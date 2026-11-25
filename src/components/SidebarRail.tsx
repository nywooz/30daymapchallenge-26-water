import {
  ChevronLeft,
  ChevronRight,
  Layers,
  Map as MapIcon,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import {
  LAYER_CATALOG,
  type BaseMapMode,
  type LayerId,
  type ShowcaseChapter,
} from '../data/waterShowcaseData';

interface SidebarRailProps {
  chapter: ShowcaseChapter;
  totalChapters: number;
  isOpen: boolean;
  onToggleOpen: () => void;
  baseMap: BaseMapMode;
  onBaseMapChange: (mode: BaseMapMode) => void;
  enabledLayers: Record<LayerId, boolean>;
  onToggleLayer: (layerId: LayerId) => void;
  onApplyChapterDefaults: () => void;
  onResetCamera: () => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  activeTab: 'story' | 'layers';
  onTabChange: (tab: 'story' | 'layers') => void;
}

const BASE_MAP_OPTIONS: { id: BaseMapMode; label: string }[] = [
  { id: 'roadmap', label: 'Vector' },
  { id: 'terrain', label: 'Terrain' },
  { id: 'hybrid', label: 'Hybrid' },
  { id: 'satellite', label: 'Satellite' },
];

export const SidebarRail = ({
  chapter,
  totalChapters,
  isOpen,
  onToggleOpen,
  baseMap,
  onBaseMapChange,
  enabledLayers,
  onToggleLayer,
  onApplyChapterDefaults,
  onResetCamera,
  onPrevChapter,
  onNextChapter,
  activeTab,
  onTabChange,
}: SidebarRailProps) => {
  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={onToggleOpen}
        className="fixed left-4 top-16 z-30 flex items-center gap-2 rounded-lg border border-slate-700/80 bg-[#0B111C]/90 px-3.5 py-2 text-xs font-medium text-slate-200 backdrop-blur-md transition-colors hover:border-cyan-500/60 hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-400"
        aria-label="Open atlas panel"
      >
        <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-400" />
        <span className="whitespace-nowrap">Atlas Panel</span>
      </button>
    );
  }

  return (
    <aside
      aria-label="Cartographic Showcase Inspector"
      className="fixed left-4 top-16 bottom-24 z-30 flex w-[348px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-slate-800/90 bg-[#0B111C]/92 backdrop-blur-md shadow-2xl"
    >
      {/* Curatorial Kicker & Panel Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-mono tabular-nums text-cyan-400">
            {String(chapter.index).padStart(2, '0')} / {String(totalChapters).padStart(2, '0')}
          </span>
          <span aria-hidden="true">·</span>
          <span className="truncate">Nov 26 · Water</span>
        </div>

        <button
          type="button"
          onClick={onToggleOpen}
          className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-800/70 hover:text-slate-100 focus-visible:outline-2 focus-visible:outline-cyan-400"
          aria-label="Collapse atlas panel"
          title="Collapse panel"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Mode Switch Tabs: Story vs Layer Matrix */}
      <div className="border-b border-slate-800/80 px-4 py-2.5">
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-900/90 p-1">
          <button
            type="button"
            onClick={() => onTabChange('story')}
            className={`flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'story'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapIcon className="h-3.5 w-3.5 text-cyan-400" />
            <span>Chapter Brief</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange('layers')}
            className={`flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'layers'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            <span>Layers & Style</span>
          </button>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="atlas-scroll flex-1 overflow-y-auto px-4 py-4">
        {activeTab === 'story' ? (
          <div className="space-y-5">
            <div>
              <p className="font-mono text-[11px] tracking-wider text-cyan-400/90 uppercase">
                {chapter.regionTag}
              </p>
              <h2 className="mt-1.5 font-display text-2xl font-medium leading-tight text-white [text-wrap:balance]">
                {chapter.title}
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-400">
                {chapter.subtitle}
              </p>
            </div>

            <p className="text-[13.5px] leading-relaxed text-slate-300">
              {chapter.narrative}
            </p>

            {/* Quantitative Telemetry Grid */}
            <div className="border-t border-slate-800/80 pt-4">
              <div className="mb-2.5 text-[11px] font-medium tracking-wider text-slate-400 uppercase">
                Hydrological Telemetry
              </div>
              <div className="grid grid-cols-1 gap-3">
                {chapter.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="flex items-baseline justify-between border-b border-slate-800/50 pb-2.5 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <div className="text-xs text-slate-400">{m.label}</div>
                      {m.delta && (
                        <div className="mt-0.5 font-mono text-[11px] text-slate-500">
                          {m.delta}
                        </div>
                      )}
                    </div>
                    <div className="text-right font-mono tabular-nums">
                      <span className="text-lg font-medium text-white">{m.value}</span>
                      <span className="ml-1.5 text-[11px] text-slate-400">{m.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Technologies & Features Demonstrated */}
            <div className="border-t border-slate-800/80 pt-4">
              <div className="mb-2 text-[11px] font-medium tracking-wider text-slate-400 uppercase">
                Demonstrated Map Features
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-300">
                {chapter.featuredCapabilities.map((cap, idx) => (
                  <span key={cap} className="inline-flex items-center gap-2">
                    <span className="text-cyan-300/95">{cap}</span>
                    {idx < chapter.featuredCapabilities.length - 1 && (
                      <span className="text-slate-600" aria-hidden="true">
                        /
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Google Maps Base Layer Quick Switcher */}
            <div className="border-t border-slate-800/80 pt-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-medium tracking-wider text-slate-400 uppercase">
                  Google Maps Surface
                </span>
                <button
                  type="button"
                  onClick={onResetCamera}
                  className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset View</span>
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1 rounded-lg bg-slate-900/90 p-1">
                {BASE_MAP_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onBaseMapChange(opt.id)}
                    className={`rounded-md py-1.5 text-[11px] font-medium transition-colors whitespace-nowrap ${
                      baseMap === opt.id
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Toggle individual deck.gl &amp; Maps layers
              </span>
              <button
                type="button"
                onClick={onApplyChapterDefaults}
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300 whitespace-nowrap"
              >
                Chapter Preset
              </button>
            </div>

            {/* Google Maps Surface Selector */}
            <div>
              <div className="mb-2 text-[11px] font-medium tracking-wider text-slate-400 uppercase">
                Google Maps Base Layer
              </div>
              <div className="grid grid-cols-4 gap-1 rounded-lg bg-slate-900/90 p-1">
                {BASE_MAP_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onBaseMapChange(opt.id)}
                    className={`rounded-md py-1.5 text-[11px] font-medium transition-colors whitespace-nowrap ${
                      baseMap === opt.id
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Individual deck.gl & Marker Layer Toggles */}
            <div className="divide-y divide-slate-800/70 border-t border-slate-800/80">
              {LAYER_CATALOG.map((layer) => {
                const active = enabledLayers[layer.id];
                return (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => onToggleLayer(layer.id)}
                    className="flex w-full items-start justify-between gap-3 py-3 text-left transition-colors hover:bg-slate-800/30 focus-visible:outline-2 focus-visible:outline-cyan-400"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                          style={{
                            backgroundColor: active ? layer.colorSwatch : '#334155',
                          }}
                          aria-hidden="true"
                        />
                        <span
                          className={`truncate text-xs font-medium ${
                            active ? 'text-white' : 'text-slate-400'
                          }`}
                        >
                          {layer.label}
                        </span>
                      </div>
                      <div className="mt-0.5 pl-4.5 font-mono text-[11px] text-slate-500">
                        {layer.library}
                      </div>
                      <p className="mt-0.5 pl-4.5 text-[11px] leading-snug text-slate-400">
                        {layer.description}
                      </p>
                    </div>

                    <span
                      className={`mt-0.5 shrink-0 font-mono text-[11px] ${
                        active ? 'text-cyan-400' : 'text-slate-500'
                      }`}
                    >
                      {active ? 'ON' : 'OFF'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Chapter Step Controls */}
      <div className="flex items-center justify-between border-t border-slate-800/80 bg-[#080C15] px-4 py-2.5">
        <button
          type="button"
          onClick={onPrevChapter}
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Previous</span>
        </button>
        <span className="font-mono text-[11px] text-slate-500 tabular-nums">
          {chapter.navLabel}
        </span>
        <button
          type="button"
          onClick={onNextChapter}
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
};
