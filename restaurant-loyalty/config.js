/* =====================================================================
 *  CONFIGURACIÓN DE TU PROGRAMA DE LEALTAD
 *  ---------------------------------------------------------------------
 *  Este es el ÚNICO archivo que necesitas editar para personalizar todo.
 *  No necesitas saber programar: solo cambia los textos entre comillas.
 * ===================================================================== */

window.LOYALTY_CONFIG = {

  /* Nombre de tu restaurante (aparece en toda la app) */
  restaurantName: "Mi Restaurante",

  /* -------------------------------------------------------------------
   *  ¿DÓNDE SE GUARDAN LOS DATOS?
   *  "local"    → Modo demo. Se guarda solo en ESTE navegador.
   *               Funciona al instante, sin cuenta ni configuración.
   *               NO sincroniza entre el celular y la PC.
   *
   *  "supabase" → Nube gratis. Sincroniza al instante entre todos los
   *               dispositivos. Requiere pegar tus 2 datos de Supabase
   *               abajo (mira el README.md, es gratis y toma 5 minutos).
   * ------------------------------------------------------------------- */
  backend: "local",

  /* Solo se usan si backend = "supabase". Los copias de tu proyecto
   * Supabase en Settings → API. (La "anon key" es pública, es normal.) */
  supabaseUrl: "",   // ej: https://abcdxyz.supabase.co
  supabaseKey: "",   // ej: eyJhbGciOiJI... (anon public key)

  /* -------------------------------------------------------------------
   *  PREMIOS
   *  Cada regla premia "cada N visitas". Puedes agregar o quitar reglas.
   *  everyVisits = cada cuántas visitas se otorga el premio.
   *  label       = qué se le regala (el texto que verá el mesero).
   *  icon        = un emoji para decorar.
   * ------------------------------------------------------------------- */
  rewards: [
    { everyVisits: 10, label: "Café gratis",                               icon: "☕" },
    { everyVisits: 5,  label: "50% de descuento en su próximo consumo",    icon: "🎉" }
  ],

  /* -------------------------------------------------------------------
   *  PIN OPCIONAL para la mesa de control (index.html).
   *  Déjalo vacío ("") para no pedir PIN. Si pones un número, se pedirá
   *  al abrir el panel (protección básica contra curiosos).
   * ------------------------------------------------------------------- */
  crmPin: "",

  /* Deja esto vacío para detectar el link automáticamente.
   * Solo cámbialo si sabes lo que haces. */
  baseUrl: ""
};
