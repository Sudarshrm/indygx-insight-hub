import { motion } from 'framer-motion';
import { Organization, ecosystemTypeLabels, stageLabels } from '@/types/ecosystem';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Building2, Users, DollarSign, MapPin, Target, Briefcase } from 'lucide-react';

interface ComparisonViewProps {
  organizations: Organization[];
  onRemove: (id: string) => void;
  onClose: () => void;
}

export const ComparisonView = ({ organizations, onRemove, onClose }: ComparisonViewProps) => {
  const formatCurrency = (num?: number) => {
    if (!num) return '-';
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(0)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num}`;
  };

  const metrics = [
    { key: 'startupsSupported', label: 'Startups Supported', icon: Users, format: (v: number) => v.toLocaleString() },
    { key: 'capitalDeployed', label: 'Capital Deployed', icon: DollarSign, format: formatCurrency },
    { key: 'portfolioSize', label: 'Portfolio Size', icon: Briefcase, format: (v?: number) => v?.toString() || '-' },
    { key: 'yearsActive', label: 'Years Active', icon: Target, format: (v: number) => `${v} years` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-card rounded-xl border border-border shadow-xl max-w-6xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Compare Organizations</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          {/* Headers */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${organizations.length}, 1fr)` }}>
            <div /> {/* Empty corner cell */}
            {organizations.map((org) => (
              <div key={org.id} className="text-center space-y-2 pb-4 border-b border-border">
                <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{org.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {ecosystemTypeLabels[org.type]}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-destructive"
                  onClick={() => onRemove(org.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {/* Metrics */}
          {metrics.map(({ key, label, icon: Icon, format }) => (
            <div
              key={key}
              className="grid gap-4 py-4 border-b border-border items-center"
              style={{ gridTemplateColumns: `200px repeat(${organizations.length}, 1fr)` }}
            >
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Icon className="h-4 w-4" />
                {label}
              </div>
              {organizations.map((org) => (
                <div key={org.id} className="text-center">
                  <span className="text-lg font-semibold text-foreground">
                    {format((org as any)[key])}
                  </span>
                </div>
              ))}
            </div>
          ))}

          {/* Stages */}
          <div
            className="grid gap-4 py-4 border-b border-border"
            style={{ gridTemplateColumns: `200px repeat(${organizations.length}, 1fr)` }}
          >
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Target className="h-4 w-4" />
              Target Stages
            </div>
            {organizations.map((org) => (
              <div key={org.id} className="flex flex-wrap justify-center gap-1">
                {org.targetStages.map((stage) => (
                  <Badge key={stage} variant="secondary" className="text-xs">
                    {stageLabels[stage]}
                  </Badge>
                ))}
              </div>
            ))}
          </div>

          {/* Sectors */}
          <div
            className="grid gap-4 py-4 border-b border-border"
            style={{ gridTemplateColumns: `200px repeat(${organizations.length}, 1fr)` }}
          >
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              Top Sectors
            </div>
            {organizations.map((org) => (
              <div key={org.id} className="flex flex-wrap justify-center gap-1">
                {org.targetSectors.slice(0, 3).map((sector) => (
                  <Badge key={sector} variant="outline" className="text-xs">
                    {sector}
                  </Badge>
                ))}
                {org.targetSectors.length > 3 && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    +{org.targetSectors.length - 3}
                  </Badge>
                )}
              </div>
            ))}
          </div>

          {/* Geography */}
          <div
            className="grid gap-4 py-4"
            style={{ gridTemplateColumns: `200px repeat(${organizations.length}, 1fr)` }}
          >
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MapPin className="h-4 w-4" />
              Geography
            </div>
            {organizations.map((org) => (
              <div key={org.id} className="flex flex-wrap justify-center gap-1">
                {org.geographicFocus.slice(0, 3).map((geo) => (
                  <Badge key={geo} variant="secondary" className="text-xs">
                    {geo}
                  </Badge>
                ))}
                {org.geographicFocus.length > 3 && (
                  <Badge variant="secondary" className="text-xs text-muted-foreground">
                    +{org.geographicFocus.length - 3}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
