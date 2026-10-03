#!/usr/bin/env python3
"""
Transcriptor de Reels - Coste minimo
Descarga video (yt-dlp), transcribe audio (faster-whisper) y extrae texto de
imagenes (Tesseract OCR).

Requisitos:
    pip install yt-dlp faster-whisper opencv-python pytesseract Pillow
Adicional:
    - ffmpeg disponible en el PATH (yt-dlp lo necesita para extraer audio)
    - Tesseract-OCR instalado (Windows: C:\\Program Files\\Tesseract-OCR)

Uso:
    python reel_analyzer.py <url> [--language es] [--model base]
    python reel_analyzer.py <url> --json --output result.json
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import List, Optional

TESSERACT_DEFAULT_WIN = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Pares (modulo, pip package)
REQUIRED = [
    ("yt_dlp", "yt-dlp"),
    ("faster_whisper", "faster-whisper"),
    ("cv2", "opencv-python"),
    ("pytesseract", "pytesseract"),
    ("PIL", "Pillow"),
]


def check_dependencies(auto_install: bool = True) -> bool:
    """Verifica dependencias instaladas. Si faltan y auto_install, las instala."""
    missing = [pkg for imp, pkg in REQUIRED if not _module_available(imp)]
    if not missing:
        return True

    print(f"Dependencias faltantes: {', '.join(missing)}")
    if not auto_install:
        print("Reinstalarlas con: pip install " + " ".join(missing))
        return False

    try:
        for pkg in missing:
            print(f"Instalando {pkg}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", pkg, "-q"])
        print("Dependencias instaladas.")
        return True
    except subprocess.CalledProcessError as exc:
        print(f"ERROR: fallo al instalar dependencias: {exc}")
        return False


def _module_available(imp: str) -> bool:
    try:
        __import__(imp)
        return True
    except ImportError:
        return False


def check_external_tools() -> List[str]:
    """Comprueba binarios externos (yt-dlp, ffmpeg, tesseract)."""
    missing = []
    for tool in ("yt-dlp", "ffmpeg"):
        if shutil.which(tool) is None:
            missing.append(tool)
    return missing


def download_video(url: str, workdir: Path) -> Optional[Path]:
    """Descarga el video con yt-dlp dentro de workdir. Devuelve la ruta."""
    if shutil.which("yt-dlp") is None:
        print("ERROR: yt-dlp no esta en el PATH.")
        print("Instalalo con: pip install yt-dlp  (o winget install yt-dlp)")
        return None

    output = workdir / "video.%(ext)s"
    cmd = [
        "yt-dlp",
        "-f", "best[ext=mp4]/best",
        "--no-playlist",
        "--no-warnings",
        "-o", str(output),
        url,
    ]
    print(f"Descargando: {url}")
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
        if result.returncode != 0:
            print(f"Descarga fallida: {result.stderr.strip()}")
            print("Tips:")
            print("  - Exporta tus cookies de Instagram/TikTok y usa: --cookies cookies.txt")
            print("  - Prueba el video manualmente: yt-dlp -F <url>")
            return None
    except subprocess.TimeoutExpired:
        print("ERROR: la descarga supero 10 minutos. Reintenta con un video mas corto.")
        return None

    candidates = sorted(workdir.glob("video.*"), key=lambda p: p.stat().st_size, reverse=True)
    if not candidates:
        print("ERROR: no se encontro el video descargado.")
        return None
    video = candidates[0]
    print(f"Descargado: {video.name} ({video.stat().st_size / 1024 / 1024:.1f} MB)")
    return video


def transcribe_audio(video_path: Path, language: str = "es", model_size: str = "base") -> tuple:
    """Transcribe el audio con faster-whisper. Devuelve (transcript, lang_detected)."""
    print(f"Transcribiendo audio (modelo {model_size}, idioma {language})...")
    try:
        from faster_whisper import WhisperModel

        model = WhisperModel(model_size, device="cpu", compute_type="int8")
        segments, info = model.transcribe(str(video_path), language=language, vad_filter=True)

        lines = [f"[{segment.start:.1f}s] {segment.text}" for segment in segments]
        transcript = "\n".join(lines)
        print(f"Transcripcion completa. Idioma detectado: {info.language}")
        return transcript, info.language
    except Exception as exc:  # noqa: BLE001
        print(f"ERROR de transcripcion: {exc}")
        print("Verifica que ffmpeg este instalado y en el PATH.")
        return "", None


def extract_frames(video_path: Path, workdir: Path, interval: int = 3) -> List[Path]:
    """Extrae fotogramas cada 'interval' segundos dentro de workdir."""
    print(f"Extrayendo fotogramas (cada {interval}s)...")
    try:
        import cv2

        cap = cv2.VideoCapture(str(video_path))
        if not cap.isOpened():
            print("ERROR: no se pudo abrir el video (cv2).")
            return []

        fps = cap.get(cv2.CAP_PROP_FPS)
        if not fps or fps <= 0:
            fps = 30.0  # fallback si el contenedor no reporta fps

        step = max(1, int(fps) * interval)
        frames: List[Path] = []
        count = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            if count % step == 0:
                frame_path = workdir / f"frame_{count:06d}.jpg"
                cv2.imwrite(str(frame_path), frame)
                frames.append(frame_path)
            count += 1
        cap.release()
        print(f"Fotogramas extraidos: {len(frames)}")
        return frames
    except Exception as exc:  # noqa: BLE001
        print(f"ERROR al extraer fotogramas: {exc}")
        return []


def ocr_frames(frames: List[Path], tesseract_cmd: Optional[str] = None) -> str:
    """Lee texto de los fotogramas con Tesseract OCR."""
    print("Ejecutando OCR sobre los fotogramas...")
    try:
        import pytesseract
        from PIL import Image

        if sys.platform == "win32":
            cmd = tesseract_cmd or os.environ.get("TESSERACT_CMD") or TESSERACT_DEFAULT_WIN
            if Path(cmd).exists():
                pytesseract.pytesseract.tesseract_cmd = cmd
            elif not shutil.which("tesseract"):
                print("AVISO: Tesseract no encontrado. Instalalo o pasa --tesseract <ruta>.")
                return ""

        texts = []
        for frame_path in frames:
            try:
                img = Image.open(frame_path)
                text = pytesseract.image_to_string(img, lang="spa+eng")
            except Exception as exc:  # noqa: BLE001
                print(f"  (skip {frame_path.name}: {exc})")
                continue
            if text.strip():
                texts.append(f"--- {frame_path.name} ---\n{text.strip()}")

        return "\n\n".join(texts) if texts else "No se encontro texto en los fotogramas."
    except Exception as exc:  # noqa: BLE001
        print(f"ERROR de OCR: {exc}")
        return ""


def main():
    parser = argparse.ArgumentParser(
        description="Transcribe reels/videos y extrae texto de las imagenes."
    )
    parser.add_argument("url", help="URL del reel/video (Instagram, YouTube Shorts, TikTok)")
    parser.add_argument("--language", default="es", help="Codigo de idioma (default: es)")
    parser.add_argument("--model", default="base", help="Modelo Whisper: tiny/base/small/medium (default: base)")
    parser.add_argument("--no-ocr", action="store_true", help="Omite el OCR de fotogramas")
    parser.add_argument("--no-install", action="store_true", help="No instalar dependencias automaticamente")
    parser.add_argument("--output", default="transcription.txt", help="Archivo de salida (default: transcription.txt)")
    parser.add_argument("--json", action="store_true", help="Ademas, guarda un reporte estructurado .json")
    parser.add_argument("--tesseract", default=None, help="Ruta al binario de Tesseract (Windows)")
    parser.add_argument("--keep-frames", action="store_true", help="No borra los fotogramas extraidos")
    parser.add_argument("--keep-video", action="store_true", help="No borra el video descargado")
    args = parser.parse_args()

    if not check_dependencies(auto_install=not args.no_install):
        sys.exit(1)

    for tool in check_external_tools():
        print(f"AVISO: {tool} no esta en el PATH. Algunas funciones pueden fallar.")

    with tempfile.TemporaryDirectory(prefix="reel_") as tmp:
        workdir = Path(tmp)

        video = download_video(args.url, workdir)
        if video is None:
            sys.exit(1)

        transcript, lang_detected = transcribe_audio(video, args.language, args.model)

        ocr_text = ""
        if not args.no_ocr:
            frames = extract_frames(video, workdir)
            if frames:
                ocr_text = ocr_frames(frames, args.tesseract)
                if not args.keep_frames:
                    for f in frames:
                        f.unlink(missing_ok=True)

        # Guardado
        out_path = Path(args.output)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        content = (
            f"# Transcription\n\n"
            f"URL: {args.url}\n"
            f"Idioma: {lang_detected or args.language}\n"
            f"\n## Audio\n{transcript or '(sin transcripcion)'}\n\n"
            f"## Text from Images\n{ocr_text}"
        )
        out_path.write_text(content, encoding="utf-8")
        print(f"\nResultados guardados en: {out_path}")

        if args.json:
            report = {
                "url": args.url,
                "language": lang_detected or args.language,
                "transcript": transcript,
                "ocr_text": ocr_text,
                "output_file": str(out_path),
            }
            json_path = out_path.with_suffix(".json")
            json_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"Reporte JSON: {json_path}")

        if args.keep_video:
            dest = Path(video.name)
            shutil.copy2(video, dest)
            print(f"Video conservado: {dest}")


if __name__ == "__main__":
    main()
