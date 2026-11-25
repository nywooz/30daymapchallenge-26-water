export type LayerId =
  | 'arcs'
  | 'rivers'
  | 'trips'
  | 'heatmap'
  | 'columns'
  | 'hexagons'
  | 'polygons'
  | 'stations'
  | 'markers';

export type BaseMapMode = 'roadmap' | 'terrain' | 'hybrid' | 'satellite';

export interface LayerMetadata {
  id: LayerId;
  label: string;
  library: string;
  description: string;
  colorSwatch: string;
}

export const LAYER_CATALOG: LayerMetadata[] = [
  {
    id: 'arcs',
    label: 'Global Moisture Arcs',
    library: 'deck.gl ArcLayer',
    description: 'Great-circle atmospheric moisture & maritime freshwater corridors',
    colorSwatch: '#22D3EE',
  },
  {
    id: 'rivers',
    label: 'Hydrographic Arteries',
    library: 'deck.gl PathLayer',
    description: 'Major basin rivers scaled by mean volumetric discharge',
    colorSwatch: '#38BDF8',
  },
  {
    id: 'trips',
    label: 'Animated Flow Pulses',
    library: 'deck.gl TripsLayer',
    description: 'Real-time 60fps directional sediment and tidal current vectors',
    colorSwatch: '#67E8F9',
  },
  {
    id: 'heatmap',
    label: 'Basin Saturation Heatmap',
    library: 'deck.gl HeatmapLayer',
    description: 'Kernel density surface of seasonal floodplain inundation',
    colorSwatch: '#0EA5E9',
  },
  {
    id: 'columns',
    label: '3D Storage & Surge Columns',
    library: 'deck.gl ColumnLayer',
    description: 'Extruded cylindrical bars encoding reservoir capacity and tide surge',
    colorSwatch: '#F59E0B',
  },
  {
    id: 'hexagons',
    label: '3D Glacial Runoff Bins',
    library: 'deck.gl HexagonLayer',
    description: 'Hexagonal spatial aggregation of Alpine snow-water equivalent',
    colorSwatch: '#7DD3FC',
  },
  {
    id: 'polygons',
    label: 'Delta & Lagoon Zones',
    library: 'deck.gl PolygonLayer',
    description: 'Extruded bathymetric basins and coastal salinity intrusion extents',
    colorSwatch: '#0284C7',
  },
  {
    id: 'stations',
    label: 'Telemetry Nodes',
    library: 'deck.gl ScatterplotLayer',
    description: 'Proportional hydrological gauges with hover picking',
    colorSwatch: '#34D399',
  },
  {
    id: 'markers',
    label: 'Interactive Beacons',
    library: 'Google AdvancedMarker',
    description: 'Clickable Google Maps markers anchored to InfoWindow telemetry',
    colorSwatch: '#E2E8F0',
  },
];

export interface CameraTarget {
  center: { lat: number; lng: number };
  zoom: number;
  tilt: number;
  heading: number;
}

export interface ChapterMetric {
  label: string;
  value: string;
  unit: string;
  delta?: string;
}

export interface ShowcaseChapter {
  id: string;
  index: number;
  navLabel: string;
  regionTag: string;
  title: string;
  subtitle: string;
  narrative: string;
  durationMs: number;
  baseMap: BaseMapMode;
  orbitSpeedDegPerSec: number;
  camera: CameraTarget;
  activeLayers: LayerId[];
  metrics: ChapterMetric[];
  featuredCapabilities: string[];
}

export const SHOWCASE_CHAPTERS: ShowcaseChapter[] = [
  {
    id: 'global-currents',
    index: 1,
    navLabel: 'Overview',
    regionTag: 'Global Network · Day 26',
    title: 'Planetary Water Corridors',
    subtitle: 'Atmospheric rivers, virtual water trade, and global basin telemetry',
    narrative:
      'Every day, trillions of liters circulate across continents through atmospheric moisture rivers and maritime supply corridors. Interleaved deck.gl ArcLayer vectors trace primary trans-oceanic vapor and freshwater linkages above Google Maps dark vector cartography.',
    durationMs: 9500,
    baseMap: 'roadmap',
    orbitSpeedDegPerSec: 0,
    camera: {
      center: { lat: 20.5, lng: 8.0 },
      zoom: 2.35,
      tilt: 0,
      heading: 0,
    },
    activeLayers: ['arcs', 'trips', 'stations', 'markers'],
    metrics: [
      { label: 'Global Freshwater', value: '2.50', unit: '% of total', delta: '0.3% accessible' },
      { label: 'Monitored Basins', value: '32', unit: 'nodes', delta: '6 focus zones' },
      { label: 'Peak Vapor Flux', value: '45.2', unit: 'kt/s', delta: '+4.8% seasonal' },
    ],
    featuredCapabilities: ['Google Maps Dark Vector', 'deck.gl ArcLayer', 'ScatterplotLayer', 'AdvancedMarker'],
  },
  {
    id: 'amazon-confluence',
    index: 2,
    navLabel: 'Amazon',
    regionTag: 'South America · 3.14° S, 59.95° W',
    title: 'Amazon Meeting of Waters',
    subtitle: 'Blackwater vs. sediment-rich currents and seasonal floodplain saturation',
    narrative:
      'At Manaus, the dark acidic Rio Negro runs side-by-side with the pale, sediment-laden Solimões for six kilometers before mixing. Hybrid satellite imagery pairs with a WebGL HeatmapLayer and animated TripsLayer currents to reveal the world’s largest river discharge.',
    durationMs: 10500,
    baseMap: 'hybrid',
    orbitSpeedDegPerSec: 1.6,
    camera: {
      center: { lat: -3.14, lng: -59.95 },
      zoom: 7.25,
      tilt: 48,
      heading: 18,
    },
    activeLayers: ['rivers', 'heatmap', 'trips', 'stations', 'markers'],
    metrics: [
      { label: 'Mean Discharge', value: '209,000', unit: 'm³/s', delta: '20% of river input' },
      { label: 'Floodplain Pulse', value: '11.4', unit: 'm stage', delta: 'Manaus gauge' },
      { label: 'Basin Catchment', value: '7.05', unit: 'M km²', delta: 'Tropical wet' },
    ],
    featuredCapabilities: ['Google Hybrid Satellite', 'HeatmapLayer', 'TripsLayer Flow', '48° 3D Tilt'],
  },
  {
    id: 'nile-artery',
    index: 3,
    navLabel: 'Nile',
    regionTag: 'North Africa · 26.80° N, 31.20° E',
    title: 'The Nile Hydraulic Spine',
    subtitle: 'Extruded 3D reservoir storage and municipal demand across arid terrain',
    narrative:
      'Crossing 6,650 kilometers of hyper-arid desert, the Nile concentrates nearly all regional freshwater demand into a narrow green ribbon. Google Maps Terrain relief highlights the valley floor while 3D ColumnLayer cylinders contrast Aswan reservoir storage against downstream urban demand.',
    durationMs: 10000,
    baseMap: 'terrain',
    orbitSpeedDegPerSec: -1.4,
    camera: {
      center: { lat: 26.6, lng: 31.3 },
      zoom: 5.85,
      tilt: 45,
      heading: -14,
    },
    activeLayers: ['rivers', 'trips', 'columns', 'stations', 'markers'],
    metrics: [
      { label: 'River Length', value: '6,650', unit: 'km', delta: 'Lake Victoria to Delta' },
      { label: 'Nasser Storage', value: '162.0', unit: 'km³', delta: 'Aswan High Dam' },
      { label: 'Arid Corridor', value: '96.4', unit: '% pop.', delta: 'Within 15 km of channel' },
    ],
    featuredCapabilities: ['Google Terrain Relief', '3D ColumnLayer', 'PathLayer Arteries', 'Elevation Probe'],
  },
  {
    id: 'alpine-cryosphere',
    index: 4,
    navLabel: 'Alps',
    regionTag: 'Central Europe · 46.54° N, 8.15° E',
    title: 'Alpine Meltwater Towers',
    subtitle: '3D hexagonal aggregation of snow-water equivalent across headwaters',
    narrative:
      'High-altitude glaciers in the Bernese and Valais Alps act as Europe’s frozen water towers, feeding the Rhône, Rhine, and Po simultaneously. deck.gl HexagonLayer aggregates dense catchment samples into extruded 3D bins directly over tilted Alpine terrain.',
    durationMs: 10000,
    baseMap: 'terrain',
    orbitSpeedDegPerSec: 1.8,
    camera: {
      center: { lat: 46.54, lng: 8.15 },
      zoom: 8.85,
      tilt: 56,
      heading: 32,
    },
    activeLayers: ['hexagons', 'rivers', 'trips', 'stations', 'markers'],
    metrics: [
      { label: 'Snow-Water Eq.', value: '1,420', unit: 'mm', delta: 'Aletsch firn zone' },
      { label: 'Headwater Basins', value: '4', unit: 'major', delta: 'Rhône · Rhine · Po · Inn' },
      { label: 'Peak Elevation', value: '4,274', unit: 'm ASL', delta: 'Finsteraarhorn ridge' },
    ],
    featuredCapabilities: ['3D HexagonLayer', 'Terrain Shading', '56° Oblique Camera', 'Headwater Paths'],
  },
  {
    id: 'mekong-pulse',
    index: 5,
    navLabel: 'Mekong',
    regionTag: 'Southeast Asia · 10.02° N, 105.82° E',
    title: 'Mekong Nine Dragons Delta',
    subtitle: 'Distributary sediment trails and dry-season salinity intrusion zones',
    narrative:
      'Splitting into nine tidal branches across southern Vietnam, the Mekong sustains one of Earth’s most productive rice and aquaculture deltas. Extruded PolygonLayer salinity zones sit beneath animated TripsLayer sediment pulses gliding toward the South China Sea.',
    durationMs: 10000,
    baseMap: 'hybrid',
    orbitSpeedDegPerSec: -1.5,
    camera: {
      center: { lat: 10.02, lng: 105.82 },
      zoom: 8.65,
      tilt: 48,
      heading: -24,
    },
    activeLayers: ['trips', 'polygons', 'rivers', 'stations', 'markers'],
    metrics: [
      { label: 'Sediment Load', value: '160', unit: 'Mt/yr', delta: 'Historical baseline' },
      { label: 'Salinity Reach', value: '62.5', unit: 'km inland', delta: 'Dry-season 4 g/L' },
      { label: 'Distributaries', value: '9', unit: 'channels', delta: 'Cửu Long estuary' },
    ],
    featuredCapabilities: ['PolygonLayer Salinity', 'TripsLayer Sediment', 'Hybrid Imagery', 'Camera Orbit'],
  },
  {
    id: 'venice-barriers',
    index: 6,
    navLabel: 'Venice',
    regionTag: 'Adriatic Sea · 45.43° N, 12.35° E',
    title: 'Venice Lagoon Tidal Engineering',
    subtitle: 'Bathymetric basins, MOSE barrier inlets, and high-tide surge telemetry',
    narrative:
      'Three narrow Adriatic inlets—Lido, Malamocco, and Chioggia—regulate tidal exchange across 550 square kilometers of shallow lagoon. Satellite imagery reveals the barrier islands while 3D surge columns, bathymetry polygons, and tidal currents animate the coastal defense system.',
    durationMs: 10500,
    baseMap: 'satellite',
    orbitSpeedDegPerSec: 2.0,
    camera: {
      center: { lat: 45.425, lng: 12.35 },
      zoom: 11.35,
      tilt: 60,
      heading: 44,
    },
    activeLayers: ['polygons', 'columns', 'trips', 'stations', 'markers'],
    metrics: [
      { label: 'MOSE Threshold', value: '+110', unit: 'cm', delta: '78 mobile gates' },
      { label: 'Lagoon Area', value: '550', unit: 'km²', delta: '8% open marshland' },
      { label: 'Tidal Exchange', value: '380', unit: 'M m³', delta: 'Per semi-diurnal cycle' },
    ],
    featuredCapabilities: ['Google Satellite 3D', 'MOSE Inlet Polygons', '3D Tide Surge Columns', '60° Cinematic Tilt'],
  },
];

export interface HydroCorridor {
  id: string;
  name: string;
  sourceName: string;
  targetName: string;
  source: [number, number]; // [lng, lat]
  target: [number, number]; // [lng, lat]
  volumeKm3: number;
  category: 'Atmospheric River' | 'Virtual Water Trade' | 'Oceanic Current';
}

export const HYDRO_CORRIDORS: HydroCorridor[] = [
  {
    id: 'ar-pacific-nw',
    name: 'Pineapple Express Corridor',
    sourceName: 'Central Tropical Pacific',
    targetName: 'Pacific Northwest Coast',
    source: [-156.0, 21.0],
    target: [-124.2, 46.8],
    volumeKm3: 48.5,
    category: 'Atmospheric River',
  },
  {
    id: 'ar-atlantic-eu',
    name: 'North Atlantic Vapor Stream',
    sourceName: 'Caribbean Basin',
    targetName: 'Western European Shelf',
    source: [-74.0, 20.5],
    target: [-5.5, 48.4],
    volumeKm3: 42.1,
    category: 'Atmospheric River',
  },
  {
    id: 'ar-amazon-andes',
    name: 'Amazon Flying River',
    sourceName: 'Central Amazon Basin',
    targetName: 'Paraná-La Plata Basin',
    source: [-60.0, -3.1],
    target: [-58.4, -27.4],
    volumeKm3: 64.0,
    category: 'Atmospheric River',
  },
  {
    id: 'vw-brazil-china',
    name: 'South America → East Asia Soy-Water Flow',
    sourceName: 'Santos Maritime Terminal',
    targetName: 'Yangtze Estuary Port',
    source: [-46.3, -23.9],
    target: [121.8, 31.2],
    volumeKm3: 52.4,
    category: 'Virtual Water Trade',
  },
  {
    id: 'vw-mississippi-med',
    name: 'Mississippi → Mediterranean Grain-Water',
    sourceName: 'New Orleans Delta',
    targetName: 'Alexandria Nile Port',
    source: [-90.0, 29.9],
    target: [29.9, 31.2],
    volumeKm3: 31.8,
    category: 'Virtual Water Trade',
  },
  {
    id: 'oc-gulf-arctic',
    name: 'North Atlantic Meridional Drift',
    sourceName: 'Florida Straits',
    targetName: 'Norwegian Sea Shelf',
    source: [-79.8, 25.7],
    target: [4.5, 63.2],
    volumeKm3: 88.0,
    category: 'Oceanic Current',
  },
  {
    id: 'ar-indian-monsoon',
    name: 'Somali Jet Monsoon Plume',
    sourceName: 'Mascarene High',
    targetName: 'Western Ghats & Ganges',
    source: [54.0, -8.5],
    target: [75.8, 15.2],
    volumeKm3: 71.2,
    category: 'Atmospheric River',
  },
  {
    id: 'ar-mekong-scsea',
    name: 'Indochina Monsoon Vapor Arc',
    sourceName: 'Bay of Bengal',
    targetName: 'Mekong Headwaters',
    source: [88.5, 14.5],
    target: [101.2, 18.8],
    volumeKm3: 37.6,
    category: 'Atmospheric River',
  },
  {
    id: 'vw-danube-blacksea',
    name: 'Alpine-Danube Catchment Transfer',
    sourceName: 'Upper Rhine & Alps',
    targetName: 'Danube Delta Basin',
    source: [8.2, 46.6],
    target: [29.5, 45.1],
    volumeKm3: 24.3,
    category: 'Oceanic Current',
  },
  {
    id: 'ar-congo-east',
    name: 'Congo Basin Moisture Recycle',
    sourceName: 'Congo River Core',
    targetName: 'Lake Victoria Headwaters',
    source: [18.5, -0.5],
    target: [33.0, -1.2],
    volumeKm3: 39.4,
    category: 'Atmospheric River',
  },
  {
    id: 'vw-murray-seasia',
    name: 'Southern Ocean Moisture Advection',
    sourceName: 'Great Australian Bight',
    targetName: 'Murray-Darling Basin',
    source: [131.0, -35.0],
    target: [142.1, -34.2],
    volumeKm3: 19.7,
    category: 'Atmospheric River',
  },
  {
    id: 'oc-kuroshio',
    name: 'Kuroshio Heat & Vapor Boundary',
    sourceName: 'Luzon Strait',
    targetName: 'Tokyo Bay Offshore',
    source: [122.0, 20.5],
    target: [140.5, 35.1],
    volumeKm3: 76.4,
    category: 'Oceanic Current',
  },
];

export interface HydroStation {
  id: string;
  name: string;
  basin: string;
  regionId: string;
  lat: number;
  lng: number;
  metricLabel: string;
  metricValue: string;
  unit: string;
  magnitude: number; // Normalized 10..100 for radius scaling
  status: 'Nominal' | 'Elevated' | 'Critical';
  summary: string;
}

export const HYDRO_STATIONS: HydroStation[] = [
  // Global & Amazon
  {
    id: 'st-manaus',
    name: 'Manaus · Meeting of Waters',
    basin: 'Amazon Basin',
    regionId: 'amazon-confluence',
    lat: -3.136,
    lng: -59.903,
    metricLabel: 'Stage / Flow',
    metricValue: '209,000',
    unit: 'm³/s',
    magnitude: 96,
    status: 'Nominal',
    summary: 'Confluence of tea-colored Rio Negro and clay-rich Solimões; 6 km thermal & pH shear boundary.',
  },
  {
    id: 'st-obidos',
    name: 'Óbidos Mainstem Gauge',
    basin: 'Amazon Basin',
    regionId: 'amazon-confluence',
    lat: -1.918,
    lng: -55.518,
    metricLabel: 'Channel Depth',
    metricValue: '62.4',
    unit: 'm',
    magnitude: 82,
    status: 'Nominal',
    summary: 'Downstream narrowing of the lower Amazon capturing 80% of total basin runoff.',
  },
  {
    id: 'st-madeira',
    name: 'Porto Velho · Madeira',
    basin: 'Amazon Basin',
    regionId: 'amazon-confluence',
    lat: -8.761,
    lng: -63.903,
    metricLabel: 'Sediment Flux',
    metricValue: '420',
    unit: 'Mt/yr',
    magnitude: 74,
    status: 'Elevated',
    summary: 'Andean-fed whitewater tributary supplying nearly half of the Amazon’s suspended sediment.',
  },
  {
    id: 'st-tapajos',
    name: 'Santarém · Tapajós Mouth',
    basin: 'Amazon Basin',
    regionId: 'amazon-confluence',
    lat: -2.419,
    lng: -54.721,
    metricLabel: 'Clarity Index',
    metricValue: '2.8',
    unit: 'm Secchi',
    magnitude: 66,
    status: 'Nominal',
    summary: 'Clearwater Brazilian Shield tributary forming a broad drowned river-valley ria.',
  },
  {
    id: 'st-tabatinga',
    name: 'Tabatinga Upper Solimões',
    basin: 'Amazon Basin',
    regionId: 'amazon-confluence',
    lat: -4.231,
    lng: -69.941,
    metricLabel: 'Mean Flow',
    metricValue: '41,200',
    unit: 'm³/s',
    magnitude: 68,
    status: 'Nominal',
    summary: 'Western tri-border entry gauge tracking Andean snowmelt and tropical rain pulses.',
  },

  // Nile
  {
    id: 'st-aswan',
    name: 'Aswan High Dam · Lake Nasser',
    basin: 'Nile Corridor',
    regionId: 'nile-artery',
    lat: 23.971,
    lng: 32.877,
    metricLabel: 'Reservoir Storage',
    metricValue: '162.0',
    unit: 'km³',
    magnitude: 94,
    status: 'Nominal',
    summary: 'Multi-year over-year storage reservoir regulating Egypt’s entire agricultural water allocation.',
  },
  {
    id: 'st-cairo',
    name: 'Cairo · El-Roda Nilometer',
    basin: 'Nile Corridor',
    regionId: 'nile-artery',
    lat: 30.007,
    lng: 31.225,
    metricLabel: 'Urban Extraction',
    metricValue: '1,240',
    unit: 'm³/s',
    magnitude: 85,
    status: 'Elevated',
    summary: 'Historic hydraulic reference point at the apex of the Nile Delta fan.',
  },
  {
    id: 'st-rosetta',
    name: 'Rosetta (Rashid) Delta Branch',
    basin: 'Nile Corridor',
    regionId: 'nile-artery',
    lat: 31.425,
    lng: 30.391,
    metricLabel: 'Delta Salinity',
    metricValue: '14.8',
    unit: 'PSU',
    magnitude: 70,
    status: 'Critical',
    summary: 'Coastal Mediterranean boundary experiencing sea-level rise and saltwater wedge intrusion.',
  },
  {
    id: 'st-luxor',
    name: 'Luxor · Upper Nile Valley',
    basin: 'Nile Corridor',
    regionId: 'nile-artery',
    lat: 25.687,
    lng: 32.639,
    metricLabel: 'Evaporation Loss',
    metricValue: '7.8',
    unit: 'mm/day',
    magnitude: 62,
    status: 'Elevated',
    summary: 'Hyper-arid valley reach where canal irrigation supports dense ribbon agriculture.',
  },
  {
    id: 'st-khartoum',
    name: 'Khartoum · Nile Confluence',
    basin: 'Nile Corridor',
    regionId: 'nile-artery',
    lat: 15.611,
    lng: 32.512,
    metricLabel: 'Combined Flow',
    metricValue: '2,830',
    unit: 'm³/s',
    magnitude: 80,
    status: 'Nominal',
    summary: 'Junction of the steady Equatorial White Nile and seasonal Ethiopian Blue Nile.',
  },

  // Alpine Cryosphere
  {
    id: 'st-aletsch',
    name: 'Aletsch Glacier · Konkordiaplatz',
    basin: 'Alpine Cryosphere',
    regionId: 'alpine-cryosphere',
    lat: 46.501,
    lng: 8.037,
    metricLabel: 'Ice Thickness',
    metricValue: '840',
    unit: 'm',
    magnitude: 92,
    status: 'Critical',
    summary: 'Largest glacier in the Alps; long-term ablation monitoring feeds Rhône meltwater models.',
  },
  {
    id: 'st-rhone-glacier',
    name: 'Rhône Glacier · Furka Headwaters',
    basin: 'Alpine Cryosphere',
    regionId: 'alpine-cryosphere',
    lat: 46.578,
    lng: 8.385,
    metricLabel: 'Summer Melt Runoff',
    metricValue: '18.4',
    unit: 'm³/s',
    magnitude: 74,
    status: 'Elevated',
    summary: 'Proglacial lake expanding rapidly at 2,200 m elevation, feeding the Upper Rhône.',
  },
  {
    id: 'st-gotthard',
    name: 'Gotthard Pass · 4-Sea Divide',
    basin: 'Alpine Cryosphere',
    regionId: 'alpine-cryosphere',
    lat: 46.559,
    lng: 8.567,
    metricLabel: 'Snow-Water Eq.',
    metricValue: '1,380',
    unit: 'mm',
    magnitude: 78,
    status: 'Nominal',
    summary: 'Continental hydrographic node feeding North Sea (Rhine), Mediterranean (Rhône), and Adriatic (Ticino).',
  },
  {
    id: 'st-geneva',
    name: 'Lake Geneva · Rhône Outflow',
    basin: 'Alpine Cryosphere',
    regionId: 'alpine-cryosphere',
    lat: 46.205,
    lng: 6.143,
    metricLabel: 'Lake Volume',
    metricValue: '89.0',
    unit: 'km³',
    magnitude: 86,
    status: 'Nominal',
    summary: 'Western Europe’s largest freshwater lake buffering Alpine seasonal melt pulses.',
  },
  {
    id: 'st-constance',
    name: 'Lake Constance · Rhine Regulator',
    basin: 'Alpine Cryosphere',
    regionId: 'alpine-cryosphere',
    lat: 47.625,
    lng: 9.381,
    metricLabel: 'Retention Basin',
    metricValue: '48.5',
    unit: 'km³',
    magnitude: 76,
    status: 'Nominal',
    summary: 'Unregulated Alpine border lake supplying drinking water to 5 million residents.',
  },

  // Mekong Delta
  {
    id: 'st-cantho',
    name: 'Cần Thơ · Hậu River Gauge',
    basin: 'Mekong Delta',
    regionId: 'mekong-pulse',
    lat: 10.045,
    lng: 105.788,
    metricLabel: 'Tidal Amplitude',
    metricValue: '2.95',
    unit: 'm',
    magnitude: 88,
    status: 'Elevated',
    summary: 'Primary urban gauge on the Bassac (Hậu) branch monitoring monsoon flood peaks.',
  },
  {
    id: 'st-mytho',
    name: 'Mỹ Tho · Tiền Distributary',
    basin: 'Mekong Delta',
    regionId: 'mekong-pulse',
    lat: 10.354,
    lng: 106.365,
    metricLabel: 'Salinity Wedge',
    metricValue: '4.6',
    unit: 'g/L',
    magnitude: 79,
    status: 'Critical',
    summary: 'Eastern delta agricultural hub facing dry-season saline intrusion from South China Sea tides.',
  },
  {
    id: 'st-chaudoc',
    name: 'Châu Đốc · Upper Delta Entry',
    basin: 'Mekong Delta',
    regionId: 'mekong-pulse',
    lat: 10.701,
    lng: 105.118,
    metricLabel: 'Flood Discharge',
    metricValue: '34,500',
    unit: 'm³/s',
    magnitude: 84,
    status: 'Nominal',
    summary: 'Entry point from Cambodia where wet-season floodwaters spill across the Plain of Reeds.',
  },
  {
    id: 'st-camau',
    name: 'Cà Mau · Coastal Mangrove Edge',
    basin: 'Mekong Delta',
    regionId: 'mekong-pulse',
    lat: 9.176,
    lng: 105.152,
    metricLabel: 'Subsidence Rate',
    metricValue: '18.2',
    unit: 'mm/yr',
    magnitude: 72,
    status: 'Critical',
    summary: 'Southernmost delta peninsula balancing brackish aquaculture and mangrove coastal defense.',
  },

  // Venice Lagoon
  {
    id: 'st-salute',
    name: 'Punta della Salute Tide Station',
    basin: 'Venice Lagoon',
    regionId: 'venice-barriers',
    lat: 45.4309,
    lng: 12.3348,
    metricLabel: 'Reference Tide',
    metricValue: '+94',
    unit: 'cm ZMPS',
    magnitude: 90,
    status: 'Nominal',
    summary: 'Century-long datum benchmark in the Grand Canal basin monitoring Acqua Alta surges.',
  },
  {
    id: 'st-lido',
    name: 'Lido Inlet · MOSE Barrier North',
    basin: 'Venice Lagoon',
    regionId: 'venice-barriers',
    lat: 45.4255,
    lng: 12.4265,
    metricLabel: 'Submerged Gates',
    metricValue: '41',
    unit: 'caissons',
    magnitude: 86,
    status: 'Elevated',
    summary: 'Dual-row mobile floodgates shielding the northern lagoon and San Marco basin.',
  },
  {
    id: 'st-malamocco',
    name: 'Malamocco Deep-Water Inlet',
    basin: 'Venice Lagoon',
    regionId: 'venice-barriers',
    lat: 45.3355,
    lng: 12.3385,
    metricLabel: 'Channel Depth',
    metricValue: '14.0',
    unit: 'm',
    magnitude: 80,
    status: 'Nominal',
    summary: 'Primary shipping channel fitted with 19 air-buoyancy floodgates and navigation lock.',
  },
  {
    id: 'st-chioggia',
    name: 'Chioggia Southern Inlet',
    basin: 'Venice Lagoon',
    regionId: 'venice-barriers',
    lat: 45.2295,
    lng: 12.2995,
    metricLabel: 'Mobile Gates',
    metricValue: '18',
    unit: 'caissons',
    magnitude: 76,
    status: 'Nominal',
    summary: 'Southern tidal gateway protecting Chioggia’s historic lagoon fishing harbor.',
  },

  // Additional Global Stations for Overview Arcs
  {
    id: 'st-mississippi',
    name: 'New Orleans · Mississippi Delta',
    basin: 'North America',
    regionId: 'global-currents',
    lat: 29.951,
    lng: -90.071,
    metricLabel: 'Mean Discharge',
    metricValue: '16,790',
    unit: 'm³/s',
    magnitude: 75,
    status: 'Elevated',
    summary: 'Drains 41% of the contiguous United States into the Gulf of Mexico.',
  },
  {
    id: 'st-yangtze',
    name: 'Yangtze Estuary · Chongming',
    basin: 'East Asia',
    regionId: 'global-currents',
    lat: 31.42,
    lng: 121.65,
    metricLabel: 'Mean Discharge',
    metricValue: '30,166',
    unit: 'm³/s',
    magnitude: 85,
    status: 'Nominal',
    summary: 'Asia’s longest river, carrying monumental Himalayan meltwater and monsoon sediment.',
  },
  {
    id: 'st-congo',
    name: 'Kinshasa · Congo Rapids',
    basin: 'Central Africa',
    regionId: 'global-currents',
    lat: -4.325,
    lng: 15.322,
    metricLabel: 'Mean Discharge',
    metricValue: '41,200',
    unit: 'm³/s',
    magnitude: 88,
    status: 'Nominal',
    summary: 'Earth’s deepest river and second largest by discharge volume.',
  },
  {
    id: 'st-ganges',
    name: 'Padma-Meghna Estuary',
    basin: 'South Asia',
    regionId: 'global-currents',
    lat: 23.24,
    lng: 90.65,
    metricLabel: 'Monsoon Peak',
    metricValue: '102,000',
    unit: 'm³/s',
    magnitude: 90,
    status: 'Elevated',
    summary: 'World’s largest river delta system fed by Himalayan snowmelt and southwest monsoons.',
  },
];

export interface RiverPathFeature {
  id: string;
  name: string;
  basin: string;
  dischargeM3s: number;
  waterType: 'Blackwater' | 'Whitewater' | 'Glacial Melt' | 'Distributary' | 'Mainstem';
  color: [number, number, number];
  path: [number, number][]; // [lng, lat]
}

export const RIVER_PATHS: RiverPathFeature[] = [
  // Amazon Basin
  {
    id: 'riv-solimoes',
    name: 'Solimões / Upper Amazon',
    basin: 'Amazon Basin',
    dischargeM3s: 103000,
    waterType: 'Whitewater',
    color: [245, 196, 118],
    path: [
      [-69.94, -4.23],
      [-68.25, -3.55],
      [-66.7, -2.85],
      [-64.8, -3.35],
      [-62.9, -3.85],
      [-61.4, -3.72],
      [-60.6, -3.28],
      [-59.9, -3.14],
      [-58.45, -3.18],
      [-56.8, -2.62],
      [-55.52, -1.92],
      [-53.8, -1.55],
      [-52.1, -1.2],
      [-50.2, -0.45],
    ],
  },
  {
    id: 'riv-rio-negro',
    name: 'Rio Negro (Blackwater)',
    basin: 'Amazon Basin',
    dischargeM3s: 28400,
    waterType: 'Blackwater',
    color: [56, 189, 248],
    path: [
      [-67.1, -0.15],
      [-65.4, -0.42],
      [-63.8, -0.82],
      [-62.1, -1.35],
      [-61.2, -2.18],
      [-60.5, -2.85],
      [-60.05, -3.12],
      [-59.9, -3.14],
    ],
  },
  {
    id: 'riv-madeira',
    name: 'Rio Madeira',
    basin: 'Amazon Basin',
    dischargeM3s: 31200,
    waterType: 'Whitewater',
    color: [251, 191, 36],
    path: [
      [-63.9, -8.76],
      [-62.8, -7.85],
      [-61.9, -6.72],
      [-60.95, -5.68],
      [-59.9, -4.45],
      [-58.78, -3.38],
    ],
  },
  {
    id: 'riv-tapajos',
    name: 'Rio Tapajós (Clearwater)',
    basin: 'Amazon Basin',
    dischargeM3s: 13500,
    waterType: 'Mainstem',
    color: [34, 211, 238],
    path: [
      [-57.6, -7.45],
      [-56.4, -5.92],
      [-55.65, -4.45],
      [-55.12, -3.18],
      [-54.72, -2.42],
    ],
  },

  // Nile Basin
  {
    id: 'riv-nile-main',
    name: 'Nile Mainstem & Delta',
    basin: 'Nile Corridor',
    dischargeM3s: 2830,
    waterType: 'Mainstem',
    color: [34, 211, 238],
    path: [
      [32.51, 15.61],
      [33.15, 17.2],
      [32.95, 19.35],
      [31.82, 18.45],
      [30.42, 19.65],
      [30.98, 21.85],
      [32.88, 23.97],
      [32.91, 24.45],
      [32.64, 25.69],
      [32.72, 26.15],
      [31.7, 26.56],
      [31.18, 27.18],
      [30.82, 28.12],
      [31.11, 29.06],
      [31.23, 30.01],
      [31.14, 30.18],
    ],
  },
  {
    id: 'riv-nile-rosetta',
    name: 'Rosetta Delta Distributary',
    basin: 'Nile Corridor',
    dischargeM3s: 1450,
    waterType: 'Distributary',
    color: [56, 189, 248],
    path: [
      [31.14, 30.18],
      [30.84, 30.65],
      [30.62, 31.05],
      [30.39, 31.43],
    ],
  },
  {
    id: 'riv-nile-damietta',
    name: 'Damietta Delta Distributary',
    basin: 'Nile Corridor',
    dischargeM3s: 1380,
    waterType: 'Distributary',
    color: [56, 189, 248],
    path: [
      [31.14, 30.18],
      [31.26, 30.62],
      [31.48, 31.04],
      [31.82, 31.46],
    ],
  },

  // Alpine Headwaters
  {
    id: 'riv-upper-rhone',
    name: 'Upper Rhône Glacial Artery',
    basin: 'Alpine Cryosphere',
    dischargeM3s: 340,
    waterType: 'Glacial Melt',
    color: [125, 211, 252],
    path: [
      [8.38, 46.58],
      [8.15, 46.42],
      [7.78, 46.31],
      [7.36, 46.22],
      [7.03, 46.15],
      [6.88, 46.39],
      [6.45, 46.42],
      [6.14, 46.2],
    ],
  },
  {
    id: 'riv-alpine-rhine',
    name: 'Alpine Rhine Headwaters',
    basin: 'Alpine Cryosphere',
    dischargeM3s: 410,
    waterType: 'Glacial Melt',
    color: [56, 189, 248],
    path: [
      [8.68, 46.63],
      [9.12, 46.78],
      [9.53, 46.85],
      [9.52, 47.15],
      [9.63, 47.48],
      [9.38, 47.62],
    ],
  },
  {
    id: 'riv-ticino',
    name: 'Ticino Southern Melt',
    basin: 'Alpine Cryosphere',
    dischargeM3s: 280,
    waterType: 'Glacial Melt',
    color: [34, 211, 238],
    path: [
      [8.56, 46.54],
      [8.75, 46.41],
      [8.98, 46.25],
      [8.86, 46.16],
      [8.65, 45.95],
    ],
  },

  // Mekong Delta
  {
    id: 'riv-mekong-hau',
    name: 'Hậu River (Bassac Branch)',
    basin: 'Mekong Delta',
    dischargeM3s: 16800,
    waterType: 'Distributary',
    color: [34, 211, 238],
    path: [
      [105.12, 10.7],
      [105.42, 10.38],
      [105.78, 10.04],
      [106.02, 9.75],
      [106.25, 9.48],
    ],
  },
  {
    id: 'riv-mekong-tien',
    name: 'Tiền River (Main Mekong Branch)',
    basin: 'Mekong Delta',
    dischargeM3s: 19400,
    waterType: 'Distributary',
    color: [56, 189, 248],
    path: [
      [105.22, 10.82],
      [105.62, 10.46],
      [105.95, 10.25],
      [106.36, 10.35],
      [106.72, 10.22],
    ],
  },
  {
    id: 'riv-mekong-cochien',
    name: 'Cổ Chiên Distributary',
    basin: 'Mekong Delta',
    dischargeM3s: 6900,
    waterType: 'Distributary',
    color: [103, 232, 249],
    path: [
      [105.95, 10.25],
      [106.18, 10.05],
      [106.42, 9.85],
      [106.58, 9.75],
    ],
  },
];

export interface FloodplainHeatPoint {
  coordinates: [number, number];
  weight: number;
}

// Deterministic pseudo-random helper so data is clean and reproducible
function seededValue(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export const FLOODPLAIN_HEAT_POINTS: FloodplainHeatPoint[] = (() => {
  const points: FloodplainHeatPoint[] = [];
  const centers: { lng: number; lat: number; radius: number; intensity: number }[] = [
    { lng: -59.95, lat: -3.14, radius: 1.6, intensity: 1.0 }, // Manaus confluence
    { lng: -61.3, lat: -3.5, radius: 2.1, intensity: 0.85 }, // Solimoes floodplain
    { lng: -64.5, lat: -3.2, radius: 2.3, intensity: 0.8 }, // Tefé / Mamirauá flooded forest
    { lng: -57.2, lat: -2.8, radius: 1.8, intensity: 0.75 }, // Lower Madeira-Amazon várzea
    { lng: -55.5, lat: -1.95, radius: 1.5, intensity: 0.85 }, // Óbidos
    { lng: -62.5, lat: -1.4, radius: 1.7, intensity: 0.7 }, // Rio Negro Anavilhanas
  ];

  let idx = 1;
  for (const c of centers) {
    for (let i = 0; i < 42; i++) {
      const angle = seededValue(idx++) * Math.PI * 2;
      const dist = Math.sqrt(seededValue(idx++)) * c.radius;
      const lng = c.lng + Math.cos(angle) * dist * 1.15;
      const lat = c.lat + Math.sin(angle) * dist * 0.85;
      const weight = c.intensity * (0.45 + seededValue(idx++) * 0.55);
      points.push({ coordinates: [lng, lat], weight });
    }
  }
  return points;
})();

export interface WaterColumnDatum {
  id: string;
  name: string;
  regionId: string;
  position: [number, number];
  value: number;
  unit: string;
  elevationMeters: number;
  radiusMeters: number;
  color: [number, number, number, number];
  category: string;
}

export const WATER_STRESS_COLUMNS: WaterColumnDatum[] = [
  // Nile Corridor 3D Storage & Urban Demand
  {
    id: 'col-nasser',
    name: 'Lake Nasser Storage',
    regionId: 'nile-artery',
    position: [32.85, 23.4],
    value: 162.0,
    unit: 'km³ capacity',
    elevationMeters: 260000,
    radiusMeters: 28000,
    color: [34, 211, 238, 220],
    category: 'Reservoir Reserve',
  },
  {
    id: 'col-toshka',
    name: 'Toshka Spillway Lakes',
    regionId: 'nile-artery',
    position: [31.55, 23.15],
    value: 28.5,
    unit: 'km³ overflow',
    elevationMeters: 78000,
    radiusMeters: 20000,
    color: [56, 189, 248, 210],
    category: 'Desert Depression',
  },
  {
    id: 'col-asyut',
    name: 'Asyut Barrage Irrigation',
    regionId: 'nile-artery',
    position: [31.18, 27.18],
    value: 44.2,
    unit: 'Mm³/day draw',
    elevationMeters: 112000,
    radiusMeters: 22000,
    color: [245, 158, 11, 220],
    category: 'Agricultural Draw',
  },
  {
    id: 'col-cairo',
    name: 'Greater Cairo Demand',
    regionId: 'nile-artery',
    position: [31.23, 30.04],
    value: 98.4,
    unit: 'Mm³/day demand',
    elevationMeters: 215000,
    radiusMeters: 26000,
    color: [245, 158, 11, 235],
    category: 'Urban Extraction',
  },
  {
    id: 'col-delta',
    name: 'Delta Salinity Front',
    regionId: 'nile-artery',
    position: [30.92, 31.32],
    value: 74.0,
    unit: 'Salinity Stress Index',
    elevationMeters: 158000,
    radiusMeters: 24000,
    color: [244, 63, 94, 215],
    category: 'Coastal Intrusion',
  },

  // Venice Lagoon 3D Tide Surge Columns
  {
    id: 'col-venice-sanmarco',
    name: 'Punta della Salute Gauge',
    regionId: 'venice-barriers',
    position: [12.3348, 45.4309],
    value: 94,
    unit: 'cm surge datum',
    elevationMeters: 1450,
    radiusMeters: 280,
    color: [34, 211, 238, 230],
    category: 'Lagoon Center',
  },
  {
    id: 'col-venice-lido',
    name: 'Lido MOSE Barrier Peak',
    regionId: 'venice-barriers',
    position: [12.4265, 45.4255],
    value: 142,
    unit: 'cm offshore tide',
    elevationMeters: 2200,
    radiusMeters: 320,
    color: [245, 158, 11, 235],
    category: 'Offshore Surge',
  },
  {
    id: 'col-venice-malamocco',
    name: 'Malamocco Gate Array',
    regionId: 'venice-barriers',
    position: [12.3385, 45.3355],
    value: 138,
    unit: 'cm offshore tide',
    elevationMeters: 2050,
    radiusMeters: 310,
    color: [245, 158, 11, 235],
    category: 'Offshore Surge',
  },
  {
    id: 'col-venice-chioggia',
    name: 'Chioggia Southern Barrier',
    regionId: 'venice-barriers',
    position: [12.2995, 45.2295],
    value: 131,
    unit: 'cm offshore tide',
    elevationMeters: 1920,
    radiusMeters: 300,
    color: [56, 189, 248, 230],
    category: 'Tidal Gate',
  },
  {
    id: 'col-venice-burano',
    name: 'Northern Lagoon Marsh',
    regionId: 'venice-barriers',
    position: [12.418, 45.485],
    value: 76,
    unit: 'cm buffered tide',
    elevationMeters: 1120,
    radiusMeters: 260,
    color: [52, 211, 153, 220],
    category: 'Saltmarsh Buffer',
  },
];

export interface AlpineMeltPoint {
  coordinates: [number, number];
  sweMm: number;
}

export const ALPINE_MELT_GRID: AlpineMeltPoint[] = (() => {
  const pts: AlpineMeltPoint[] = [];
  const glacierPeaks = [
    { lng: 8.03, lat: 46.5, swe: 1420 }, // Aletsch
    { lng: 8.38, lat: 46.58, swe: 1180 }, // Rhone Glacier
    { lng: 7.86, lat: 46.02, swe: 1290 }, // Monte Rosa / Gorner
    { lng: 7.36, lat: 45.98, swe: 1050 }, // Pennine Valais
    { lng: 8.89, lat: 46.81, swe: 980 }, // Tödi / Glarus
    { lng: 9.91, lat: 46.38, swe: 1120 }, // Bernina Range
    { lng: 8.56, lat: 46.56, swe: 1090 }, // Gotthard Massif
  ];

  let seed = 101;
  for (const peak of glacierPeaks) {
    for (let i = 0; i < 38; i++) {
      const a = seededValue(seed++) * Math.PI * 2;
      const r = Math.sqrt(seededValue(seed++)) * 0.24;
      const lng = peak.lng + Math.cos(a) * r * 1.3;
      const lat = peak.lat + Math.sin(a) * r * 0.85;
      const sweMm = Math.round(peak.swe * (0.45 + seededValue(seed++) * 0.65));
      pts.push({ coordinates: [lng, lat], sweMm });
    }
  }
  return pts;
})();

export interface WaterZonePolygon {
  id: string;
  name: string;
  regionId: string;
  metric: string;
  fillColor: [number, number, number, number];
  lineColor: [number, number, number, number];
  elevation: number;
  contour: [number, number][];
}

export const DELTA_LAGOON_ZONES: WaterZonePolygon[] = [
  // Mekong Delta Salinity & Flood Zones
  {
    id: 'poly-mekong-salinity-east',
    name: 'Coastal Salinity Intrusion (>4 g/L)',
    regionId: 'mekong-pulse',
    metric: 'Dry-season brackish boundary · 62 km inland',
    fillColor: [245, 158, 11, 75],
    lineColor: [251, 191, 36, 210],
    elevation: 420,
    contour: [
      [106.05, 9.42],
      [106.65, 9.85],
      [106.78, 10.32],
      [106.35, 10.42],
      [105.98, 10.12],
      [105.82, 9.68],
    ],
  },
  {
    id: 'poly-mekong-plain-reeds',
    name: 'Plain of Reeds Monsoon Retention',
    regionId: 'mekong-pulse',
    metric: 'Seasonal freshwater wetland · 690,000 ha',
    fillColor: [14, 165, 233, 72],
    lineColor: [56, 189, 248, 210],
    elevation: 280,
    contour: [
      [105.28, 10.88],
      [106.02, 10.82],
      [106.15, 10.48],
      [105.58, 10.44],
      [105.25, 10.65],
    ],
  },
  {
    id: 'poly-mekong-camau',
    name: 'Cà Mau Mangroves & Brackish Belt',
    regionId: 'mekong-pulse',
    metric: 'Coastal tidal aquaculture zone',
    fillColor: [20, 184, 166, 70],
    lineColor: [45, 212, 191, 200],
    elevation: 240,
    contour: [
      [104.85, 8.68],
      [105.35, 8.75],
      [105.62, 9.25],
      [105.12, 9.48],
      [104.78, 9.15],
    ],
  },

  // Venice Lagoon Sub-Basins
  {
    id: 'poly-venice-north',
    name: 'Northern Lagoon Saltmarsh Basin',
    regionId: 'venice-barriers',
    metric: 'Lido Inlet tidal exchange · 185 km²',
    fillColor: [52, 211, 153, 68],
    lineColor: [110, 231, 183, 210],
    elevation: 65,
    contour: [
      [12.31, 45.44],
      [12.42, 45.52],
      [12.56, 45.53],
      [12.52, 45.45],
      [12.43, 45.42],
      [12.34, 45.42],
    ],
  },
  {
    id: 'poly-venice-central',
    name: 'Central San Marco & Malamocco Basin',
    regionId: 'venice-barriers',
    metric: 'Deep-draft navigation & surge basin',
    fillColor: [6, 182, 212, 74],
    lineColor: [34, 211, 238, 220],
    elevation: 95,
    contour: [
      [12.24, 45.42],
      [12.34, 45.42],
      [12.37, 45.34],
      [12.31, 45.28],
      [12.22, 45.32],
    ],
  },
  {
    id: 'poly-venice-south',
    name: 'Southern Chioggia Lagoon Basin',
    regionId: 'venice-barriers',
    metric: 'Chioggia inlet coastal exchange · 160 km²',
    fillColor: [56, 189, 248, 68],
    lineColor: [125, 211, 252, 200],
    elevation: 55,
    contour: [
      [12.21, 45.29],
      [12.31, 45.28],
      [12.3, 45.18],
      [12.2, 45.17],
      [12.16, 45.23],
    ],
  },
];

export interface WaterFlowTrip {
  id: string;
  name: string;
  regionId: string;
  kind: 'river' | 'lagoon' | 'arc';
  color: [number, number, number];
  coreColor: [number, number, number];
  waypoints: [number, number][];
  timestamps: number[];
}

export const TRIP_LOOP_LENGTH = 100;

function densifyPath(coords: [number, number][], subdivisions = 4): [number, number][] {
  if (coords.length < 2) return coords;
  const out: [number, number][] = [];
  for (let i = 0; i < coords.length - 1; i++) {
    const [x0, y0] = coords[i];
    const [x1, y1] = coords[i + 1];
    for (let s = 0; s < subdivisions; s++) {
      const t = s / subdivisions;
      out.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]);
    }
  }
  out.push(coords[coords.length - 1]);
  return out;
}

function interpolateGreatCircle(
  start: [number, number],
  end: [number, number],
  segments = 24
): [number, number][] {
  const toRad = Math.PI / 180;
  const toDeg = 180 / Math.PI;
  const lat1 = start[1] * toRad;
  const lon1 = start[0] * toRad;
  const lat2 = end[1] * toRad;
  const lon2 = end[0] * toRad;

  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin((lat2 - lat1) / 2), 2) +
          Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon2 - lon1) / 2), 2)
      )
    );

  if (d < 1e-6) return [start, end];

  const pts: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const f = i / segments;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    const lat = Math.atan2(z, Math.sqrt(x * x + y * y)) * toDeg;
    const lon = Math.atan2(y, x) * toDeg;
    pts.push([lon, lat]);
  }
  return pts;
}

/**
 * Generates staggered, seamlessly looping wave pulses along a waterway or corridor.
 * Uses 3 wave phases + wrap-around echoes so pulses continuously stream with zero dead gaps.
 */
function buildStaggeredWaves(
  baseId: string,
  name: string,
  regionId: string,
  kind: 'river' | 'lagoon' | 'arc',
  color: [number, number, number],
  coreColor: [number, number, number],
  coords: [number, number][],
  waves = 3,
  travelSpan = 64
): WaterFlowTrip[] {
  const dense = kind === 'arc' ? coords : densifyPath(coords, 3);
  const trips: WaterFlowTrip[] = [];
  const step = travelSpan / Math.max(1, dense.length - 1);

  for (let w = 0; w < waves; w++) {
    const phaseOffset = (w * TRIP_LOOP_LENGTH) / waves;
    // Primary and wrapped copies ensure seamless trail continuity across TRIP_LOOP_LENGTH boundary
    for (const wrapShift of [-TRIP_LOOP_LENGTH, 0, TRIP_LOOP_LENGTH]) {
      const start = phaseOffset + wrapShift;
      const end = start + travelSpan;
      if (end < 0 || start > TRIP_LOOP_LENGTH + 40) continue;

      trips.push({
        id: `${baseId}-w${w}-s${wrapShift}`,
        name,
        regionId,
        kind,
        color,
        coreColor,
        waypoints: dense,
        timestamps: dense.map((_, i) => start + i * step),
      });
    }
  }
  return trips;
}

const VENICE_FLOW_CHANNELS: {
  id: string;
  name: string;
  color: [number, number, number];
  coreColor: [number, number, number];
  coords: [number, number][];
}[] = [
  {
    id: 'trip-venice-lido',
    name: 'Lido Inlet Tidal Exchange',
    color: [34, 211, 238],
    coreColor: [224, 242, 254],
    coords: [
      [12.465, 45.398],
      [12.435, 45.423],
      [12.395, 45.43],
      [12.355, 45.429],
      [12.334, 45.432],
      [12.318, 45.439],
      [12.305, 45.446],
    ],
  },
  {
    id: 'trip-venice-grandcanal',
    name: 'Grand Canal & San Marco Circulation',
    color: [56, 189, 248],
    coreColor: [207, 250, 254],
    coords: [
      [12.355, 45.429],
      [12.339, 45.431],
      [12.333, 45.435],
      [12.336, 45.439],
      [12.326, 45.441],
      [12.316, 45.438],
    ],
  },
  {
    id: 'trip-venice-malamocco',
    name: 'Malamocco Channel Current',
    color: [34, 211, 238],
    coreColor: [224, 242, 254],
    coords: [
      [12.385, 45.324],
      [12.342, 45.335],
      [12.305, 45.348],
      [12.275, 45.375],
      [12.282, 45.408],
    ],
  },
  {
    id: 'trip-venice-chioggia',
    name: 'Chioggia Southern Surge',
    color: [56, 189, 248],
    coreColor: [207, 250, 254],
    coords: [
      [12.338, 45.224],
      [12.3, 45.23],
      [12.268, 45.236],
      [12.24, 45.252],
      [12.222, 45.278],
    ],
  },
];

export const WATER_FLOW_TRIPS: WaterFlowTrip[] = [
  // All 13 regional rivers from RIVER_PATHS
  ...RIVER_PATHS.flatMap((riv) => {
    const isWarmSediment = riv.waterType === 'Whitewater';
    return buildStaggeredWaves(
      `flow-${riv.id}`,
      riv.name,
      riv.basin,
      'river',
      riv.color,
      isWarmSediment ? [254, 243, 199] : [224, 242, 254],
      riv.path,
      3,
      62
    );
  }),

  // Venice Lagoon channels
  ...VENICE_FLOW_CHANNELS.flatMap((ch) =>
    buildStaggeredWaves(
      ch.id,
      ch.name,
      'venice-barriers',
      'lagoon',
      ch.color,
      ch.coreColor,
      ch.coords,
      3,
      58
    )
  ),

  // Global Moisture & Maritime Corridors (great-circle animated streams)
  ...HYDRO_CORRIDORS.flatMap((arc) => {
    const gcPath = interpolateGreatCircle(arc.source, arc.target, 22);
    const color: [number, number, number] =
      arc.category === 'Virtual Water Trade'
        ? [245, 158, 11]
        : arc.category === 'Oceanic Current'
          ? [14, 165, 233]
          : [34, 211, 238];
    const coreColor: [number, number, number] =
      arc.category === 'Virtual Water Trade' ? [254, 243, 199] : [224, 242, 254];
    return buildStaggeredWaves(
      `flow-${arc.id}`,
      arc.name,
      'global-currents',
      'arc',
      color,
      coreColor,
      gcPath,
      2,
      66
    );
  }),
];

