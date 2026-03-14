import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { RegionalReport } from '@/services/regionalReportGenerator';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface RegionalReportDisplayProps {
  report: RegionalReport;
  onSourceClick?: (source: string) => void;
}

export const RegionalReportDisplay: React.FC<RegionalReportDisplayProps> = ({
  report,
  onSourceClick,
}) => {
  const { content, metadata } = report;
  const { credibility, riskAssessment, analysis, verdict, recommendations } = content;

  const credibilityColor = useMemo(() => {
    if (credibility.score >= 75) return 'text-green-600';
    if (credibility.score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  }, [credibility.score]);

  const riskColor = useMemo(() => {
    if (riskAssessment.level === 'low') return 'bg-green-100 text-green-800';
    if (riskAssessment.level === 'medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }, [riskAssessment.level]);

  const getSegmentIcon = (type: string) => {
    switch (type) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'questionable':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'misinformation':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{report.header}</CardTitle>
              <CardDescription>
                {new Date(metadata.generatedAt).toLocaleString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </CardDescription>
            </div>
            <Badge variant="outline">{metadata.language.toUpperCase()}</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{content.summary.split(':')[0]}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">{content.summary}</p>
        </CardContent>
      </Card>

      {/* Credibility & Risk Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Credibility Score */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Credibility Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <div className={`text-4xl font-bold ${credibilityColor}`}>
                    {credibility.score}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">/100</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{credibility.label}</div>
                  <div className="text-xs text-gray-600 mt-1">{credibility.description}</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    credibility.score >= 75
                      ? 'bg-green-600'
                      : credibility.score >= 40
                        ? 'bg-yellow-600'
                        : 'bg-red-600'
                  }`}
                  style={{ width: `${credibility.score}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Badge className={riskColor}>{riskAssessment.label}</Badge>
            </div>
            <p className="text-sm text-gray-700">{riskAssessment.description}</p>
          </CardContent>
        </Card>
      </div>

      {/* Findings */}
      {analysis.findings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Key Findings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.findings.map((finding, idx) => (
              <div key={idx} className="pb-3 border-b last:border-b-0">
                <div className="flex items-start gap-2">
                  {finding.severity === 'high' && (
                    <AlertCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                  )}
                  {finding.severity === 'medium' && (
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                  )}
                  {finding.severity === 'low' && (
                    <Info className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="font-medium text-sm">{finding.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{finding.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Red Flags */}
      {analysis.redFlags.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Red Flags Detected</AlertTitle>
          <AlertDescription className="mt-2">
            <ul className="list-disc list-inside space-y-1">
              {analysis.redFlags.map((flag, idx) => (
                <li key={idx} className="text-sm">
                  {flag}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Content Breakdown */}
      {analysis.segments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Content Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.segments.map((segment, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                {getSegmentIcon(segment.type)}
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{segment.text}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {segment.type.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Confidence: {Math.round(segment.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Verdict */}
      <Card className="border-l-4 border-l-blue-600">
        <CardHeader>
          <CardTitle className="text-base">Verdict</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm font-medium">{verdict.conclusion}</p>
          <p className="text-sm text-gray-700">{verdict.reasoning}</p>
        </CardContent>
      </Card>

      {/* Sources */}
      {verdict.sources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fact-Check Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {verdict.sources.map((source, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onSourceClick?.(source)}
                    className="text-sm text-blue-600 hover:underline text-left"
                  >
                    {source}
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card className="border-l-4 border-l-green-600">
        <CardHeader>
          <CardTitle className="text-base">Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Disclaimer</AlertTitle>
        <AlertDescription className="text-xs">{content.disclaimer}</AlertDescription>
      </Alert>
    </div>
  );
};

export default RegionalReportDisplay;
