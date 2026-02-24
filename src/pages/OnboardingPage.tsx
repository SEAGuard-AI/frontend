import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Map, Bell, Navigation, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    icon: Shield,
    title: 'ADRRS',
    subtitle: 'ASEAN Disaster Response & Recovery System',
    description: 'Real-time disaster monitoring, early warnings, and guided evacuation — designed to protect communities across Southeast Asia.',
    accent: 'text-primary',
  },
  {
    icon: Map,
    title: 'Live Disaster Map',
    subtitle: 'See what\'s happening around you',
    description: 'Color-coded zones show danger areas and evacuation points. Drone-detected population clusters help rescue teams find you faster.',
    accent: 'text-zone-danger',
  },
  {
    icon: Bell,
    title: 'Early Warnings',
    subtitle: 'Stay one step ahead',
    description: 'Receive instant alerts with clear action steps — from monitoring updates to urgent evacuation orders.',
    accent: 'text-zone-caution',
  },
  {
    icon: Navigation,
    title: 'AR Evacuation Guide',
    subtitle: 'Follow the safest path',
    description: 'Camera-based augmented reality overlays safe routes and danger zones directly on your screen — guiding you to safety even in chaos.',
    accent: 'text-zone-evacuation',
  },
];

const OnboardingPage = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const touchStartX = useRef<number | null>(null);

  const isLast = current === slides.length - 1;
  const slide = slides[current];
  const Icon = slide.icon;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && current < slides.length - 1) {
        setCurrent(c => c + 1);
      } else if (diff < 0 && current > 0) {
        setCurrent(c => c - 1);
      }
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="flex min-h-screen flex-col bg-background px-6 py-12 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 transition-opacity duration-300">
        <div className={`flex h-24 w-24 items-center justify-center rounded-3xl bg-card border border-border ${slide.accent}`}>
          <Icon className="h-12 w-12" />
        </div>
        <div className="space-y-3 max-w-xs">
          <h1 className="text-3xl font-bold text-foreground">{slide.title}</h1>
          <p className={`text-sm font-medium ${slide.accent}`}>{slide.subtitle}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{slide.description}</p>
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {isLast ? (
          <Button
            onClick={() => navigate('/login')}
            className="w-full h-14 text-base font-bold rounded-xl gap-2"
          >
            Get Started
            <ChevronRight className="h-5 w-5" />
          </Button>
        ) : (
          <>
            <Button
              onClick={() => setCurrent(c => c + 1)}
              className="w-full h-14 text-base font-semibold rounded-xl gap-2"
            >
              Next
              <ChevronRight className="h-5 w-5" />
            </Button>
            <button
              onClick={() => navigate('/login')}
              className="w-full text-sm text-muted-foreground py-2"
            >
              Skip
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
