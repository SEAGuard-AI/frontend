import { useNavigate } from 'react-router-dom';
import {
  disasterNews, countryStatuses, survivalTips,
  countryFlags, type DisasterNews
} from '@/data/mockData';
import { usePreferences } from '@/contexts/UserPreferencesContext';
import {
  Globe, TrendingUp, Newspaper, BookOpen, ChevronRight,
  Activity, ExternalLink, AlertTriangle, X
} from 'lucide-react';
import { useState } from 'react';

const zoneColors: Record<string, string> = {
  evacuation: 'hsl(var(--zone-evacuation))',
  caution: 'hsl(var(--zone-caution))',
  danger: 'hsl(var(--zone-danger))',
};

const zoneLabels: Record<string, string> = {
  evacuation: 'Stable',
  caution: 'Caution',
  danger: 'Critical',
};

const newsImages: Record<string, string> = {
  flood: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&h=340&fit=crop',
  landslide: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=340&fit=crop',
  typhoon: 'https://images.unsplash.com/photo-1509803874385-db7c23652552?w=600&h=340&fit=crop',
  earthquake: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=600&h=340&fit=crop',
  global: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=340&fit=crop',
};

const HomePage = () => {
  const { preferences } = usePreferences();
  const navigate = useNavigate();
  const [selectedNews, setSelectedNews] = useState<DisasterNews | null>(null);

  const localNews = disasterNews.filter(n => n.country === preferences.country);
  const globalNews = disasterNews.filter(n => n.isGlobal);
  const sortedStatuses = [...countryStatuses].sort((a, b) => b.activeDisasters - a.activeDisasters);

  const getNewsImage = (news: DisasterNews) =>
    news.isGlobal ? newsImages.global : (newsImages[news.disasterType] || newsImages.flood);

  return (
    <div className="h-full overflow-y-auto bg-background pb-6">
      {/* Header */}
      <div className="px-4 pt-6 pb-3">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Overview</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Global & regional disaster intelligence
        </p>
      </div>

      {/* Hero Local News */}
      {localNews.length > 0 && (
        <section className="px-4 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <Newspaper className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">
              {countryFlags[preferences.country]} Local Updates
            </h2>
          </div>
          {/* Hero card for first local news */}
          <button
            onClick={() => setSelectedNews(localNews[0])}
            className="w-full rounded-2xl overflow-hidden bg-card border border-border text-left"
          >
            <div className="relative h-44 w-full">
              <img
                src={getNewsImage(localNews[0])}
                alt={localNews[0].title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-bold text-primary-foreground mb-1.5">
                  <AlertTriangle className="h-3 w-3" /> BREAKING
                </span>
                <h3 className="text-sm font-bold text-white line-clamp-2">{localNews[0].title}</h3>
                <p className="text-[11px] text-white/70 mt-0.5">{localNews[0].source} • {localNews[0].date}</p>
              </div>
            </div>
          </button>
          {/* Remaining local news as smaller cards */}
          {localNews.length > 1 && (
            <div className="space-y-2 mt-2">
              {localNews.slice(1).map(news => (
                <button
                  key={news.id}
                  onClick={() => setSelectedNews(news)}
                  className="w-full flex gap-3 rounded-xl bg-card border border-border p-2 text-left"
                >
                  <img
                    src={getNewsImage(news)}
                    alt={news.title}
                    className="h-16 w-20 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 py-0.5">
                    <h3 className="text-xs font-semibold text-foreground line-clamp-2">{news.title}</h3>
                    <p className="text-[10px] text-muted-foreground mt-1">{news.source} • {news.date}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Risk Forecast — Horizontal Scroll */}
      <section className="mt-6">
        <div className="flex items-center gap-2 mb-3 px-4">
          <Activity className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Risk Forecast</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory">
          {sortedStatuses.filter(s => s.prediction).slice(0, 6).map(s => (
            <div
              key={s.country}
              className="shrink-0 w-36 snap-start rounded-2xl p-3 border border-border relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${zoneColors[s.alertLevel]}15, ${zoneColors[s.alertLevel]}05)`,
              }}
            >
              <div className="absolute top-0 right-0 h-12 w-12 rounded-bl-full opacity-20"
                style={{ background: zoneColors[s.alertLevel] }} />
              <span className="text-2xl">{countryFlags[s.country]}</span>
              <p className="text-xs font-bold text-foreground mt-1.5">{s.country}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: zoneColors[s.alertLevel] }} />
                <span className="text-[10px] font-semibold" style={{ color: zoneColors[s.alertLevel] }}>
                  {zoneLabels[s.alertLevel]}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 line-clamp-3 leading-relaxed">{s.prediction}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ASEAN Country Status Grid */}
      <section className="px-4 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">ASEAN Status</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {sortedStatuses.map(status => (
            <button
              key={status.country}
              onClick={() => navigate(`/country/${encodeURIComponent(status.country)}`)}
              className="rounded-xl bg-card border border-border p-3 text-left hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{countryFlags[status.country]}</span>
                <span className="text-xs font-medium text-foreground">{status.country}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ background: zoneColors[status.alertLevel] }} />
                <span className="text-[10px] font-semibold" style={{ color: zoneColors[status.alertLevel] }}>
                  {zoneLabels[status.alertLevel]}
                </span>
              </div>
              {status.activeDisasters > 0 && (
                <p className="text-[10px] text-muted-foreground mt-1">
                  {status.activeDisasters} disaster{status.activeDisasters > 1 ? 's' : ''} • {status.affectedPopulation.toLocaleString()} affected
                </p>
              )}
              <div className="flex items-center gap-1 mt-1.5 text-primary">
                <span className="text-[10px] font-medium">Details</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Global News */}
      <section className="mt-6 bg-secondary/50 py-5">
        <div className="flex items-center gap-2 mb-3 px-4">
          <Globe className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Global Alerts</h2>
        </div>
        <div className="space-y-2 px-4">
          {globalNews.map(news => (
            <button
              key={news.id}
              onClick={() => setSelectedNews(news)}
              className="w-full flex gap-3 rounded-xl bg-card border border-border p-2 text-left"
            >
              <img
                src={getNewsImage(news)}
                alt={news.title}
                className="h-16 w-20 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0 py-0.5">
                <h3 className="text-xs font-semibold text-foreground line-clamp-2">{news.title}</h3>
                <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{news.summary}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{news.source} • {news.date}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Survival Guide */}
      <section className="px-4 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Quick Survival Guide</h2>
        </div>
        <div className="space-y-2">
          {survivalTips.map(tip => (
            <button
              key={tip.id}
              onClick={() => navigate(`/guide/${tip.id}`)}
              className="w-full flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left hover:border-primary/30 transition-colors"
            >
              <span className="text-2xl">{tip.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{tip.title}</p>
                <p className="text-[10px] text-muted-foreground">{tip.description}</p>
              </div>
              <div className="flex items-center gap-1 text-primary shrink-0">
                <ExternalLink className="h-3.5 w-3.5" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* News Detail Bottom Sheet */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedNews(null)} />
          <div className="relative w-full rounded-t-2xl bg-card border-t border-border max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom">
            <img
              src={getNewsImage(selectedNews)}
              alt={selectedNews.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="text-[10px] text-muted-foreground">{selectedNews.source} • {selectedNews.date}</span>
                  <h2 className="text-lg font-bold text-foreground mt-1">{selectedNews.title}</h2>
                </div>
                <button onClick={() => setSelectedNews(null)} className="p-1 rounded-lg hover:bg-accent shrink-0 ml-2">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{selectedNews.summary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
