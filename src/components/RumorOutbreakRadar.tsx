import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, AlertTriangle, MapPin, Radio, Satellite } from "lucide-react";

type RumorTopic = "health" | "election" | "finance" | "religion" | "disaster";
type RiskLevel = "low" | "medium" | "high";
type RadarMode = "gps" | "macro";

interface RegionSignal {
  id: string;
  region: string;
  x: number;
  y: number;
  risk: RiskLevel;
  topic: RumorTopic;
  spike: number;
  lat?: number;
  lng?: number;
}

interface RadarSnapshot {
  id: string;
  timestampLabel: string;
  headline: string;
  regions: RegionSignal[];
}

interface GpsState {
  lat: number;
  lng: number;
  accuracy: number;
  lastUpdated: number;
}

interface ReverseGeocodeResult {
  displayName: string;
  city: string;
  state: string;
  country: string;
}

const TOPIC_COLORS: Record<RumorTopic, string> = {
  health: "bg-emerald-400/20 text-emerald-200 border-emerald-300/50",
  election: "bg-violet-400/20 text-violet-200 border-violet-300/50",
  finance: "bg-amber-400/20 text-amber-100 border-amber-300/50",
  religion: "bg-rose-400/20 text-rose-100 border-rose-300/50",
  disaster: "bg-cyan-400/20 text-cyan-100 border-cyan-300/50",
};

const RISK_GLOW: Record<RiskLevel, string> = {
  low: "shadow-[0_0_12px_rgba(74,222,128,0.35)] bg-emerald-300/80",
  medium: "shadow-[0_0_14px_rgba(251,191,36,0.35)] bg-amber-300/85",
  high: "shadow-[0_0_16px_rgba(251,113,133,0.4)] bg-rose-300/90",
};

const snapshots: RadarSnapshot[] = [
  {
    id: "pulse-1",
    timestampLabel: "Live now",
    headline: "Election and finance rumors rising in North and West clusters",
    regions: [
      { id: "m-n-1", region: "North", x: 42, y: 26, risk: "high", topic: "election", spike: 88 },
      { id: "m-w-1", region: "West", x: 26, y: 44, risk: "medium", topic: "finance", spike: 67 },
      { id: "m-c-1", region: "Central", x: 44, y: 47, risk: "medium", topic: "religion", spike: 58 },
      { id: "m-e-1", region: "East", x: 63, y: 45, risk: "low", topic: "health", spike: 34 },
      { id: "m-s-1", region: "South", x: 48, y: 72, risk: "medium", topic: "disaster", spike: 61 },
      { id: "m-ne-1", region: "Northeast", x: 76, y: 31, risk: "low", topic: "election", spike: 29 },
    ],
  },
  {
    id: "pulse-2",
    timestampLabel: "30 sec ago",
    headline: "Health misinformation clusters building in East and South belts",
    regions: [
      { id: "m-n-2", region: "North", x: 42, y: 26, risk: "medium", topic: "finance", spike: 52 },
      { id: "m-w-2", region: "West", x: 26, y: 44, risk: "low", topic: "election", spike: 31 },
      { id: "m-c-2", region: "Central", x: 44, y: 47, risk: "medium", topic: "health", spike: 56 },
      { id: "m-e-2", region: "East", x: 63, y: 45, risk: "high", topic: "health", spike: 83 },
      { id: "m-s-2", region: "South", x: 48, y: 72, risk: "high", topic: "health", spike: 79 },
      { id: "m-ne-2", region: "Northeast", x: 76, y: 31, risk: "medium", topic: "disaster", spike: 49 },
    ],
  },
  {
    id: "pulse-3",
    timestampLabel: "1 min ago",
    headline: "Disaster-related rumor waves increasing in coastal and northeast zones",
    regions: [
      { id: "m-n-3", region: "North", x: 42, y: 26, risk: "low", topic: "religion", spike: 36 },
      { id: "m-w-3", region: "West", x: 26, y: 44, risk: "medium", topic: "finance", spike: 54 },
      { id: "m-c-3", region: "Central", x: 44, y: 47, risk: "medium", topic: "election", spike: 59 },
      { id: "m-e-3", region: "East", x: 63, y: 45, risk: "high", topic: "disaster", spike: 86 },
      { id: "m-s-3", region: "South", x: 48, y: 72, risk: "high", topic: "disaster", spike: 82 },
      { id: "m-ne-3", region: "Northeast", x: 76, y: 31, risk: "high", topic: "disaster", spike: 77 },
    ],
  },
];

const GPS_TOPICS: RumorTopic[] = [
  "health",
  "election",
  "finance",
  "religion",
  "disaster",
];

const pad = (n: number) => n.toFixed(4);

const getRiskFromSpike = (spike: number): RiskLevel => {
  if (spike >= 75) return "high";
  if (spike >= 45) return "medium";
  return "low";
};

const detectGpsRegion = (lat: number, lng: number) => {
  const inIndiaBounds = lat >= 6 && lat <= 37.5 && lng >= 68 && lng <= 98;
  if (!inIndiaBounds) {
    return "Outside India coverage";
  }

  if (lat >= 28) {
    if (lng < 76) return "North-West India";
    if (lng > 84) return "North-East India";
    return "North India";
  }

  if (lat >= 23) {
    if (lng < 74) return "West-Central India";
    if (lng > 84) return "East-Central India";
    return "Central India";
  }

  if (lat >= 17) {
    if (lng < 75) return "West-South India";
    if (lng > 84) return "East-South India";
    return "South-Central India";
  }

  return "Deep South India";
};

const toRad = (value: number) => (value * Math.PI) / 180;

const distanceKm = (aLat: number, aLng: number, bLat: number, bLng: number) => {
  const earthRadius = 6371;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const aa =
    sinLat * sinLat +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * sinLng * sinLng;
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  return earthRadius * c;
};

const getLocalityLabel = (deltaLat: number, deltaLng: number) => {
  const ns = deltaLat >= 0 ? "North" : "South";
  const ew = deltaLng >= 0 ? "East" : "West";
  return `${ns}-${ew} Microzone`;
};

const buildGpsSignals = (gps: GpsState, tick: number): RegionSignal[] => {
  const template = [
    { dLat: 0.005, dLng: -0.004 },
    { dLat: -0.006, dLng: 0.003 },
    { dLat: 0.003, dLng: 0.006 },
    { dLat: -0.004, dLng: -0.005 },
    { dLat: 0.007, dLng: 0.001 },
    { dLat: -0.002, dLng: 0.007 },
  ];

  return template.map((point, i) => {
    const topic = GPS_TOPICS[(i + tick) % GPS_TOPICS.length];
    const spike = Math.min(95, Math.max(24, 40 + ((tick * 9 + i * 13) % 58)));
    const risk = getRiskFromSpike(spike);
    return {
      id: `gps-${i}`,
      region: getLocalityLabel(point.dLat, point.dLng),
      x: 50 + point.dLng * 900,
      y: 50 - point.dLat * 900,
      lat: Number((gps.lat + point.dLat).toFixed(6)),
      lng: Number((gps.lng + point.dLng).toFixed(6)),
      topic,
      risk,
      spike,
    };
  });
};

const getRiskText = (risk: RegionSignal["risk"]) => {
  if (risk === "high") return "High";
  if (risk === "medium") return "Medium";
  return "Low";
};

const RumorOutbreakRadar = () => {
  const [mode, setMode] = useState<RadarMode>("gps");
  const [gpsState, setGpsState] = useState<GpsState | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [resolvedPlace, setResolvedPlace] = useState<ReverseGeocodeResult | null>(null);
  const [isResolvingPlace, setIsResolvingPlace] = useState(false);
  const [tick, setTick] = useState(0);
  const [snapshotIndex, setSnapshotIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!gpsState || mode !== "gps") return;

    let isCancelled = false;

    const fetchPlace = async () => {
      setIsResolvingPlace(true);
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${gpsState.lat}&lon=${gpsState.lng}&zoom=10&addressdetails=1`;
        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Reverse geocoding unavailable");
        }

        const payload = await response.json();
        const address = payload?.address || {};
        const city =
          address.city ||
          address.town ||
          address.village ||
          address.county ||
          "Unknown city";
        const state = address.state || address.region || "Unknown state";
        const country = address.country || "Unknown country";

        if (!isCancelled) {
          setResolvedPlace({
            displayName: payload?.display_name || `${city}, ${state}, ${country}`,
            city,
            state,
            country,
          });
        }
      } catch {
        if (!isCancelled) {
          setResolvedPlace(null);
        }
      } finally {
        if (!isCancelled) {
          setIsResolvingPlace(false);
        }
      }
    };

    fetchPlace();

    return () => {
      isCancelled = true;
    };
  }, [gpsState?.lat, gpsState?.lng, mode]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported in this browser.");
      setMode("macro");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setGpsError(null);
        setGpsState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          lastUpdated: Date.now(),
        });
      },
      () => {
        setGpsError("Location permission is blocked. Showing macro radar fallback.");
        setMode("macro");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (mode !== "macro") return;
    const timer = setInterval(() => {
      setSnapshotIndex((prev) => (prev + 1) % snapshots.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [mode]);

  const snapshot = useMemo<RadarSnapshot>(() => {
    if (mode === "gps" && gpsState) {
      const regions = buildGpsSignals(gpsState, tick);
      return {
        id: `gps-${tick}`,
        timestampLabel: "Live GPS",
        headline: `Local outbreak feed around (${pad(gpsState.lat)}, ${pad(gpsState.lng)})`,
        regions,
      };
    }

    return snapshots[snapshotIndex];
  }, [gpsState, mode, snapshotIndex, tick]);

  const locationMeta = useMemo(() => {
    if (!gpsState) return null;
    return {
      coords: `${pad(gpsState.lat)}, ${pad(gpsState.lng)}`,
      region: detectGpsRegion(gpsState.lat, gpsState.lng),
      accuracy: `${gpsState.accuracy}m`,
      updatedAt: new Date(gpsState.lastUpdated).toLocaleTimeString(),
    };
  }, [gpsState]);

  const nearestGpsHotspot = useMemo(() => {
    if (!gpsState || mode !== "gps") return null;
    const gpsSignals = snapshot.regions.filter(
      (region) => typeof region.lat === "number" && typeof region.lng === "number",
    );
    if (gpsSignals.length === 0) return null;

    return gpsSignals
      .map((region) => ({
        ...region,
        distance: distanceKm(gpsState.lat, gpsState.lng, region.lat!, region.lng!),
      }))
      .sort((a, b) => a.distance - b.distance)[0];
  }, [gpsState, mode, snapshot.regions]);

  const topicSummary = useMemo(() => {
    const grouped = new Map<RumorTopic, { total: number; highCount: number }>();

    snapshot.regions.forEach((item) => {
      const current = grouped.get(item.topic) || { total: 0, highCount: 0 };
      current.total += item.spike;
      if (item.risk === "high") current.highCount += 1;
      grouped.set(item.topic, current);
    });

    return Array.from(grouped.entries())
      .map(([topic, value]) => ({
        topic,
        score: Math.round(value.total / Math.max(1, snapshot.regions.filter((r) => r.topic === topic).length)),
        highCount: value.highCount,
      }))
      .sort((a, b) => b.score - a.score);
  }, [snapshot]);

  return (
    <motion.section
      className="mt-8 rounded-2xl border border-cyan-300/35 bg-[linear-gradient(145deg,rgba(18,31,51,0.82),rgba(22,39,63,0.78))] p-4 shadow-[0_0_28px_rgba(56,189,248,0.22)] sm:p-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/45 bg-cyan-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-100">
            <Radio className="h-3.5 w-3.5" />
            Rumor Outbreak Radar
          </p>
          <h3 className="mt-2 text-base font-bold text-cyan-50 sm:text-lg">
            Live misinformation spikes by region and topic
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-cyan-100/80">
            {snapshot.headline}
          </p>
        </div>

        <div className="rounded-lg border border-cyan-200/35 bg-black/20 px-3 py-2 text-right">
          <p className="text-[10px] uppercase tracking-wider text-cyan-100/70">Updated</p>
          <p className="text-xs font-semibold text-cyan-100">{snapshot.timestampLabel}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setMode("gps")}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
            mode === "gps"
              ? "border-cyan-300/55 bg-cyan-300/20 text-cyan-100"
              : "border-white/25 bg-white/5 text-cyan-100/80"
          }`}
        >
          <Satellite className="h-3.5 w-3.5" />
          GPS Level
        </button>
        <button
          onClick={() => setMode("macro")}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
            mode === "macro"
              ? "border-cyan-300/55 bg-cyan-300/20 text-cyan-100"
              : "border-white/25 bg-white/5 text-cyan-100/80"
          }`}
        >
          <MapPin className="h-3.5 w-3.5" />
          Macro Regions
        </button>
        {gpsError && (
          <span className="text-[11px] text-amber-200/90">{gpsError}</span>
        )}
      </div>

      {mode === "gps" && locationMeta && (
        <div className="mt-3 rounded-lg border border-cyan-200/30 bg-black/20 px-3 py-2 text-[11px] text-cyan-100/90">
          <p className="font-semibold">Detected GPS Region: {locationMeta.region}</p>
          <p className="mt-1 font-semibold">
            Detected Place: {isResolvingPlace ? "Resolving..." : resolvedPlace ? `${resolvedPlace.city}, ${resolvedPlace.state}, ${resolvedPlace.country}` : "Not available"}
          </p>
          <p className="font-semibold">Live Device Coordinates: {locationMeta.coords}</p>
          <p className="mt-1 text-cyan-100/75">
            Accuracy: {locationMeta.accuracy} | Last sync: {locationMeta.updatedAt}
          </p>
          {nearestGpsHotspot && (
            <p className="mt-1 text-cyan-100/75">
              Nearest hotspot: {nearestGpsHotspot.region} ({nearestGpsHotspot.topic}, {getRiskText(nearestGpsHotspot.risk)} risk, {nearestGpsHotspot.distance.toFixed(1)} km)
            </p>
          )}
        </div>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-cyan-200/30 bg-black/20 p-3">
          <div className="relative mx-auto aspect-[1/1.06] w-full max-w-[360px] rounded-xl border border-cyan-200/25 bg-[radial-gradient(circle_at_35%_20%,rgba(56,189,248,0.14),transparent_50%),radial-gradient(circle_at_75%_70%,rgba(251,113,133,0.12),transparent_48%),linear-gradient(180deg,rgba(10,18,30,0.82),rgba(12,22,36,0.9))]">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full p-5">
              <path
                d="M30 10 L45 12 L58 18 L66 28 L78 30 L83 38 L80 48 L72 54 L69 66 L61 75 L52 90 L44 86 L39 77 L31 74 L24 63 L25 51 L19 41 L22 32 L29 26 Z"
                fill="rgba(99, 179, 237, 0.08)"
                stroke="rgba(125, 211, 252, 0.35)"
                strokeWidth="1.4"
              />
              {snapshot.regions.map((region) => (
                <g key={region.id}>
                  <circle
                    cx={region.x}
                    cy={region.y}
                    r={region.risk === "high" ? 5.8 : 4.8}
                    fill="rgba(56,189,248,0.12)"
                    stroke="rgba(56,189,248,0.35)"
                  >
                    <animate
                      attributeName="r"
                      values={region.risk === "high" ? "4.8;7.4;4.8" : "4.3;5.8;4.3"}
                      dur="2.8s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.65;0.18;0.65"
                      dur="2.8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              ))}

              {mode === "gps" && gpsState && (
                <g>
                  <circle
                    cx="50"
                    cy="50"
                    r="6"
                    fill="rgba(16,185,129,0.18)"
                    stroke="rgba(110,231,183,0.7)"
                    strokeWidth="1.6"
                  >
                    <animate
                      attributeName="r"
                      values="4.8;7.2;4.8"
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.9;0.28;0.9"
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="50" cy="50" r="2.3" fill="rgba(167,243,208,0.95)" />
                </g>
              )}
            </svg>

            {snapshot.regions.map((region) => (
              <div
                key={`pin-${region.id}`}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${region.x}%`, top: `${region.y}%` }}
              >
                <div className={`h-2.5 w-2.5 rounded-full border border-white/40 ${RISK_GLOW[region.risk]}`} />
              </div>
            ))}

            {mode === "gps" && gpsState && (
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[2.2rem] rounded-md border border-emerald-200/45 bg-emerald-300/15 px-2 py-1 text-[10px] font-semibold text-emerald-100 shadow-[0_0_14px_rgba(16,185,129,0.35)]">
                {resolvedPlace?.city || "Detected Device Location"}
              </div>
            )}
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {snapshot.regions.map((region) => (
              <div
                key={`summary-${region.id}`}
                className="rounded-lg border border-cyan-200/20 bg-black/25 px-2.5 py-2"
              >
                <p className="text-[11px] font-semibold text-cyan-100 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {region.region}
                </p>
                <div className="mt-1 flex items-center justify-between text-[10px] text-cyan-100/80">
                  <span className="capitalize">{region.topic}</span>
                  <span>{getRiskText(region.risk)} Risk</span>
                </div>
                {mode === "gps" && region.lat && region.lng && (
                  <p className="mt-1 text-[10px] text-cyan-100/65">
                    {pad(region.lat)}, {pad(region.lng)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-cyan-200/30 bg-black/20 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-100/85 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Topic Outbreak Intensity
          </p>

          <div className="mt-3 space-y-2.5">
            {topicSummary.map((item) => (
              <div
                key={item.topic}
                className="rounded-lg border border-cyan-200/20 bg-black/25 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${TOPIC_COLORS[item.topic]}`}
                  >
                    {item.topic}
                  </span>
                  <span className="text-[11px] font-semibold text-cyan-100">
                    Spike {item.score}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-300 to-rose-300"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-cyan-100/70">
                  High-risk zones: {item.highCount}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-lg border border-amber-200/30 bg-amber-300/10 px-3 py-2 text-[11px] text-amber-100/90 flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {mode === "gps"
              ? "GPS mode tracks local rumor micro-zones near your current coordinates with periodic live refreshes."
              : "Use this macro radar to prioritize verification by region and topic before rumor waves scale."}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default RumorOutbreakRadar;
