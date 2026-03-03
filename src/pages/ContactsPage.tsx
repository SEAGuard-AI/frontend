import { emergencyContacts, type EmergencyContact } from '@/data/mockData';
import { Phone, Search, Shield, Ambulance, BadgeAlert, Flame, Building2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const categoryIcons: Record<EmergencyContact['category'], typeof Shield> = {
  sar: Shield,
  ambulance: Ambulance,
  police: BadgeAlert,
  fire: Flame,
  hospital: Building2,
};

const categoryLabels: Record<EmergencyContact['category'], string> = {
  sar: 'SAR Team',
  ambulance: 'Ambulance',
  police: 'Police',
  fire: 'Fire Dept',
  hospital: 'Hospital',
};

const ContactsPage = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<EmergencyContact['category'] | 'all'>('all');

  const filtered = emergencyContacts.filter(c => {
    const matchCategory = activeCategory === 'all' || c.category === activeCategory;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold text-foreground">Emergency Contacts</h1>
        <p className="text-sm text-muted-foreground mt-1">One-tap emergency call</p>
      </div>

      {/* SOS Button */}
      <div className="px-4 mb-4">
        <Button
          className="w-full h-14 text-lg font-bold rounded-2xl animate-pulse-emergency gap-2 shadow-clay"
          onClick={() => window.open('tel:112')}
        >
          <AlertTriangle className="h-5 w-5" />
          SOS — EMERGENCY
        </Button>
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl bg-card shadow-clay-inset px-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 mb-4 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={cn(
            'shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-all',
            activeCategory === 'all' ? 'bg-primary/15 text-primary shadow-clay-sm' : 'bg-card shadow-clay-sm text-muted-foreground hover:shadow-clay'
          )}
        >
          All
        </button>
        {(Object.keys(categoryLabels) as EmergencyContact['category'][]).map(cat => {
          const Icon = categoryIcons[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
              'shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1',
              activeCategory === cat ? 'bg-primary/15 text-primary shadow-clay-sm' : 'bg-card shadow-clay-sm text-muted-foreground hover:shadow-clay'
            )}
            >
              <Icon className="h-3 w-3" />
              {categoryLabels[cat]}
            </button>
          );
        })}
      </div>

      {/* Contact List */}
      <div className="px-4 pb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {filtered.map(contact => {
          const Icon = categoryIcons[contact.category];
          return (
            <div key={contact.id} className="flex items-center gap-3 rounded-2xl bg-card shadow-clay-sm p-3 transition-all hover:-translate-y-0.5 hover:shadow-clay">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary shadow-clay-inset">
                <Icon className="h-5 w-5 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{contact.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{contact.distance}</span>
                  <span className={cn(
                    'text-[10px] font-medium px-1.5 py-0.5 rounded-full',
                    contact.status === 'active' ? 'bg-zone-evacuation/20 text-zone-evacuation' : 'bg-zone-danger/20 text-zone-danger'
                  )}>
                    {contact.status}
                  </span>
                </div>
              </div>
              <a
                href={`tel:${contact.phone}`}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shrink-0 shadow-clay-sm transition-all hover:shadow-clay hover:-translate-y-0.5 active:shadow-clay-pressed"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
};

export default ContactsPage;
