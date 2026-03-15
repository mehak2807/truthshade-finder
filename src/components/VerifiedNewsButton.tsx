import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, RefreshCw } from "lucide-react";
import {
  verifiedNewsService,
  VerifiedNews,
} from "../services/verifiedNewsService";
import { motion } from "framer-motion";

interface VerifiedNewsButtonProps {
  onNewsClick?: () => void;
}

export const VerifiedNewsButton: React.FC<VerifiedNewsButtonProps> = ({
  onNewsClick,
}) => {
  const navigate = useNavigate();
  const [newsCount, setNewsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [latestNews, setLatestNews] = useState<VerifiedNews | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const newsData = await verifiedNewsService.getVerifiedNews();
        setNewsCount(newsData.length);
        if (newsData.length > 0) {
          setLatestNews(newsData[0]);
        }
      } catch (error) {
        console.error("Error fetching news count:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();

    // Refresh every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    onNewsClick?.();
    navigate("/verified-news");
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="relative flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold button-ghost group transition-all"
      title={latestNews ? latestNews.title : "Verified News"}
    >
      <div className="relative flex items-center gap-1.5">
        {isLoading ? (
          <RefreshCw className="h-4 w-4 text-cyan-400 animate-spin" />
        ) : (
          <>
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-cyan-300">
              {newsCount > 0 ? `${newsCount} News` : "No News"}
            </span>
          </>
        )}
      </div>

      {/* Badge for unread/latest */}
      {newsCount > 0 && !isLoading && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white"
        >
          {newsCount > 9 ? "9+" : newsCount}
        </motion.div>
      )}

      {/* Tooltip on hover */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        <div className="bg-slate-900 border border-cyan-500/30 rounded-lg px-2 py-1 text-[10px] text-slate-300 whitespace-nowrap">
          {latestNews
            ? `Latest: ${latestNews.title.substring(0, 40)}...`
            : "No verified news"}
        </div>
      </div>
    </motion.button>
  );
};
