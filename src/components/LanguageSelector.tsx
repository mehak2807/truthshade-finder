import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LanguageCode, LANGUAGES, SUPPORTED_LANGUAGES } from '@/config/languages';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
  disabled?: boolean;
  showNative?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  disabled = false,
  showNative = true,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-blue-600" />
      <Select value={currentLanguage} onValueChange={onLanguageChange} disabled={disabled}>
        <SelectTrigger className="w-full md:w-64">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_LANGUAGES.map((langCode) => {
            const lang = LANGUAGES[langCode];
            return (
              <SelectItem key={langCode} value={langCode}>
                {showNative ? `${lang.name} (${lang.nativeName})` : lang.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
