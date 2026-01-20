
import React, { useState, useRef } from 'react';
import { simulateAIGrading } from '../geminiService';
import { GradingResult } from '../types';

interface AIGradingProps {
  onBack: () => void;
}

const AIGrading: React.FC<AIGradingProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GradingResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      setPreview(event.target?.result as string);
      setLoading(true);
      try {
        const grading = await simulateAIGrading(base64);
        setResult(grading);
      } catch (error: unknown) {
        alert('AI 品評暫時無法使用，請稍後再試。');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const ScoreCircle: React.FC<{ label: string; score: number; color: string }> = ({ label, score, color }) => (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-20 h-20 rounded-full border-4 ${color} flex items-center justify-center font-bold text-xl bg-white shadow-inner`}>
        {score}
      </div>
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold serif-font text-gray-900">🤖 AI 品評模擬區</h2>
          <p className="text-sm text-gray-500 mt-1">上傳您的愛鯉，透過科技分析體型、模樣與質地。</p>
        </div>
        <button onClick={onBack} className="text-gray-400 hover:text-indigo-600 transition-colors">✕ 關閉</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[3/4] rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 transition-all group relative overflow-hidden"
          >
            {preview ? (
              <>
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">更換照片</div>
              </>
            ) : (
              <div className="text-center p-6">
                <span className="text-4xl mb-3 block">📸</span>
                <p className="text-sm font-medium text-gray-500">點擊上傳錦鯉照片</p>
                <p className="text-xs text-gray-400 mt-2">支援 JPG, PNG 高解析度圖片</p>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">⚠️ 注意事項</h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              本功能由 AI 進行模擬分析，僅供日常交流與參考。
              最終品評結果應以各大品評會官方專業評審為準。
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col items-center justify-center min-h-[300px]">
          {loading ? (
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-medium text-gray-600">AI 正在深度分析中...</p>
              <p className="text-xs text-gray-400 mt-2">評估體型、白地、紅質與斑紋分布</p>
            </div>
          ) : result ? (
            <div className="w-full animate-in fade-in zoom-in duration-500">
              <div className="grid grid-cols-3 gap-4 mb-8">
                <ScoreCircle label="體型" score={result.bodyShape} color="border-indigo-500" />
                <ScoreCircle label="模樣" score={result.pattern} color="border-red-500" />
                <ScoreCircle label="質地" score={result.quality} color="border-amber-500" />
              </div>
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-2">AI 分析評語</h4>
                <p className="text-sm text-gray-600 leading-loose italic">
                  「{result.summary}」
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full mt-6 bg-white border border-gray-200 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
              >
                重新上傳
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg mb-2">請上傳照片開始品評</p>
              <p className="text-sm">我們將為您分析這條魚的發展潛力</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIGrading;
