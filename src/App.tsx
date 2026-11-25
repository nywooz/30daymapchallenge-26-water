/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
/// <reference types="google.maps" />

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AdvancedMarker,
  APILoadingStatus,
  APIProvider,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useApiLoadingStatus,
} from '@vis.gl/react-google-maps';
import type { PickingInfo } from '@deck.gl/core';
import {
  HYDRO_STATIONS,
  LAYER_CATALOG,
  SHOWCASE_CHAPTERS,
  TRIP_LOOP_LENGTH,
  type BaseMapMode,
  type HydroStation,
  type LayerId,
} from './data/waterShowcaseData';
import { DeckGlOverlay } from './components/DeckGlOverlay';
import { CameraController, type ElevationSample } from './components/CameraController';
import { SidebarRail } from './components/SidebarRail';
import {
  BottomTimelineDock,
  CornerTelemetryHud,
  DeckHoverTooltip,
  TopNavBar,
} from './components/ShowcaseHud';
import { buildWaterDeckLayers } from './utils/buildDeckLayers';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

function layersRecordForChapter(activeList: LayerId[]): Record<LayerId, boolean> {
  const rec = {} as Record<LayerId, boolean>;
  for (const item of LAYER_CATALOG) {
    rec[item.id] = activeList.includes(item.id);
  }
  return rec;
}

function MapsApiStatusNotice({ hasApiKey }: { hasApiKey: boolean }) {
  const status = useApiLoadingStatus();

  if (!hasApiKey) {
    return (
      <div className="fixed inset-x-0 top-13 z-40 border-b border-amber-500/40 bg-amber-950/90 px-4 py-2 text-center text-xs text-amber-100 backdrop-blur-md">
        Google Maps API key is not configured. Enable Google Maps in the AI Studio panel or set{' '}
        <code className="font-mono text-amber-200">VITE_GOOGLE_MAPS_API_KEY</code>.
      </div>
    );
  }

  if (status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE) {
    return (
      <div className="fixed inset-x-0 top-13 z-40 border-b border-rose-500/40 bg-rose-950/90 px-4 py-2 text-center text-xs text-rose-100 backdrop-blur-md">
        Unable to load Google Maps JavaScript API. Please verify your API key configuration and enabled APIs.
      </div>
    );
  }

  return null;
}

export default function App() {
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  // Showcase chapter & playback state
  const [chapterIndex, setChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chapterProgress, setChapterProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5>(1);
  const [orbitEnabled, setOrbitEnabled] = useState(true);
  const [transitionTrigger, setTransitionTrigger] = useState(0);

  // Map surface & layer visibility state
  const activeChapter = SHOWCASE_CHAPTERS[chapterIndex];
  const [baseMap, setBaseMap] = useState<BaseMapMode>(SHOWCASE_CHAPTERS[0].baseMap);
  const [enabledLayers, setEnabledLayers] = useState<Record<LayerId, boolean>>(() =>
    layersRecordForChapter(SHOWCASE_CHAPTERS[0].activeLayers)
  );

  // UI inspection state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'story' | 'layers'>('story');
  const [hoverInfo, setHoverInfo] = useState<PickingInfo | null>(null);
  const [selectedStation, setSelectedStation] = useState<HydroStation | null>(null);
  const [elevationSample, setElevationSample] = useState<ElevationSample | null>(null);
  const [webglUnsupported, setWebglUnsupported] = useState(false);
  const [cameraReadout, setCameraReadout] = useState({
    lat: SHOWCASE_CHAPTERS[0].camera.center.lat,
    lng: SHOWCASE_CHAPTERS[0].camera.center.lng,
    zoom: SHOWCASE_CHAPTERS[0].camera.zoom,
    tilt: SHOWCASE_CHAPTERS[0].camera.tilt,
    heading: SHOWCASE_CHAPTERS[0].camera.heading,
  });

  // Marker refs stored in plain Record (avoiding `new Map()` due to Map component shadowing)
  const markerRefs = useRef<Record<string, google.maps.marker.AdvancedMarkerElement | null>>({});

  // WebGL animation clock for TripsLayer & station ripples
  const [animClock, setAnimClock] = useState({ currentTime: 0, pulsePhase: 0 });
  const tripsTimeRef = useRef(0);
  const pulsePhaseRef = useRef(0);
  const chapterElapsedRef = useRef(0);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Activate a specific chapter and sync its base map + deck.gl layers
  const activateChapter = useCallback((nextIndex: number) => {
    const bounded = (nextIndex + SHOWCASE_CHAPTERS.length) % SHOWCASE_CHAPTERS.length;
    const chap = SHOWCASE_CHAPTERS[bounded];
    setChapterIndex(bounded);
    setBaseMap(chap.baseMap);
    setEnabledLayers(layersRecordForChapter(chap.activeLayers));
    setSelectedStation(null);
    setChapterProgress(0);
    chapterElapsedRef.current = 0;
    setTransitionTrigger((n) => n + 1);
  }, []);

  const handleSelectChapterById = useCallback(
    (chapterId: string) => {
      const idx = SHOWCASE_CHAPTERS.findIndex((c) => c.id === chapterId);
      if (idx !== -1) {
        activateChapter(idx);
      }
    },
    [activateChapter]
  );

  const handleNextChapter = useCallback(() => {
    activateChapter(chapterIndex + 1);
  }, [activateChapter, chapterIndex]);

  const handlePrevChapter = useCallback(() => {
    activateChapter(chapterIndex - 1);
  }, [activateChapter, chapterIndex]);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev;
      if (next) {
        // Re-align camera & layers to current chapter on play start
        const chap = SHOWCASE_CHAPTERS[chapterIndex];
        setBaseMap(chap.baseMap);
        setEnabledLayers(layersRecordForChapter(chap.activeLayers));
        setTransitionTrigger((n) => n + 1);
      }
      return next;
    });
  }, [chapterIndex]);

  // Continuous animation loop for TripsLayer, water ripples, and Auto Play progression
  useEffect(() => {
    const needsWaterAnim = enabledLayers.trips || enabledLayers.stations;
    if (!isPlaying && !needsWaterAnim) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && !isPlaying) return;

    let rafId = 0;
    let lastTs = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - lastTs) / 1000);
      lastTs = now;

      if (needsWaterAnim && !prefersReducedMotion) {
        tripsTimeRef.current = (tripsTimeRef.current + dt * 24) % TRIP_LOOP_LENGTH;
        pulsePhaseRef.current = (pulsePhaseRef.current + dt * 0.45) % 1;
        setAnimClock({
          currentTime: tripsTimeRef.current,
          pulsePhase: pulsePhaseRef.current,
        });
      }

      if (isPlaying) {
        const effectiveDuration = activeChapter.durationMs / playbackSpeed;
        chapterElapsedRef.current += dt * 1000;
        const pct = Math.min(1, chapterElapsedRef.current / effectiveDuration);
        setChapterProgress(pct);

        if (chapterElapsedRef.current >= effectiveDuration) {
          const nextIdx = (chapterIndex + 1) % SHOWCASE_CHAPTERS.length;
          activateChapter(nextIdx);
          return;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [
    isPlaying,
    activeChapter.durationMs,
    playbackSpeed,
    chapterIndex,
    activateChapter,
    enabledLayers.trips,
    enabledLayers.stations,
  ]);

  const handleToggleLayer = useCallback((layerId: LayerId) => {
    setIsPlaying(false);
    setEnabledLayers((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  }, []);

  const handleBaseMapChange = useCallback((mode: BaseMapMode) => {
    setIsPlaying(false);
    setBaseMap(mode);
  }, []);

  const handleApplyChapterDefaults = useCallback(() => {
    setBaseMap(activeChapter.baseMap);
    setEnabledLayers(layersRecordForChapter(activeChapter.activeLayers));
    setTransitionTrigger((n) => n + 1);
  }, [activeChapter]);

  const handleResetCamera = useCallback(() => {
    setTransitionTrigger((n) => n + 1);
  }, []);

  const handleUserMapDrag = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleDeckClick = useCallback((info: PickingInfo) => {
    if (info.layer?.id === 'water-telemetry-stations' && info.object) {
      setSelectedStation(info.object as HydroStation);
    }
  }, []);

  const deckLayers = useMemo(
    () =>
      buildWaterDeckLayers({
        enabledLayers,
        currentTime: animClock.currentTime,
        pulsePhase: animClock.pulsePhase,
        selectedStationId: selectedStation?.id ?? null,
      }),
    [enabledLayers, animClock.currentTime, animClock.pulsePhase, selectedStation?.id]
  );

  // Filter AdvancedMarkers to keep map clean (Global shows representative nodes; regional chapters highlight their basin)
  const visibleMarkers = useMemo(() => {
    if (!enabledLayers.markers) return [];
    if (activeChapter.id === 'global-currents') {
      return HYDRO_STATIONS.filter((_, i) => i % 2 === 0);
    }
    return HYDRO_STATIONS.filter((s) => s.regionId === activeChapter.id);
  }, [enabledLayers.markers, activeChapter.id]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#070B12] text-slate-100">
      {/* Mandatory Demo Key Quota Banner */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      <TopNavBar
        activeChapterId={activeChapter.id}
        isPlaying={isPlaying}
        onSelectChapter={handleSelectChapterById}
        onTogglePlay={handleTogglePlay}
      />

      <main className="relative h-full w-full pt-13">
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY} language="en" region="US">
          <MapsApiStatusNotice hasApiKey={Boolean(GOOGLE_MAPS_API_KEY)} />

          <div className="relative h-full w-full">
            <GoogleMap
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              mapId="DEMO_MAP_ID"
              colorScheme="DARK"
              mapTypeId={baseMap}
              defaultCenter={SHOWCASE_CHAPTERS[0].camera.center}
              defaultZoom={SHOWCASE_CHAPTERS[0].camera.zoom}
              gestureHandling="greedy"
              disableDefaultUI={true}
              style={{ width: '100%', height: '100%' }}
            >
              <CameraController
                target={activeChapter.camera}
                transitionTrigger={transitionTrigger}
                orbitEnabled={isPlaying && orbitEnabled}
                orbitSpeedDegPerSec={activeChapter.orbitSpeedDegPerSec * playbackSpeed}
                onUserInteract={handleUserMapDrag}
                onElevationSample={setElevationSample}
                onCameraReadout={setCameraReadout}
              />

              <DeckGlOverlay
                layers={deckLayers}
                onHoverInfo={setHoverInfo}
                onClickInfo={handleDeckClick}
                onWebGLUnsupported={setWebglUnsupported}
              />

              {visibleMarkers.map((station) => {
                const pinColor =
                  station.status === 'Critical'
                    ? '#F43F5E'
                    : station.status === 'Elevated'
                      ? '#F59E0B'
                      : '#22D3EE';
                return (
                  <AdvancedMarker
                    key={station.id}
                    ref={(el) => {
                      markerRefs.current[station.id] = el;
                    }}
                    position={{ lat: station.lat, lng: station.lng }}
                    title={station.name}
                    onClick={() => setSelectedStation(station)}
                  >
                    <Pin
                      background="#0B111C"
                      borderColor={pinColor}
                      glyphColor={pinColor}
                      scale={selectedStation?.id === station.id ? 1.15 : 0.85}
                    />
                  </AdvancedMarker>
                );
              })}

              {selectedStation && (
                <InfoWindow
                  anchor={markerRefs.current[selectedStation.id] ?? undefined}
                  position={
                    markerRefs.current[selectedStation.id]
                      ? undefined
                      : { lat: selectedStation.lat, lng: selectedStation.lng }
                  }
                  onCloseClick={() => setSelectedStation(null)}
                >
                  <div className="max-w-[240px] space-y-1.5 text-slate-100">
                    <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-cyan-400">
                      <span>{selectedStation.basin}</span>
                      <span>{selectedStation.status}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white">
                      {selectedStation.name}
                    </h3>
                    <div className="font-mono text-xs text-cyan-300 tabular-nums">
                      {selectedStation.metricLabel}: {selectedStation.metricValue}{' '}
                      {selectedStation.unit}
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300">
                      {selectedStation.summary}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
        </APIProvider>

        <SidebarRail
          chapter={activeChapter}
          totalChapters={SHOWCASE_CHAPTERS.length}
          isOpen={sidebarOpen}
          onToggleOpen={() => setSidebarOpen((v) => !v)}
          baseMap={baseMap}
          onBaseMapChange={handleBaseMapChange}
          enabledLayers={enabledLayers}
          onToggleLayer={handleToggleLayer}
          onApplyChapterDefaults={handleApplyChapterDefaults}
          onResetCamera={handleResetCamera}
          onPrevChapter={handlePrevChapter}
          onNextChapter={handleNextChapter}
          activeTab={sidebarTab}
          onTabChange={setSidebarTab}
        />

        <CornerTelemetryHud
          cameraReadout={cameraReadout}
          elevationSample={elevationSample}
          webglUnsupported={webglUnsupported}
        />

        <BottomTimelineDock
          activeChapter={activeChapter}
          isPlaying={isPlaying}
          progress={chapterProgress}
          playbackSpeed={playbackSpeed}
          orbitEnabled={orbitEnabled}
          onTogglePlay={handleTogglePlay}
          onPrev={handlePrevChapter}
          onNext={handleNextChapter}
          onSelectChapter={handleSelectChapterById}
          onToggleSpeed={() => setPlaybackSpeed((s) => (s === 1 ? 1.5 : 1))}
          onToggleOrbit={() => setOrbitEnabled((o) => !o)}
        />

        <DeckHoverTooltip hoverInfo={hoverInfo} />
      </main>
    </div>
  );
}
