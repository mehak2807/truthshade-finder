import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ImagePlus, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  onTextExtracted: (text: string) => void;
  isExtracting: boolean;
  setIsExtracting: (v: boolean) => void;
}

const ImageUpload = ({ onTextExtracted, isExtracting, setIsExtracting }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
      setIsExtracting(true);

      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data, error: fnError } = await supabase.functions.invoke("ocr-extract", {
          body: { image: base64 },
        });

        if (fnError) throw new Error(fnError.message);
        if (data?.error) throw new Error(data.error);
        if (data?.text) {
          onTextExtracted(data.text);
        }
      } catch (err: any) {
        setError(err.message || "Failed to extract text from image.");
      } finally {
        setIsExtracting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    setPreview(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      {!preview ? (
        <motion.div
          className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-trust-glow/40 transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <ImagePlus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Drop an image or <span className="text-trust-glow">click to upload</span>
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">Screenshots, news articles, social media posts</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </motion.div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img src={preview} alt="Uploaded" className="w-full max-h-48 object-contain bg-secondary" />
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background transition-colors"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
          {isExtracting && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-trust-glow">
                <Loader2 className="w-4 h-4 animate-spin" />
                Extracting text with AI OCR...
              </div>
            </div>
          )}
        </div>
      )}
      {error && <p className="text-xs text-trust-misinformation">{error}</p>}
    </div>
  );
};

export default ImageUpload;
