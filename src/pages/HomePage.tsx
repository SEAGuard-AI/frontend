import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  countryFlags,
  aseanCountries,
} from '@/data/mockData';
import { usePreferences } from '@/contexts/UserPreferencesContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { dashboardApi, type CountryStatusItem, type DisasterNewsItem } from '@/lib/api';
import {
  Globe, TrendingUp, Newspaper, BookOpen, ChevronRight,
  Activity, ExternalLink, AlertTriangle
} from 'lucide-react';

const zoneColors: Record<string, string> = {
  evacuation: 'hsl(var(--zone-evacuation))',
  caution: 'hsl(var(--zone-caution))',
  danger: 'hsl(var(--zone-danger))',
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
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    data: localNews = [],
    isLoading: isLocalNewsLoading,
    isError: isLocalNewsError,
  } = useQuery({
    queryKey: ['dashboard', 'news', 'local', preferences.country],
    queryFn: () => dashboardApi.getLocalNews(preferences.country),
    enabled: Boolean(preferences.country),
  });

  const {
    data: globalNews = [],
    isLoading: isGlobalNewsLoading,
    isError: isGlobalNewsError,
  } = useQuery({
    queryKey: ['dashboard', 'news', 'global'],
    queryFn: () => dashboardApi.getGlobalNews(),
  });

  const {
    data: countryStatuses = [],
    isLoading: isCountryStatusesLoading,
    isError: isCountryStatusesError,
  } = useQuery({
    queryKey: ['dashboard', 'countries'],
    queryFn: () => dashboardApi.getCountryStatuses(),
  });

  const {
    data: survivalTips = [],
    isLoading: isSurvivalTipsLoading,
    isError: isSurvivalTipsError,
  } = useQuery({
    queryKey: ['dashboard', 'guides', 'survival'],
    queryFn: () => dashboardApi.getSurvivalTips(),
  });

  const sortedStatuses = [...countryStatuses].sort((a, b) => b.activeDisasters - a.activeDisasters);
  const aseanCountrySet = new Set<string>(aseanCountries);
  const aseanRegionalNews = globalNews.filter((news) => aseanCountrySet.has(news.country));

  const getNewsImage = (news: DisasterNewsItem) => {
    const typeKey = news.disasterType as keyof typeof newsImages;
    return news.imageUrl !== '/placeholder.svg'
      ? news.imageUrl
      : (news.isGlobal ? newsImages.global : (newsImages[typeKey] || newsImages.flood));
  };

  const openNews = (news: DisasterNewsItem) => {
    if (news.sourceUrl) {
      window.open(news.sourceUrl, '_blank');
    } else {
      navigate(`/news/${news.id}`);
    }
  };

  const getZoneLabel = (level: string) => {
    if (level === 'evacuation') return t('stable');
    if (level === 'caution') return t('caution');
    return t('critical');
  };

  const getZoneColor = (level: string) => zoneColors[level] || 'hsl(var(--muted-foreground))';
  const forecastStatuses = sortedStatuses.filter((s) => s.prediction).slice(0, 6);

  return (
    <div className="h-full overflow-y-auto pb-6">
      <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="px-4 pt-6 pb-3">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">{t('overview')}</h1>
        </div>
      </div>

      {/* Hero Local News */}
      {(isLocalNewsLoading || isLocalNewsError || localNews.length > 0) && (
        <section className="px-4 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <Newspaper className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">
              {countryFlags[preferences.country] || '🏳️'} {t('local_updates')}
            </h2>
          </div>
          {isLocalNewsLoading && (
            <div className="w-full clay-lg h-44 animate-pulse bg-card/70" />
          )}
          {isLocalNewsError && !isLocalNewsLoading && (
            <div className="w-full clay-sm p-4 text-xs text-muted-foreground">
              Failed to load local updates.
            </div>
          )}
          {!isLocalNewsLoading && !isLocalNewsError && localNews.length > 0 && (
            <>
              <button
                onClick={() => openNews(localNews[0])}
                className="w-full clay-lg overflow-hidden text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-clay-lg active:animate-clay-bounce"
              >
                <div className="relative h-44 w-full">
                  <img src={getNewsImage(localNews[0])} alt={localNews[0].title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-bold text-primary-foreground mb-1.5">
                      <AlertTriangle className="h-3 w-3" /> {t('breaking')}
                    </span>
                    <h3 className="text-sm font-bold text-white line-clamp-2">{localNews[0].title}</h3>
                    <p className="text-[11px] text-white/70 mt-0.5">{localNews[0].source} • {localNews[0].date}</p>
                  </div>
                </div>
              </button>
              {localNews.length > 1 && (
                <div className="space-y-2 mt-2">
                  {localNews.slice(1).map((news, i) => (
                    <button
                      key={news.id}
                      onClick={() => openNews(news)}
                      className="w-full flex gap-3 clay-sm p-2.5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-clay active:animate-clay-bounce animate-fade-in"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <img src={getNewsImage(news)} alt={news.title} className="h-16 w-20 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0 py-0.5">
                        <h3 className="text-xs font-semibold text-foreground line-clamp-2">{news.title}</h3>
                        <p className="text-[10px] text-muted-foreground mt-1">{news.source} • {news.date}</p>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-1" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
          {!isLocalNewsLoading && !isLocalNewsError && localNews.length === 0 && (
            <div className="w-full clay-sm p-4 text-xs text-muted-foreground">
              No local updates available yet.
            </div>
          )}
        </section>
      )}

      {/* Risk Forecast — Horizontal Scroll */}
      <section className="mt-6">
        <div className="flex items-center gap-2 mb-3 px-4">
          <Activity className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">{t('risk_forecast')}</h2>
        </div>
        {isCountryStatusesLoading && (
          <div className="flex gap-3 overflow-x-auto px-4 pb-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="shrink-0 w-36 h-36 clay-sm animate-pulse bg-card/70" />
            ))}
          </div>
        )}
        {isCountryStatusesError && !isCountryStatusesLoading && (
          <div className="px-4">
            <div className="w-full clay-sm p-4 text-xs text-muted-foreground">
              Failed to load country risk forecast.
            </div>
          </div>
        )}
        {!isCountryStatusesLoading && !isCountryStatusesError && forecastStatuses.length === 0 && (
          <div className="px-4">
            <div className="w-full clay-sm p-4 text-xs text-muted-foreground">
              No risk forecast data available yet.
            </div>
          </div>
        )}
        {!isCountryStatusesLoading && !isCountryStatusesError && forecastStatuses.length > 0 && (
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory">
            {forecastStatuses.map((s, i) => (
              <button
                key={s.id || s.country}
                onClick={() => navigate(`/country/${encodeURIComponent(s.country)}`)}
                className="shrink-0 w-36 snap-start clay-sm p-3 relative overflow-hidden text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-clay active:animate-clay-bounce animate-fade-in"
                style={{
                  background: `linear-gradient(135deg, ${getZoneColor(s.alertLevel)}15, hsl(var(--card)))`,
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <div className="absolute top-0 right-0 h-12 w-12 rounded-bl-full opacity-20"
                  style={{ background: getZoneColor(s.alertLevel) }} />
                <span className="text-2xl">{countryFlags[s.country] || '🏳️'}</span>
                <p className="text-xs font-bold text-foreground mt-1.5">{s.country}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="h-1.5 w-1.5 rounded-full" style={{ background: getZoneColor(s.alertLevel) }} />
                  <span className="text-[10px] font-semibold" style={{ color: getZoneColor(s.alertLevel) }}>
                    {getZoneLabel(s.alertLevel)}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5 line-clamp-3 leading-relaxed">{s.prediction}</p>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ASEAN Country Status Grid */}
      <section className="px-4 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">{t('asean_status')}</h2>
        </div>
        {isCountryStatusesLoading && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="clay-sm h-24 animate-pulse bg-card/70" />
            ))}
          </div>
        )}
        {isCountryStatusesError && !isCountryStatusesLoading && (
          <div className="w-full clay-sm p-4 text-xs text-muted-foreground">
            Failed to load ASEAN country status.
          </div>
        )}
        {!isCountryStatusesLoading && !isCountryStatusesError && sortedStatuses.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {sortedStatuses.map((status: CountryStatusItem, i) => (
              <button
                key={status.id || status.country}
                onClick={() => navigate(`/country/${encodeURIComponent(status.country)}`)}
                className="clay-sm p-3 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-clay active:animate-clay-bounce animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{countryFlags[status.country] || '🏳️'}</span>
                  <span className="text-xs font-medium text-foreground">{status.country}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ background: getZoneColor(status.alertLevel) }} />
                  <span className="text-[10px] font-semibold" style={{ color: getZoneColor(status.alertLevel) }}>
                    {getZoneLabel(status.alertLevel)}
                  </span>
                </div>
                {status.activeDisasters > 0 && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {status.activeDisasters} {t('active_disasters').toLowerCase()} • {status.affectedPopulation.toLocaleString()} {t('people_affected').toLowerCase()}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-1.5 text-primary">
                  <span className="text-[10px] font-medium">{t('details')}</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Global News */}
      <section className="mt-6 mx-4 clay-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">{t('global_alerts')}</h2>
        </div>
        {isGlobalNewsLoading && (
          <div className="space-y-2">
            {[1, 2].map((n) => (
              <div key={n} className="w-full h-20 rounded-xl bg-muted/50 animate-pulse" />
            ))}
          </div>
        )}
        {isGlobalNewsError && !isGlobalNewsLoading && (
          <div className="w-full rounded-xl bg-muted/50 p-4 text-xs text-muted-foreground">
            Failed to load global alerts.
          </div>
        )}
        {!isGlobalNewsLoading && !isGlobalNewsError && (
          <div className="space-y-2">
            {aseanRegionalNews.map((news, i) => (
              <button
                key={news.id}
                onClick={() => openNews(news)}
                className="w-full flex gap-3 rounded-xl bg-muted/50 p-2.5 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-accent active:animate-clay-bounce animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <img src={getNewsImage(news)} alt={news.title} className="h-16 w-20 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0 py-0.5">
                  <h3 className="text-xs font-semibold text-foreground line-clamp-2">{news.title}</h3>
                  <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{news.summary}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{news.source} • {news.date}</p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-1" />
              </button>
            ))}
            {aseanRegionalNews.length === 0 && (
              <div className="w-full rounded-xl bg-muted/50 p-4 text-xs text-muted-foreground">
                No global alerts available yet.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Survival Guide */}
      <section className="px-4 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">{t('survival_guide')}</h2>
        </div>
        {isSurvivalTipsLoading && (
          <div className="space-y-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="w-full h-16 clay-sm animate-pulse bg-card/70" />
            ))}
          </div>
        )}
        {isSurvivalTipsError && !isSurvivalTipsLoading && (
          <div className="w-full clay-sm p-4 text-xs text-muted-foreground">
            Failed to load survival guide.
          </div>
        )}
        {!isSurvivalTipsLoading && !isSurvivalTipsError && (
          <div className="space-y-2">
            {survivalTips.map((tip, i) => (
              <button
                key={tip.id}
                onClick={() => navigate(`/guide/${tip.id}`)}
                className="w-full flex items-center gap-3 clay-sm p-3 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-clay active:animate-clay-bounce animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="text-2xl">{tip.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{tip.title}</p>
                  <p className="text-[10px] text-muted-foreground">{tip.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-primary shrink-0" />
              </button>
            ))}
            {survivalTips.length === 0 && (
              <div className="w-full clay-sm p-4 text-xs text-muted-foreground">
                No survival guide data available yet.
              </div>
            )}
          </div>
        )}
      </section>
      </div>
    </div>
  );
};

export default HomePage;
