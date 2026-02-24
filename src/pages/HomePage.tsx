import { useState } from 'react';
import {
  disasterNews, countryStatuses, survivalTips, disasterReports,
  countryFlags, type CountryStatus, type DisasterNews
} from '@/data/mockData';
import { usePreferences } from '@/contexts/UserPreferencesContext';
import {
  Globe, TrendingUp, Newspaper, BookOpen, ChevronRight, AlertTriangle,
  Users, X, Droplets, Mountain, Wind, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

const disasterIcons: Record<string, string> = {
  flood: '🌊',
  landslide: '⛰️',
  earthquake: '🌍',
  typhoon: '🌀',
};

const HomePage = () => {
  const { preferences } = usePreferences();
  const [selectedCountry, setSelectedCountry] = useState<CountryStatus | null>(null);
  const [selectedNews, setSelectedNews] = useState<DisasterNews | null>(null);
  const [activeTipId, setActiveTipId] = useState<string | null>(null);

  // Filter local news based on user's country preference
  const localNews = disasterNews.filter(n => n.country === preferences.country);
  const globalNews = disasterNews.filter(n => n.isGlobal);
  const allNewsForDisplay = [...localNews, ...globalNews].slice(0, 6);

  // Sort countries: those with active disasters first
  const sortedStatuses = [...countryStatuses].sort((a, b) => b.activeDisasters - a.activeDisasters);

  return (
    <div className="h-full overflow-y-auto bg-background pb-6">
      {/* Header */}
      <div className="px-4 pt-6 pb-2">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Overview</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Global & regional disaster intelligence
        </p>
      </div>

      {/* Active Disasters Summary Bar */}
      <div className="px-4 mt-3">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {sortedStatuses.filter(s => s.activeDisasters > 0).map(s => (
            <button
              key={s.country}
              onClick={() => setSelectedCountry(s)}
              className="shrink-0 flex items-center gap-2 rounded-xl bg-card border border-border px-3 py-2"
            >
              <span className="text-lg">{countryFlags[s.country]}</span>
              <div className="text-left">
                <p className="text-xs font-medium text-foreground">{s.country}</p>
                <p className="text-[10px] font-medium" style={{ color: zoneColors[s.alertLevel] }}>
                  {s.activeDisasters} active
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Local News Section */}
      {localNews.length > 0 && (
        <section className="px-4 mt-5">
          <div className="flex items-center gap-2 mb-3">
            <Newspaper className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">
              {countryFlags[preferences.country]} Local Updates
            </h2>
          </div>
          <div className="space-y-2">
            {localNews.map(news => (
              <button
                key={news.id}
                onClick={() => setSelectedNews(news)}
                className="w-full rounded-xl bg-card border border-border p-3 text-left"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{disasterIcons[news.disasterType]}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2">{news.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{news.summary}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-muted-foreground">{news.source}</span>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span className="text-[10px] text-muted-foreground">{news.date}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Global News */}
      <section className="px-4 mt-5">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Global Alerts</h2>
        </div>
        <div className="space-y-2">
          {globalNews.map(news => (
            <button
              key={news.id}
              onClick={() => setSelectedNews(news)}
              className="w-full rounded-xl bg-card border border-border p-3 text-left"
            >
              <h3 className="text-sm font-semibold text-foreground line-clamp-2">{news.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{news.summary}</p>
              <span className="text-[10px] text-muted-foreground mt-1 block">{news.source} • {news.date}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ASEAN Country Status Grid */}
      <section className="px-4 mt-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">ASEAN Status</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {sortedStatuses.map(status => (
            <button
              key={status.country}
              onClick={() => setSelectedCountry(status)}
              className="rounded-xl bg-card border border-border p-3 text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{countryFlags[status.country]}</span>
                <span className="text-xs font-medium text-foreground">{status.country}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ background: zoneColors[status.alertLevel] }} />
                <span className="text-[10px]" style={{ color: zoneColors[status.alertLevel] }}>
                  {zoneLabels[status.alertLevel]}
                </span>
              </div>
              {status.activeDisasters > 0 && (
                <p className="text-[10px] text-muted-foreground mt-1">
                  {status.activeDisasters} disaster{status.activeDisasters > 1 ? 's' : ''} • {status.affectedPopulation.toLocaleString()} affected
                </p>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Predictions */}
      <section className="px-4 mt-5">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Risk Forecast</h2>
        </div>
        <div className="space-y-2">
          {sortedStatuses.filter(s => s.prediction).slice(0, 4).map(s => (
            <div key={s.country} className="rounded-xl bg-card border border-border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span>{countryFlags[s.country]}</span>
                <span className="text-xs font-medium text-foreground">{s.country}</span>
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: zoneColors[s.alertLevel] }} />
              </div>
              <p className="text-xs text-muted-foreground">{s.prediction}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Survival Tips — Contextual E-Learning */}
      <section className="px-4 mt-5">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Quick Survival Guide</h2>
        </div>
        <div className="space-y-2">
          {survivalTips.map(tip => (
            <div key={tip.id}>
              <button
                onClick={() => setActiveTipId(activeTipId === tip.id ? null : tip.id)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-colors',
                  activeTipId === tip.id ? 'bg-primary/5 border-primary/30' : 'bg-card border-border'
                )}
              >
                <span className="text-2xl">{tip.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{tip.title}</p>
                  <p className="text-[10px] text-muted-foreground">{tip.description}</p>
                </div>
                <ChevronRight className={cn('h-4 w-4 text-muted-foreground transition-transform', activeTipId === tip.id && 'rotate-90')} />
              </button>
              {activeTipId === tip.id && (
                <div className="mt-1 ml-4 rounded-xl bg-card border border-border p-3 space-y-2">
                  {tip.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-primary text-xs font-bold mt-0.5">{i + 1}.</span>
                      <p className="text-xs text-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Country Detail Bottom Sheet */}
      {selectedCountry && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedCountry(null)} />
          <div className="relative w-full rounded-t-2xl bg-card border-t border-border p-4 space-y-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{countryFlags[selectedCountry.country]}</span>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{selectedCountry.country}</h2>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ background: zoneColors[selectedCountry.alertLevel] }} />
                    <span className="text-xs" style={{ color: zoneColors[selectedCountry.alertLevel] }}>
                      {zoneLabels[selectedCountry.alertLevel]}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedCountry(null)} className="p-1 rounded-lg hover:bg-accent">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-secondary p-3 text-center">
                <AlertTriangle className="h-5 w-5 mx-auto text-zone-danger mb-1" />
                <p className="text-lg font-bold text-foreground">{selectedCountry.activeDisasters}</p>
                <p className="text-[10px] text-muted-foreground">Active Disasters</p>
              </div>
              <div className="rounded-xl bg-secondary p-3 text-center">
                <Users className="h-5 w-5 mx-auto text-zone-caution mb-1" />
                <p className="text-lg font-bold text-foreground">{selectedCountry.affectedPopulation.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">People Affected</p>
              </div>
            </div>

            {/* Recent Events */}
            {selectedCountry.recentEvents.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Recent Events</p>
                <div className="space-y-1">
                  {selectedCountry.recentEvents.map((evt, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg bg-secondary p-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-zone-danger" />
                      <span className="text-xs text-foreground">{evt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prediction */}
            <div className="rounded-xl bg-secondary p-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Risk Forecast</p>
              <p className="text-xs text-foreground">{selectedCountry.prediction}</p>
            </div>

            {/* Reports for this country */}
            {disasterReports.filter(r => r.country === selectedCountry.country).map(report => (
              <div key={report.id} className="rounded-xl border border-border p-3 space-y-2">
                <h3 className="text-sm font-semibold text-foreground">{report.title}</h3>
                <p className="text-xs text-muted-foreground">{report.summary}</p>
                <div className="space-y-1">
                  {report.timeline.map((t, i) => (
                    <div key={i} className="flex gap-2 text-[11px]">
                      <span className="text-muted-foreground font-mono shrink-0">{t.time}</span>
                      <span className="text-foreground">{t.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* News Detail */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedNews(null)} />
          <div className="relative w-full rounded-t-2xl bg-card border-t border-border p-4 space-y-3 max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom">
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
            <div className="rounded-xl bg-secondary h-40 flex items-center justify-center border border-border">
              <p className="text-xs text-muted-foreground">📹 Media coverage — {selectedNews.title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
