# ESTADO DE MÁQUINAS — snapshot vivo

Cada nodo actualiza SOLO su fila. Última actualización arriba de cada celda.

## PC-PERSONAL (USER)
- *Actualizado: 2026-08-25 (2ª pasada)*
- Windows 11 build 26200 · SSD LITEON 256GB · Intel UHD 620 (sin CUDA → IA solo vía APIs remotas)
- Disco C: ~18 GB libres (sesión limpieza: -8 GiB → 523 duplicados borrados, 3 venvs regenerables, snapshot viejo, basura temp)
- Auditoría en Tools/czkawka/deleted-dupes.log · czkawka CLI 12.0.1 instalado
- opencode 1.18.22 OK · Qwen Code 0.22.0 OK (6 MCPs + Zen MCP en ~/.zen/zen-mcp-server)
- 45 API keys activas en env vars
- 16 repos frontend mejorados y pusheados (Lenis+GSAP+ScrollTrigger, Vanta en oscuros)
- Pendiente propio: backup COMPLETO a TeraBox (~38 GiB Documents, arrastre manual)

## PC-AUTOMATIZACIONES (Administrador)
- *Actualizado: (reporte propio pendiente — datos detectados desde PC-PERSONAL)*
- LAN: IP **192.168.1.138** · host **2019-DESKTOP-SR** · WORKGROUP
- Lead API puerto 3847 VIVA (HTTP 404 en /) · SMB 445 abierto · WinRM/SSH/RDP cerrados
- Cuenta `belentani` SIN contraseña → login red bloqueado por política (pendiente definir contraseña o WinRM)
- ALERTA DISCO: +~416 GiB generados, origen desconocido (ver INBOX urgente)
- Según cli.txt y README automations: Python 3.11.9 · Node 24.15.0 · Git 2.54 · gh 2.98 · PowerShell 7.6.3 · WSL 2.6.3 · pm2 instalado · Docker/n8n pendientes
- 49+ repos sincronizados
- Pendiente conocido: SFC/DISM resultado, Netlify ManosAbiertas, phoneai (?), Ambilight modelo
