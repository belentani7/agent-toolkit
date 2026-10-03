import React, { useState, useEffect, useRef } from 'react';
import { Language, Message } from '../types';
import { TRANSLATIONS } from '../data/i18n';
import { hablarTexto, VOCES_39 } from '../data/voiceConfig';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  RefreshCw,
  Zap,
  RotateCcw
} from 'lucide-react';

interface NodeCompanionProps {
  language: Language;
}

export const NodeCompanion: React.FC<NodeCompanionProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-welcome',
      role: 'assistant',
      text:
        '¡Hola! Soy Manos, tu tutor y acompañante de inteligencia artificial. Estoy aquí para resolver tus dudas sobre trámites en España, extranjería, derechos laborales, cursos y preparación de exámenes. ¿En qué puedo orientarte hoy?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const quickChips = [
    '¿Cómo solicito el empadronamiento sin domicilio fijo?',
    '¿Qué es la Cuenta de Pago Básica y cómo pedirla con pasaporte?',
    '¿Cuáles son los 3 tipos de Arraigo y qué tiempo de permanencia exigen?',
    '¿Cómo solicito la tarjeta sanitaria individual en mi centro de salud?',
    'Dame 5 consejos para mi primera entrevista laboral en España',
  ];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang =
        language === 'en'
          ? 'en-US'
          : language === 'pt'
          ? 'pt-PT'
          : language === 'ca'
          ? 'ca-ES'
          : language === 'ar'
          ? 'ar-SA'
          : 'es-ES';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('El reconocimiento de voz no está soportado en este navegador.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakText = (text: string) => {
    if (!ttsEnabled) return;
    hablarTexto(text, language);
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          systemInstruction: `Eres "Manos", un tutor y orientador de apoyo para personas migrantes y de acogida en España dentro del proyecto Manos Abiertas. Responde con calidez humana, empatía, claridad pedagógica y rigor legal estricto. Siempre cita leyes cuando aplique (LO 4/2000, RD 19/2017 para cuentas de pago básicas, Ley 16/2003 para sanidad universal, etc.). Si el usuario escribe en otro idioma (${language}), respóndele en ese mismo idioma.`,
        }),
      });

      const data = await response.json();
      const replyText = data.reply || 'Ha ocurrido un error al consultar el servidor.';

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      speakText(replyText);
    } catch (err) {
      // Local knowledge fallback
      const fallbackReply =
        'Actualmente estamos en modo local. Recuerda que para trámites de extranjería puedes consultar el Nodo 5 (Legislación y Arraigos) y el Nodo 4 para teléfonos gratuitos de asistencia de Cruz Roja (900 22 11 22) y CEAR.';
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    window.speechSynthesis?.cancel();
    setMessages([
      {
        id: 'm-welcome',
        role: 'assistant',
        text:
          'Conversación reiniciada. ¿En qué trámite, derecho o aprendizaje puedo orientarte hoy?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-white shadow-md shadow-orange-500/20">
                Nodo 8 · Tutor Inteligente
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Voz: {VOCES_39[language]?.vozPrincipal} ({VOCES_39[language]?.nombre}) · Modelo de Orientación Social y Legal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
              Acompañante de Voz & Tutor IA 'Manos'
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
              Conversa en lenguaje natural mediante voz o texto. 'Manos' comprende tus necesidades de acogida, te guía con los trámites administrativos, redacta reclamaciones y te ayuda a practicar español y entrevistas.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                ttsEnabled
                  ? 'bg-orange-500/20 border-orange-500/60 text-slate-950 dark:text-white font-bold'
                  : 'glass-card-subtle border-white/60 dark:border-white/10 text-slate-600 dark:text-slate-300'
              }`}
              title={ttsEnabled ? 'Voz activada' : 'Voz silenciada'}
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4 text-orange-500" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{ttsEnabled ? 'Voz On' : 'Voz Off'}</span>
            </button>
            <button
              onClick={handleResetChat}
              className="p-2.5 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-slate-600 dark:text-slate-300 hover:bg-white/60 text-xs font-bold flex items-center gap-1.5"
              title="Reiniciar chat"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="glass-card rounded-2xl shadow-sm flex flex-col h-[600px] overflow-hidden">
        {/* Messages List Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isBot = m.role === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex gap-3 items-start ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20 mt-0.5 font-bold text-xs">
                    M
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-1.5 ${
                    isBot
                      ? 'glass-card-subtle border border-white/60 dark:border-white/10 text-slate-900 dark:text-slate-100 rounded-tl-sm'
                      : 'bg-orange-500 text-white rounded-tr-sm shadow-md shadow-orange-500/20'
                  }`}
                >
                  <p className="whitespace-pre-wrap font-sans">{m.text}</p>
                  <div
                    className={`flex items-center justify-end gap-2 text-[10px] ${
                      isBot ? 'text-slate-400 dark:text-slate-400' : 'text-orange-100'
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {isBot && ttsEnabled && (
                      <button
                        onClick={() => speakText(m.text)}
                        className="hover:text-orange-600 p-0.5"
                        title="Escuchar locución de este mensaje"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center shrink-0 shadow-sm mt-0.5 font-bold text-xs">
                    Tú
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-500">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <span className="italic">Manos está razonando la mejor orientación...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 glass-card-subtle border-t border-white/40 dark:border-white/10 flex gap-1.5 overflow-x-auto no-scrollbar">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full glass-pill text-slate-700 dark:text-slate-300 text-xs font-medium hover:border-orange-400 transition-all shadow-xs"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 glass-card border-t border-white/40 dark:border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-xl font-bold transition-all ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-lg ring-4 ring-rose-300'
                  : 'glass-card-subtle border border-white/60 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-white/80'
              }`}
              title={isListening ? 'Detener escucha' : 'Hablar por micrófono'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-orange-500" />}
            </button>

            {/* Text Input Field */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? 'Escuchando tu voz...' : 'Escribe tu consulta a Manos...'}
              className="flex-1 p-3 rounded-xl border border-white/60 dark:border-white/10 glass-card-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold transition-all disabled:opacity-40 shadow-md shadow-orange-500/20"
              title="Enviar mensaje"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
