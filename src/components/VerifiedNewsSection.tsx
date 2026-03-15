import React, { useState, useEffect } from "react";
import { AlertCircle, TrendingUp, RefreshCw, CheckCircle } from "lucide-react";
import {
  verifiedNewsService,
  VerifiedNews,
} from "../services/verifiedNewsService";
import { motion } from "framer-motion";

interface VerifiedNewsSectionProps {
  autoRefreshInterval?: number; // in milliseconds, default 5 minutes
}

export const VerifiedNewsSection: React.FC<VerifiedNewsSectionProps> = ({
  autoRefreshInterval = 5 * 60 * 1000, // 5 minutes default
}) => {
  const [news, setNews] = useState<VerifiedNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch verified news
  const fetchNews = async () => {
    try {
      setIsRefreshing(true);
      const newsData = await verifiedNewsService.getVerifiedNews();
      setNews(newsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching verified news:", error);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  // Initial fetch and setup auto-refresh
  useEffect(() => {
    fetchNews();

    // Set up auto-refresh interval
    const interval = setInterval(() => {
      fetchNews();
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, [autoRefreshInterval]);

  // Format time elapsed since last update
  const getTimeElapsed = (): string => {
    if (!lastUpdated) return "Just now";

    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-b from-slate-900/50 to-slate-800/30 rounded-2xl border border-cyan-500/20 p-8 backdrop-blur-xl">
        <div className="flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
          <p className="text-slate-300">Loading verified news...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-emerald-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Verified News</h2>
            <p className="text-sm text-slate-400">
              From PIB Fact Check • Updated {getTimeElapsed()}
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchNews}
          disabled={isRefreshing}
          className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500/50 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-5 h-5 text-cyan-400 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </motion.button>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/40 to-slate-800/20 backdrop-blur-md hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
          >
            {/* Background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/5 group-hover:to-purple-500/5 transition-all duration-300" />

            {/* Image */}
            {item.imageUrl && (
              <div className="relative h-32 overflow-hidden border-b border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.style.minHeight = "40px";
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />
              </div>
            )}

            {/* Content */}
            <div className="relative p-4 space-y-3">
              {/* Status Badge */}
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${verifiedNewsService.getStatusColor(item.verificationStatus)}`}
                >
                  {verifiedNewsService.getStatusLabel(item.verificationStatus)}
                </span>
                <span className="text-xs text-slate-500">
                  {verifiedNewsService.formatDate(item.date)}
                </span>
              </div>

              {/* Category */}
              <p className="text-xs text-cyan-400 font-medium uppercase tracking-wider">
                {item.category}
              </p>

              {/* Title */}
              <h3 className="text-sm font-bold text-white line-clamp-2 group-hover:text-cyan-300 transition-colors">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-400 line-clamp-2">
                {item.description}
              </p>

              {/* Source & CTA */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                <span className="text-xs text-slate-500">{item.source}</span>
                <div className="flex items-center gap-1 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-semibold">Read</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {news.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-12 rounded-xl border border-slate-700/50 bg-slate-900/20">
          <AlertCircle className="w-10 h-10 text-slate-500" />
          <p className="text-slate-400">
            No verified news available at the moment
          </p>
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 px-4">
        <TrendingUp className="w-4 h-4" />
        <p>
          Auto-refreshes every 5 minutes. Data from official PIB Fact Check.
        </p>
      </div>
    </motion.div>
  );
};
