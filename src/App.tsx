import { useState } from 'react';
import { CloudSun, MessageSquare, Leaf } from 'lucide-react';
import Navbar from './components/Navbar';
import WeatherModule from './components/WeatherModule';
import AIAssistant from './components/AIAssistant';
import PlantDiseaseModule from './components/PlantDiseaseModule';
import { useLanguage } from './contexts/LanguageContext';

type Tab = 'weather' | 'assistant' | 'disease';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('weather');
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffaf0] via-white to-[#fffaf0]">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('weather')}
            className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold text-lg transition-all ${
              activeTab === 'weather'
                ? 'bg-[#2d6a4f] text-white shadow-lg scale-105'
                : 'bg-white text-[#2d6a4f] border-2 border-[#40916c] hover:bg-[#40916c] hover:text-white'
            }`}
          >
            <CloudSun className="w-6 h-6" />
            {t.weather}
          </button>

          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold text-lg transition-all ${
              activeTab === 'assistant'
                ? 'bg-[#2d6a4f] text-white shadow-lg scale-105'
                : 'bg-white text-[#2d6a4f] border-2 border-[#40916c] hover:bg-[#40916c] hover:text-white'
            }`}
          >
            <MessageSquare className="w-6 h-6" />
            {t.assistant}
          </button>

          <button
            onClick={() => setActiveTab('disease')}
            className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold text-lg transition-all ${
              activeTab === 'disease'
                ? 'bg-[#2d6a4f] text-white shadow-lg scale-105'
                : 'bg-white text-[#2d6a4f] border-2 border-[#40916c] hover:bg-[#40916c] hover:text-white'
            }`}
          >
            <Leaf className="w-6 h-6" />
            {t.plantDisease}
          </button>
        </div>

        <div className="max-w-6xl mx-auto">
          {activeTab === 'weather' && <WeatherModule />}
          {activeTab === 'assistant' && <AIAssistant />}
          {activeTab === 'disease' && <PlantDiseaseModule />}
        </div>
      </div>
    </div>
  );
}

export default App;
