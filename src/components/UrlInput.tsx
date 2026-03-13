import { useState } from "react";
import { Globe, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UrlInputProps {
  onTextExtracted: (text: string) => void;
  isExtracting: boolean;
  setIsExtracting: (v: boolean) => void;
}

const UrlInput = ({ onTextExtracted, isExtracting, setIsExtracting }: UrlInputProps) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    setError(null);
    setIsExtracting(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("fetch-url", {
        body: { url: trimmed },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);
      if (data?.text) {
        onTextExtracted(data.text);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch URL content.");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="space-y-3 p-4 pb-2">
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/article"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            disabled={isExtracting}
            onKeyDown={(e) => e.key === "Enter" && handleFetch()}
          />
        </div>
        <button
          onClick={handleFetch}
          disabled={isExtracting || !url.trim()}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExtracting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fetch"}
        </button>
      </div>
      {error && <p className="text-xs text-trust-misinformation">{error}</p>}
    </div>
  );
};

export default UrlInput;
