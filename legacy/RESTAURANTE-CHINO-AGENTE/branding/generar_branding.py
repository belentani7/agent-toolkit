"""
🐉 DRAGÓN DE JADE — Generador de Imágenes Placeholder
Crea imágenes SVG para el restaurante.
"""

import json
from pathlib import Path

def crear_logo_svg():
    """Crea logo SVG del restaurante."""
    svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#D4AF37"/>
      <stop offset="100%" style="stop-color:#8B6914"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="#0A0A0A" rx="20"/>
  <circle cx="200" cy="150" r="80" fill="url(#gold)" opacity="0.2"/>
  <text x="200" y="180" font-size="100" text-anchor="middle" fill="url(#gold)">🐉</text>
  <text x="200" y="260" font-family="serif" font-size="32" font-weight="bold" text-anchor="middle" fill="#D4AF37">Dragón de Jade</text>
  <text x="200" y="295" font-family="serif" font-size="24" text-anchor="middle" fill="#8B6914">龍玉</text>
  <text x="200" y="330" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#666" font-style="italic">Sabor auténtico, tradición milenaria</text>
</svg>"""

    output_path = Path(__file__).parent.parent / 'branding' / 'logo_completo.svg'
    output_path.parent.mkdir(exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(svg)
    print(f"✅ Logo creado: {output_path}")
    return output_path

def crear_menu_svg():
    """Crea menú SVG."""
    svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#D4AF37"/>
      <stop offset="100%" style="stop-color:#8B6914"/>
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="#0A0A0A"/>
  <rect x="0" y="0" width="600" height="120" fill="url(#gold)"/>
  <text x="300" y="50" font-size="40" text-anchor="middle" fill="#000">🐉</text>
  <text x="300" y="85" font-family="serif" font-size="28" font-weight="bold" text-anchor="middle" fill="#000">Dragón de Jade 龍玉</text>
  <text x="300" y="110" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#333">Calle Gran Vía de los Chinos, 42 — Barcelona</text>

  <text x="50" y="170" font-family="serif" font-size="20" fill="#D4AF37">🥟 Entrantes / YumCha</text>
  <text x="50" y="200" font-family="sans-serif" font-size="14" fill="#CCC">Har Gow (Gambas) — 6.50€</text>
  <text x="50" y="225" font-family="sans-serif" font-size="14" fill="#CCC">Siu Mai (Cerdo) — 6.00€</text>
  <text x="50" y="250" font-family="sans-serif" font-size="14" fill="#CCC">Spring Rolls — 5.00€</text>
  <text x="50" y="275" font-family="sans-serif" font-size="14" fill="#CCC">Pato Pekín (½) — 14.00€</text>

  <text x="50" y="320" font-family="serif" font-size="20" fill="#D4AF37">🍜 Arroces</text>
  <text x="50" y="350" font-family="sans-serif" font-size="14" fill="#CCC">Arroz del Dragón — 9.50€</text>
  <text x="50" y="375" font-family="sans-serif" font-size="14" fill="#CCC">Chow Mein — 9.00€</text>
  <text x="50" y="400" font-family="sans-serif" font-size="14" fill="#CCC">Fideos Ternera — 10.00€</text>

  <text x="50" y="445" font-family="serif" font-size="20" fill="#D4AF37">🥩 Carnes</text>
  <text x="50" y="475" font-family="sans-serif" font-size="14" fill="#CCC">Cerdo Agridulce — 12.50€</text>
  <text x="50" y="500" font-family="sans-serif" font-size="14" fill="#CCC">Pollo Almendras — 11.00€</text>
  <text x="50" y="525" font-family="sans-serif" font-size="14" fill="#CCC">Costillas BBQ — 14.50€</text>

  <text x="50" y="570" font-family="serif" font-size="20" fill="#D4AF37">🍰 Postres</text>
  <text x="50" y="600" font-family="sans-serif" font-size="14" fill="#CCC">Mochi Matcha — 5.00€</text>
  <text x="50" y="625" font-family="sans-serif" font-size="14" fill="#CCC">Tarta Lichi — 5.50€</text>

  <rect x="0" y="680" width="600" height="120" fill="#1A1A1A"/>
  <text x="300" y="720" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#D4AF37">📞 +34 933 456 789 | 📱 WhatsApp: +34 612 345 678</text>
  <text x="300" y="750" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#666">Horario: Lu-Ju 12-23h | Vi-Sa 12-00h | Do 12-22h</text>
  <text x="300" y="775" font-family="sans-serif" font-size="11" text-anchor="middle" fill="#444">www.dragondejade.es</text>
</svg>"""

    output_path = Path(__file__).parent.parent / 'branding' / 'menu_carta.svg'
    output_path.parent.mkdir(exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(svg)
    print(f"✅ Menú creado: {output_path}")
    return output_path

def crear_flyer_svg():
    """Crea flyer de delivery SVG."""
    svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
  <defs>
    <linearGradient id="red" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#C41E3A"/>
      <stop offset="100%" style="stop-color:#8B0000"/>
    </linearGradient>
  </defs>
  <rect width="400" height="600" fill="#0A0A0A"/>
  <rect x="0" y="0" width="400" height="150" fill="url(#red)"/>
  <text x="200" y="60" font-size="50" text-anchor="middle">🛵</text>
  <text x="200" y="100" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#FFF">¡PIDE A DOMICILIO!</text>
  <text x="200" y="130" font-family="serif" font-size="16" text-anchor="middle" fill="#FFD700">Dragón de Jade 龍玉</text>

  <text x="200" y="220" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#888">Pidiendo directo</text>
  <text x="200" y="270" font-family="sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#D4AF37">10%</text>
  <text x="200" y="310" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#D4AF37">DESCUENTO</text>

  <line x1="100" y1="340" x2="300" y2="340" stroke="#333" stroke-width="1"/>

  <text x="200" y="380" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#FFF">📱 WhatsApp: 612 345 678</text>
  <text x="200" y="410" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#FFF">🌐 dragondejade.es/pedidos</text>
  <text x="200" y="440" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#FFF">📞 933 456 789</text>

  <text x="200" y="490" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#666">🛵 Envío gratuito en radio de 3km</text>
  <text x="200" y="520" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#666">⏱️ Tiempo estimado: 30-45 min</text>

  <rect x="50" y="550" width="300" height="30" fill="#D4AF37" rx="15"/>
  <text x="200" y="570" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#000">PIDE AHORA</text>
</svg>"""

    output_path = Path(__file__).parent.parent / 'branding' / 'flyer_delivery.svg'
    output_path.parent.mkdir(exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(svg)
    print(f"✅ Flyer creado: {output_path}")
    return output_path

def crear_post_instagram_svg():
    """Crea post de Instagram SVG."""
    svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
  <defs>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#D4AF37"/>
      <stop offset="100%" style="stop-color:#8B6914"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1080" fill="#0A0A0A"/>
  <rect x="0" y="0" width="1080" height="200" fill="url(#gold)"/>
  <text x="540" y="80" font-size="80" text-anchor="middle">🐉</text>
  <text x="540" y="140" font-family="serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#000">Dragón de Jade</text>
  <text x="540" y="180" font-family="serif" font-size="24" text-anchor="middle" fill="#333">龍玉</text>

  <text x="540" y="350" font-family="sans-serif" font-size="36" text-anchor="middle" fill="#FFF">Menú del Día</text>
  <text x="540" y="420" font-family="sans-serif" font-size="24" text-anchor="middle" fill="#888">Entrante + Principal + Postre + Bebida</text>

  <rect x="240" y="460" width="600" height="150" fill="#1A1A1A" rx="20"/>
  <text x="540" y="530" font-family="sans-serif" font-size="80" font-weight="bold" text-anchor="middle" fill="#D4AF37">12.50€</text>
  <text x="540" y="580" font-family="sans-serif" font-size="20" text-anchor="middle" fill="#666">Solo de lunes a viernes | 12:00 - 16:00</text>

  <text x="540" y="700" font-family="sans-serif" font-size="28" text-anchor="middle" fill="#FFF">📍 Calle Gran Vía de los Chinos, 42</text>
  <text x="540" y="750" font-family="sans-serif" font-size="24" text-anchor="middle" fill="#888">Barcelona</text>

  <text x="540" y="850" font-family="sans-serif" font-size="20" text-anchor="middle" fill="#D4AF37">📞 +34 933 456 789</text>
  <text x="540" y="890" font-family="sans-serif" font-size="20" text-anchor="middle" fill="#D4AF37">📱 WhatsApp: +34 612 345 678</text>

  <text x="540" y="1000" font-family="sans-serif" font-size="16" text-anchor="middle" fill="#444">#DragonDeJade #ComidaChina #Barcelona #MenúDelDía #DimSum #YumCha #ComidaChinaBarcelona</text>
</svg>"""

    output_path = Path(__file__).parent.parent / 'branding' / 'post_instagram.svg'
    output_path.parent.mkdir(exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(svg)
    print(f"✅ Post Instagram creado: {output_path}")
    return output_path

def crear_tarjeta_svg():
    """Crea tarjeta de presentación SVG."""
    svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" width="900" height="500">
  <defs>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#D4AF37"/>
      <stop offset="100%" style="stop-color:#8B6914"/>
    </linearGradient>
  </defs>
  <rect width="900" height="500" fill="#0A0A0A" rx="20"/>
  <rect x="0" y="0" width="4" height="500" fill="url(#gold)"/>

  <text x="80" y="80" font-size="60">🐉</text>
  <text x="80" y="130" font-family="serif" font-size="32" font-weight="bold" fill="#D4AF37">Dragón de Jade</text>
  <text x="80" y="160" font-family="serif" font-size="20" fill="#8B6914">龍玉</text>
  <text x="80" y="190" font-family="sans-serif" font-size="12" fill="#666" font-style="italic">Sabor auténtico, tradición milenaria</text>

  <line x1="80" y1="210" x2="350" y2="210" stroke="#333" stroke-width="1"/>

  <text x="80" y="250" font-family="sans-serif" font-size="14" fill="#888">📍 Calle Gran Vía de los Chinos, 42</text>
  <text x="80" y="280" font-family="sans-serif" font-size="14" fill="#888">    08015 Barcelona, España</text>
  <text x="80" y="320" font-family="sans-serif" font-size="14" fill="#888">📞 +34 933 456 789</text>
  <text x="80" y="350" font-family="sans-serif" font-size="14" fill="#888">📱 +34 612 345 678</text>
  <text x="80" y="380" font-family="sans-serif" font-size="14" fill="#888">✉️ info@dragondejade.es</text>
  <text x="80" y="410" font-family="sans-serif" font-size="14" fill="#888">🌐 www.dragondejade.es</text>

  <rect x="500" y="50" width="350" height="400" fill="#1A1A1A" rx="15"/>
  <text x="675" y="100" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#D4AF37">HORARIO</text>
  <text x="675" y="140" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#888">Lu-Ju: 12:00 - 23:00</text>
  <text x="675" y="165" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#888">Vi-Sa: 12:00 - 00:00</text>
  <text x="675" y="190" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#888">Do: 12:00 - 22:00</text>

  <line x1="550" y1="220" x2="800" y2="220" stroke="#333" stroke-width="1"/>

  <text x="675" y="260" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#D4AF37">RED SOCIALES</text>
  <text x="675" y="295" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#888">📸 @dragondejade_bcn</text>
  <text x="675" y="320" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#888">📘 facebook.com/dragondejade</text>
  <text x="675" y="345" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#888">🎵 @dragondejade</text>

  <line x1="550" y1="380" x2="800" y2="380" stroke="#333" stroke-width="1"/>
  <text x="675" y="415" font-family="sans-serif" font-size="11" text-anchor="middle" fill="#666">Menú del día desde 12.50€</text>
</svg>"""

    output_path = Path(__file__).parent.parent / 'branding' / 'tarjeta_presentacion.svg'
    output_path.parent.mkdir(exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(svg)
    print(f"✅ Tarjeta creada: {output_path}")
    return output_path


if __name__ == '__main__':
    import sys
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    print("🐉 Dragón de Jade — Generador de Branding")
    print("="*50)

    crear_logo_svg()
    crear_menu_svg()
    crear_flyer_svg()
    crear_post_instagram_svg()
    crear_tarjeta_svg()

    print()
    print("✅ Todos los assets de branding creados en: branding/")
    print("   📄 logo_completo.svg")
    print("   📄 menu_carta.svg")
    print("   📄 flyer_delivery.svg")
    print("   📄 post_instagram.svg")
    print("   📄 tarjeta_presentacion.svg")
