# CONTENIDO PENDIENTE — GEMMAE

Todo lo que el sitio necesita de GEMMAE para pasar de "construido" a
"publicable". Está ordenado por impacto: lo de arriba bloquea el lanzamiento,
lo de abajo mejora resultados.

Regla que se siguió en todo el proyecto: **no se inventó ningún dato**. Donde
falta información hay un marcador `[POR CONFIRMAR]` visible en pantalla.

---

## BLOQUEA EL LANZAMIENTO

### 1. Datos de contacto
- [ ] Número de WhatsApp (con lada país). ¿Uno central o uno por sede?
- [ ] Teléfono de cada sede
- [ ] Correo de contacto
- [ ] Tiempo de respuesta que se promete públicamente

### 2. Sedes (× 3: Toluca, Metepec, Zinacantepec)
- [ ] Dirección exacta: calle, número, colonia, CP
- [ ] Coordenadas (lat/lng) o enlace de Google Maps
- [ ] URL del perfil de Google Business de cada sede
- [ ] Horarios reales por día
- [ ] Referencias de acceso ("frente a…", "a dos cuadras de…")
- [ ] Estacionamiento: ¿propio, en la calle, pensión cercana?
- [ ] ¿Qué servicios se atienden realmente en cada sede? (hoy hay un supuesto
      razonable en cada archivo; hay que validarlo)

### 3. Médicos
Por cada especialista:
- [ ] Nombre completo y título (Dr. / Dra.)
- [ ] Especialidad y subespecialidades
- [ ] **Cédula profesional** y **cédula de especialidad** (dato regulatorio)
- [ ] Formación: licenciatura, especialidad, institución y año
- [ ] Certificaciones vigentes (consejo, folio, vigencia)
- [ ] Semblanza (2–4 párrafos) — la redactamos si nos dan los insumos
- [ ] Fotografía profesional (mínimo 800 × 1000 px, fondo neutro)
- [ ] Sedes y días en que atiende
- [ ] Servicios que atiende
- [ ] Perfil de Doctoralia si existe
- [ ] Idiomas

> Sin esto, `/medicos/` muestra un estado vacío honesto y los tres perfiles
> plantilla quedan fuera del índice de Google. Es el activo con mayor impacto
> pendiente: los perfiles médicos son lo que más se busca y lo que más
> convierte en el sector.

### 4. Datos regulatorios
- [ ] Razón social y RFC
- [ ] Responsable sanitario
- [ ] Aviso de funcionamiento / permiso de publicidad si aplica
- [ ] **Aviso de privacidad** redactado o validado por el área legal
- [ ] **Términos y condiciones** redactados o validados por el área legal
- [ ] Correo para solicitudes ARCO

### 5. Marca
- [ ] Logotipo en SVG (versión horizontal y versión compacta)
- [ ] Paleta oficial, si difiere de la propuesta (marfil + salvia)
- [ ] Tipografías corporativas si existen (hoy: Fraunces + Inter, ambas SIL OFL)
- [ ] Favicon definitivo (hoy hay uno provisional generado)

---

## NECESARIO ANTES DE INVERTIR EN PUBLICIDAD

### 6. Fotografía original
Recomendado, por orden de utilidad:
- [ ] Hero de la home (vertical 4:5, mínimo 1400 px de ancho)
- [ ] Fachada y recepción de cada sede — reduce la fricción de "no sé a dónde llego"
- [ ] Consultorio y equipo de ultrasonido
- [ ] Retratos del equipo médico
- [ ] Detalles ambientales (sala de espera, material de consulta)

> Sin fotografía original el sitio funciona: los espacios muestran un
> marcador editorial en lugar de imágenes de stock genéricas, que restan
> credibilidad más de lo que suman.

### 7. Analítica
- [ ] ID de Google Tag Manager
- [ ] ID de GA4
- [ ] ID de Meta Pixel
- [ ] ID de Google Ads y etiqueta de conversión
- [ ] Acceso a Google Search Console para el dominio

### 8. Integración de leads
- [ ] URL del webhook de n8n / CRM
- [ ] Token compartido
- [ ] Correo de respaldo para notificaciones

### 9. Servicios: validación clínica
El contenido de los 11 servicios se redactó en lenguaje general, sin promesas
ni afirmaciones sobre GEMMAE en particular. Falta:
- [ ] Revisión y firma de un médico del equipo (nombre + cédula) para poder
      mostrar "Contenido revisado por profesionales de la salud"
- [ ] Confirmar: ¿se realizan tratamientos de reproducción asistida o se deriva?
- [ ] Confirmar: ¿se aplica la vacuna contra VPH? ¿desde qué edad?
- [ ] Confirmar: ¿se realiza mastografía o se deriva?
- [ ] Confirmar: hospitales donde se atienden partos y cesáreas
- [ ] Confirmar: política de acompañantes en estudios
- [ ] Confirmar: entrega de imágenes de ultrasonido
- [ ] Confirmar: procedimiento ante urgencias

### 10. Precios y pagos
- [ ] ¿Se publican precios de consulta y estudios? (decisión estratégica)
- [ ] Formas de pago aceptadas
- [ ] ¿Facturación?
- [ ] ¿Aseguradoras con convenio?

---

## MEJORA RESULTADOS (no bloquea)

### 11. Reseñas
- [ ] Reseñas reales con autorización de publicación (texto, iniciales, fecha)
- [ ] O bien: URL del perfil de Google para enlazar las reseñas en su origen

El componente está construido y muestra un estado vacío explícito mientras
tanto. No se fabricaron testimonios ni calificaciones.

### 12. Contenido editorial
El blog arranca con 5 artículos. Para que la estrategia SEO tenga tracción se
sugiere una cadencia de 2–4 al mes. Temas con demanda local ya mapeados:

- Dolor menstrual: cuándo deja de ser normal
- Anticoncepción: cómo elegir método
- Miomas uterinos: síntomas y opciones
- Endometriosis: por qué tarda tanto el diagnóstico
- Ovario poliquístico
- Alimentación y suplementos en el embarazo
- Sangrado en el embarazo: cuándo acudir
- Lactancia: primeras dos semanas
- Osteoporosis después de la menopausia
- Infecciones vaginales recurrentes

### 13. Ampliación del ecosistema
- [ ] Enlaces a perfiles de Instagram, Facebook, TikTok, YouTube, Doctoralia
- [ ] Imágenes sociales personalizadas por servicio (1200 × 630)
- [ ] Video institucional para la home (opcional; hoy no se carga video para
      no comprometer los Core Web Vitals)

---

## Cómo entregar el contenido

- **Textos:** documento con un apartado por punto de esta lista.
- **Imágenes:** JPG/PNG originales sin comprimir; el sitio genera WebP/AVIF y
  los tamaños responsive en el build.
- **Datos de sedes:** en un solo archivo, para cargarlos de una vez y evitar
  inconsistencias de NAP.
