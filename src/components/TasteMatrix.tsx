import React, { useState } from 'react';
import { Flavor, FLAVORS } from '../data/flavors.ts';
import { Sliders, Award, Flame, Droplets } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface TasteMatrixProps {
  currentFlavor: Flavor;
  onSelectFlavor: (flavorId: Flavor['id']) => void;
}

export const TasteMatrix: React.FC<TasteMatrixProps> = ({
  currentFlavor,
  onSelectFlavor,
}) => {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<Flavor['id']>(currentFlavor.id);

  const active = FLAVORS.find((f) => f.id === selectedId) || currentFlavor;

  const handleSelect = (id: Flavor['id']) => {
    setSelectedId(id);
    onSelectFlavor(id);
  };

  const tastingNotes = (t(`flavors.${active.id}.notes`, { returnObjects: true }) as string[]) || active.tastingNotes;

  return (
    <section id="taste-matrix" className="py-20 px-4 sm:px-6 lg:px-12 bg-neutral-900 text-white relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-yellow-400 text-xs font-bold uppercase tracking-widest mb-3">
              <Sliders className="w-3.5 h-3.5" />
              <span>{t('matrix.tag')}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight">
              {t('matrix.title')}
            </h2>
          </div>

          {/* Flavor Selection Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-neutral-800/80 p-1.5 rounded-2xl border border-neutral-700">
            {FLAVORS.map((f) => {
              const isSelected = f.id === selectedId;
              return (
                <button
                  key={f.id}
                  onClick={() => handleSelect(f.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-neutral-900 shadow-md scale-102'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: f.bg }}
                  />
                  <span>{t(`flavors.${f.id}.name`)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Flavor Packshot and Key Features */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl bg-neutral-800/60 border border-neutral-700/60">
            <div className="relative w-48 h-56 shrink-0 flex items-center justify-center">
              <img
                src={active.thumb}
                alt={active.name}
                className="w-full h-full object-contain drop-shadow-2xl rounded-2xl"
              />
              <span
                className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-black"
                style={{ backgroundColor: active.bg }}
              >
                120mg Mate
              </span>
            </div>

            <div className="text-left space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {t('matrix.signature_blend')}
              </span>
              <h3 className="text-2xl font-bold uppercase tracking-tight text-white">
                {t(`flavors.${active.id}.name`)}
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {t(`flavors.${active.id}.description`)}
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                {tastingNotes.map((note: string) => (
                  <span
                    key={note}
                    className="px-2 py-0.5 rounded-md bg-neutral-700 text-neutral-200 text-[11px] font-medium"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Metric Gauges */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Metric 1: Sweetness */}
            <div className="p-5 rounded-2xl bg-neutral-800/80 border border-neutral-700/80 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-pink-400" />
                  <span className="text-sm font-bold uppercase tracking-wide">
                    {t('matrix.sweetness')}
                  </span>
                </div>
                <span className="text-base font-extrabold font-mono text-pink-400">
                  {active.metrics.sweetness}%
                </span>
              </div>
              <div className="w-full h-3 bg-neutral-700 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-pink-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${active.metrics.sweetness}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-400 uppercase tracking-wider">
                <span>{t('matrix.subtle')}</span>
                <span>{t('matrix.balanced')}</span>
                <span>{t('matrix.rich')}</span>
              </div>
            </div>

            {/* Metric 2: Tartness */}
            <div className="p-5 rounded-2xl bg-neutral-800/80 border border-neutral-700/80 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold uppercase tracking-wide">
                    {t('matrix.tartness')}
                  </span>
                </div>
                <span className="text-base font-extrabold font-mono text-amber-400">
                  {active.metrics.tartness}%
                </span>
              </div>
              <div className="w-full h-3 bg-neutral-700 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${active.metrics.tartness}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-400 uppercase tracking-wider">
                <span>{t('matrix.mellow')}</span>
                <span>{t('matrix.zesty')}</span>
                <span>{t('matrix.punchy')}</span>
              </div>
            </div>

            {/* Metric 3: Sustained Energy */}
            <div className="p-5 rounded-2xl bg-neutral-800/80 border border-neutral-700/80 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold uppercase tracking-wide">
                    {t('matrix.energy')}
                  </span>
                </div>
                <span className="text-base font-extrabold font-mono text-emerald-400">
                  {active.metrics.energy}%
                </span>
              </div>
              <div className="w-full h-3 bg-neutral-700 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${active.metrics.energy}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-400 uppercase tracking-wider">
                <span>{t('matrix.gentle')}</span>
                <span>{t('matrix.smooth')}</span>
                <span>{t('matrix.peak_focus')}</span>
              </div>
            </div>

            {/* Metric 4: Fizz Effervescence */}
            <div className="p-5 rounded-2xl bg-neutral-800/80 border border-neutral-700/80 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-bold uppercase tracking-wide">
                    {t('matrix.fizz')}
                  </span>
                </div>
                <span className="text-base font-extrabold font-mono text-cyan-400">
                  {active.metrics.fizz}%
                </span>
              </div>
              <div className="w-full h-3 bg-neutral-700 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${active.metrics.fizz}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-400 uppercase tracking-wider">
                <span>{t('matrix.still')}</span>
                <span>{t('matrix.sparkling')}</span>
                <span>{t('matrix.ultra_crisp')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TasteMatrix;
