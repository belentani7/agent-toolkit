#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Google Drive Uploader - Belentani
Sube carpetas locales a Google Drive usando OAuth2
"""

import os
import sys
import pickle
import json
from pathlib import Path

# Fix Windows encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError

# Configuración
SCOPES = ['https://www.googleapis.com/auth/drive.file']
CREDENTIALS_FILE = r'C:\Users\USER\Downloads\client_secret_2832578670-t34g7c7bidp31obsp5t0rcdnssm67b7e.apps.googleusercontent.com.json'
TOKEN_FILE = r'C:\Users\USER\.openclaw\workspace\token.pickle'
DRIVE_FOLDER_NAME = 'Belentani-Backup-2026-09-01'

# Carpetas a subir
FOLDERS_TO_UPLOAD = [
    'BIGFILES-NO-BORRAR',
    'Documentos',
    'elizaOS',
    'ux-academy-professional-program',
    'claude-manus',
    'Movies',
    'manos-abiertas-drive-extract',
    'tools',
    'belentani-voz',
    'go',
    'belentani-monorepo',
    'belentani-kaggle',
    'bin',
    'belentani-covers',
    'belentani-album',
    'renders3d',
    'NOIACORE TURBO'
]

def authenticate():
    """Autenticación OAuth2 con Google Drive"""
    creds = None
    
    # Cargar token existente
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, 'rb') as token:
            creds = pickle.load(token)
    
    # Si no hay credenciales válidas, autenticar
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=7777)
        
        # Guardar token para futuras sesiones
        with open(TOKEN_FILE, 'wb') as token:
            pickle.dump(creds, token)
    
    return creds

def create_folder(service, folder_name, parent_id=None):
    """Crea una carpeta en Google Drive"""
    file_metadata = {
        'name': folder_name,
        'mimeType': 'application/vnd.google-apps.folder'
    }
    if parent_id:
        file_metadata['parents'] = [parent_id]
    
    try:
        file = service.files().create(body=file_metadata, fields='id').execute()
        print(f'✅ Carpeta creada: {folder_name} (ID: {file.get("id")})')
        return file.get('id')
    except HttpError as error:
        print(f'❌ Error creando carpeta {folder_name}: {error}')
        return None

def upload_file(service, file_path, folder_id):
    """Sube un archivo a Google Drive"""
    file_name = os.path.basename(file_path)
    file_metadata = {
        'name': file_name,
        'parents': [folder_id]
    }
    
    try:
        media = MediaFileUpload(file_path, resumable=True)
        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id'
        ).execute()
        print(f'✅ Subido: {file_name}')
        return file.get('id')
    except HttpError as error:
        print(f'❌ Error subiendo {file_name}: {error}')
        return None

def upload_folder(service, folder_path, parent_id):
    """Sube recursivamente una carpeta y su contenido"""
    folder_name = os.path.basename(folder_path)
    folder_id = create_folder(service, folder_name, parent_id)
    
    if not folder_id:
        return
    
    # Subir archivos y subcarpetas
    for item in os.listdir(folder_path):
        item_path = os.path.join(folder_path, item)
        
        if os.path.isfile(item_path):
            upload_file(service, item_path, folder_id)
        elif os.path.isdir(item_path):
            upload_folder(service, item_path, folder_id)

def main():
    """Función principal"""
    print('[AUTH] Autenticando con Google Drive...')
    creds = authenticate()
    service = build('drive', 'v3', credentials=creds)
    
    print(f'\n[FOLDER] Creando carpeta principal: {DRIVE_FOLDER_NAME}')
    main_folder_id = create_folder(service, DRIVE_FOLDER_NAME)
    
    if not main_folder_id:
        print('[ERROR] No se pudo crear la carpeta principal')
        return
    
    user_home = Path.home()
    
    print(f'\n[UPLOAD] Subiendo {len(FOLDERS_TO_UPLOAD)} carpetas...\n')
    
    for folder_name in FOLDERS_TO_UPLOAD:
        folder_path = user_home / folder_name
        
        if folder_path.exists():
            print(f'\n{"="*60}')
            print(f'[PROCESS] Procesando: {folder_name}')
            print(f'{"="*60}')
            upload_folder(service, str(folder_path), main_folder_id)
        else:
            print(f'[WARN] No encontrada: {folder_name}')
    
    print(f'\n[DONE] Proceso completado!')
    print(f'[FOLDER] Carpeta creada en Google Drive: {DRIVE_FOLDER_NAME}')

if __name__ == '__main__':
    main()
