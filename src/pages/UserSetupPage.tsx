import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aseanCountries, aseanLanguages, countryFlags } from '@/data/mockData';
import { usePreferences } from '@/contexts/UserPreferencesContext';
import { Globe, Languages, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const UserSetupPage = () => {
  const navigate = useNavigate();
  const { setCountry, setLanguage, completeSetup } = usePreferences();
  const [step, setStep] = useState<'country' | 'language'>('country');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setCountry(country);
    // Auto-select the default language for this country
    const lang = aseanLanguages[country];
    if (lang) {
      setSelectedLanguage(lang.name);
      setLanguage(lang.name);
    }
  };

  const handleContinue = () => {
    if (step === 'country' && selectedCountry) {
      setStep('language');
    } else if (step === 'language' && selectedLanguage) {
      completeSetup();
      navigate('/');
    }
  };

  // Collect all unique languages + English
  const allLanguages = [
    { name: 'English', nativeName: 'English' },
    ...Object.values(aseanLanguages).filter(
      (l, i, arr) => l.name !== 'English' && arr.findIndex(a => a.name === l.name) === i
    ),
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 py-8">
      {/* Header */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2">
          {step === 'country' ? (
            <Globe className="h-5 w-5 text-primary" />
          ) : (
            <Languages className="h-5 w-5 text-primary" />
          )}
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Step {step === 'country' ? '1' : '2'} of 2
          </span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          {step === 'country' ? 'Where are you from?' : 'Preferred Language'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {step === 'country'
            ? 'This helps us show relevant local disaster information and emergency contacts.'
            : 'Choose the language for displaying content in the app.'}
        </p>
      </div>

      {/* Options */}
      <div className="flex-1 space-y-2 overflow-y-auto pb-4">
        {step === 'country' ? (
          aseanCountries.map(country => (
            <button
              key={country}
              onClick={() => handleCountrySelect(country)}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl border p-4 text-left transition-colors',
                selectedCountry === country
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:bg-accent'
              )}
            >
              <span className="text-2xl">{countryFlags[country]}</span>
              <span className="flex-1 text-sm font-medium text-foreground">{country}</span>
              {selectedCountry === country && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </button>
          ))
        ) : (
          allLanguages.map(lang => (
            <button
              key={lang.name}
              onClick={() => { setSelectedLanguage(lang.name); setLanguage(lang.name); }}
              className={cn(
                'w-full flex items-center justify-between rounded-xl border p-4 text-left transition-colors',
                selectedLanguage === lang.name
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:bg-accent'
              )}
            >
              <div>
                <p className="text-sm font-medium text-foreground">{lang.name}</p>
                <p className="text-xs text-muted-foreground">{lang.nativeName}</p>
              </div>
              {selectedLanguage === lang.name && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </button>
          ))
        )}
      </div>

      {/* Continue */}
      <Button
        onClick={handleContinue}
        disabled={step === 'country' ? !selectedCountry : !selectedLanguage}
        className="w-full h-14 text-base font-semibold rounded-xl gap-2 mt-4"
      >
        {step === 'language' ? 'Start Using ADRRS' : 'Continue'}
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default UserSetupPage;
