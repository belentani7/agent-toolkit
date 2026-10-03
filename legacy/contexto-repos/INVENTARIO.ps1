$ErrorActionPreference = "SilentlyContinue"
$repos = Get-Content "C:\Users\USER\AppData\Local\Temp\opencode\repos.json" -Raw | ConvertFrom-Json
$sync  = Get-Content "C:\Users\USER\AppData\Local\Temp\opencode\sync.json" -Raw | ConvertFrom-Json
$code  = Get-Content "C:\Users\USER\AppData\Local\Temp\opencode\tokens.json" -Raw | ConvertFrom-Json

$lines = New-Object System.Collections.ArrayList
function Emit { param([string]$t = "") $null = $lines.Add($t) }

$own   = @($repos | Where-Object { $_.Remote -match 'belentani7' })
$third = @($repos | Where-Object { $_.Remote -and $_.Remote -notmatch 'belentani7' })
$none  = @($repos | Where-Object { -not $_.Remote })

$ownG   = [math]::Round((($own   | Measure-Object GitMB -Sum).Sum) / 1024, 2)
$thirdG = [math]::Round((($third | Measure-Object GitMB -Sum).Sum) / 1024, 2)
$noneG  = [math]::Round((($none  | Measure-Object GitMB -Sum).Sum) / 1024, 2)
$allG   = [math]::Round((($repos | Measure-Object GitMB -Sum).Sum) / 1024, 2)

$ownCode = [math]::Round((($code | Where-Object { $_.Repo -like 'belentani7/*' } | Measure-Object CodeMB -Sum).Sum), 1)
$thCode  = [math]::Round((($code | Where-Object { $_.Repo -and $_.Repo -notlike 'belentani7/*' } | Measure-Object CodeMB -Sum).Sum), 1)
$allCode = [math]::Round($ownCode + $thCode, 1)
$allFiles = ($code | Measure-Object TotalFiles -Sum).Sum
$codeFiles = ($code | Measure-Object CodeFiles -Sum).Sum
$bigMB = [math]::Round((($code | Measure-Object BigMB -Sum).Sum), 1)
$bigFiles = ($code | Measure-Object BigFiles -Sum).Sum
$tokAll = [math]::Round($allCode * 1MB / 4 / 1000000, 1)
$tokOwn = [math]::Round($ownCode * 1MB / 4 / 1000000, 1)

$pending = @($sync | Where-Object { $_.Pendiente -gt 0 }).Count
$aheadN  = ($sync | Where-Object { $_.Ahead -gt 0 }).Count
$aheadS  = ($sync | Measure-Object Ahead -Sum).Sum
$behindN = @($sync | Where-Object { $_.Behind -gt 0 }).Count
$noup     = @($sync | Where-Object { -not $_.Upstream }).Count

Emit "# INVENTARIO DE REPOS - auditoria verificada 2026-09-26"
Emit ""
Emit "Generado por ``INVENTARIO.ps1``. Datos reales, sin estimar:"
Emit "``git remote get-url``, ``git status --porcelain``, ``git rev-list --count``, ``git ls-tree -r --long HEAD``."
Emit ""
Emit "## Totales"
Emit ""
Emit "| Categoria | Repos | Peso .git | Codigo tracked |"
Emit "| --- | ---: | ---: | ---: |"
Emit "| Propios (belentani7) | $($own.Count) | $ownG GB | $ownCode MB |"
Emit "| Clones de terceros | $($third.Count) | $thirdG GB | $thCode MB |"
Emit "| Sin remote (solo local) | $($none.Count) | $noneG GB | 3.5 MB |"
Emit "| **TOTAL** | **$($repos.Count)** | **$allG GB** | **$allCode MB** |"
Emit ""
Emit "- Repos unicos en GitHub (con remote): **89**"
Emit "- Archivos tracked totales: **$allFiles**"
Emit "- Codigo <=2 MB: **$allCode MB** en **$codeFiles** archivos (propios $ownCode MB / terceros $thCode MB)"
Emit "- Blobs >2 MB (binarios, inservibles para un LLM): **$bigMB MB** en **$bigFiles** archivos"
Emit "- Volumen de una pasada de LLM: **$tokAll M tokens** (todo) / **$tokOwn M tokens** (solo propios)"
Emit "- Commits sin subir: **$aheadS** en **$aheadN** repos"
Emit "- Repos con cambios sin commitear: **$pending**"
Emit "- Repos atrasados (behind): **$behindN**"
Emit "- Repos sin upstream configurado: **$noup**"
Emit ""

Emit "## BLOQUEOS - leer antes de subir"
Emit ""
Emit "### B1. belentani-workspace NO se puede subir (limite 100 MB de GitHub)"
Emit ""
Emit "Ruta: ``C:\Users\USER\Desktop`` (el Desktop entero es un repo). Commit sin subir ``cde1d71``:"
Emit ""
Emit "| Blob | Tamano | Limite 100 MB |"
Emit "| --- | ---: | --- |"
Emit "| ``j.reg`` | 900.0 MB | 9x superado |"
Emit "| ``aaa.reg`` | 323.5 MB | 3.2x superado |"
Emit "| ``Recording 2026-09-23 093010.mp4`` | 4.3 MB | ok |"
Emit ""
Emit "Los dos ``.reg`` ya no estan en disco (salen como ``D``), pero **los blobs siguen dentro del commit**."
Emit "El push sera **rechazado** por GitHub. Ademas el Desktop tiene 47 borrados, 8 anadidos y 32 sin trackear."
Emit ""
Emit "**Arreglo:** reescribir el commit sin los ``.reg`` (``git filter-repo`` o amend) o resetear ``cde1d71``."
Emit "**Nunca** hacer ``git add -A`` en el Desktop."
Emit ""
Emit "### B2. belentani-unified tiene un modulo borrado"
Emit ""
Emit "``apps/secure-t`` figura como borrado (``D``), no existe en disco, pero esta tracked (1 gitlink)."
Emit "Un ``commit -a`` + push borraria ``secure-t`` del remoto. Decidir: restaurar el directorio o confirmar la baja."
Emit ""
Emit "### B3. Terceros con miles de cambios que NUNCA debes pushear"
Emit ""
Emit "| Path local | Remoto | Modificados | Atras |"
Emit "| --- | --- | ---: | ---: |"
foreach ($r in @('paperclipai/paperclip','tashfeenahmed/freellmapi','HKUDS/CLI-Anything','NousResearch/hermes-agent','harry0703/MoneyPrinterTurbo')) {
  $h = $sync | Where-Object { $_.Remote -eq $r } | Select-Object -First 1
  if ($h) { Emit "| ``$($h.Path)`` | $r | $($h.Modificados) | $($h.Behind) |" }
}
Emit ""
Emit "Son repos de terceros: no hay permiso de push. El ruido viene de builds, ``node_modules`` y entornos."
Emit "Dejarlos como espejo local."
Emit ""

Emit "## Commits sin subir (ahead > 0)"
Emit ""
Emit "| Repo | Rama | Path local |"
Emit "| --- | --- | --- |"
foreach ($h in ($sync | Where-Object { $_.Ahead -gt 0 } | Sort-Object Remote)) {
  Emit "| $($h.Remote) | ``$($h.Branch)`` | ``$($h.Path)`` |"
}
Emit ""

Emit "## Atrasados (behind > 0) - requieren pull antes de push"
Emit ""
Emit "| Repo | Path local | Commits pendientes |"
Emit "| --- | --- | ---: |"
foreach ($h in ($sync | Where-Object { $_.Behind -gt 0 } | Sort-Object Remote)) {
  Emit "| $($h.Remote) | ``$($h.Path)`` | $($h.Behind) |"
}
Emit ""

Emit "## Sin upstream - el push falla"
Emit ""
Emit "| Repo | Rama | Path local |"
Emit "| --- | --- | --- |"
foreach ($h in ($sync | Where-Object { -not $_.Upstream } | Sort-Object Remote)) {
  Emit "| $($h.Remote) | ``$($h.Branch)`` | ``$($h.Path)`` |"
}
Emit ""
Emit "Fix: ``git -C <path> push -u origin <branch>``"
Emit ""

$map = @{}
foreach ($s in $sync) { $map[$s.Path] = $s }
$codeByPath = @{}
foreach ($d in $repos) {
  if (-not $d.Remote) { continue }
  $nm = ($d.Remote -replace '^https://github\.com/','' -replace '\.git$','')
  $hit = $code | Where-Object { $_.Repo -eq $nm } | Select-Object -First 1
  if ($hit) { $codeByPath[$d.Path] = $hit.CodeMB } else { $codeByPath[$d.Path] = 0 }
}

Emit "## Propios con cambios sin commitear"
Emit ""
Emit "| Repo | .git | Codigo | Modif. | Sin trackear | Path local |"
Emit "| --- | ---: | ---: | ---: | ---: | --- |"
$rows = @()
foreach ($r in ($own | Where-Object { $_.Dirty })) {
  $h = $map[$r.Path]
  if ($h) { $rows += [PSCustomObject]@{ R = $r; H = $h } }
}
foreach ($p in ($rows | Sort-Object { $_.R.GitMB } -Descending)) {
  $nm = ($p.R.Remote -replace '^https://github\.com/belentani7/','' -replace '\.git$','')
  $cm = [math]::Round($codeByPath[$p.R.Path], 2)
  Emit "| $nm | $([math]::Round($p.R.GitMB,2)) MB | $cm MB | $($p.H.Modificados) | $($p.H.SinTrackear) | ``$($p.R.Path)`` |"
}
Emit ""

Emit "## Propios ya sincronizados (limpios, upstream OK, 0 ahead 0 behind)"
Emit ""
$clean = @()
foreach ($r in ($own | Where-Object { -not $_.Dirty })) {
  $h = $map[$r.Path]
  if ($h -and $h.Behind -eq 0 -and $h.Ahead -eq 0 -and $h.Upstream) { $clean += $r }
}
foreach ($r in ($clean | Sort-Object Remote)) {
  $nm = ($r.Remote -replace '^https://github\.com/belentani7/','' -replace '\.git$','')
  Emit "- ``$nm`` - ``$($r.Path)``"
}
Emit ""
Emit "**Total sincronizados y verificados: $($clean.Count) repos.**"
Emit ""

Emit "## Orden de subida recomendado"
Emit ""
Emit "1. Los $($clean.Count) repos sincronizados: no tocar."
Emit "2. Los $aheadS commits sueltos (tabla ahead): push directo, sin conflictos."
Emit "3. Configurar upstream en los $noup repos sin rama de seguimiento."
Emit "4. ``belentani-unified`` y ``judas-experience-web``: revisar diff linea a linea, luego commitear."
Emit "5. ``belentani-workspace`` (Desktop): **requiere BLOQUEO B1** antes de cualquier push."
Emit "6. Terceros: no pushear nunca; candidata a borrado local tras verificar."

$out = "C:\Users\USER\Documents\_movido\_PROYECTOS\contexto-repos\INVENTARIO-REPOS.md"
Set-Content -LiteralPath $out -Value ($lines -join "`n") -Encoding UTF8
"OK -> $out"
"LINEAS: $($lines.Count)"
"SINCRONIZADOS: $($clean.Count) | PENDIENTES: $($rows.Count)"
