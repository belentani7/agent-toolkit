$code = Get-Content "C:\Users\USER\AppData\Local\Temp\opencode\tokens.json" -Raw | ConvertFrom-Json

$ownMB = ($code | Where-Object { $_.Repo -like 'belentani7/*' } | Measure-Object CodeMB -Sum).Sum
$allMB = ($code | Measure-Object CodeMB -Sum).Sum
$ownFiles = ($code | Where-Object { $_.Repo -like 'belentani7/*' } | Measure-Object CodeFiles -Sum).Sum
$allFiles = ($code | Measure-Object CodeFiles -Sum).Sum

$tokOwn = $ownMB * 1MB / 4 / 1e6
$tokAll = $allMB * 1MB / 4 / 1e6

$models = @(
  @{ N='GPT-6 Astra (frontera)' ; I=10.00; O=50.00 },
  @{ N='GPT-5.6 Sol'           ; I=4.00;  O=20.00 },
  @{ N='GPT-5.5'              ; I=5.00;  O=30.00 },
  @{ N='GPT-6 Sol'            ; I=2.00;  O=10.00 },
  @{ N='GPT-5'                ; I=1.25;  O=10.00 },
  @{ N='GPT-6 Luna (barato)'  ; I=0.10;  O=0.50 }
)

$lines = New-Object System.Collections.ArrayList
function E { param([string]$t="") $null = $lines.Add($t) }

E "## Coste estimado con LLM"
E ""
E "GPT-Alpha es un agente interno de OpenAI (filtrado en 2025-09) **sin API ni precio publico**."
E "La tabla usa los modelos frontera equivalentes, precio por 1M de tokens."
E ""
E "Base de calculo: `CodeMB / 4 bytes por token`."
E ""
E "| Volumen | MB | Archivos | Tokens |"
E "| --- | ---: | ---: | ---: |"
E "| Solo repos propios (79) | $([math]::Round($ownMB,1)) | $ownFiles | $([math]::Round($tokOwn,1)) M |"
E "| Todos los repos con remote (92) | $([math]::Round($allMB,1)) | $allFiles | $([math]::Round($tokAll,1)) M |"
E ""
E "### Escenario A - una pasada de lectura (input 1x, output 5%)"
E ""
E "Coste = tokens * precio_input + (5% tokens) * precio_output"
E ""
E "| Modelo | Solo propios | Todos |"
E "| --- | ---: | ---: |"
foreach ($m in $models) {
  $a = $tokOwn * $m.I + ($tokOwn * 0.05) * $m.O
  $b = $tokAll * $m.I + ($tokAll * 0.05) * $m.O
  E "| $($m.N) | `$$([int][math]::Round($a))` | `$$([int][math]::Round($b))` |"
}
E ""
E "### Escenario B - trabajo agentico real (input 10x por relecturas, output 10%)"
E ""
E "Un agente reenvia el contexto en cada turno: input ~10x, output ~10% (informes y diffs)."
E ""
E "| Modelo | Solo propios | Todos |"
E "| --- | ---: | ---: |"
foreach ($m in $models) {
  $a = $tokOwn * 10 * $m.I + ($tokOwn * 0.10) * $m.O
  $b = $tokAll * 10 * $m.I + ($tokAll * 0.10) * $m.O
  E "| $($m.N) | `$$([int][math]::Round($a))` | `$$([int][math]::Round($b))` |"
}
E ""
E "### Escenario C - economico, solo lo que importa (input 3x, output 3%, GPT-6 Luna)"
E ""
$luna = $models | Where-Object { $_.N -like '*Luna*' }
$c1 = [int][math]::Round($tokOwn * 3 * $luna.I + ($tokOwn * 0.03) * $luna.O)
$c2 = [int][math]::Round($tokAll * 3 * $luna.I + ($tokAll * 0.03) * $luna.O)
E "- Solo propios: **USD $c1**"
E "- Todos: **USD $c2**"
E ""
E "### Excluido del calculo"
E ""
$bigMB = ($code | Measure-Object BigMB -Sum).Sum
$bigF  = ($code | Measure-Object BigFiles -Sum).Sum
E "- $bigMB MB en $bigF blobs >2 MB (registros, HTML giant, video, binarios). Sin util para un LLM."
E "- Los 34 repos sin remote (3.5 MB), que ademas no se subirian."
E "- Cache de input: si el mismo repo se repregunta, el cached input baja 10x (p.ej. GPT-6 Astra `$1.00/M`)."
E ""
E "Conclusion: el precio lo decide el modelo, no el volumen. GPT-6 Luna hace **todo** por menos de"
E "lo que cuesta una sesion de GPT-6 Astra sobre **un solo repo**."

$inv = "C:\Users\USER\Documents\_movido\_PROYECTOS\contexto-repos\INVENTARIO-REPOS.md"
$txt = Get-Content -LiteralPath $inv -Raw
$txt = $txt -replace "(?s)\r?\n## Orden de subida recomendado", ("`n" + ($lines -join "`n") + "`n`n## Orden de subida recomendado")
Set-Content -LiteralPath $inv -Value $txt -Encoding UTF8
"OK. Seccion de coste anadida."
"tokens propio: $([math]::Round($tokOwn,1)) M | todos: $([math]::Round($tokAll,1)) M"

