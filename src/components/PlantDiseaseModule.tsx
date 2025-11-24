import { Camera, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function PlantDiseaseModule() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#fffaf0] to-white rounded-xl shadow-lg border-2 border-[#40916c] p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-[#2d6a4f] bg-opacity-10 p-6 rounded-full">
            <Camera className="w-16 h-16 text-[#2d6a4f]" />
          </div>
        </div>

        <h3 className="text-3xl font-bold text-[#2d6a4f] mb-4">{t.comingSoon}</h3>

        <p className="text-xl text-gray-700 mb-6">{t.plantDiseaseDesc}</p>

        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 flex items-start gap-3 text-left max-w-2xl mx-auto">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-gray-700 leading-relaxed">
              This feature will allow you to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
              <li>Capture or upload plant images</li>
              <li>Detect diseases using AI image recognition</li>
              <li>Get treatment recommendations</li>
              <li>Access disease prevention tips</li>
            </ul>
          </div>
        </div>

        <button
          disabled
          className="mt-6 bg-gray-300 text-gray-600 px-8 py-3 rounded-lg font-semibold cursor-not-allowed flex items-center gap-2 mx-auto"
        >
          <Camera className="w-5 h-5" />
          {t.comingSoon}
        </button>
      </div>
    </div>
  );
}
