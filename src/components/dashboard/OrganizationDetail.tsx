import { motion } from 'framer-motion';
import { Organization, ecosystemTypeLabels, stageLabels, capitalTypeLabels } from '@/types/ecosystem';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, MapPin, Calendar, Users, Globe, ExternalLink, 
  Linkedin, ArrowLeft, Target, Briefcase, DollarSign, Clock,
  Award, CheckCircle2, TrendingUp
} from 'lucide-react';

interface OrganizationDetailProps {
  organization: Organization;
  onBack: () => void;
}

const typeColors: Record<string, string> = {
  accelerator: 'bg-ecosystem-accelerator text-white',
  investor: 'bg-ecosystem-investor text-white',
  funding: 'bg-ecosystem-funding text-white',
  government: 'bg-ecosystem-government text-white',
  coworking: 'bg-ecosystem-coworking text-white',
  incubator: 'bg-ecosystem-incubator text-white',
};

export const OrganizationDetail = ({ organization, onBack }: OrganizationDetailProps) => {
  const formatCurrency = (num: number) => {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(0)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Ecosystem
      </Button>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="h-10 w-10 text-primary" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{organization.name}</h1>
              <Badge className={typeColors[organization.type]}>
                {ecosystemTypeLabels[organization.type]}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">{organization.tagline}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {organization.headquarters}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Founded {organization.yearFounded}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {organization.yearsActive} years active
              </span>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" asChild>
                <a href={organization.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2 h-4 w-4" />
                  Website
                </a>
              </Button>
              {organization.linkedin && (
                <Button variant="outline" size="sm" asChild>
                  <a href={organization.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="stat-card"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-accent/10">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {organization.startupsSupported.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Startups Supported</p>
            </div>
          </div>
        </motion.div>

        {organization.capitalDeployed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="stat-card"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-accent/10">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(organization.capitalDeployed)}
                </p>
                <p className="text-xs text-muted-foreground">Capital Deployed</p>
              </div>
            </div>
          </motion.div>
        )}

        {organization.portfolioSize && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="stat-card"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-accent/10">
                <Briefcase className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {organization.portfolioSize}
                </p>
                <p className="text-xs text-muted-foreground">Portfolio Size</p>
              </div>
            </div>
          </motion.div>
        )}

        {organization.programDuration && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="stat-card"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-accent/10">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {organization.programDuration}
                </p>
                <p className="text-xs text-muted-foreground">Program Duration</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <h2 className="text-lg font-semibold text-foreground mb-3">About</h2>
        <p className="text-muted-foreground leading-relaxed">{organization.description}</p>
      </motion.div>

      {/* Focus & Strategy */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="bg-card rounded-xl border border-border p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            Target Stages
          </h2>
          <div className="flex flex-wrap gap-2">
            {organization.targetStages.map((stage) => (
              <Badge key={stage} variant="secondary" className="px-3 py-1">
                {stageLabels[stage]}
              </Badge>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-card rounded-xl border border-border p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-accent" />
            Target Sectors
          </h2>
          <div className="flex flex-wrap gap-2">
            {organization.targetSectors.map((sector) => (
              <Badge key={sector} variant="outline" className="px-3 py-1">
                {sector}
              </Badge>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Geographic & Capital */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.55 }}
          className="bg-card rounded-xl border border-border p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Globe className="h-5 w-5 text-accent" />
            Geographic Focus
          </h2>
          <div className="flex flex-wrap gap-2">
            {organization.geographicFocus.map((geo) => (
              <Badge key={geo} variant="secondary" className="px-3 py-1">
                <MapPin className="h-3 w-3 mr-1" />
                {geo}
              </Badge>
            ))}
          </div>
        </motion.div>

        {organization.capitalTypes && organization.capitalTypes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="bg-card rounded-xl border border-border p-6 space-y-4"
          >
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-accent" />
              Capital Types
            </h2>
            <div className="flex flex-wrap gap-2">
              {organization.capitalTypes.map((type) => (
                <Badge key={type} variant="outline" className="px-3 py-1">
                  {capitalTypeLabels[type]}
                </Badge>
              ))}
            </div>
            {organization.investmentRange && (
              <p className="text-sm text-muted-foreground">
                Investment Range: {formatCurrency(organization.investmentRange.min)} - {formatCurrency(organization.investmentRange.max)}
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Support Offered */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.65 }}
        className="bg-card rounded-xl border border-border p-6 space-y-4"
      >
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Award className="h-5 w-5 text-accent" />
          Support Offered
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {organization.supportTypes.map((support) => (
            <div key={support} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
              <span className="text-foreground">{support}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Impact Focus */}
      {(organization.impactFocus || organization.inclusionFocus) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="bg-gradient-to-r from-accent/5 to-accent/10 rounded-xl border border-accent/20 p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Impact & Inclusion
          </h2>
          <div className="flex flex-wrap gap-3">
            {organization.impactFocus && (
              <Badge className="bg-accent text-accent-foreground">Impact Focused</Badge>
            )}
            {organization.inclusionFocus && (
              <Badge className="bg-accent text-accent-foreground">Inclusion Focused</Badge>
            )}
          </div>
          {organization.founderProfiles && (
            <div className="mt-4">
              <p className="text-sm font-medium text-foreground mb-2">Founder Profiles:</p>
              <div className="flex flex-wrap gap-2">
                {organization.founderProfiles.map((profile) => (
                  <Badge key={profile} variant="outline" className="px-3 py-1">
                    {profile}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
