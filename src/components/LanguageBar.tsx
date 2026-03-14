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
    <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      {/* Globe Icon + Label */}
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <Globe className="w-5 h-5 text-blue-600" />
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
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                className={`transition-all ${
                  isSelected
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'hover:bg-blue-100'
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
                className="hover:bg-blue-100"
              >
                +More
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80">
              <SheetHeader>
                <SheetTitle>Select Language</SheetTitle>
                <SheetDescription>
                  Choose from 10 regional languages to analyze content
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-3 mt-6">
                {/* Current Selection */}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600">Current Language</p>
                  <p className="text-lg font-semibold text-blue-900">{currentLang.name}</p>
                  <p className="text-sm text-gray-500">{currentLang.nativeName}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    ~{currentLang.speakers}M speakers
                  </p>
                </div>

                {/* All Languages */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">All Languages</p>
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
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                          }`}
                        >
                          <div className="font-medium text-sm">{lang.name}</div>
                          <div className={`text-xs ${isSelected ? 'text-blue-100' : 'text-gray-600'}`}>
                            {lang.nativeName}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-900">
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
        <p className="text-xs text-gray-500">Current:</p>
        <p className="font-semibold text-gray-900">{currentLang.nativeName}</p>
      </div>
    </div>
  );
};

export default LanguageBar;
