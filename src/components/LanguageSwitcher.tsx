import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";

interface LanguageSwitcherProps {
  variant?: "button" | "select";
  className?: string;
}

export function LanguageSwitcher({ variant = "select", className = "" }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();

  if (variant === "button") {
    return (
      <div className={`flex gap-1 ${className}`}>
        <Button
          variant={language === 'en' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setLanguage('en')}
          className="text-xs"
        >
          EN
        </Button>
        <Button
          variant={language === 'hi' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setLanguage('hi')}
          className="text-xs"
        >
          HI
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Languages className="h-4 w-4 text-muted-foreground" />
      <Select value={language} onValueChange={(value: 'en' | 'hi') => setLanguage(value)}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t('language.english')}</SelectItem>
          <SelectItem value="hi">{t('language.hindi')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
