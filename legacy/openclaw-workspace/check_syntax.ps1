$err = $null
$tokens = [System.Management.Automation.PSParser]::Tokenize((Get-Content -Raw 'C:\Users\USER\.openclaw\workspace\fix-github-critical.ps1'), [ref]$err)
if ($err.Count -gt 0) { $err | ForEach-Object { Write-Host ($_.Message + ' @ line ' + $_.Token.StartLine) } } else { Write-Host 'SYNTAX OK' }
