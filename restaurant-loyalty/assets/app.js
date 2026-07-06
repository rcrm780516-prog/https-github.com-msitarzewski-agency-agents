/* =====================================================================
 *  Núcleo de la app de lealtad
 *  - Store: capa de datos (local o Supabase)
 *  - Lógica de premios
 *  - Utilidades compartidas (QR, formato, etc.)
 * ===================================================================== */
(function () {
  "use strict";

  const CFG = window.LOYALTY_CONFIG || {};

  /* ------------------------------------------------------------------ *
   *  Utilidades
   * ------------------------------------------------------------------ */
  const Util = {
    // Genera un id corto legible: 8 caracteres alfanuméricos
    shortId() {
      const s = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin caracteres confusos
      let out = "";
      const arr = new Uint32Array(8);
      (window.crypto || window.msCrypto).getRandomValues(arr);
      for (let i = 0; i < 8; i++) out += s[arr[i] % s.length];
      return out;
    },
    // UUID v4 (para Supabase lo genera la BD; esto es respaldo local)
    uuid() {
      if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });
    },
    esc(str) {
      return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    },
    fmtDate(iso) {
      if (!iso) return "—";
      const d = new Date(iso);
      if (isNaN(d)) return "—";
      return d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }) +
        " " + d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
    },
    fmtDateShort(iso) {
      if (!iso) return "—";
      const d = new Date(iso);
      if (isNaN(d)) return "—";
      return d.toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
    },
    // URL absoluta hacia escanear.html?id=... (usa el link donde vive la app)
    scanUrl(id) {
      const base = CFG.baseUrl && CFG.baseUrl.trim()
        ? CFG.baseUrl.replace(/\/+$/, "") + "/escanear.html"
        : new URL("escanear.html", window.location.href).href.split("?")[0];
      return base + "?id=" + encodeURIComponent(id);
    },
    // Dibuja un QR dentro de un elemento contenedor
    renderQR(container, text, size) {
      container.innerHTML = "";
      const qr = qrcode(0, "M"); // 0 = autodetecta tamaño, "M" = corrección media
      qr.addData(text);
      qr.make();
      const cell = Math.max(3, Math.round((size || 220) / qr.getModuleCount()));
      container.innerHTML = qr.createImgTag(cell, 8);
      const img = container.querySelector("img");
      if (img) { img.style.width = "100%"; img.style.height = "auto"; img.style.imageRendering = "pixelated"; }
    }
  };

  /* ------------------------------------------------------------------ *
   *  Lógica de premios
   *  Dado el total de visitas, calcula qué premios aplican y el progreso.
   * ------------------------------------------------------------------ */
  const Rewards = {
    rules() {
      return (CFG.rewards || []).filter(function (r) { return r && r.everyVisits > 0; });
    },
    // Premios ganados EN esta visita (el total cae justo en el múltiplo)
    earnedAt(total) {
      if (!total) return [];
      return this.rules().filter(function (r) { return total % r.everyVisits === 0; });
    },
    // Progreso hacia el próximo premio de cada regla
    progress(total) {
      return this.rules().map(function (r) {
        const rem = r.everyVisits - (total % r.everyVisits);
        const missing = rem === r.everyVisits ? 0 : rem; // 0 = disponible ahora
        return {
          rule: r,
          missing: missing,
          available: missing === 0 && total > 0
        };
      });
    }
  };

  /* ------------------------------------------------------------------ *
   *  Store LOCAL (localStorage) — modo demo
   * ------------------------------------------------------------------ */
  function LocalStore() {
    const KEY = "loyalty_data_v1";
    function read() {
      try { return JSON.parse(localStorage.getItem(KEY)) || { customers: [] }; }
      catch (e) { return { customers: [] }; }
    }
    function write(d) { localStorage.setItem(KEY, JSON.stringify(d)); }

    return {
      mode: "local",
      async listCustomers() {
        return read().customers.map(function (c) {
          const visits = c.visits || [];
          return {
            id: c.id, name: c.name, phone: c.phone || "",
            created_at: c.created_at,
            visitCount: visits.length,
            lastVisit: visits.length ? visits[visits.length - 1].created_at : null
          };
        });
      },
      async getCustomer(id) {
        const c = read().customers.find(function (x) { return x.id === id; });
        if (!c) return null;
        const visits = (c.visits || []).slice().sort(function (a, b) {
          return new Date(a.created_at) - new Date(b.created_at);
        });
        return {
          id: c.id, name: c.name, phone: c.phone || "",
          created_at: c.created_at, visits: visits, visitCount: visits.length,
          lastVisit: visits.length ? visits[visits.length - 1].created_at : null
        };
      },
      async createCustomer(data) {
        const d = read();
        const c = {
          id: Util.shortId(), name: data.name.trim(),
          phone: (data.phone || "").trim(),
          created_at: new Date().toISOString(), visits: []
        };
        d.customers.push(c);
        write(d);
        return c;
      },
      async addVisit(id, note) {
        const d = read();
        const c = d.customers.find(function (x) { return x.id === id; });
        if (!c) throw new Error("Cliente no encontrado");
        c.visits = c.visits || [];
        c.visits.push({ id: Util.uuid(), created_at: new Date().toISOString(), note: note || "" });
        write(d);
        return c.visits.length;
      },
      async deleteCustomer(id) {
        const d = read();
        d.customers = d.customers.filter(function (x) { return x.id !== id; });
        write(d);
      }
    };
  }

  /* ------------------------------------------------------------------ *
   *  Store SUPABASE (REST / PostgREST)
   * ------------------------------------------------------------------ */
  function SupabaseStore() {
    const url = (CFG.supabaseUrl || "").replace(/\/+$/, "");
    const key = CFG.supabaseKey || "";
    const rest = url + "/rest/v1";
    const headers = {
      "apikey": key,
      "Authorization": "Bearer " + key,
      "Content-Type": "application/json"
    };
    async function req(path, opts) {
      const res = await fetch(rest + path, Object.assign({ headers: headers }, opts || {}));
      if (!res.ok) {
        const body = await res.text().catch(function () { return ""; });
        throw new Error("Supabase " + res.status + ": " + body);
      }
      if (res.status === 204) return null;
      return res.json();
    }
    function shape(row) {
      const visits = row.visits || [];
      const sorted = visits.slice().sort(function (a, b) {
        return new Date(a.created_at) - new Date(b.created_at);
      });
      return {
        id: row.id, name: row.name, phone: row.phone || "",
        created_at: row.created_at,
        visits: sorted,
        visitCount: visits.length,
        lastVisit: visits.length ? sorted[sorted.length - 1].created_at : null
      };
    }
    return {
      mode: "supabase",
      async listCustomers() {
        const rows = await req("/customers?select=id,name,phone,created_at,visits(created_at)&order=created_at.desc");
        return rows.map(function (r) {
          const v = r.visits || [];
          const last = v.length ? v.map(function (x) { return x.created_at; }).sort().pop() : null;
          return { id: r.id, name: r.name, phone: r.phone || "", created_at: r.created_at, visitCount: v.length, lastVisit: last };
        });
      },
      async getCustomer(id) {
        const rows = await req("/customers?id=eq." + encodeURIComponent(id) + "&select=id,name,phone,created_at,visits(id,created_at,note)");
        if (!rows.length) return null;
        return shape(rows[0]);
      },
      async createCustomer(data) {
        const rows = await req("/customers", {
          method: "POST",
          headers: Object.assign({}, headers, { "Prefer": "return=representation" }),
          body: JSON.stringify({ name: data.name.trim(), phone: (data.phone || "").trim() })
        });
        return rows[0];
      },
      async addVisit(id, note) {
        await req("/visits", {
          method: "POST",
          body: JSON.stringify({ customer_id: id, note: note || "" })
        });
        const c = await this.getCustomer(id);
        return c ? c.visitCount : 0;
      },
      async deleteCustomer(id) {
        await req("/customers?id=eq." + encodeURIComponent(id), { method: "DELETE" });
      }
    };
  }

  /* ------------------------------------------------------------------ *
   *  Selección del store según config
   * ------------------------------------------------------------------ */
  let store;
  if (CFG.backend === "supabase" && CFG.supabaseUrl && CFG.supabaseKey) {
    store = SupabaseStore();
  } else {
    store = LocalStore();
  }

  // API pública
  window.Loyalty = {
    store: store,
    Rewards: Rewards,
    Util: Util,
    config: CFG,
    isDemo: store.mode === "local"
  };
})();
