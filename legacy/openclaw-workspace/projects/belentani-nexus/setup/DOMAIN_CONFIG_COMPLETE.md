# ⚙️ CONFIGURACIÓN COMPLETA DE DOMINIO — belentani.eu

**Fecha:** 2026-08-31
**Dominio:** belentani.eu
**Registrador:** DonDominio
**Hosting:** GitHub Pages (usuario `belentani7`)
**Estado actual:** belentani.eu ya apunta al repo `Belentani` (portal principal)

---

## 📋 Índice

1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [Paso a paso en DonDominio](#2-paso-a-paso-en-dondominio)
3. [Registros DNS exactos para GitHub Pages](#3-registros-dns-exactos-para-github-pages)
4. [Configuración en GitHub (repo Belentani)](#4-configuración-en-github-repo-belentani)
5. [Subdominios para cada proyecto](#5-subdominios-para-cada-proyecto)
6. [SSL / HTTPS](#6-ssl--https)
7. [Verificación](#7-verificación)
8. [Troubleshooting](#8-troubleshooting)
9. [Futuro: email @belentani.eu](#9-futuro-email-belentanieu)

---

## 1. Resumen ejecutivo

| Elemento | Valor |
|---|---|
| Dominio apex | `belentani.eu` → repo **Belentani** (portal principal) |
| www | `www.belentani.eu` → mismo sitio (CNAME) |
| Subdominios | `proyecto.belentani.eu` → CNAME a `belentani7.github.io` |
| SSL | Automático con Let's Encrypt vía GitHub Pages |
| Tiempo de propagación | 15 min – 48 h (normalmente 1–2 h) |

**Regla de oro:** el apex (`belentani.eu`) usa registros **A/AAAA**, todo lo demás (`www`, subdominios) usa **CNAME**. Nunca un CNAME en el apex.

---

## 2. Paso a paso en DonDominio

### 2.1 Acceso

1. Ve a **https://www.dondominio.com** y pulsa **"Acceder"** (arriba a la derecha).
2. Inicia sesión con tu usuario y contraseña.
3. En el panel, entra en **"Mis dominios"** (o "Dominios" → lista de dominios).
4. Localiza **belentani.eu** y pulsa el botón de gestión (icono de llave/engranaje o "Gestionar").

### 2.2 Comprobaciones previas

1. **Nameservers:** en la pestaña **"Nameservers"** comprueba que el dominio usa los DNS de DonDominio (por defecto: `ns1.dondominio.com`, `ns2.dondominio.com`, `ns3.dondominio.com`).
   - ✅ Si usa los de DonDominio → gestiona los registros desde la **"Zona DNS"** (sección siguiente).
   - ⚠️ Si apunta a otro proveedor de DNS (Cloudflare, etc.), los registros se añaden allí, no en DonDominio.
2. **Contactos/WHOIS:** verifica que el email de contacto del dominio es tuyo (renovaciones, avisos).

### 2.3 Editar la Zona DNS

1. Dentro de la gestión del dominio, entra en la pestaña **"Zona DNS"** (o "DNS" → "Editar zona DNS" / "Gestión avanzada de DNS").
2. Si DonDominio muestra una zona por defecto con registros de parking, **elimina o sustituye** los registros `A` y `CNAME` existentes que apunten a parking (los marcados como `@`/`www`).
3. Añade los registros de la [sección 3](#3-registros-dns-exactos-para-github-pages) uno a uno con el botón **"Añadir registro"**.
4. Pulsa **"Guardar"** / **"Aplicar cambios"**.

> 📝 En DonDominio, el campo "Nombre/Host" se rellena así:
> - Apex → deja **vacío** o escribe **@**
> - www → escribe **www**
> - Subdominio → escribe solo la parte izquierda (ej. `nexus` para `nexus.belentani.eu`)

---

## 3. Registros DNS exactos para GitHub Pages

### 3.1 Apex: `belentani.eu` (4 registros A + 4 AAAA)

| Tipo | Nombre | Valor / Destino | TTL |
|---|---|---|---|
| A | @ | `185.199.108.153` | 3600 (o por defecto) |
| A | @ | `185.199.109.153` | 3600 |
| A | @ | `185.199.110.153` | 3600 |
| A | @ | `185.199.111.153` | 3600 |
| AAAA | @ | `2606:50c0:8000::153` | 3600 |
| AAAA | @ | `2606:50c0:8001::153` | 3600 |
| AAAA | @ | `2606:50c0:8002::153` | 3600 |
| AAAA | @ | `2606:50c0:8003::153` | 3600 |

> Las 4 IPs A son **obligatorias** (recomendación oficial de GitHub). Las AAAA son opcionales pero recomendadas (IPv6).

### 3.2 WWW: `www.belentani.eu`

| Tipo | Nombre | Valor / Destino | TTL |
|---|---|---|---|
| CNAME | www | `belentani7.github.io` | 3600 |

### 3.3 Verificación de dominio (TXT)

GitHub pedirá verificar que eres dueño del dominio:

| Tipo | Nombre | Valor |
|---|---|---|
| TXT | `_github-pages-challenge-belentani7` | *(el código único que muestra GitHub en Settings → Pages)* |

El valor exacto aparece en el repo → **Settings → Pages** al escribir el dominio personalizado. Cópialo tal cual.

### 3.4 Resumen de la zona final

```dns
; belentani.eu → GitHub Pages (repo Belentani)
belentani.eu.                                   A      185.199.108.153
belentani.eu.                                   A      185.199.109.153
belentani.eu.                                   A      185.199.110.153
belentani.eu.                                   A      185.199.111.153
belentani.eu.                                   AAAA   2606:50c0:8000::153
belentani.eu.                                   AAAA   2606:50c0:8001::153
belentani.eu.                                   AAAA   2606:50c0:8002::153
belentani.eu.                                   AAAA   2606:50c0:8003::153
www.belentani.eu.                               CNAME  belentani7.github.io.
_github-pages-challenge-belentani7.belentani.eu. TXT   "<CODIGO-DE-GITHUB>"
```

---

## 4. Configuración en GitHub (repo Belentani)

1. Ve a **https://github.com/belentani7/Belentani** → **Settings** → **Pages** (menú izquierdo).
2. En **"Build and deployment"**:
   - Source: **Deploy from a branch**
   - Branch: `main` (o la rama con la web), carpeta `/ (root)` o `/docs` según el repo.
3. En **"Custom domain"**:
   - Escribe `belentani.eu` → **Save**.
   - GitHub mostrará el registro TXT de verificación → añádelo en DonDominio (sección 3.3).
   - Espera a que aparezca ✅ "Domain verified".
4. Marca la casilla **"Enforce HTTPS"** (se habilita cuando el certificado esté emitido; ver sección 6).
5. (Opcional) Crea un archivo `CNAME` en la raíz del repo con una sola línea:
   ```
   belentani.eu
   ```
   Así la configuración viaja con el repo y no se pierde en futuros despliegues.

---

## 5. Subdominios para cada proyecto

### 5.1 Mapa recomendado

Cada repo con GitHub Pages puede tener **un único dominio personalizado**. Usa subdominios:

| Subdominio | Repo GitHub | Proyecto | Prioridad |
|---|---|---|---|
| `belentani.eu` (apex) | `Belentani` | Portal principal / ecosistema | 🔴 Ya activo |
| `www.belentani.eu` | `Belentani` | Alias del apex | 🔴 Ya activo |
| `omega.belentani.eu` | `belentani_Omega` | Web insignia (actual belentani.es) | 🔴 Alta |
| `nexus.belentani.eu` | `belentani-nexus` | Plataforma All-in-One AI | 🔴 Alta |
| `judas.belentani.eu` | `judas-experience` | Judas Experience (música cyberpunk) | 🟠 Alta |
| `manosabiertas.belentani.eu` | `ManosAbiertas` | Educación gratuita migrantes | 🔴 Alta |
| `cruzando.belentani.eu` | `Cruzando-el-charco` | Guía LGTBIQ+ migrantes | 🟠 Media |
| `duck.belentani.eu` | `duck-apps` | Duck Studio / apps | 🟠 Media |
| `musica.belentani.eu` | `duck-music-lab` | Laboratorio musical | 🟡 Media |
| `linguaforge.belentani.eu` | `linguaforge` | Herramientas de idiomas | 🟡 Baja |
| `cv.belentani.eu` | `Belentani.cv-ai` | CV interactivo AI | 🟡 Baja |
| `harmonia.belentani.eu` | `harmonia-hub` | Harmonia Hub | 🟢 Baja |
| `oculus.belentani.eu` | `Oculus-Tv` | Oculus TV | 🟢 Baja |

> ⚠️ Antes de asignar un subdominio, el repo debe tener GitHub Pages **activado** (ver `docs/pages-status.txt` para saber cuáles ya lo tienen). `belentani-nexus` necesita primero crearse/publicarse como repo con `index.html`.

### 5.2 Procedimiento por subdominio (repetir para cada uno)

**Paso A — En DonDominio (Zona DNS):**

| Tipo | Nombre | Valor |
|---|---|---|
| CNAME | `nexus` | `belentani7.github.io` |

**Paso B — En GitHub (repo del proyecto):**

1. Repo → **Settings → Pages**.
2. Custom domain: `nexus.belentani.eu` → **Save**.
3. Copia el TXT de verificación y añádelo en DonDominio:

| Tipo | Nombre | Valor |
|---|---|---|
| TXT | `_github-pages-challenge-belentani7.nexus` | código que da GitHub |

4. Espera verificación y marca **Enforce HTTPS**.
5. (Opcional) Archivo `CNAME` en la raíz del repo con `nexus.belentani.eu`.

**Paso C — Espera propagación (15 min – 2 h) y verifica:**

```powershell
nslookup nexus.belentani.eu
# Debe responder con las IPs de GitHub Pages o un CNAME a belentani7.github.io
```

### 5.3 Ejemplo completo de zona con subdominios

```dns
; --- Apex + www ---
belentani.eu.            A      185.199.108.153   (+ 109/110/111)
www                      CNAME  belentani7.github.io.

; --- Subdominios de proyecto ---
omega                    CNAME  belentani7.github.io.
nexus                    CNAME  belentani7.github.io.
judas                    CNAME  belentani7.github.io.
manosabiertas            CNAME  belentani7.github.io.
cruzando                 CNAME  belentani7.github.io.
duck                     CNAME  belentani7.github.io.
musica                   CNAME  belentani7.github.io.
cv                       CNAME  belentani7.github.io.
```

---

## 6. SSL / HTTPS

GitHub Pages emite certificados **Let's Encrypt automáticamente**. No hay que hacer nada manual.

### 6.1 Proceso

1. Configura DNS + custom domain (secciones anteriores).
2. GitHub detecta el dominio resuelto y solicita el certificado.
   - Típico: **5–60 minutos**. Máximo oficial: 48 h.
3. En **Settings → Pages** aparecerá: *"Your site is published at https://belentani.eu/"*.
4. Marca **"Enforce HTTPS"** → todas las peticiones HTTP redirigen a HTTPS.

### 6.2 Si "Enforce HTTPS" aparece deshabilitado

Causas y soluciones:

| Causa | Solución |
|---|---|
| DNS aún no propagado | Espera 1–2 h; verifica con `nslookup belentani.eu` |
| Faltan IPs A (solo pusiste 1–2) | Pon las **4** IPs de la sección 3.1 |
| CNAME en el apex | Elimínalo; el apex solo lleva A/AAAA |
| Dominio no verificado | Añade el TXT de la sección 3.3 |
| Certificado caducado tras cambio DNS | Desmarca custom domain, guarda, vuelve a marcarlo |

### 6.3 Forzar HTTPS también desde el sitio (doble seguro)

Añade en el `<head>` de cada `index.html`:

```html
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```

### 6.4 Verificación del certificado

```powershell
# Desde PowerShell
$req = [System.Net.HttpWebRequest]::Create("https://belentani.eu")
$req.Method = "HEAD"
$resp = $req.GetResponse()
$resp.Headers  # busca "Strict-Transport-Security"
$resp.Close()
```

O online: https://www.ssllabs.com/ssltest/analyze.html?d=belentani.eu (objetivo: A o A+).

---

## 7. Verificación

Comandos desde PowerShell (Windows):

```powershell
# 1. Registros A del apex
nslookup belentani.eu
# Esperado: 185.199.108.153 / 109 / 110 / 111

# 2. CNAME de www
nslookup www.belentani.eu
# Esperado: canonical name = belentani7.github.io

# 3. CNAME de subdominio
nslookup nexus.belentani.eu

# 4. TXT de verificación
nslookup -type=TXT _github-pages-challenge-belentani7.belentani.eu

# 5. Respuesta HTTP
curl.exe -I https://belentani.eu
# Esperado: HTTP/2 200
```

Herramientas online:
- https://dnschecker.org (propagación global)
- https://www.whatsmydns.net
- https://www.ssllabs.com/ssltest/

---

## 8. Troubleshooting

| Síntoma | Causa probable | Solución |
|---|---|---|
| `404 - There isn't a GitHub Pages site here` | Custom domain no guardado en el repo | Settings → Pages → reescribe el dominio y Save |
| Página de parking de DonDominio | Registros antiguos de parking | Elimina registros A/CNAME de parking en la Zona DNS |
| `DNS_PROBE_FINISHED_NXDOMAIN` | Propagación pendiente o mal NS | Espera; verifica nameservers en DonDominio |
| Certificado "no seguro" en navegador | Certificado en emisión | Espera hasta 48 h; fuerza re-check desmarcando/marcando custom domain |
| www funciona pero apex no | Faltan registros A | Añade las 4 IPs |
| Subdominio 404 | Falta Settings → Pages en ese repo | Configura custom domain en el repo del subdominio |

---

## 9. Futuro: email @belentani.eu

Cuando quieras correo profesional (`pedro@belentani.eu`):

1. **Opción gratuita — Redirección:** algunos registradores ofrecen forwarding de email; DonDominio tiene correo básico con su hosting. MX apuntaría a su servidor de correo.
2. **Opción recomendada — Google Workspace:** ~6 €/mes por usuario, `pedro@belentani.eu` con Gmail completo. Registros MX de Google:
   - `ASPMX.L.GOOGLE.COM` (prioridad 1)
   - `ALT1.ASPMX.L.GOOGLE.COM` (5), `ALT2` (5), `ALT3` (10), `ALT4` (10)
3. **Opción intermedia — Improvmx / Forward Email (gratis):** MX + TXT de verificación y redirección a tu Gmail actual.

> No configures nada de esto hasta decidir la opción. El correo actual `belentani7pedro@gmail.com` sigue siendo el principal.

---

## ✅ Checklist final

- [ ] Zona DNS de DonDominio editada con las 4 A + 4 AAAA + CNAME www
- [ ] TXT de verificación añadido y verificado en GitHub
- [ ] Repo `Belentani`: Settings → Pages con `belentani.eu` + Enforce HTTPS
- [ ] `https://belentani.eu` responde 200 con candado válido
- [ ] `https://www.belentani.eu` redirige a https
- [ ] Subdominios prioritarios creados: `omega`, `nexus`, `manosabiertas`, `judas`
- [ ] Cada subdominio con Enforce HTTPS activo
- [ ] SSL Labs: grado A

---

*Generado por OpenClaw · Proyecto belentani-nexus · 2026-08-31*
