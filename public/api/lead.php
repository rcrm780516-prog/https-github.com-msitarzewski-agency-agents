<?php
/**
 * GEMMAE — Endpoint de captura de leads.
 *
 * Por qué PHP: Hostinger sirve PHP de forma nativa en hosting compartido.
 * Esto permite validar del lado del servidor, aplicar rate limiting y ocultar
 * la URL del webhook de n8n/CRM sin desplegar infraestructura adicional
 * (ni Node, ni serverless, ni servicios de pago).
 *
 * Acepta JSON (fetch) y application/x-www-form-urlencoded (envío sin JS).
 * Configuración: copiar config.example.php a config.php y completar valores.
 * config.php está bloqueado por .htaccess y excluido del repositorio.
 */

declare(strict_types=1);

// ---------- Configuración ----------
$config = [
    'webhook_url'   => '',      // p. ej. https://n8n.midominio.com/webhook/gemmae-lead
    'webhook_token' => '',      // se envía como cabecera X-Gemmae-Token
    'notify_email'  => '',      // correo de respaldo si el webhook falla
    'log_file'      => __DIR__ . '/../../gemmae-leads.log', // fuera de public_html
    'rate_limit'    => 5,       // envíos permitidos por IP
    'rate_window'   => 3600,    // ventana en segundos
    'min_seconds'   => 3,       // tiempo mínimo de llenado (anti-bot)
    'redirect_ok'   => '/gracias/',
    'redirect_err'  => '/contacto/?error=1',
];

if (is_readable(__DIR__ . '/config.php')) {
    /** @var array $userConfig */
    $userConfig = require __DIR__ . '/config.php';
    $config = array_merge($config, is_array($userConfig) ? $userConfig : []);
}

// ---------- Utilidades ----------
function wantsJson(): bool
{
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    $ctype  = $_SERVER['CONTENT_TYPE'] ?? '';
    return str_contains($accept, 'application/json') || str_contains($ctype, 'application/json');
}

function respond(int $status, array $payload, array $config): never
{
    if (wantsJson()) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    } else {
        $target = $status < 400 ? $config['redirect_ok'] : $config['redirect_err'];
        http_response_code(303);
        header('Location: ' . $target);
    }
    exit;
}

function clientIp(): string
{
    foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'] as $key) {
        if (!empty($_SERVER[$key])) {
            $ip = explode(',', (string) $_SERVER[$key])[0];
            $ip = trim($ip);
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    return '0.0.0.0';
}

/** Sanitiza: recorta, elimina control chars y limita longitud. */
function clean(mixed $value, int $max = 300): string
{
    if (!is_scalar($value)) {
        return '';
    }
    $text = trim((string) $value);
    $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $text) ?? '';
    // Evita inyección de cabeceras en el correo de respaldo
    $text = str_replace(["\r", "\n"], ' ', $text);
    return mb_substr($text, 0, $max);
}

/** Rate limiting por IP con archivo temporal: suficiente para un formulario. */
function rateLimited(string $ip, int $limit, int $window): bool
{
    $file = sys_get_temp_dir() . '/gemmae_rl_' . md5($ip) . '.json';
    $now = time();
    $hits = [];
    if (is_readable($file)) {
        $decoded = json_decode((string) file_get_contents($file), true);
        if (is_array($decoded)) {
            $hits = array_filter($decoded, static fn ($t) => is_int($t) && $t > $now - $window);
        }
    }
    if (count($hits) >= $limit) {
        return true;
    }
    $hits[] = $now;
    @file_put_contents($file, json_encode(array_values($hits)), LOCK_EX);
    return false;
}

// ---------- 1. Método ----------
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'method_not_allowed'], $config);
}

// ---------- 2. Origen (mitiga POST de terceros) ----------
$host = $_SERVER['HTTP_HOST'] ?? '';
$origin = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
if ($origin !== '' && $host !== '') {
    $originHost = parse_url($origin, PHP_URL_HOST) ?: '';
    if ($originHost !== '' && stripos($host, (string) $originHost) === false) {
        respond(403, ['ok' => false, 'error' => 'bad_origin'], $config);
    }
}

// ---------- 3. Entrada ----------
$raw = file_get_contents('php://input') ?: '';
$data = [];
if (str_contains($_SERVER['CONTENT_TYPE'] ?? '', 'application/json')) {
    $decoded = json_decode($raw, true);
    $data = is_array($decoded) ? $decoded : [];
} else {
    $data = $_POST;
}

// ---------- 4. Anti-spam ----------
if (clean($data['website'] ?? '') !== '') {          // honeypot
    respond(200, ['ok' => true], $config);            // respuesta silenciosa al bot
}

$ts = (int) ($data['ts'] ?? 0);
if ($ts > 0 && (time() * 1000 - $ts) < $config['min_seconds'] * 1000) {
    respond(429, ['ok' => false, 'error' => 'too_fast'], $config);
}

$ip = clientIp();
if (rateLimited($ip, (int) $config['rate_limit'], (int) $config['rate_window'])) {
    respond(429, ['ok' => false, 'error' => 'rate_limited'], $config);
}

// ---------- 5. Validación ----------
$name  = clean($data['name'] ?? '', 80);
$phone = preg_replace('/\D/', '', (string) ($data['phone'] ?? '')) ?? '';
$consent = !empty($data['consent']);

$errors = [];
if (mb_strlen($name) < 2) {
    $errors['name'] = 'Nombre requerido';
}
if (strlen($phone) < 10 || strlen($phone) > 15) {
    $errors['phone'] = 'WhatsApp inválido';
}
if (!$consent) {
    $errors['consent'] = 'Consentimiento requerido';
}
if ($errors) {
    respond(422, ['ok' => false, 'errors' => $errors], $config);
}

// ---------- 6. Payload normalizado (contrato con n8n / CRM) ----------
$payload = [
    'event'              => 'lead_created',
    'source_system'      => 'website',
    'name'               => $name,
    'phone'              => $phone,
    'service'            => clean($data['service'] ?? '', 60),
    'location'           => clean($data['location'] ?? '', 60),
    'doctor'             => clean($data['doctor'] ?? '', 60),
    'contact_preference' => clean($data['contact_preference'] ?? 'whatsapp', 20),
    'message'            => clean($data['message'] ?? '', 600),
    'utm_source'         => clean($data['utm_source'] ?? '', 120),
    'utm_medium'         => clean($data['utm_medium'] ?? '', 120),
    'utm_campaign'       => clean($data['utm_campaign'] ?? '', 120),
    'utm_content'        => clean($data['utm_content'] ?? '', 120),
    'utm_term'           => clean($data['utm_term'] ?? '', 120),
    'landing_page'       => clean($data['landing_page'] ?? '', 200),
    'page'               => clean($data['page'] ?? '', 200),
    'referrer'           => clean($data['referrer'] ?? '', 200),
    'created_at'         => gmdate('c'),
    'ip_hash'            => substr(hash('sha256', $ip . ($host ?: 'gemmae')), 0, 16), // sin IP en claro
];

// ---------- 7. Entrega ----------
$delivered = false;

if (!empty($config['webhook_url'])) {
    $ch = curl_init($config['webhook_url']);
    $headers = ['Content-Type: application/json'];
    if (!empty($config['webhook_token'])) {
        $headers[] = 'X-Gemmae-Token: ' . $config['webhook_token'];
    }
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER     => $headers,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 8,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $delivered = $code >= 200 && $code < 300;
}

// Respaldo: registro local (fuera de public_html) para no perder ningún lead
if (!empty($config['log_file'])) {
    @file_put_contents(
        $config['log_file'],
        json_encode($payload + ['delivered' => $delivered], JSON_UNESCAPED_UNICODE) . PHP_EOL,
        FILE_APPEND | LOCK_EX
    );
}

// Respaldo adicional por correo
if (!$delivered && !empty($config['notify_email'])) {
    $lines = [];
    foreach ($payload as $key => $value) {
        $lines[] = $key . ': ' . $value;
    }
    @mail(
        (string) $config['notify_email'],
        'Nueva solicitud de cita — GEMMAE',
        implode("\n", $lines),
        'Content-Type: text/plain; charset=utf-8'
    );
}

respond(200, ['ok' => true], $config);
