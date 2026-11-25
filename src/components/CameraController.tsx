/// <reference types="google.maps" />
import { useEffect, useRef } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import type { CameraTarget } from '../data/waterShowcaseData';

export interface ElevationSample {
  lat: number;
  lng: number;
  elevationMeters: number | null;
  resolutionMeters: number | null;
  loading: boolean;
  error?: string;
}

interface CameraControllerProps {
  target: CameraTarget;
  transitionTrigger: number;
  orbitEnabled: boolean;
  orbitSpeedDegPerSec: number;
  onUserInteract?: () => void;
  onElevationSample?: (sample: ElevationSample) => void;
  onCameraReadout?: (readout: { lat: number; lng: number; zoom: number; tilt: number; heading: number }) => void;
}

function shortestAngleDiff(from: number, to: number): number {
  const diff = ((to - from + 540) % 360) - 180;
  return diff;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export const CameraController = ({
  target,
  transitionTrigger,
  orbitEnabled,
  orbitSpeedDegPerSec,
  onUserInteract,
  onElevationSample,
  onCameraReadout,
}: CameraControllerProps) => {
  const map = useMap();
  const elevationLib = useMapsLibrary('elevation');
  const elevationServiceRef = useRef<google.maps.ElevationService | null>(null);

  const animFrameRef = useRef<number | null>(null);
  const orbitFrameRef = useRef<number | null>(null);
  const isFlyingRef = useRef(false);
  const onUserInteractRef = useRef(onUserInteract);
  const onElevationRef = useRef(onElevationSample);
  const onCameraReadoutRef = useRef(onCameraReadout);

  useEffect(() => {
    onUserInteractRef.current = onUserInteract;
  }, [onUserInteract]);

  useEffect(() => {
    onElevationRef.current = onElevationSample;
  }, [onElevationSample]);

  useEffect(() => {
    onCameraReadoutRef.current = onCameraReadout;
  }, [onCameraReadout]);

  useEffect(() => {
    if (elevationLib) {
      elevationServiceRef.current = new elevationLib.ElevationService();
    }
  }, [elevationLib]);

  // Listen to user drag and click elevation probe
  useEffect(() => {
    if (!map) return;

    const dragListener = map.addListener('dragstart', () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
        isFlyingRef.current = false;
      }
      onUserInteractRef.current?.();
    });

    const idleListener = map.addListener('camera_changed' in map ? 'bounds_changed' : 'idle', () => {
      const c = map.getCenter();
      if (c) {
        onCameraReadoutRef.current?.({
          lat: c.lat(),
          lng: c.lng(),
          zoom: map.getZoom() ?? 2,
          tilt: map.getTilt() ?? 0,
          heading: map.getHeading() ?? 0,
        });
      }
    });

    const clickListener = map.addListener('click', async (ev: google.maps.MapMouseEvent) => {
      if (!ev.latLng) return;
      const lat = ev.latLng.lat();
      const lng = ev.latLng.lng();

      onElevationRef.current?.({
        lat,
        lng,
        elevationMeters: null,
        resolutionMeters: null,
        loading: true,
      });

      if (!elevationServiceRef.current) {
        onElevationRef.current?.({
          lat,
          lng,
          elevationMeters: null,
          resolutionMeters: null,
          loading: false,
          error: 'Elevation service initializing',
        });
        return;
      }

      try {
        const response = await elevationServiceRef.current.getElevationForLocations({
          locations: [{ lat, lng }],
        });
        const first = response.results?.[0];
        if (first) {
          onElevationRef.current?.({
            lat,
            lng,
            elevationMeters: first.elevation,
            resolutionMeters: first.resolution ?? null,
            loading: false,
          });
        } else {
          onElevationRef.current?.({
            lat,
            lng,
            elevationMeters: null,
            resolutionMeters: null,
            loading: false,
            error: 'No elevation data',
          });
        }
      } catch {
        onElevationRef.current?.({
          lat,
          lng,
          elevationMeters: null,
          resolutionMeters: null,
          loading: false,
          error: 'Elevation probe unavailable',
        });
      }
    });

    return () => {
      dragListener.remove();
      idleListener.remove();
      clickListener.remove();
    };
  }, [map]);

  // Smooth camera flight whenever chapter or reset trigger changes
  useEffect(() => {
    if (!map) return;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    const startCenter = map.getCenter();
    const startLat = startCenter ? startCenter.lat() : target.center.lat;
    const startLng = startCenter ? startCenter.lng() : target.center.lng;
    const startZoom = map.getZoom() ?? target.zoom;
    const startTilt = map.getTilt() ?? 0;
    const startHeading = map.getHeading() ?? 0;

    // Respect prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      map.moveCamera({
        center: target.center,
        zoom: target.zoom,
        tilt: target.tilt,
        heading: target.heading,
      });
      return;
    }

    const durationMs = 1750;
    const startTime = performance.now();
    const headingDelta = shortestAngleDiff(startHeading, target.heading);
    isFlyingRef.current = true;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const rawT = Math.min(1, elapsed / durationMs);
      const t = easeInOutCubic(rawT);

      const lat = startLat + (target.center.lat - startLat) * t;
      const lng = startLng + (target.center.lng - startLng) * t;
      const zoom = startZoom + (target.zoom - startZoom) * t;
      const tilt = startTilt + (target.tilt - startTilt) * t;
      const heading = (startHeading + headingDelta * t + 360) % 360;

      map.moveCamera({
        center: { lat, lng },
        zoom,
        tilt,
        heading,
      });

      onCameraReadoutRef.current?.({ lat, lng, zoom, tilt, heading });

      if (rawT < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        isFlyingRef.current = false;
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      isFlyingRef.current = false;
    };
  }, [map, target, transitionTrigger]);

  // Continuous gentle 3D camera orbit during dwell when enabled
  useEffect(() => {
    if (!map || !orbitEnabled || orbitSpeedDegPerSec === 0) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let lastTime = performance.now();

    const orbitTick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!isFlyingRef.current && dt > 0 && dt < 0.25) {
        const currentHeading = map.getHeading() ?? 0;
        const nextHeading = (currentHeading + orbitSpeedDegPerSec * dt + 360) % 360;
        map.moveCamera({ heading: nextHeading });
      }
      orbitFrameRef.current = requestAnimationFrame(orbitTick);
    };

    orbitFrameRef.current = requestAnimationFrame(orbitTick);

    return () => {
      if (orbitFrameRef.current) {
        cancelAnimationFrame(orbitFrameRef.current);
        orbitFrameRef.current = null;
      }
    };
  }, [map, orbitEnabled, orbitSpeedDegPerSec]);

  return null;
};
