import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  verifiedNewsService,
  VerifiedNews,
} from "../services/verifiedNewsService";

const VerifiedNewsPage: React.FC = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<VerifiedNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedNews, setSelectedNews] = useState<VerifiedNews | null>(null);

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

  useEffect(() => {
    fetchNews();

    // Auto-refresh every 5 minutes
    const interval = setInterval(
      () => {
        fetchNews();
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  const handleOpenLink = (url?: string) => {
    if (url) {
      try {
        window.open(url, "_blank");
      } catch (error) {
        console.error("Error opening link:", error);
      }
    }
  };

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

  return (
    <div className="page-gradient min-h-screen overflow-hidden px-4 py-5 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl rounded-2xl border border-cyber-cyan/30 glass-panel shadow-[0_26px_70px_-28px_rgba(0,200,255,0.3)]">
        {/* Background gradients */}
        <div className="absolute pointer-events-none inset-0">
          <div className="absolute -left-20 top-0 h-52 w-52 rounded-full bg-cyber-blue/15 blur-3xl" />
          <div className="absolute right-10 top-24 h-44 w-44 rounded-full bg-cyber-cyan/10 blur-3xl" />
          <div className="absolute bottom-6 left-1/3 h-28 w-44 rounded-full bg-cyber-purple/10 blur-3xl" />
        </div>

        {/* Header */}
        <header className="relative px-4 pt-4 sm:px-8 sm:pt-7">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between rounded-lg border border-mint border-opacity-40 glass-panel px-4 shadow-glow-md">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold button-ghost hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <div className="text-center">
                <h1 className="text-sm font-bold text-gradient-cyber">
                  Verified Truth Hub
                </h1>
                <p className="text-xs text-slate-400">Official fact-checks</p>
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
                className={`w-5 h-5 text-cyan-400 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
            </motion.button>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative px-5 pb-10 pt-8 sm:px-10">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-10 max-w-4xl text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="h-6 w-6 text-cyan-400" />
              <h2 className="text-3xl sm:text-4xl font-bold text-gradient-cyber">
                Truth in Every Click
              </h2>
              <Zap className="h-6 w-6 text-cyan-400" />
            </div>
            <p className="text-base text-slate-400 mb-6">
              Stay informed with verified facts from official government
              sources. Real-time updates on policies, claims, and announcements.
            </p>

            {/* Update Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-emerald-300 font-semibold">
                  {news.length} Verified Items
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                <RefreshCw className="h-4 w-4 text-cyan-400" />
                <span className="text-xs text-cyan-300 font-semibold">
                  Updated {getTimeElapsed()}
                </span>
              </div>
            </div>
          </motion.section>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
              <p className="text-slate-300">Loading verified news...</p>
            </div>
          )}

          {/* News Grid */}
          {!loading && news.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto max-w-5xl grid gap-4 sm:grid-cols-1 lg:grid-cols-2"
            >
              {news.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  onClick={() => setSelectedNews(item)}
                  className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/40 to-slate-800/20 backdrop-blur-md hover:border-cyan-500/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:to-purple-500/10 transition-all duration-300" />

                  {/* Image */}
                  {item.imageUrl && (
                    <div className="relative h-40 overflow-hidden border-b border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          const parent = (e.target as HTMLImageElement)
                            .parentElement;
                          if (parent) {
                            parent.style.minHeight = "60px";
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 pointer-events-none" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="relative p-5 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${verifiedNewsService.getStatusColor(
                            item.verificationStatus,
                          )}`}
                        >
                          {verifiedNewsService.getStatusLabel(
                            item.verificationStatus,
                          )}
                        </span>
                        <span className="ml-2 text-xs text-slate-500">
                          {verifiedNewsService.formatDate(item.date)}
                        </span>
                      </div>
                    </div>

                    {/* Category & Title */}
                    <div>
                      <p className="text-xs text-cyan-400 font-medium uppercase tracking-wider mb-2">
                        {item.category}
                      </p>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-400 line-clamp-3">
                      {item.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                      <span className="text-xs text-slate-500 font-medium">
                        {item.source}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenLink(item.url);
                        }}
                        className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <span className="text-xs font-semibold">Read</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && news.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-20 rounded-xl border border-slate-700/50 bg-slate-900/20">
              <AlertCircle className="w-12 h-12 text-slate-500" />
              <p className="text-slate-400 text-lg font-semibold">
                No verified news available
              </p>
              <button
                onClick={fetchNews}
                className="mt-4 px-6 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30 transition-colors text-sm font-semibold"
              >
                Try Refreshing
              </button>
            </div>
          )}
        </main>

        {/* Modal for detailed view */}
        {selectedNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedNews(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900/95 border border-cyan-500/30 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            >
              {/* Modal Header */}
              <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <h2 className="text-lg font-bold text-white">Details</h2>
                </div>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {selectedNews.imageUrl && (
                  <img
                    src={selectedNews.imageUrl}
                    alt={selectedNews.title}
                    className="w-full h-64 object-cover rounded-lg bg-gradient-to-br from-slate-800 to-slate-900"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${verifiedNewsService.getStatusColor(
                        selectedNews.verificationStatus,
                      )}`}
                    >
                      {verifiedNewsService.getStatusLabel(
                        selectedNews.verificationStatus,
                      )}
                    </span>
                    <span className="text-sm text-slate-400">
                      {verifiedNewsService.formatDate(selectedNews.date)}
                    </span>
                  </div>

                  <p className="text-xs text-cyan-400 font-medium uppercase tracking-wider mb-3">
                    {selectedNews.category}
                  </p>

                  <h3 className="text-2xl font-bold text-white mb-4">
                    {selectedNews.title}
                  </h3>

                  <p className="text-base text-slate-300 leading-relaxed mb-6">
                    {selectedNews.description}
                  </p>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <span className="text-sm text-slate-400">
                      <span className="font-semibold">Source:</span>{" "}
                      {selectedNews.source}
                    </span>
                    {selectedNews.url && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleOpenLink(selectedNews.url)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30 transition-colors font-semibold text-sm"
                      >
                        Open Original
                        <ExternalLink className="h-4 w-4" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500">
          Data sourced from TrustVault • Auto-refreshes every 5 minutes • Last
          updated {getTimeElapsed()}
        </p>
      </div>
    </div>
  );
};

export default VerifiedNewsPage;
