import type { PickingInfo } from '@deck.gl/core';
import {
  Compass,
  Mountain,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import {
  SHOWCASE_CHAPTERS,
  type HydroCorridor,
  type HydroStation,
  type RiverPathFeature,
  type ShowcaseChapter,
  type WaterColumnDatum,
  type WaterZonePolygon,
} from '../data/waterShowcaseData';
import type { ElevationSample } from './CameraController';

interface TopNavBarProps {
  activeChapterId: string;
  isPlaying: boolean;
  onSelectChapter: (chapterId: string) => void;
  onTogglePlay: () => void;
}

const TOP_NAV_LINKS: { label: string; chapterId: string }[] = [
  { label: 'Overview', chapterId: 'global-currents' },
  { label: 'Amazon', chapterId: 'amazon-confluence' },
  { label: 'Nile', chapterId: 'nile-artery' },
  { label: 'Alps', chapterId: 'alpine-cryosphere' },
  { label: 'Deltas', chapterId: 'mekong-pulse' },
];

export const TopNavBar = ({
  activeChapterId,
  isPlaying,
  onSelectChapter,
  onTogglePlay,
}: TopNavBarProps) => {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-13 items-center justify-between gap-8 border-b border-slate-800/80 bg-[#070B12]/90 px-5 backdrop-blur-md">
      {/* Zone 1: Single-element wordmark */}
      <a
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          onSelectChapter('global-currents');
        }}
        className="font-display text-lg font-medium tracking-tight text-white whitespace-nowrap shrink-0"
      >
        HydroSphere
      </a>

      {/* Zone 2: 5 clean single-line navigation links */}
      <nav aria-label="Showcase regions" className="hidden md:flex items-center gap-6 text-sm font-medium">
        {TOP_NAV_LINKS.map((item) => {
          const isCurrent =
            item.chapterId === activeChapterId ||
            (item.label === 'Deltas' && activeChapterId === 'venice-barriers');
          return (
            <button
              key={item.chapterId}
              type="button"
              onClick={() => onSelectChapter(item.chapterId)}
              className={`relative py-1 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                isCurrent ? 'text-white' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {item.label}
              {isCurrent && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-[11px] h-[2px] bg-cyan-400"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1 Primary Action CTA */}
      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={onTogglePlay}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-cyan-300 ${
            isPlaying
              ? 'bg-slate-800 text-cyan-300 ring-1 ring-cyan-500/50 hover:bg-slate-700'
              : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="h-3.5 w-3.5 fill-current" />
              <span>Pause Tour</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Auto Play</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};

interface BottomTimelineDockProps {
  activeChapter: ShowcaseChapter;
  isPlaying: boolean;
  progress: number; // 0..1
  playbackSpeed: 1 | 1.5;
  orbitEnabled: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelectChapter: (chapterId: string) => void;
  onToggleSpeed: () => void;
  onToggleOrbit: () => void;
}

export const BottomTimelineDock = ({
  activeChapter,
  isPlaying,
  progress,
  playbackSpeed,
  orbitEnabled,
  onTogglePlay,
  onPrev,
  onNext,
  onSelectChapter,
  onToggleSpeed,
  onToggleOrbit,
}: BottomTimelineDockProps) => {
  return (
    <div
      role="region"
      aria-label="Auto Play Tour Controls"
      className="fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-slate-800/90 bg-[#0B111C]/92 px-3 py-2 backdrop-blur-md shadow-2xl max-w-[calc(100vw-2rem)]"
    >
      {/* Transport Controls */}
      <div className="flex items-center gap-1 border-r border-slate-800 pr-2">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous chapter"
          className="rounded-md p-1.5 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-400"
        >
          <SkipBack className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onTogglePlay}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-cyan-300 ${
            isPlaying
              ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40'
              : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="h-3.5 w-3.5 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Auto Play</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onNext}
          aria-label="Next chapter"
          className="rounded-md p-1.5 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-400"
        >
          <SkipForward className="h-4 w-4" />
        </button>
      </div>

      {/* 6 Chapter Progress Stepper */}
      <div className="hidden lg:flex items-center gap-1.5 px-1">
        {SHOWCASE_CHAPTERS.map((chap) => {
          const isCurrent = chap.id === activeChapter.id;
          const isCompleted = chap.index < activeChapter.index;
          return (
            <button
              key={chap.id}
              type="button"
              onClick={() => onSelectChapter(chap.id)}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-md px-2.5 py-1.5 text-left transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                isCurrent
                  ? 'bg-slate-800/90 text-white'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[11px] font-medium">
                <span className="font-mono tabular-nums text-[10px] text-cyan-400/90">
                  0{chap.index}
                </span>
                <span>{chap.navLabel}</span>
              </div>
              {/* Progress Bar Rail */}
              <div className="mt-1 h-[2px] w-full overflow-hidden rounded-full bg-slate-700/80">
                <div
                  className="h-full bg-cyan-400 transition-[width] duration-100 ease-linear"
                  style={{
                    width: isCurrent
                      ? `${Math.round(progress * 100)}%`
                      : isCompleted
                        ? '100%'
                        : '0%',
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Compact Mobile Chapter Counter */}
      <div className="flex lg:hidden items-center px-2 font-mono text-xs text-slate-300 tabular-nums whitespace-nowrap">
        0{activeChapter.index} / 0{SHOWCASE_CHAPTERS.length} · {activeChapter.navLabel}
      </div>

      {/* Orbit & Speed Controls */}
      <div className="hidden sm:flex items-center gap-1 border-l border-slate-800 pl-2">
        <button
          type="button"
          onClick={onToggleOrbit}
          title="Toggle 3D camera orbit"
          className={`inline-flex items-center gap-1 rounded-md px-2 py-1.5 font-mono text-[11px] transition-colors whitespace-nowrap shrink-0 ${
            orbitEnabled
              ? 'bg-slate-800 text-cyan-300'
              : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          <span>Orbit</span>
        </button>

        <button
          type="button"
          onClick={onToggleSpeed}
          title="Cycle tour speed"
          className="rounded-md px-2 py-1.5 font-mono text-[11px] text-slate-300 tabular-nums transition-colors hover:bg-slate-800/60 hover:text-white whitespace-nowrap shrink-0"
        >
          {playbackSpeed}x
        </button>
      </div>
    </div>
  );
};

interface CornerTelemetryHudProps {
  cameraReadout: { lat: number; lng: number; zoom: number; tilt: number; heading: number };
  elevationSample: ElevationSample | null;
  webglUnsupported: boolean;
}

export const CornerTelemetryHud = ({
  cameraReadout,
  elevationSample,
  webglUnsupported,
}: CornerTelemetryHudProps) => {
  return (
    <div className="pointer-events-none fixed right-4 top-16 z-20 hidden sm:flex flex-col items-end gap-2">
      {/* Live Camera Readout */}
      <div className="pointer-events-auto rounded-lg border border-slate-800/90 bg-[#0B111C]/88 px-3 py-2 text-right font-mono text-[11px] text-slate-300 backdrop-blur-md tabular-nums">
        <div className="text-slate-400">
          {cameraReadout.lat.toFixed(3)}°, {cameraReadout.lng.toFixed(3)}°
        </div>
        <div className="mt-0.5 flex items-center justify-end gap-2.5 text-slate-400">
          <span>Z {cameraReadout.zoom.toFixed(1)}</span>
          <span aria-hidden="true">·</span>
          <span>Tilt {Math.round(cameraReadout.tilt)}°</span>
          <span aria-hidden="true">·</span>
          <span>Hdg {Math.round(cameraReadout.heading)}°</span>
        </div>
      </div>

      {/* Live Google Maps Elevation Probe */}
      {elevationSample && (
        <div className="pointer-events-auto flex items-center gap-2.5 rounded-lg border border-slate-800/90 bg-[#0B111C]/90 px-3 py-2 font-mono text-[11px] backdrop-blur-md tabular-nums">
          <Mountain className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <div className="text-right">
            {elevationSample.loading ? (
              <span className="text-slate-400">Probing elevation…</span>
            ) : elevationSample.elevationMeters !== null ? (
              <>
                <span className="text-white font-medium">
                  {elevationSample.elevationMeters.toFixed(1)} m ASL
                </span>
                <span className="ml-2 text-slate-500">
                  ({elevationSample.lat.toFixed(2)}, {elevationSample.lng.toFixed(2)})
                </span>
              </>
            ) : (
              <span className="text-slate-400">{elevationSample.error ?? 'No sample'}</span>
            )}
          </div>
        </div>
      )}

      {!elevationSample && (
        <div className="rounded-lg border border-slate-800/60 bg-[#0B111C]/75 px-3 py-1.5 text-[11px] text-slate-400 backdrop-blur-sm">
          Click map surface to probe elevation
        </div>
      )}

      {webglUnsupported && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-950/80 px-3 py-1.5 text-[11px] text-amber-200 backdrop-blur-sm">
          WebGL2 unavailable — showing Google Maps base layer
        </div>
      )}
    </div>
  );
};

interface DeckHoverTooltipProps {
  hoverInfo: PickingInfo | null;
}

export const DeckHoverTooltip = ({ hoverInfo }: DeckHoverTooltipProps) => {
  if (!hoverInfo || !hoverInfo.object) return null;

  const { x, y, layer, object } = hoverInfo;
  const layerId = layer?.id ?? '';

  let title = '';
  let kicker = '';
  let metric = '';

  if (layerId === 'water-telemetry-stations') {
    const st = object as HydroStation;
    kicker = `${st.basin} · ${st.status}`;
    title = st.name;
    metric = `${st.metricLabel}: ${st.metricValue} ${st.unit}`;
  } else if (layerId === 'water-global-arcs') {
    const arc = object as HydroCorridor;
    kicker = arc.category;
    title = arc.name;
    metric = `${arc.sourceName} → ${arc.targetName} (${arc.volumeKm3} km³/yr)`;
  } else if (layerId === 'water-river-arteries') {
    const riv = object as RiverPathFeature;
    kicker = `${riv.basin} · ${riv.waterType}`;
    title = riv.name;
    metric = `Mean Discharge: ${riv.dischargeM3s.toLocaleString()} m³/s`;
  } else if (layerId.startsWith('water-stress-columns')) {
    const col = object as WaterColumnDatum;
    kicker = col.category;
    title = col.name;
    metric = `${col.value} ${col.unit}`;
  } else if (layerId === 'water-delta-lagoon-polygons') {
    const poly = object as WaterZonePolygon;
    kicker = 'Hydrographic Zone';
    title = poly.name;
    metric = poly.metric;
  } else if (layerId === 'water-alpine-hexagons') {
    const hex = object as { colorValue?: number; points?: unknown[] };
    kicker = 'Alpine Meltwater Bin';
    title = `${hex.points?.length ?? 0} catchment samples`;
    metric = hex.colorValue
      ? `Mean SWE: ${Math.round(hex.colorValue)} mm`
      : 'Snow-water equivalent';
  } else {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed z-50 max-w-xs rounded-lg border border-slate-700/90 bg-[#0B111C]/95 px-3 py-2 shadow-xl backdrop-blur-md"
      style={{
        left: Math.min(x + 14, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 260),
        top: Math.max(y - 12, 60),
      }}
    >
      <div className="font-mono text-[10px] tracking-wider text-cyan-400 uppercase">
        {kicker}
      </div>
      <div className="mt-0.5 text-xs font-semibold text-white">{title}</div>
      <div className="mt-0.5 font-mono text-[11px] text-slate-300 tabular-nums">{metric}</div>
    </div>
  );
};
