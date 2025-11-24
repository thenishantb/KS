import { Sprout } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language, languageNames } from '../translations';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="bg-gradient-to-r from-[#2d6a4f] to-[#40916c] text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sprout className="w-8 h-8" />
            <h1 className="text-2xl font-bold">{t.appName}</h1>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="language-select" className="text-sm font-medium">
              {t.selectLanguage}:
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-white text-gray-800 px-3 py-2 rounded-lg border-2 border-[#2d6a4f] focus:outline-none focus:ring-2 focus:ring-white font-medium"
            >
              {Object.entries(languageNames).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}
