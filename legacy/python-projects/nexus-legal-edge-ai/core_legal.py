"""
core_legal.py - Motor Legal Determinista
Valida turnos contra Estatuto de los Trabajadores y convenios.
Lógica pura sin IA, cero alucinaciones.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any
from datetime import datetime
import json
import os


@dataclass(frozen=True)
class EstatutoTrabajadores:
    """Leyes Marco Estatales (Inmutables por principio de jerarquía normativa)"""
    JORNADA_MAXIMA_ANUAL_HORAS: float = 1826.0
    DESCANSO_MINIMO_ENTRE_JORNADAS_HORAS: float = 12.0
    PAUSA_INTRAJORNADA_MINUTOS: int = 15
    HORAS_EXTRA_MAXIMAS_ANUALES: int = 80


@dataclass
class ConvenioColectivo:
    """Convenio sectorial/autonómico que mejora el Estatuto"""
    codigo: str
    nombre: str
    ccaa: str
    vacaciones_dias: int = 22
    plus_nocturnidad_pct: float = 0.20
    plus_domingo_festivo_pct: float = 0.50
    jornada_anual_horas: Optional[float] = None  # Si mejora el estatuto


class LegalValidator:
    """
    Motor de validación que cruza variables del empleado con la jerarquía legal.
    Prioridad: Convenio > Estatuto (siempre que sea más favorable).
    """
    
    def __init__(self, db_path: str = "convenios.json"):
        self.et = EstatutoTrabajadores()
        self.convenios = self._load_convenios(db_path)
    
    def _load_convenios(self, path: str) -> Dict[str, ConvenioColectivo]:
        """Carga convenios desde JSON. Fallback seguro si no existe."""
        if not os.path.exists(path):
            return self._default_convenios()
        
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            convenios = {}
            for k, v in data.items():
                convenios[k] = ConvenioColectivo(
                    codigo=k,
                    nombre=v.get('nombre', k),
                    ccaa=v.get('ccaa', 'NACIONAL'),
                    vacaciones_dias=v.get('vacaciones_dias', 22),
                    plus_nocturnidad_pct=v.get('plus_nocturnidad_pct', 0.20),
                    plus_domingo_festivo_pct=v.get('plus_domingo_festivo_pct', 0.50),
                    jornada_anual_horas=v.get('jornada_anual_horas')
                )
            return convenios
        except Exception as e:
            print(f"[WARN] Error cargando convenios: {e}. Usando defaults.")
            return self._default_convenios()
    
    def _default_convenios(self) -> Dict[str, ConvenioColectivo]:
        """Convenios mínimos por si falla el archivo"""
        return {
            "OFICINAS_CAT": ConvenioColectivo(
                "OFICINAS_CAT", "Oficinas y Despachos CAT", "CAT", 23, 0.20, 0.50
            ),
            "METAL_MAD": ConvenioColectivo(
                "METAL_MAD", "Industria Metal Madrid", "MAD", 22, 0.25, 0.60
            ),
            "HOSTELERIA_AND": ConvenioColectivo(
                "HOSTELERIA_AND", "Hostelería Andalucía", "AND", 22, 0.30, 0.75
            ),
            "COMERCIO_VAL": ConvenioColectivo(
                "COMERCIO_VAL", "Comercio Valencia", "VAL", 22, 0.20, 0.50
            ),
            "CONSTRUCCION_NAC": ConvenioColectivo(
                "CONSTRUCCION_NAC", "Construcción Nacional", "NACIONAL", 22, 0.25, 0.50
            ),
        }
    
    def get_convenio(self, codigo: str) -> Optional[ConvenioColectivo]:
        return self.convenios.get(codigo)
    
    def list_convenios(self) -> List[Dict]:
        return [
            {"codigo": k, "nombre": v.nombre, "ccaa": v.ccaa}
            for k, v in self.convenios.items()
        ]
    
    def validate_shift_compliance(
        self, 
        horas_jornada: float, 
        horas_descanso_previo: float,
        convenio_codigo: str = "OFICINAS_CAT",
        es_nocturno: bool = False,
        es_domingo_festivo: bool = False
    ) -> Dict[str, Any]:
        """
        Valida el turno y devuelve structured output listo para IA/Reportes.
        
        Args:
            horas_jornada: Horas trabajadas en el turno
            horas_descanso_previo: Horas desde fin de turno anterior
            convenio_codigo: Código del convenio aplicable
            es_nocturno: Si el turno es nocturno (22:00-06:00)
            es_domingo_festivo: Si cae en domingo/festivo
        """
        convenio = self.convenios.get(convenio_codigo, self._default_convenios()["OFICINAS_CAT"])
        alertas = []
        warnings = []
        info = []
        
        # 1. Validar descanso entre jornadas (Art. 34.3 ET: Mínimo 12h)
        if horas_descanso_previo < self.et.DESCANSO_MINIMO_ENTRE_JORNADAS_HORAS:
            deficit = self.et.DESCANSO_MINIMO_ENTRE_JORNADAS_HORAS - horas_descanso_previo
            alertas.append({
                "codigo": "ET_34_3_DESCANSO_INSUFICIENTE",
                "articulo": "Art. 34.3 ET",
                "severity": "CRITICAL",
                "message": (
                    f"VIOLACIÓN LEGAL: Descanso de {horas_descanso_previo}h. "
                    f"El mínimo legal es {self.et.DESCANSO_MINIMO_ENTRE_JORNADAS_HORAS}h. "
                    f"Déficit: {deficit:.1f}h. Turno ILEGAL."
                ),
                "remediation": f"Atrasar entrada {deficit:.1f}h o adelantar salida anterior."
            })
        
        # 2. Validar jornada máxima diaria (Art. 34.1 ET: Máx 9h salvo convenio)
        max_diaria = 9.0  # Default ET
        # Si convenio mejora, usar ese límite
        if convenio.jornada_anual_horas:
            # Estimación diaria aproximada (230 días laborables)
            max_diaria = min(9.0, convenio.jornada_anual_horas / 230)
        
        if horas_jornada > max_diaria:
            alertas.append({
                "codigo": "ET_34_1_JORNADA_EXCESIVA",
                "articulo": "Art. 34.1 ET",
                "severity": "CRITICAL",
                "message": (
                    f"VIOLACIÓN LEGAL: Jornada de {horas_jornada}h supera el máximo de {max_diaria}h/día "
                    f"({convenio.nombre}). Turno ILEGAL."
                ),
                "remediation": f"Reducir jornada a {max_diaria}h o fraccionar en dos turnos."
            })
        
        # 3. Pausa intrajornada (Art. 34.4 ET: 15min si jornada > 6h)
        if horas_jornada > 6.0:
            warnings.append({
                "codigo": "ET_34_4_PAUSA_OBLIGATORIA",
                "articulo": "Art. 34.4 ET",
                "severity": "WARNING",
                "message": (
                    f"Jornada de {horas_jornada}h requiere pausa mínima de "
                    f"{self.et.PAUSA_INTRAJORNADA_MINUTOS} min. "
                    f"Debe reflejarse en cuadrante."
                ),
                "remediation": "Incluir pausa de 15min en horario (no computable como trabajo)."
            })
        
        # 4. Horas extra límite anual (Art. 35 ET: 80h/año)
        info.append({
            "codigo": "ET_35_HORAS_EXTRA",
            "articulo": "Art. 35 ET",
            "severity": "INFO",
            "message": f"Límite anual horas extra: {self.et.HORAS_EXTRA_MAXIMAS_ANUALES}h. Verificar acumulado empleado."
        })
        
        # 5. Plus nocturnidad si aplica
        if es_nocturno:
            info.append({
                "codigo": "PLUS_NOCTURNIDAD",
                "articulo": f"Convenio {convenio.codigo}",
                "severity": "INFO",
                "message": (
                    f"Turno nocturno detectado. Plus aplicable: "
                    f"{convenio.plus_nocturnidad_pct*100:.0f}% sobre salario base."
                )
            })
        
        # 6. Plus domingo/festivo
        if es_domingo_festivo:
            info.append({
                "codigo": "PLUS_FESTIVO",
                "articulo": f"Convenio {convenio.codigo}",
                "severity": "INFO",
                "message": (
                    f"Turno en domingo/festivo. Plus aplicable: "
                    f"{convenio.plus_domingo_festivo_pct*100:.0f}% sobre salario base."
                )
            })
        
        # 7. Vacaciones según convenio
        info.append({
            "codigo": "VACACIONES",
            "articulo": f"Convenio {convenio.codigo}",
            "severity": "INFO",
            "message": f"Derecho a {convenio.vacaciones_dias} días de vacaciones anuales."
        })
        
        is_compliant = len(alertas) == 0
        
        return {
            "timestamp": datetime.now().isoformat(),
            "convenio": convenio.codigo,
            "convenio_nombre": convenio.nombre,
            "ccaa": convenio.ccaa,
            "inputs": {
                "horas_jornada": horas_jornada,
                "horas_descanso_previo": horas_descanso_previo,
                "es_nocturno": es_nocturno,
                "es_domingo_festivo": es_domingo_festivo
            },
            "is_compliant": is_compliant,
            "critical_count": len(alertas),
            "warning_count": len(warnings),
            "alerts": alertas,
            "warnings": warnings,
            "info": info
        }
    
    def validate_weekly_schedule(
        self,
        dias_trabajo: List[Dict],  # [{"dia": "Lunes", "horas": 8, "descanso_previo": 12, ...}, ...]
        convenio_codigo: str = "OFICINAS_CAT"
    ) -> Dict[str, Any]:
        """Valida una semana completa de turnos"""
        resultados_dia = []
        total_horas = 0
        alertas_semana = []
        
        for dia_data in dias_trabajo:
            result = self.validate_shift_compliance(
                horas_jornada=dia_data.get("horas", 8),
                horas_descanso_previo=dia_data.get("descanso_previo", 12),
                convenio_codigo=convenio_codigo,
                es_nocturno=dia_data.get("nocturno", False),
                es_domingo_festivo=dia_data.get("festivo", False)
            )
            resultados_dia.append(result)
            total_horas += dia_data.get("horas", 8)
            alertas_semana.extend(result["alerts"])
        
        # Validar jornada semanal (Art. 34.2 ET: media 40h/semana computo anual)
        if total_horas > 40:
            alertas_semana.append({
                "codigo": "ET_34_2_JORNADA_SEMANAL",
                "articulo": "Art. 34.2 ET",
                "severity": "WARNING",
                "message": f"Semana de {total_horas}h supera media 40h/semana. Debe compensarse en otras semanas."
            })
        
        return {
            "semana_compliant": len([a for a in alertas_semana if a["severity"] == "CRITICAL"]) == 0,
            "total_horas": total_horas,
            "dias": resultados_dia,
            "alertas_consolidadas": alertas_semana
        }


if __name__ == "__main__":
    # Test rápido
    validator = LegalValidator()
    print("Convenios disponibles:")
    for c in validator.list_convenios():
        print(f"  {c['codigo']}: {c['nombre']} ({c['ccaa']})")
    
    print("\n--- Test Turno ILEGAL (descanso 10h) ---")
    r = validator.validate_shift_compliance(9, 10, "OFICINAS_CAT")
    print(f"Compliant: {r['is_compliant']}")
    for a in r['alerts']:
        print(f"  CRITICAL: {a['message']}")
    
    print("\n--- Test Turno LEGAL ---")
    r = validator.validate_shift_compliance(8, 13, "OFICINAS_CAT")
    print(f"Compliant: {r['is_compliant']}")
    print(f"Info: {len(r['info'])} items")