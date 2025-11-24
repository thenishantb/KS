import { useState, useEffect } from 'react';
import { Mic, Send, Volume2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSpeechRecognition, useSpeechSynthesis } from '../hooks/useSpeech';
import { askGemini } from '../services/geminiService';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

export default function AIAssistant() {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { isListening, transcript, startListening, isSupported: isSpeechRecognitionSupported } =
    useSpeechRecognition();
  const { speak, isSpeaking, isSupported: isSpeechSynthesisSupported } = useSpeechSynthesis();

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setError('');

    setMessages((prev) => [...prev, { text: userMessage, sender: 'user' }]);

    setLoading(true);

    try {
      const response = await askGemini(userMessage);
      setMessages((prev) => [...prev, { text: response, sender: 'ai' }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      return;
    }
    startListening();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg border-2 border-[#40916c] overflow-hidden">
        <div className="bg-gradient-to-r from-[#2d6a4f] to-[#40916c] text-white p-4">
          <h3 className="text-2xl font-bold">{t.askQuestion}</h3>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-[#fffaf0]">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p className="text-lg">{t.typeQuestion}</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-[#2d6a4f] text-white'
                    : 'bg-white text-gray-800 border-2 border-[#40916c]'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
                {message.sender === 'ai' && isSpeechSynthesisSupported && (
                  <button
                    onClick={() => speak(message.text)}
                    disabled={isSpeaking}
                    className="mt-2 flex items-center gap-2 text-sm text-[#2d6a4f] hover:text-[#40916c] disabled:opacity-50"
                  >
                    <Volume2 className="w-4 h-4" />
                    {t.playAudio}
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border-2 border-[#40916c] p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#2d6a4f] border-t-transparent"></div>
                  <p className="text-gray-600">{t.aiThinking}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-t-2 border-red-300 p-4 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 bg-white border-t-2 border-[#40916c]">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? t.speakYourQuestion : t.typeQuestion}
              disabled={loading || isListening}
              className="flex-1 px-4 py-3 text-lg border-2 border-[#40916c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] disabled:bg-gray-100"
            />

            {isSpeechRecognitionSupported && (
              <button
                type="button"
                onClick={handleVoiceInput}
                disabled={loading || isListening}
                className={`px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-[#40916c] text-white hover:bg-[#2d6a4f]'
                }`}
              >
                <Mic className="w-6 h-6" />
              </button>
            )}

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-[#2d6a4f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#40916c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              {t.send}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
