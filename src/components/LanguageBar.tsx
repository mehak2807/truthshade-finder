import React from 'react';
import { LanguageCode, LANGUAGES, LANGUAGE_PRIORITY } from '@/config/languages';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface LanguageBarProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
  disabled?: boolean;
  showQuickSelect?: boolean;
  maxQuickSelectItems?: number;
}

export const LanguageBar: React.FC<LanguageBarProps> = ({
  currentLanguage,
  onLanguageChange,
  disabled = false,
  showQuickSelect = true,
  maxQuickSelectItems = 5,
}) => {
  const quickSelectLanguages = LANGUAGE_PRIORITY.slice(0, maxQuickSelectItems);
  const currentLang = LANGUAGES[currentLanguage];

  return (
    <div className="flex items-center gap-2 p-3 rounded-xl glass-panel border border-white/30 shadow-glow-md">
      {/* Globe Icon + Label */}
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Globe className="w-5 h-5 text-cyber-cyan" />
        <span>Analyze in:</span>
      </div>

      {/* Quick Select Buttons */}
      {showQuickSelect && (
        <div className="flex gap-2 flex-wrap">
          {quickSelectLanguages.map((langCode) => {
            const lang = LANGUAGES[langCode];
            const isSelected = currentLanguage === langCode;
            return (
              <Button
                key={langCode}
                onClick={() => onLanguageChange(langCode)}
                disabled={disabled}
                variant="outline"
                size="sm"
                className={`transition-all ${
                  isSelected
                    ? 'bg-primary/20 border border-cyber-cyan/50 text-cyber-cyan shadow-glow-md hover:bg-primary/25'
                    : 'bg-transparent border-white/25 text-muted-foreground hover:text-foreground hover:border-white/45 hover:bg-white/5'
                }`}
                title={lang.nativeName}
              >
                {lang.name}
              </Button>
            );
          })}

          {/* More Languages Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-white/25 text-muted-foreground hover:text-foreground hover:border-white/45 hover:bg-white/5"
              >
                +More
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 bg-[#0f1826]/95 border-l border-white/20 backdrop-blur-xl text-foreground">
              <SheetHeader>
                <SheetTitle>Select Language</SheetTitle>
                <SheetDescription>
                  Choose from 10 regional languages to analyze content
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-3 mt-6">
                {/* Current Selection */}
                <div className="p-3 rounded-lg glass-panel-alt border border-white/25">
                  <p className="text-sm text-muted-foreground">Current Language</p>
                  <p className="text-lg font-semibold text-foreground">{currentLang.name}</p>
                  <p className="text-sm text-foreground/80">{currentLang.nativeName}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ~{currentLang.speakers}M speakers
                  </p>
                </div>

                {/* All Languages */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-3">All Languages</p>
                  <div className="grid grid-cols-2 gap-2">
                    {LANGUAGE_PRIORITY.map((langCode) => {
                      const lang = LANGUAGES[langCode];
                      const isSelected = currentLanguage === langCode;
                      return (
                        <button
                          key={langCode}
                          onClick={() => onLanguageChange(langCode)}
                          disabled={disabled}
                          className={`p-3 rounded-lg text-left transition-all ${
                            isSelected
                              ? 'bg-primary/20 border border-cyber-cyan/50 text-cyber-cyan shadow-glow-md'
                              : 'glass-panel-alt border border-white/20 hover:border-white/40 text-foreground'
                          }`}
                        >
                          <div className="font-medium text-sm">{lang.name}</div>
                          <div className={`text-xs ${isSelected ? 'text-cyber-cyan/80' : 'text-muted-foreground'}`}>
                            {lang.nativeName}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 rounded-lg border border-warn-yellow/40 bg-warn-yellow/10">
                  <p className="text-xs text-warn-yellow">
                    💡 <strong>Tip:</strong> AI automatically detects the language of your input text.
                    Select your preferred language for the analysis report.
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Current Language Info */}
      <div className="ml-auto text-right hidden sm:block">
        <p className="text-xs text-muted-foreground">Current:</p>
        <p className="font-semibold text-foreground">{currentLang.nativeName}</p>
      </div>
    </div>
  );
};

export default LanguageBar;
