@echo off
title Duck Music Studio
cd /d "%~dp0"
echo.
echo  =========================================
echo     Duck Music Studio - arrancando...
echo  =========================================
echo.

REM Usa el entorno virtual .venv si existe (recomendado)
if exist ".venv\Scripts\python.exe" (
    ".venv\Scripts\python.exe" studio.py
) else (
    python studio.py
)

if errorlevel 1 (
  echo.
  echo [ERROR] Algo fallo. Si faltan dependencias, ejecuta:
  echo         pip install -r requirements.txt
  echo.
  echo O crea el entorno recomendado:
  echo         python -m venv .venv
  echo         .venv\Scripts\pip install -r requirements.txt
  pause
)
