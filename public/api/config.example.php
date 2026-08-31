<?php
/**
 * Copiar este archivo como config.php en el servidor y completar los valores.
 * NUNCA subir config.php al repositorio: contiene credenciales.
 * El .htaccess de la raíz bloquea el acceso web directo a config.php.
 */

return [
    // Webhook de n8n / CRM que recibe el lead
    'webhook_url'   => '',   // [POR CONFIRMAR]
    'webhook_token' => '',   // [POR CONFIRMAR] token compartido, se envía como X-Gemmae-Token

    // Correo de respaldo si el webhook no responde
    'notify_email'  => '',   // [POR CONFIRMAR]

    // Ruta del log de respaldo. Debe quedar FUERA de public_html.
    'log_file'      => dirname(__DIR__, 2) . '/gemmae-leads.log',

    // Anti-abuso
    'rate_limit'    => 5,
    'rate_window'   => 3600,
    'min_seconds'   => 3,
];
