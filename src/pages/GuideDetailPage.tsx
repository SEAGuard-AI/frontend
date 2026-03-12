import { useNavigate, useParams } from 'react-router-dom';
import { survivalTips } from '@/data/mockData';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stepImages: Record<string, string[]> = {
  's1': [
    'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=500&h=280&fit=crop',
    'https://images.unsplash.com/photo-1559060017-445fb9722f2a?w=500&h=280&fit=crop',
    'https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=500&h=280&fit=crop',
    'https://images.unsplash.com/photo-1573152143286-0c422b4d2175?w=500&h=280&fit=crop',
    'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=500&h=280&fit=crop',
  ],
  's2': [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=280&fit=crop',
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=500&h=280&fit=crop',
    'https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=500&h=280&fit=crop',
    'https://images.unsplash.com/photo-1573152143286-0c422b4d2175?w=500&h=280&fit=crop',
    'https://images.unsplash.com/photo-1559060017-445fb9722f2a?w=500&h=280&fit=crop',
  ],
  's3': [
    'https://images.unsplash.com/photo-1509803874385-db7c23652552?w=500&h=280&fit=crop',
    'https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=500&h=280&fit=crop',
    'https://images.unsplash.com/photo-1573152143286-0c422b4d2175?w=500&h=280&fit=crop',
    'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=500&h=280&fit=crop',
    'https://images.unsplash.com/photo-1559060017-445fb9722f2a?w=500&h=280&fit=crop',
  ],
  's4': [
    'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=500&h=280&fit=crop',
    'https://images.unsplash.com/photo-1573152143286-0c422b4d2175?w=500&h=280&fit=crop',
    'https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=500&h=280&fit=crop',
    'https://images.unsplash.com/photo-1559060017-445fb9722f2a?w=500&h=280&fit=crop',
    'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=500&h=280&fit=crop',
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=500&h=280&fit=crop',
  ],
};

const GuideDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const guide = survivalTips.find(t => t.id === id);

  if (!guide) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background p-4">
        <p className="text-muted-foreground">Guide not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const images = stepImages[guide.id] || [];

  return (
    <div className="h-full overflow-y-auto px-4 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 bg-card mt-4 rounded-xl pt-4 pb-3 border-b ">
        <button onClick={() => navigate(-1)} className="p-1 rounded-lg hover:bg-accent">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <span className="text-2xl">{guide.icon}</span>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">{guide.title}</h1>
          <p className="text-xs text-muted-foreground">{guide.description}</p>
        </div>
      </div>

      {/* Steps — WikiHow style */}
      <div className="px-4 mt-4 space-y-5">
        {guide.steps.map((step, i) => (
          <div key={i} className="rounded-2xl bg-card border border-border overflow-hidden">
            {/* Step image */}
            {images[i] && (
              <img
                src={images[i]}
                alt={`Step ${i + 1}`}
                className="w-full h-40 object-cover"
              />
            )}
            {/* Step content */}
            <div className="p-4 flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {i + 1}
              </div>
              <p className="text-sm text-foreground leading-relaxed pt-0.5">{step}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom tip */}
      <div className="px-4 mt-6">
        <div className="rounded-xl bg-primary/10 border border-primary/20 p-3">
          <p className="text-xs text-primary font-medium text-center">
            💡 Share this guide with your family & neighbors to help them stay safe
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuideDetailPage;
