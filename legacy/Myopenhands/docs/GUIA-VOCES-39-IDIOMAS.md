# 🎙️ GUÍA DE VOCES — MANOS ABIERTAS (39 IDIOMAS)

> Generado automáticamente por `scripts/voice_assigner.py`
> Cada idioma tiene asignada una voz única — **ninguna voz se repite**.

## 📊 Tabla de Voces por Idioma

| # | Código | Idioma | Voz Principal | Alternativa | Género | Velocidad | RTL |
|---|--------|--------|---------------|-------------|--------|-----------|-----|
| 1 | `ar` | العربية | Google العربية | Microsoft Salma | femenino | 0.9× | ✅ |
| 2 | `bg` | Български | Google български | Microsoft Kalina | femenino | 0.95× | — |
| 3 | `bn` | বাংলা | Google বাংলা | Microsoft Tanishaa | femenino | 0.9× | — |
| 4 | `ca` | Català | Google català | Microsoft Montserrat | femenino | 1.0× | — |
| 5 | `cs` | Čeština | Google čeština | Microsoft Vlasta | femenino | 0.95× | — |
| 6 | `da` | Dansk | Google dansk | Microsoft Naja | femenino | 1.0× | — |
| 7 | `de` | Deutsch | Google Deutsch | Microsoft Katja | femenino | 0.95× | — |
| 8 | `el` | Ελληνικά | Google Ελληνικά | Microsoft Athina | femenino | 0.95× | — |
| 9 | `en` | English | Google US English | Microsoft Aria | femenino | 1.0× | — |
| 10 | `es` | Español | Google español | Microsoft Helena | femenino | 1.0× | — |
| 11 | `et` | Eesti | Google eesti | Microsoft Anu | femenino | 1.0× | — |
| 12 | `fa` | فارسی | Google فارسی | Microsoft Dilara | femenino | 0.9× | ✅ |
| 13 | `fi` | Suomi | Google suomi | Microsoft Noora | femenino | 1.0× | — |
| 14 | `fr` | Français | Google français | Microsoft Denise | femenino | 1.0× | — |
| 15 | `he` | עברית | Google עברית | Microsoft Hila | femenino | 0.95× | ✅ |
| 16 | `hi` | हिन्दी | Google हिन्दी | Microsoft Swara | femenino | 0.9× | — |
| 17 | `hu` | Magyar | Google magyar | Microsoft Szabolcs | masculino | 0.95× | — |
| 18 | `id` | Bahasa Indonesia | Google Bahasa Indonesia | Microsoft Ardi | masculino | 1.0× | — |
| 19 | `it` | Italiano | Google italiano | Microsoft Elsa | femenino | 1.0× | — |
| 20 | `ja` | 日本語 | Google 日本語 | Microsoft Nanami | femenino | 0.95× | — |
| 21 | `ko` | 한국어 | Google 한국어 | Microsoft SunHi | femenino | 0.9× | — |
| 22 | `lt` | Lietuvių | Google lietuvių | Microsoft Ona | femenino | 0.95× | — |
| 23 | `lv` | Latviešu | Google latviešu | Microsoft Everita | femenino | 0.95× | — |
| 24 | `nl` | Nederlands | Google Nederlands | Microsoft Colette | femenino | 1.0× | — |
| 25 | `no` | Norsk | Google norsk | Microsoft Nora | femenino | 1.0× | — |
| 26 | `pl` | Polski | Google polski | Microsoft Paulina | femenino | 0.95× | — |
| 27 | `pt` | Português | Google português do Brasil | Microsoft Francisca | femenino | 0.95× | — |
| 28 | `ro` | Română | Google română | Microsoft Alina | femenino | 1.0× | — |
| 29 | `ru` | Русский | Google русский | Microsoft Svetlana | femenino | 0.95× | — |
| 30 | `sk` | Slovenčina | Google slovenčina | Microsoft Viktoria | femenino | 0.95× | — |
| 31 | `sl` | Slovenščina | Google slovenščina | Microsoft Mojca | femenino | 1.0× | — |
| 32 | `sv` | Svenska | Google svenska | Microsoft Hillevi | femenino | 1.0× | — |
| 33 | `sw` | Kiswahili | Google Kiswahili | Microsoft Rehema | femenino | 1.0× | — |
| 34 | `th` | ไทย | Google ไทย | Microsoft Premwadee | femenino | 0.9× | — |
| 35 | `tr` | Türkçe | Google Türkçe | Microsoft Emel | femenino | 1.0× | — |
| 36 | `uk` | Українська | Google українська | Microsoft Polina | femenino | 0.95× | — |
| 37 | `ur` | اردو | Google اردو | Microsoft Uzma | femenino | 0.9× | ✅ |
| 38 | `vi` | Tiếng Việt | Google Tiếng Việt | Microsoft HoaiMy | femenino | 0.95× | — |
| 39 | `zh` | 中文 | Google 中文 | Microsoft Xiaoxiao | femenino | 0.9× | — |

## 🔧 Uso en TypeScript

```typescript
// En NodeCompanion.tsx — selección de voz por idioma
const vozPorIdioma: Record<string, string> = {
  "ar": "Google العربية",
  "bg": "Google български",
  "bn": "Google বাংলা",
  "ca": "Google català",
  "cs": "Google čeština",
  "da": "Google dansk",
  "de": "Google Deutsch",
  "el": "Google Ελληνικά",
  "en": "Google US English",
  "es": "Google español",
  "et": "Google eesti",
  "fa": "Google فارسی",
  "fi": "Google suomi",
  "fr": "Google français",
  "he": "Google עברית",
  "hi": "Google हिन्दी",
  "hu": "Google magyar",
  "id": "Google Bahasa Indonesia",
  "it": "Google italiano",
  "ja": "Google 日本語",
  "ko": "Google 한국어",
  "lt": "Google lietuvių",
  "lv": "Google latviešu",
  "nl": "Google Nederlands",
  "no": "Google norsk",
  "pl": "Google polski",
  "pt": "Google português do Brasil",
  "ro": "Google română",
  "ru": "Google русский",
  "sk": "Google slovenčina",
  "sl": "Google slovenščina",
  "sv": "Google svenska",
  "sw": "Google Kiswahili",
  "th": "Google ไทย",
  "tr": "Google Türkçe",
  "uk": "Google українська",
  "ur": "Google اردو",
  "vi": "Google Tiếng Việt",
  "zh": "Google 中文",
};

function seleccionarVoz(idioma: string): SpeechSynthesisVoice | null {
  const voces = window.speechSynthesis.getVoices();
  const vozPreferida = vozPorIdioma[idioma];
  return voces.find(v => v.name === vozPreferida) || voces.find(v => v.lang.startsWith(idioma)) || null;
}
```

## ✅ Verificación

- **Total idiomas:** 39
- **Total voces únicas:** 39
- **Voces duplicadas:** 0 (verificado por `i18n_auditor.py`)