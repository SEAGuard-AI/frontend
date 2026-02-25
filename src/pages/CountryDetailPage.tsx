import { useNavigate, useParams } from 'react-router-dom';
import {
  countryStatuses, countryFlags, disasterNews, disasterReports,
  disasterZones, countryDefaultCenters
} from '@/data/mockData';
import { useTranslation } from '@/contexts/TranslationContext';
import { ArrowLeft, AlertTriangle, Users, MapPin, ChevronRight, Activity, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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

const newsImages: Record<string, string> = {
  flood: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&h=340&fit=crop',
  landslide: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=340&fit=crop',
  typhoon: 'https://images.unsplash.com/photo-1509803874385-db7c23652552?w=600&h=340&fit=crop',
  earthquake: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=600&h=340&fit=crop',
};

const CountryDetailPage = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const country = decodeURIComponent(name || '');

  const status = countryStatuses.find(s => s.country === country);
  const countryNews = disasterNews.filter(n => n.country === country);
  const countryReports = disasterReports.filter(r => r.country === country);
  const countryZones = disasterZones.filter(z => z.country === country);
  const center = countryDefaultCenters[country] || [0, 0];

  const getZoneLabel = (level: string) => {
    if (level === 'evacuation') return t('stable');
    if (level === 'caution') return t('caution');
    return t('critical');
  };

  if (!status) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background p-4">
        <p className="text-muted-foreground">{t('country_not_found')}</p>
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
      {status.recentEvents.length > 0 && (
        <section className="px-4 mt-5">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('recent_events')}</h2>
          <div className="space-y-1.5">
            {status.recentEvents.map((evt, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-card border border-border p-2.5">
                <div className="h-2 w-2 rounded-full bg-zone-danger shrink-0" />
                <span className="text-xs text-foreground">{evt}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mini Map */}
      <section className="px-4 mt-5">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('disaster_map')}</h2>
        <div className="rounded-xl overflow-hidden border border-border h-44">
          <MapContainer
            center={center}
            zoom={countryZones.length > 0 ? 11 : 6}
            zoomControl={false}
            dragging={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
            attributionControl={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            {countryZones.map(zone => (
              <Circle
                key={zone.id}
                center={zone.center}
                radius={zone.radius}
                pathOptions={{
                  color: zoneHex[zone.level],
                  fillColor: zoneHex[zone.level],
                  fillOpacity: 0.25,
                  weight: 2,
                }}
              />
            ))}
          </MapContainer>
        </div>
        <Button
          variant="outline"
          className="w-full mt-2 gap-2"
          onClick={() => navigate('/map')}
        >
          <MapPin className="h-4 w-4" />
          {t('view_full_map')}
          <ChevronRight className="h-4 w-4 ml-auto" />
        </Button>
      </section>

      {/* Related News */}
      {countryNews.length > 0 && (
        <section className="px-4 mt-5">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('related_news')}</h2>
          <div className="space-y-2">
            {countryNews.map(news => (
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

      {/* Reports */}
      {countryReports.map(report => (
        <section key={report.id} className="px-4 mt-5">
          <div className="rounded-xl border border-border p-3 space-y-2 bg-card">
            <h3 className="text-sm font-semibold text-foreground">{report.title}</h3>
            <p className="text-xs text-muted-foreground">{report.summary}</p>
            <div className="space-y-1">
              {report.timeline.map((te, i) => (
                <div key={i} className="flex gap-2 text-[11px]">
                  <span className="text-muted-foreground font-mono shrink-0">{te.time}</span>
                  <span className="text-foreground">{te.event}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default CountryDetailPage;
