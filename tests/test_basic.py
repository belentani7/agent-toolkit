"""Tests básicos del inventario exportable del repositorio (Mother 02).

Verifican que ``scripts/export.py`` produce un inventario coherente con la
realidad del repo: cada carpeta de ``legacy/`` aparece en el inventario y la
tabla del README la documenta. Ejecutables con ``python -m unittest discover``
(CI de ``quality.yml``) y con ``pytest``.
"""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from scripts.export import ROOT, export_inventario, leer_tabla_readme


class TestInventario(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.inventario = export_inventario()
        cls.carpetas_reales = sorted(p.name for p in (ROOT / "legacy").iterdir() if p.is_dir())

    def test_total_coincide_con_carpetas_de_legacy(self):
        self.assertGreaterEqual(self.inventario["total"], 50)
        self.assertEqual(self.inventario["total"], len(self.carpetas_reales))
        self.assertEqual(len(self.inventario["bloques"]), len(self.carpetas_reales))

    def test_todas_las_carpetas_aparecen_en_el_inventario(self):
        exportadas = [b["carpeta"] for b in self.inventario["bloques"]]
        self.assertEqual(sorted(exportadas), sorted(f"legacy/{c}" for c in self.carpetas_reales))

    def test_la_tabla_del_readme_cubre_todos_los_bloques(self):
        """Cada carpeta real de legacy/ debe estar documentada en el README."""
        sin_readme = [b["carpeta"] for b in self.inventario["bloques"] if not b["en_readme"]]
        self.assertEqual(sin_readme, [], "bloques sin fila en el README")
        for bloque in self.inventario["bloques"]:
            self.assertIn(bloque["visibilidad"], ("pub", "priv"), bloque["carpeta"])
            self.assertTrue(bloque["repo_original"], bloque["carpeta"])

    def test_export_serializa_a_json_valido(self):
        texto = json.dumps(self.inventario, ensure_ascii=False)
        relanzado = json.loads(texto)
        self.assertEqual(relanzado["total"], self.inventario["total"])

    def test_cli_emite_json_valido(self):
        script = ROOT / "scripts" / "export.py"
        with tempfile.TemporaryDirectory() as tmp:
            destino = Path(tmp) / "inventario.json"
            proc = subprocess.run(
                [sys.executable, str(script), "--out", str(destino)],
                capture_output=True,
                text=True,
                cwd=ROOT,
                timeout=60,
            )
            self.assertEqual(proc.returncode, 0, proc.stderr)
            datos = json.loads(destino.read_text(encoding="utf-8"))
            self.assertEqual(datos["total"], self.inventario["total"])


class TestLecturaTabla(unittest.TestCase):
    def test_tabla_readme_devuelve_metadatos(self):
        tabla = leer_tabla_readme()
        self.assertGreaterEqual(len(tabla), 50)
        ejemplo = tabla.get("openclaw-workspace")
        self.assertIsNotNone(ejemplo)
        self.assertEqual(ejemplo["repo_original"], "openclaw-workspace")
        self.assertEqual(ejemplo["visibilidad"], "pub")


if __name__ == "__main__":
    unittest.main()
