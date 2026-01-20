
import React, { useState } from 'react';
import { getProfessionalTerms } from '../geminiService';

interface CompetitionHubProps {
  onBack: () => void;
}

const CompetitionHub: React.FC<CompetitionHubProps> = ({ onBack }) => {

  const [termExplanation, setTermExplanation] = useState<string | null>(null);
  const [loadingTerm, setLoadingTerm] = useState(false);

  const handleTermHelp = async (term: string) => {
    setLoadingTerm(true);
    try {
      const explanation = await getProfessionalTerms(term);
      setTermExplanation(explanation);
    } catch {
      setTermExplanation("無法取得說明。");
    } finally {
      setLoadingTerm(false);
    }
  };

  const TERMS = ["白地", "紅質", "沈縞", "手鰭", "緋盤", "墨質"];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-2xl font-bold serif-font text-gray-900">🏆 錦鯉比賽觀賽中心</h2>
            <p className="text-sm text-gray-500 mt-1">即時賽況討論、專業用語指南。</p>
          </div>
          <button onClick={onBack} className="text-gray-400 hover:text-indigo-600 transition-colors">✕ 關閉</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-indigo-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <span className="bg-red-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-2 inline-block">LIVE 現正進行中</span>
                <h3 className="text-2xl font-bold serif-font mb-2">2024 全日本總合錦鯉品評會</h3>
                <p className="text-indigo-200 text-sm mb-4">目前的賽事階段：全體大賞評選中</p>
                <div className="flex gap-4 text-xs font-medium text-indigo-300">
                  <span>📍 所在地：東京</span>
                  <span>👥 線上討論：1,248 人</span>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 min-h-[400px]">
              <h4 className="text-sm font-bold text-gray-900 mb-4">即時留言板</h4>
              <div className="space-y-4 mb-4">
                <div className="flex gap-3 text-sm">
                  <span className="font-bold text-indigo-600">資深玩家A:</span>
                  <span className="text-gray-600">這條昭和的墨質分布非常均衡，白地也很乾淨。</span>
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="font-bold text-red-600">生產者B:</span>
                  <span className="text-gray-600">同意，這條魚才三歲，發展性驚人。</span>
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="font-bold text-slate-500">新手C:</span>
                  <span className="text-gray-600 italic">請問什麼是「白地」？</span>
                </div>
              </div>
              <div className="mt-auto border-t border-gray-200 pt-4">
                <input
                  type="text"
                  className="w-full bg-white border border-gray-200 rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="輸入訊息加入討論..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h4 className="text-sm font-bold text-gray-900 mb-4">專業觀賽助手</h4>
              <p className="text-xs text-gray-500 mb-4">不懂賽評在說什麼？點擊下方用語立即解釋：</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {TERMS.map(t => (
                  <button
                    key={t}
                    onClick={() => handleTermHelp(t)}
                    className="bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 px-3 py-1 rounded-full text-xs font-medium transition-all"
                  >
                    {t}
                  </button>
                ))}
              </div>

              {loadingTerm && <div className="text-xs text-gray-400 italic">正在獲取 AI 解釋...</div>}
              {termExplanation && !loadingTerm && (
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 animate-in fade-in duration-300">
                  <p className="text-xs text-indigo-700 leading-relaxed italic">
                    {termExplanation}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
              <h4 className="text-sm font-bold text-amber-900 mb-2">觀賽小撇步</h4>
              <ul className="text-xs text-amber-800 space-y-2 list-disc pl-4">
                <li>觀察魚隻游動時的體型平衡感</li>
                <li>注意緋盤邊界（際）是否清晰</li>
                <li>兩歲魚看潛力，五歲魚看完成度</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionHub;
