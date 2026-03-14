import React, { useState } from 'react';
import { LanguageCode, LANGUAGES, SUPPORTED_LANGUAGES } from '@/config/languages';
import { Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LanguageButtonProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'secondary';
}

export const LanguageButton: React.FC<LanguageButtonProps> = ({
  currentLanguage,
  onLanguageChange,
  disabled = false,
  variant = 'outline',
}) => {
  const currentLang = LANGUAGES[currentLanguage];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Globe className="w-4 h-4" />
          <span>{currentLang.name}</span>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* English Section */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-gray-500">International</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onLanguageChange('en')}
            className={currentLanguage === 'en' ? 'bg-blue-50' : ''}
          >
            <span className="flex-1">English</span>
            {currentLanguage === 'en' && <span className="text-blue-600 ml-2">✓</span>}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Indian Regional Languages */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-gray-500">Indian Regional Languages</DropdownMenuLabel>
          {SUPPORTED_LANGUAGES.filter((lang) => lang !== 'en').map((langCode) => {
            const lang = LANGUAGES[langCode];
            return (
              <DropdownMenuItem
                key={langCode}
                onClick={() => onLanguageChange(langCode)}
                className={currentLanguage === langCode ? 'bg-blue-50' : ''}
              >
                <div className="flex-1">
                  <div className="font-medium">{lang.name}</div>
                  <div className="text-xs text-gray-500">{lang.nativeName}</div>
                </div>
                {currentLanguage === langCode && <span className="text-blue-600 ml-2">✓</span>}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageButton;
