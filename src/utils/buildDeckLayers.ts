import type { LayersList } from '@deck.gl/core';
import {
  ArcLayer,
  ColumnLayer,
  PathLayer,
  PolygonLayer,
  ScatterplotLayer,
} from '@deck.gl/layers';
import { HeatmapLayer, HexagonLayer } from '@deck.gl/aggregation-layers';
import { TripsLayer } from '@deck.gl/geo-layers';
import {
  ALPINE_MELT_GRID,
  DELTA_LAGOON_ZONES,
  FLOODPLAIN_HEAT_POINTS,
  HYDRO_CORRIDORS,
  HYDRO_STATIONS,
  RIVER_PATHS,
  WATER_FLOW_TRIPS,
  WATER_STRESS_COLUMNS,
  type AlpineMeltPoint,
  type FloodplainHeatPoint,
  type HydroCorridor,
  type HydroStation,
  type LayerId,
  type RiverPathFeature,
  type WaterColumnDatum,
  type WaterFlowTrip,
  type WaterZonePolygon,
} from '../data/waterShowcaseData';

export interface BuildLayersOptions {
  enabledLayers: Record<LayerId, boolean>;
  currentTime: number;
  pulsePhase: number; // 0..1 continuous ripple phase
  selectedStationId: string | null;
}

interface FlowCrestParticle {
  id: string;
  position: [number, number];
  color: [number, number, number];
  coreColor: [number, number, number];
  kind: 'river' | 'lagoon' | 'arc';
}

function sampleActiveFlowCrests(
  trips: WaterFlowTrip[],
  currentTime: number
): FlowCrestParticle[] {
  const crests: FlowCrestParticle[] = [];

  for (const trip of trips) {
    const ts = trip.timestamps;
    const pts = trip.waypoints;
    if (ts.length < 2) continue;
    const firstT = ts[0];
    const lastT = ts[ts.length - 1];
    if (currentTime < firstT || currentTime > lastT) continue;

    // Locate segment containing currentTime
    for (let i = 0; i < ts.length - 1; i++) {
      const t0 = ts[i];
      const t1 = ts[i + 1];
      if (currentTime >= t0 && currentTime <= t1) {
        const span = t1 - t0 || 1;
        const frac = (currentTime - t0) / span;
        const [x0, y0] = pts[i];
        const [x1, y1] = pts[i + 1];
        crests.push({
          id: trip.id,
          position: [x0 + (x1 - x0) * frac, y0 + (y1 - y0) * frac],
          color: trip.color,
          coreColor: trip.coreColor,
          kind: trip.kind,
        });
        break;
      }
    }
  }

  return crests;
}

export function buildWaterDeckLayers({
  enabledLayers,
  currentTime,
  pulsePhase,
  selectedStationId,
}: BuildLayersOptions): LayersList {
  const layers: LayersList = [];

  if (enabledLayers.heatmap) {
    layers.push(
      new HeatmapLayer<FloodplainHeatPoint>({
        id: 'water-floodplain-heatmap',
        data: FLOODPLAIN_HEAT_POINTS,
        getPosition: (d) => d.coordinates,
        getWeight: (d) => d.weight,
        radiusPixels: 58,
        intensity: 1.35,
        threshold: 0.08,
        colorRange: [
          [8, 47, 73, 0],
          [12, 74, 110, 120],
          [2, 132, 199, 170],
          [6, 182, 212, 210],
          [56, 189, 248, 235],
          [165, 243, 252, 250],
        ],
      })
    );
  }

  if (enabledLayers.polygons) {
    layers.push(
      new PolygonLayer<WaterZonePolygon>({
        id: 'water-delta-lagoon-polygons',
        data: DELTA_LAGOON_ZONES,
        pickable: true,
        stroked: true,
        filled: true,
        extruded: true,
        wireframe: false,
        lineWidthMinPixels: 2,
        lineAntialiasing: true,
        getPolygon: (d) => d.contour,
        getElevation: (d) => d.elevation,
        getFillColor: (d) => d.fillColor,
        getLineColor: (d) => d.lineColor,
        getLineWidth: 2,
      })
    );
  }

  // Deep translucent channel beds so luminous animated water pulses pop sharply on top
  if (enabledLayers.rivers) {
    layers.push(
      new PathLayer<RiverPathFeature>({
        id: 'water-river-arteries',
        data: RIVER_PATHS,
        pickable: true,
        widthUnits: 'pixels',
        widthMinPixels: 4,
        widthMaxPixels: 13,
        capRounded: true,
        jointRounded: true,
        antialiasing: true,
        getPath: (d) => d.path,
        getColor: (d) =>
          d.waterType === 'Whitewater'
            ? [146, 64, 14, 155]
            : [12, 74, 110, 175],
        getWidth: (d) => Math.max(4, Math.log10(d.dischargeM3s + 10) * 2.3),
      })
    );
  }

  if (enabledLayers.arcs) {
    layers.push(
      new ArcLayer<HydroCorridor>({
        id: 'water-global-arcs',
        data: HYDRO_CORRIDORS,
        pickable: true,
        greatCircle: true,
        antialiasing: true,
        getSourcePosition: (d) => d.source,
        getTargetPosition: (d) => d.target,
        getSourceColor: (d) =>
          d.category === 'Virtual Water Trade'
            ? [245, 158, 11, 145]
            : d.category === 'Oceanic Current'
              ? [14, 165, 233, 150]
              : [34, 211, 238, 160],
        getTargetColor: (d) =>
          d.category === 'Virtual Water Trade'
            ? [251, 191, 36, 185]
            : [165, 243, 252, 195],
        getWidth: (d) => Math.max(2.0, Math.min(5.0, d.volumeKm3 / 16)),
        getHeight: 0.42,
      })
    );
  }

  // Dual-pass luminous water current trails + glowing crest droplets
  if (enabledLayers.trips) {
    const activeTrips = enabledLayers.arcs
      ? WATER_FLOW_TRIPS
      : WATER_FLOW_TRIPS.filter((t) => t.kind !== 'arc');

    const crests = sampleActiveFlowCrests(activeTrips, currentTime);

    layers.push(
      // Outer soft cyan glow halo
      new TripsLayer<WaterFlowTrip>({
        id: 'water-flow-trips-halo',
        data: activeTrips,
        getPath: (d) => d.waypoints,
        getTimestamps: (d) => d.timestamps,
        getColor: (d) => d.color,
        opacity: 0.48,
        widthUnits: 'pixels',
        widthMinPixels: 10,
        widthMaxPixels: 18,
        capRounded: true,
        jointRounded: true,
        fadeTrail: true,
        trailLength: 32,
        currentTime,
      }),
      // Crisp bright aqua-white inner current stream
      new TripsLayer<WaterFlowTrip>({
        id: 'water-flow-trips-core',
        data: activeTrips,
        getPath: (d) => d.waypoints,
        getTimestamps: (d) => d.timestamps,
        getColor: (d) => d.coreColor,
        opacity: 1.0,
        widthUnits: 'pixels',
        widthMinPixels: 4,
        widthMaxPixels: 7.5,
        capRounded: true,
        jointRounded: true,
        fadeTrail: true,
        trailLength: 22,
        currentTime,
      }),
      // Glowing leading water-crest droplets riding the tip of every pulse
      new ScatterplotLayer<FlowCrestParticle>({
        id: 'water-flow-crests',
        data: crests,
        pickable: false,
        filled: true,
        stroked: true,
        radiusUnits: 'pixels',
        radiusMinPixels: 3.5,
        radiusMaxPixels: 7,
        lineWidthMinPixels: 1.5,
        getPosition: (d) => d.position,
        getRadius: (d) => (d.kind === 'arc' ? 4.2 : 5.2),
        getFillColor: (d) => [...d.coreColor, 245],
        getLineColor: (d) => [...d.color, 210],
      })
    );
  }

  if (enabledLayers.hexagons) {
    layers.push(
      new HexagonLayer<AlpineMeltPoint>({
        id: 'water-alpine-hexagons',
        data: ALPINE_MELT_GRID,
        pickable: true,
        extruded: true,
        radius: 3600,
        coverage: 0.84,
        elevationScale: 35,
        elevationRange: [120, 1400],
        getPosition: (d) => d.coordinates,
        getColorWeight: (d) => d.sweMm,
        getElevationWeight: (d) => d.sweMm,
        colorAggregation: 'MEAN',
        elevationAggregation: 'MEAN',
        colorRange: [
          [12, 74, 110, 210],
          [2, 132, 199, 220],
          [6, 182, 212, 230],
          [56, 189, 248, 240],
          [125, 211, 252, 245],
          [224, 242, 254, 255],
        ],
      })
    );
  }

  if (enabledLayers.columns) {
    const nileColumns = WATER_STRESS_COLUMNS.filter((c) => c.regionId === 'nile-artery');
    const veniceColumns = WATER_STRESS_COLUMNS.filter((c) => c.regionId === 'venice-barriers');

    layers.push(
      new ColumnLayer<WaterColumnDatum>({
        id: 'water-stress-columns-nile',
        data: nileColumns,
        diskResolution: 20,
        extruded: true,
        pickable: true,
        radius: 24000,
        elevationScale: 1,
        getPosition: (d) => d.position,
        getElevation: (d) => d.elevationMeters,
        getFillColor: (d) => d.color,
        getLineColor: [255, 255, 255, 90],
        stroked: true,
        lineWidthMinPixels: 1,
      }),
      new ColumnLayer<WaterColumnDatum>({
        id: 'water-stress-columns-venice',
        data: veniceColumns,
        diskResolution: 20,
        extruded: true,
        pickable: true,
        radius: 300,
        elevationScale: 1,
        getPosition: (d) => d.position,
        getElevation: (d) => d.elevationMeters,
        getFillColor: (d) => d.color,
        getLineColor: [255, 255, 255, 90],
        stroked: true,
        lineWidthMinPixels: 1,
      })
    );
  }

  if (enabledLayers.stations) {
    const rippleA = pulsePhase;
    const rippleB = (pulsePhase + 0.5) % 1;
    const alphaA = Math.round((1 - rippleA) * 195);
    const alphaB = Math.round((1 - rippleB) * 195);

    layers.push(
      // Expanding concentric hydrological ripple ring A
      new ScatterplotLayer<HydroStation>({
        id: 'water-station-ripple-a',
        data: HYDRO_STATIONS,
        pickable: false,
        filled: false,
        stroked: true,
        radiusUnits: 'pixels',
        lineWidthMinPixels: 1.5,
        getPosition: (d) => [d.lng, d.lat],
        getRadius: (d) => 7 + (d.magnitude / 100) * 6 + rippleA * 22,
        getLineColor: (d) => {
          if (d.status === 'Critical') return [244, 63, 94, alphaA];
          if (d.status === 'Elevated') return [245, 158, 11, alphaA];
          return [56, 189, 248, alphaA];
        },
        updateTriggers: {
          getRadius: [rippleA],
          getLineColor: [alphaA],
        },
      }),
      // Staggered expanding concentric hydrological ripple ring B
      new ScatterplotLayer<HydroStation>({
        id: 'water-station-ripple-b',
        data: HYDRO_STATIONS,
        pickable: false,
        filled: false,
        stroked: true,
        radiusUnits: 'pixels',
        lineWidthMinPixels: 1.5,
        getPosition: (d) => [d.lng, d.lat],
        getRadius: (d) => 7 + (d.magnitude / 100) * 6 + rippleB * 22,
        getLineColor: (d) => {
          if (d.status === 'Critical') return [244, 63, 94, alphaB];
          if (d.status === 'Elevated') return [245, 158, 11, alphaB];
          return [34, 211, 238, alphaB];
        },
        updateTriggers: {
          getRadius: [rippleB],
          getLineColor: [alphaB],
        },
      }),
      // Primary clickable station nodes
      new ScatterplotLayer<HydroStation>({
        id: 'water-telemetry-stations',
        data: HYDRO_STATIONS,
        pickable: true,
        opacity: 0.95,
        stroked: true,
        filled: true,
        radiusUnits: 'pixels',
        radiusMinPixels: 5,
        radiusMaxPixels: 15,
        lineWidthMinPixels: 1.5,
        getPosition: (d) => [d.lng, d.lat],
        getRadius: (d) =>
          (4.5 + (d.magnitude / 100) * 6.5) * (d.id === selectedStationId ? 1.35 : 1),
        getFillColor: (d) => {
          if (d.status === 'Critical') return [244, 63, 94, 225];
          if (d.status === 'Elevated') return [245, 158, 11, 225];
          return [34, 211, 238, 225];
        },
        getLineColor: (d) =>
          d.id === selectedStationId ? [255, 255, 255, 255] : [224, 242, 254, 210],
        updateTriggers: {
          getRadius: [selectedStationId],
          getLineColor: [selectedStationId],
        },
      })
    );
  }

  return layers;
}
