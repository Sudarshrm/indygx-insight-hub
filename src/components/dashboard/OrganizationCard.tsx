import { motion } from 'framer-motion';
import { Organization, ecosystemTypeLabels } from '@/types/ecosystem';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Calendar, Users, ArrowRight, Globe } from 'lucide-react';

interface OrganizationCardProps {
  organization: Organization;
  onClick: (org: Organization) => void;
  delay?: number;
}

const typeColors: Record<string, string> = {
  accelerator: 'bg-ecosystem-accelerator/10 text-ecosystem-accelerator border-ecosystem-accelerator/20',
  investor: 'bg-ecosystem-investor/10 text-ecosystem-investor border-ecosystem-investor/20',
  funding: 'bg-ecosystem-funding/10 text-ecosystem-funding border-ecosystem-funding/20',
  government: 'bg-ecosystem-government/10 text-ecosystem-government border-ecosystem-government/20',
  coworking: 'bg-ecosystem-coworking/10 text-ecosystem-coworking border-ecosystem-coworking/20',
  incubator: 'bg-ecosystem-incubator/10 text-ecosystem-incubator border-ecosystem-incubator/20',
};

export const OrganizationCard = ({ organization, onClick, delay = 0 }: OrganizationCardProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(0)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-card rounded-xl border border-border p-5 hover:shadow-lg hover:border-accent/30 transition-all duration-300 cursor-pointer group"
      onClick={() => onClick(organization)}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                {organization.name}
              </h3>
              <Badge variant="outline" className={`mt-1 text-xs ${typeColors[organization.type]}`}>
                {ecosystemTypeLabels[organization.type]}
              </Badge>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {organization.tagline}
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{organization.startupsSupported.toLocaleString()}</span>
            <span className="text-muted-foreground">supported</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{organization.yearsActive}</span>
            <span className="text-muted-foreground">years</span>
          </div>
        </div>

        {/* Location & Capital */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{organization.headquarters}</span>
          </div>
          {organization.capitalDeployed && (
            <span className="text-sm font-semibold text-accent">
              {formatNumber(organization.capitalDeployed)}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {organization.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-md bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Button
          variant="ghost"
          className="w-full mt-2 group-hover:bg-accent/10 group-hover:text-accent"
        >
          View Dashboard
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
};
