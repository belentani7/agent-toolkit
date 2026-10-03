"""
core_ai.py - Agente de IA Local 100% Offline
Wrapper para Ollama (Llama 3, Mistral, etc.) 
Cero datos salen de la máquina.
"""

import subprocess
import json
import platform
import shlex
from typing import Optional, Dict, Any
from dataclasses import dataclass
from pathlib import Path


@dataclass
class OllamaConfig:
    """Configuración del modelo local"""
    modelo: str = "llama3"  # llama3, mistral, codellama, phi3
    timeout_segundos: int = 30
    temperatura: float = 0.3  # Bajo = más determinista/legal
    max_tokens: int = 500


class LocalAIAgent:
    """
    Agente IA que se ejecuta 100% en local vía Ollama.
    No envía datos a la nube. No requiere API keys.
    """
    
    def __init__(self, config: Optional[OllamaConfig] = None):
        self.config = config or OllamaConfig()
        self._ollama_path = self._find_ollama()
        self._available = self._ollama_path is not None
    
    def _find_ollama(self) -> Optional[str]:
        """Detecta si Ollama está instalado y accesible"""
        candidates = []
        
        if platform.system() == "Windows":
            # Rutas típicas Windows
            local_app = os.environ.get("LOCALAPPDATA", "")
            candidates = [
                "ollama",  # En PATH
                os.path.join(local_app, "Programs", "Ollama", "ollama.exe"),
                os.path.join(os.environ.get("PROGRAMFILES", ""), "Ollama", "ollama.exe"),
            ]
        else:
            candidates = ["ollama", "/usr/local/bin/ollama", "/opt/homebrew/bin/ollama"]
        
        for cmd in candidates:
            try:
                result = subprocess.run(
                    [cmd, "--version"] if not cmd.endswith(".exe") else [cmd, "--version"],
                    capture_output=True,
                    timeout=5,
                    shell=(platform.system() == "Windows")
                )
                if result.returncode == 0:
                    return cmd
            except Exception:
                continue
        return None
    
    @property
    def is_available(self) -> bool:
        return self._available
    
    @property
    def model_name(self) -> str:
        return self.config.modelo
    
    def check_model_installed(self) -> bool:
        """Verifica si el modelo está descargado"""
        if not self._available:
            return False
        try:
            result = subprocess.run(
                [self._ollama_path, "list"],
                capture_output=True,
                text=True,
                timeout=10,
                shell=(platform.system() == "Windows")
            )
            return self.config.modelo in result.stdout
        except Exception:
            return False
    
    def pull_model(self) -> bool:
        """Descarga el modelo si no está disponible"""
        if not self._available:
            return False
        try:
            print(f"[IA] Descargando modelo {self.config.modelo}...")
            result = subprocess.run(
                [self._ollama_path, "pull", self.config.modelo],
                capture_output=True,
                text=True,
                timeout=300,  # 5 min para descarga
                shell=(platform.system() == "Windows")
            )
            return result.returncode == 0
        except Exception as e:
            print(f"[IA] Error descargando modelo: {e}")
            return False
    
    def generate_explanation(self, validation_result: Dict[str, Any]) -> str:
        """
        Genera explicación legal amable para managers basada en validación.
        """
        prompt = self._build_prompt(validation_result)
        return self._query_ollama(prompt)
    
    def generate_employee_notice(self, validation_result: Dict[str, Any]) -> str:
        """
        Genera comunicación formal para el empleado afectado.
        """
        prompt = self._build_employee_prompt(validation_result)
        return self._query_ollama(prompt)
    
    def generate_manager_email(self, validation_result: Dict[str, Any], manager_name: str = "") -> str:
        """
        Genera email listo para enviar al manager responsable.
        """
        prompt = self._build_manager_email_prompt(validation_result, manager_name)
        return self._query_ollama(prompt)
    
    def _build_prompt(self, result: Dict[str, Any]) -> str:
        critical_alerts = [a for a in result.get("alerts", []) if a.get("severity") == "CRITICAL"]
        warnings = result.get("warnings", [])
        
        alert_text = ""
        for a in critical_alerts:
            alert_text += f"- {a['articulo']}: {a['message']}\n  Solución: {a.get('remediation', 'N/A')}\n"
        for w in warnings:
            alert_text += f"- {w['articulo']} (Aviso): {w['message']}\n"
        
        return f"""Eres un asesor laboral experto en legislación española (Estatuto de los Trabajadores, convenios colectivos).
Tu tono es PROFESIONAL, CLARO y CONSTRUCTIVO. Nunca alarmista.
NO menciones que eres una IA. Firma como "Asesor Legal Automatizado".

INCIDENCIAS DETECTADAS:
{alert_text if alert_text else "Ninguna incidencia crítica."}

CONTEXTO:
- Convenio: {result.get('convenio_nombre', 'N/A')} ({result.get('ccaa', 'N/A')})
- Turno analizado: {result.get('inputs', {}).get('horas_jornada', 0)}h trabajo, {result.get('inputs', {}).get('horas_descanso_previo', 0)}h descanso
- Nocturno: {result.get('inputs', {}).get('es_nocturno', False)}
- Festivo: {result.get('inputs', {}).get('es_domingo_festivo', False)}

GENERA:
1. Resumen ejecutivo (2 líneas máx)
2. Qué artículos se violan exactamente
3. Impacto legal (multas, nulidad turno, responsabilidad empresarial)
4. 3 acciones concretas para corregir ANTES de publicar el cuadrante
5. Cálculo de pluses correspondientes si aplica

FORMATO: Markdown limpio, viñetas, sin introducción ni despedida innecesarias."""
    
    def _build_employee_prompt(self, result: Dict[str, Any]) -> str:
        critical_alerts = [a for a in result.get("alerts", []) if a.get("severity") == "CRITICAL"]
        
        return f"""Redacta una comunicación FORMAL y EMPÁTICA para un EMPLEADO afectado por un error en su cuadrante.

INCIDENCIA: {len(critical_alerts)} violación(es) legal(es) detectada(s) en su turno programado.
Detalle: {"; ".join([a['message'] for a in critical_alerts])}

REQUISITOS:
- Tono respetuoso, tranquilizador, transparente
- Explicar QUÉ pasa, POR QUÉ es ilegal, QUÉ se va a hacer
- Garantizar que NO habrá repercusión negativa para el empleado
- Ofrecer alternativa concreta (cambio de turno, compensación, etc.)
- Cumplir Art. 5 ET (información por escrito)
- Español neutro, máximo 200 palabras

NO uses jerga legal innecesaria. Firma: "Dirección de RRHH"."""
    
    def _build_manager_email_prompt(self, result: Dict[str, Any], manager_name: str) -> str:
        critical_alerts = [a for a in result.get("alerts", []) if a.get("severity") == "CRITICAL"]
        
        return f"""Redacta un EMAIL CORPORATIVO URGENTE para un MANAGER de equipo.

DESTINATARIO: {manager_name or "Responsable de Equipo"}
ASUNTO: URGENTE - Corrección cuadrante: incumplimiento legal detectado

CONTEXTO: El sistema ha detectado {len(critical_alerts)} violación(es) del Estatuto de los Trabajadores 
en el cuadrante de su equipo para la próxima semana.

INCUMPLIMIENTOS:
{chr(10).join([f"- {a['articulo']}: {a['message']}" for a in critical_alerts])}

EL EMAIL DEBE:
1. Ser directo, profesional, orientado a SOLUCIÓN
2. Indicar exactamente QUÉ turnos cambiar (día, empleado, nueva hora)
3. Recordar responsabilidad legal del manager (Art. 4.2 ET)
4. Dar plazo: "Corregir antes de las 14:00h de hoy"
5. Ofrecer apoyo de RRHH para reorganizar
6. Copia a Dirección RRHH

Formato: Asunto, Saludo, Cuerpo, Acción requerida, Plazo, Cierre, Firma "Sistema de Cumplimiento Legal"."""
    
    def _query_ollama(self, prompt: str) -> str:
        """Ejecuta consulta a Ollama local"""
        if not self._available:
            return self._fallback_response(prompt)
        
        if not self.check_model_installed():
            if not self.pull_model():
                return self._fallback_response(prompt)
        
        try:
            cmd = [self._ollama_path, "run", self.config.modelo]
            
            if platform.system() == "Windows":
                # Windows necesita shell=True para resolver rutas con espacios
                result = subprocess.run(
                    cmd,
                    input=prompt,
                    capture_output=True,
                    text=True,
                    encoding='utf-8',
                    timeout=self.config.timeout_segundos,
                    shell=True
                )
            else:
                result = subprocess.run(
                    cmd,
                    input=prompt,
                    capture_output=True,
                    text=True,
                    encoding='utf-8',
                    timeout=self.config.timeout_segundos
                )
            
            if result.returncode == 0 and result.stdout.strip():
                return result.stdout.strip()
            else:
                err = result.stderr.strip() if result.stderr else "Sin salida"
                return f"[Error IA local: {err}]\n\n{self._fallback_response(prompt)}"
                
        except subprocess.TimeoutExpired:
            return "[Timeout: La IA local tardó demasiado. Aumenta timeout o usa modelo más ligero.]\n\n" + self._fallback_response(prompt)
        except Exception as e:
            return f"[Error IA local: {str(e)}]\n\n{self._fallback_response(prompt)}"
    
    def _fallback_response(self, prompt: str) -> str:
        """Respuesta determinista si IA no disponible"""
        if "EMPLEADO" in prompt:
            return (
                "Estimado/a empleado/a,\n\n"
                "Le informamos que se ha detectado una incidencia en su cuadrante de turnos "
                "que no cumple con el descanso mínimo legal (Art. 34.3 ET). "
                "Su turno actual tiene un descanso inferior a 12 horas.\n\n"
                "ACCIONES: Su turno será reprogramado garantizando el descanso legal. "
                "No sufrirá ningún perjuicio económico ni laboral. "
                "Recibirá el nuevo cuadrante en las próximas 2 horas.\n\n"
                "Disculpe las molestias.\n\nDirección de RRHH"
            )
        elif "MANAGER" in prompt:
            return (
                f"Asunto: URGENTE - Corrección cuadrante incumplimiento legal\n\n"
                f"Estimado/a {prompt.split('DESTINATARIO:')[1].split(chr(10))[0] if 'DESTINATARIO:' in prompt else 'Responsable'}:\n\n"
                "El sistema detecta turnos con descanso inferior a 12h (Art. 34.3 ET). "
                "Esto constituye infracción muy grave (Art. 7.5 LISOS).\n\n"
                "ACCIÓN REQUERIDA: Modificar cuadrante ANTES de las 14:00h de hoy:\n"
                "- Atrasar entrada o adelantar salida anterior para garantizar 12h descanso\n"
                "- Verificar que ningún empleado supere 9h jornada diaria\n"
                "- Incluir pausas de 15min en jornadas >6h\n\n"
                "RRHH valida cambios. Copia a Dirección.\n\n"
                "Sistema de Cumplimiento Legal Automatizado"
            )
        else:
            return (
                "RESUMEN: Turno incumple descanso mínimo 12h (Art. 34.3 ET).\n\n"
                "VIOLACIONES:\n"
                "- Art. 34.3 ET: Descanso insuficiente entre jornadas\n\n"
                "ACCIONES INMEDIATAS:\n"
                "1. Reprogramar turno garantizando 12h descanso\n"
                "2. Verificar jornada máxima 9h/día\n"
                "3. Aplicar pluses nocturnidad/festivo si corresponde\n\n"
                "Asesor Legal Automatizado"
            )


# Función de conveniencia para uso rápido
def create_ai_agent(modelo: str = "llama3") -> LocalAIAgent:
    return LocalAIAgent(OllamaConfig(modelo=modelo))


if __name__ == "__main__":
    import os
    agent = create_ai_agent()
    print(f"Ollama disponible: {agent.is_available}")
    print(f"Modelo: {agent.model_name}")
    print(f"Modelo instalado: {agent.check_model_installed()}")
    
    # Test con resultado simulado
    test_result = {
        "convenio_nombre": "Oficinas y Despachos CAT",
        "ccaa": "CAT",
        "inputs": {"horas_jornada": 9, "horas_descanso_previo": 10, "es_nocturno": False, "es_domingo_festivo": False},
        "alerts": [{
            "articulo": "Art. 34.3 ET",
            "message": "VIOLACIÓN LEGAL: Descanso de 10h. El mínimo legal es 12h. Déficit: 2.0h. Turno ILEGAL.",
            "remediation": "Atrasar entrada 2.0h o adelantar salida anterior."
        }],
        "warnings": [],
        "info": []
    }
    
    if agent.is_available:
        print("\n--- Generando explicación con IA local ---")
        print(agent.generate_explanation(test_result))
    else:
        print("\n--- Modo Fallback (IA no disponible) ---")
        print(agent._fallback_response("test"))