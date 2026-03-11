import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  countryFlags, countryDefaultCenters,
} from '@/data/mockData';
import { useTranslation } from '@/contexts/TranslationContext';
import { usePreferences } from '@/contexts/UserPreferencesContext';
import {
  ApiError,
  countryApi,
  type DisasterNewsItem,
  type DisasterReportDetailItem,
  type DisasterReportItem,
  type DisasterZoneItem,
  type ReportTimelineItem,
} from '@/lib/api';
import { ArrowLeft, AlertTriangle, Users, Activity, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRef, useEffect, useMemo, useState } from 'react';

const zoneColors: Record<string, string> = {
  evacuation: 'hsl(var(--zone-evacuation))',
  caution: 'hsl(var(--zone-caution))',
  danger: 'hsl(var(--zone-danger))',
};

const zoneHex: Record<string, string> = {
  evacuation: '#22c55e',
  caution: '#eab308',
  danger: '#dc2626',
};

const levelRank: Record<string, number> = {
  danger: 3,
  caution: 2,
  evacuation: 1,
};

const newsImages: Record<string, string> = {
  flood: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&h=340&fit=crop',
  landslide: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=340&fit=crop',
  typhoon: 'https://images.unsplash.com/photo-1509803874385-db7c23652552?w=600&h=340&fit=crop',
  earthquake: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=600&h=340&fit=crop',
};

const CountryDetailPage = () => {
  const miniMapRef = useRef<HTMLDivElement>(null);
  const miniMapInstance = useRef<L.Map | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { preferences } = usePreferences();
  const country = decodeURIComponent(name || '');

  const {
    data: status,
    isLoading: isStatusLoading,
    error: statusError,
  } = useQuery({
    queryKey: ['country-detail', 'status', country],
    queryFn: () => countryApi.getCountryStatus(country),
    enabled: Boolean(country),
  });

  const {
    data: countryNews = [],
    isError: isCountryNewsError,
  } = useQuery({
    queryKey: ['country-detail', 'news', country],
    queryFn: () => countryApi.getCountryNews(country),
    enabled: Boolean(country),
  });

  const {
    data: countryZones = [],
    isError: isCountryZonesError,
  } = useQuery({
    queryKey: ['country-detail', 'zones', country],
    queryFn: () => countryApi.getCountryZones(country),
    enabled: Boolean(country),
  });

  const {
    data: reportSummaries = [],
    isError: isReportSummariesError,
  } = useQuery({
    queryKey: ['country-detail', 'reports', country],
    queryFn: () => countryApi.getCountryReports(country),
    enabled: Boolean(country),
  });

  const reportIdsKey = reportSummaries.map((report) => report.id).join('|');
  const {
    data: reportDetails = [],
    isError: isReportDetailsError,
  } = useQuery({
    queryKey: ['country-detail', 'reports-detail', country, reportIdsKey],
    queryFn: async () => Promise.all(reportSummaries.map((report) => countryApi.getReportDetail(report.id))),
    enabled: reportSummaries.length > 0,
  });

  const countryReports = useMemo<Array<DisasterReportItem | DisasterReportDetailItem>>(
    () => (reportDetails.length > 0
      ? reportDetails
      : reportSummaries.map((report) => ({ ...report, timeline: [] as ReportTimelineItem[] }))),
    [reportDetails, reportSummaries],
  );

  const sortedCountryZones = useMemo(
    () => [...countryZones].sort((a, b) => (levelRank[b.level] || 0) - (levelRank[a.level] || 0)),
    [countryZones],
  );

  const recentDisasters = useMemo(() => {
    if (countryReports.length > 0) {
      return countryReports
        .map((report) => ({
          id: report.id,
          title: report.title,
          level: report.severity,
          areaLabel: report.country,
          date: report.date,
        }))
        .sort((a, b) => (levelRank[b.level] || 0) - (levelRank[a.level] || 0));
    }

    return (status?.recentEvents || []).map((event, index) => ({
      id: `status-${index}`,
      title: event,
      level: status?.alertLevel || 'caution',
      areaLabel: country,
      date: '',
    }));
  }, [countryReports, status, country]);

  const center = useMemo<[number, number]>(() => {
    if (countryZones.length > 0) {
      return [countryZones[0].centerLat, countryZones[0].centerLng];
    }
    return countryDefaultCenters[country] || [0, 0];
  }, [countryZones, country]);

  const getZoneLabel = (level: string) => {
    if (level === 'evacuation') return t('stable');
    if (level === 'caution') return t('caution');
    return t('critical');
  };

  // Imperative Leaflet mini-map — must be before any early return
  useEffect(() => {
    if (!miniMapRef.current || !status) return;

    if (miniMapInstance.current) {
      miniMapInstance.current.remove();
      miniMapInstance.current = null;
    }

    const map = L.map(miniMapRef.current, {
      center: center as [number, number],
      zoom: countryZones.length > 0 ? 11 : 6,
      zoomControl: isMapExpanded,
      dragging: isMapExpanded,
      scrollWheelZoom: isMapExpanded,
      doubleClickZoom: isMapExpanded,
      touchZoom: isMapExpanded,
      attributionControl: false,
    });

    const tileUrl = preferences.theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    L.tileLayer(tileUrl).addTo(map);

    const bounds = L.latLngBounds([]);
    sortedCountryZones.forEach((zone: DisasterZoneItem) => {
      const areaKm2 = Math.PI * ((zone.radius / 1000) ** 2);
      const circle = L.circle([zone.centerLat, zone.centerLng], {
        radius: zone.radius,
        color: zoneHex[zone.level] || zoneHex.caution,
        fillColor: zoneHex[zone.level] || zoneHex.caution,
        fillOpacity: 0.25,
        weight: 2,
      }).addTo(map);
      circle.bindTooltip(
        `${zone.name} • ${zone.disasterType.toUpperCase()} • ${getZoneLabel(zone.level)} • ${areaKm2.toFixed(1)} km2`,
      );
      bounds.extend(circle.getBounds());
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.12), { animate: false });
    }

    window.requestAnimationFrame(() => {
      map.invalidateSize();
    });

    miniMapInstance.current = map;

    return () => {
      if (miniMapInstance.current) {
        miniMapInstance.current.remove();
        miniMapInstance.current = null;
      }
    };
  }, [center, countryZones, status, preferences.theme, isMapExpanded, sortedCountryZones]);

  useEffect(() => {
    if (!isMapExpanded) return;
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMapExpanded(false);
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isMapExpanded]);

  if (isStatusLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-background p-4">
        <p className="text-muted-foreground">Loading country data...</p>
      </div>
    );
  }

  if (!status) {
    const isNotFound = statusError instanceof ApiError && statusError.status === 404;
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background p-4">
        <p className="text-muted-foreground">
          {isNotFound ? t('country_not_found') : 'Failed to load country data.'}
        </p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>{t('go_back')}</Button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-background pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 bg-card border-b border-border sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1 rounded-lg hover:bg-accent">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <span className="text-2xl">{countryFlags[country]}</span>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">{country}</h1>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ background: zoneColors[status.alertLevel] }} />
            <span className="text-xs font-semibold" style={{ color: zoneColors[status.alertLevel] }}>
              {getZoneLabel(status.alertLevel)}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 px-4 mt-4">
        <div className="rounded-xl bg-card border border-border p-3 text-center">
          <AlertTriangle className="h-5 w-5 mx-auto text-zone-danger mb-1" />
          <p className="text-xl font-bold text-foreground">{status.activeDisasters}</p>
          <p className="text-[10px] text-muted-foreground">{t('active_disasters')}</p>
        </div>
        <div className="rounded-xl bg-card border border-border p-3 text-center">
          <Users className="h-5 w-5 mx-auto text-zone-caution mb-1" />
          <p className="text-xl font-bold text-foreground">{status.affectedPopulation.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">{t('people_affected')}</p>
        </div>
      </div>

      {/* Forecast */}
      {status.prediction && (
        <div className="mx-4 mt-4 rounded-xl p-3 border border-border"
          style={{ background: `${zoneColors[status.alertLevel]}10` }}>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4" style={{ color: zoneColors[status.alertLevel] }} />
            <span className="text-xs font-bold text-foreground">{t('risk_forecast')}</span>
          </div>
          <p className="text-xs text-muted-foreground">{status.prediction}</p>
        </div>
      )}

      {/* Recent Events */}
      {recentDisasters.length > 0 && (
        <section className="px-4 mt-5">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('recent_events')}</h2>
          <div className="space-y-1.5">
            {recentDisasters.map((event) => (
              <div key={event.id} className="flex items-start gap-2 rounded-lg bg-card border border-border p-2.5">
                <div className="h-2 w-2 rounded-full shrink-0 mt-1.5" style={{ background: zoneColors[event.level] || zoneColors.caution }} />
                <div className="min-w-0">
                  <span className="text-xs text-foreground block">{event.title}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {event.date ? `${event.areaLabel} • ${event.date}` : event.areaLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mini Map */}
      <section className="px-4 mt-5">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('disaster_map')}</h2>
        <div className={isMapExpanded ? 'fixed inset-0 z-50 bg-background p-4' : ''}>
          {isMapExpanded && (
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground">{country} {t('disaster_map')}</h3>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsMapExpanded(false)}>
                <Minimize2 className="h-4 w-4" />
                Collapse
              </Button>
            </div>
          )}
          <div className="rounded-xl overflow-hidden border border-border relative">
            <div ref={miniMapRef} className={isMapExpanded ? 'h-[calc(100vh-8.5rem)] w-full' : 'h-44 w-full'} />
            {!isMapExpanded && (
              <button
                type="button"
                onClick={() => setIsMapExpanded(true)}
                className="absolute inset-0 flex items-center justify-end p-3 bg-gradient-to-t from-black/45 via-transparent to-transparent"
              >
                <span className="inline-flex items-center gap-1 rounded-md border border-white/30 bg-black/40 px-2.5 py-1 text-[11px] text-white">
                  <Maximize2 className="h-3.5 w-3.5" />
                  Expand map
                </span>
              </button>
            )}
          </div>
          <div className="mt-2 space-y-1.5">
            {sortedCountryZones.length === 0 && (
              <div className="rounded-lg border border-border bg-card px-2.5 py-2 text-[11px] text-muted-foreground">
                No mapped disaster zones for this country yet.
              </div>
            )}
            {sortedCountryZones.map((zone) => {
              const areaKm2 = Math.PI * ((zone.radius / 1000) ** 2);
              return (
                <div key={zone.id} className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: zoneColors[zone.level] || zoneColors.caution }} />
                  <span className="text-[11px] text-foreground truncate flex-1">{zone.name}</span>
                  <span className="text-[10px] text-muted-foreground">{areaKm2.toFixed(1)} km2</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Related News */}
      {countryNews.length > 0 && (
        <section className="px-4 mt-5">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('related_news')}</h2>
          <div className="space-y-2">
            {countryNews.map((news: DisasterNewsItem) => (
              <button
                key={news.id}
                onClick={() => news.sourceUrl ? window.open(news.sourceUrl, '_blank') : null}
                className="w-full flex gap-3 rounded-xl bg-card border border-border p-2 text-left"
              >
                <img
                  src={newsImages[news.disasterType] || newsImages.flood}
                  alt={news.title}
                  className="h-16 w-20 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 py-0.5">
                  <h3 className="text-xs font-semibold text-foreground line-clamp-2">{news.title}</h3>
                  <p className="text-[10px] text-muted-foreground mt-1">{news.source} • {news.date}</p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </section>
      )}
      {isCountryNewsError && (
        <section className="px-4 mt-5">
          <div className="rounded-xl border border-border p-3 bg-card text-xs text-muted-foreground">
            Failed to load related news.
          </div>
        </section>
      )}

      {/* Reports */}
      {countryReports.map((report: DisasterReportItem | DisasterReportDetailItem) => (
        <section key={report.id} className="px-4 mt-5">
          <div className="rounded-xl border border-border p-3 space-y-2 bg-card">
            <h3 className="text-sm font-semibold text-foreground">{report.title}</h3>
            <p className="text-xs text-muted-foreground">{report.summary}</p>
            {'timeline' in report && report.timeline.length > 0 && (
              <div className="space-y-1">
                {report.timeline.map((te, i) => (
                  <div key={i} className="flex gap-2 text-[11px]">
                    <span className="text-muted-foreground font-mono shrink-0">{te.time}</span>
                    <span className="text-foreground">{te.event}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
      {(isReportSummariesError || isReportDetailsError) && (
        <section className="px-4 mt-5">
          <div className="rounded-xl border border-border p-3 bg-card text-xs text-muted-foreground">
            Failed to load disaster reports.
          </div>
        </section>
      )}
      {isCountryZonesError && (
        <section className="px-4 mt-5">
          <div className="rounded-xl border border-border p-3 bg-card text-xs text-muted-foreground">
            Failed to load disaster zones.
          </div>
        </section>
      )}
    </div>
  );
};

export default CountryDetailPage;
