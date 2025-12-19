import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Organization, EcosystemType, ecosystemTypeLabels } from '@/types/ecosystem';
import { StatCard } from '@/components/dashboard/StatCard';
import { OrganizationCard } from '@/components/dashboard/OrganizationCard';
import { OrganizationDetail } from '@/components/dashboard/OrganizationDetail';
import { EcosystemTypeFilter } from '@/components/dashboard/EcosystemTypeFilter';
import { ComparisonView } from '@/components/dashboard/ComparisonView';
import { DonutChart } from '@/components/charts/DonutChart';
import { HorizontalBarChart } from '@/components/charts/HorizontalBarChart';
import { TrendChart } from '@/components/charts/TrendChart';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { calculateEcosystemStats, getAllCompanies, subscribeToCompanyChanges } from '@/services/data';
import { 
  Search, Building2, Users, DollarSign, TrendingUp, 
  BarChart3, GitCompare, X, Layers
} from 'lucide-react';

const defaultTypeCounts: Record<EcosystemType, number> = {
  accelerator: 0,
  investor: 0,
  funding: 0,
  government: 0,
  coworking: 0,
  incubator: 0,
};

const Index = () => {
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<EcosystemType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const { data: organizations = [], isLoading, isError, error } = useQuery({
    queryKey: ['organizations'],
    queryFn: getAllCompanies,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const errorMessage = useMemo(() => {
    if (!error) return '';
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Unable to load data from Supabase';
  }, [error]);

  useEffect(() => {
    const cleanup = subscribeToCompanyChanges(() => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    });

    return cleanup;
  }, [queryClient]);

  useEffect(() => {
    if (!selectedOrg) return;
    const refreshed = organizations.find((org) => org.id === selectedOrg.id);
    if (!refreshed) {
      setSelectedOrg(null);
    } else {
      setSelectedOrg(refreshed);
    }
  }, [organizations, selectedOrg]);

  useEffect(() => {
    if (!compareList.length) return;
    setCompareList((prev) => prev.filter((id) => organizations.some((org) => org.id === id)));
  }, [organizations]);

  const stats = useMemo(() => (
    organizations.length ? calculateEcosystemStats(organizations) : null
  ), [organizations]);

  // Filter organizations
  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const matchesType = selectedType === 'all' || org.type === selectedType;
      const matchesSearch = searchQuery === '' || 
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [organizations, searchQuery, selectedType]);

  // Chart data
  const typeDistributionData = useMemo(() => {
    const colors = {
      accelerator: 'hsl(173, 58%, 39%)',
      investor: 'hsl(222, 47%, 31%)',
      funding: 'hsl(43, 74%, 49%)',
      government: 'hsl(142, 52%, 42%)',
      coworking: 'hsl(262, 52%, 47%)',
      incubator: 'hsl(12, 76%, 61%)',
    };
    const dataSource = stats?.byType ?? defaultTypeCounts;
    return Object.entries(dataSource).map(([type, count]) => ({
      name: ecosystemTypeLabels[type as EcosystemType],
      value: count,
      color: colors[type as EcosystemType],
    }));
  }, [stats?.byType]);

  const stageDistributionData = useMemo(() => {
    const stageNames = { idea: 'Idea', early: 'Early', growth: 'Growth', scale: 'Scale' };
    if (!stats) return [];
    return Object.entries(stats.byStage).map(([stage, count]) => ({
      name: stageNames[stage as keyof typeof stageNames],
      value: count,
    }));
  }, [stats]);

  const topSectorsData = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.bySector)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([sector, count]) => ({ name: sector, value: count }));
  }, [stats]);

  const growthTrendData = useMemo(() => {
    const counts: Record<number, number> = {};
    organizations.forEach((org) => {
      if (!org.yearFounded) return;
      counts[org.yearFounded] = (counts[org.yearFounded] || 0) + 1;
    });

    const years = Object.keys(counts)
      .map(Number)
      .sort((a, b) => a - b)
      .slice(-6);

    return years.map((year) => ({ name: year.toString(), value: counts[year] }));
  }, [organizations]);

  const handleCompareToggle = (orgId: string) => {
    setCompareList(prev => 
      prev.includes(orgId)
        ? prev.filter(id => id !== orgId)
        : prev.length < 4
          ? [...prev, orgId]
          : prev
    );
  };

  const compareOrganizations = useMemo(() => 
    organizations.filter(org => compareList.includes(org.id)),
    [compareList, organizations]
  );

  const formatCurrency = (num: number) => {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(0)}M`;
    return `$${(num / 1000).toFixed(0)}K`;
  };

  if (selectedOrg) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Layers className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">IndyGx</h1>
                <p className="text-xs text-muted-foreground">Ecosystem Intelligence</p>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <OrganizationDetail 
            organization={selectedOrg} 
            onBack={() => setSelectedOrg(null)} 
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Layers className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">IndyGx</h1>
                <p className="text-xs text-muted-foreground">Ecosystem Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search organizations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              {compareList.length > 0 && (
                <Button 
                  onClick={() => setShowComparison(true)}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <GitCompare className="mr-2 h-4 w-4" />
                  Compare ({compareList.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <h2 className="text-2xl font-bold text-foreground">Ecosystem Overview</h2>
          <p className="text-muted-foreground">
            Comprehensive intelligence across India's startup ecosystem
          </p>
        </motion.section>

        {isError && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 text-destructive px-4 py-3">
            Failed to load data from Supabase: {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Ecosystem Players"
            value={stats?.totalPlayers ?? (isLoading ? 'Loading…' : 0)}
            subtitle="Active organizations"
            icon={Building2}
            trend={{ value: 15, isPositive: true }}
            delay={0.1}
          />
          <StatCard
            title="Startups Supported"
            value={stats ? stats.totalStartupsSupported.toLocaleString() : isLoading ? 'Loading…' : 0}
            subtitle="Across all players"
            icon={Users}
            trend={{ value: 23, isPositive: true }}
            delay={0.15}
          />
          <StatCard
            title="Capital Deployed"
            value={formatCurrency(stats?.totalCapitalDeployed || 0)}
            subtitle="Total ecosystem funding"
            icon={DollarSign}
            trend={{ value: 18, isPositive: true }}
            delay={0.2}
          />
          <StatCard
            title="Avg Portfolio Size"
            value={stats?.averagePortfolioSize ?? (isLoading ? 'Loading…' : 0)}
            subtitle="Per organization"
            icon={TrendingUp}
            delay={0.25}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DonutChart
            data={typeDistributionData}
            title="Distribution by Type"
            delay={0.3}
          />
          <HorizontalBarChart
            data={stageDistributionData}
            title="Stage Focus Distribution"
            delay={0.35}
          />
          <TrendChart
            data={growthTrendData}
            title="Ecosystem Growth Trend"
            delay={0.4}
          />
        </div>

        {/* Sector Distribution */}
        <HorizontalBarChart
          data={topSectorsData}
          title="Top Sectors Covered"
          color="hsl(var(--chart-2))"
          delay={0.45}
        />

        {/* Type Filter */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              Explore Ecosystem Players
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredOrganizations.length} organizations
            </span>
          </div>
          <EcosystemTypeFilter
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            counts={stats?.byType ?? defaultTypeCounts}
          />
        </section>

        {/* Organizations Grid */}
        <section className="space-y-4">
          {compareList.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-accent/5 rounded-lg border border-accent/20">
              <span className="text-sm text-muted-foreground">
                Select up to 4 organizations to compare:
              </span>
              <div className="flex flex-wrap gap-2">
                {compareOrganizations.map((org) => (
                  <Badge key={org.id} variant="secondary" className="pr-1">
                    {org.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => handleCompareToggle(org.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredOrganizations.map((org, index) => (
                <div key={org.id} className="relative">
                  <div className="absolute top-3 right-3 z-10">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={compareList.includes(org.id)}
                        onCheckedChange={() => handleCompareToggle(org.id)}
                        disabled={!compareList.includes(org.id) && compareList.length >= 4}
                        className="bg-card"
                      />
                    </div>
                  </div>
                  <OrganizationCard
                    organization={org}
                    onClick={setSelectedOrg}
                    delay={0.05 * index}
                  />
                </div>
              ))}
            </AnimatePresence>
          </div>

          {filteredOrganizations.length === 0 && (
            <div className="text-center py-16">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No organizations found</h3>
              <p className="text-muted-foreground">
                {isLoading ? 'Loading organizations from Supabase…' : 'Try adjusting your search or filter criteria'}
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Layers className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">IndyGx</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 IndyGx. Building India's unified startup ecosystem intelligence platform.
            </p>
          </div>
        </div>
      </footer>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showComparison && compareOrganizations.length > 0 && (
          <ComparisonView
            organizations={compareOrganizations}
            onRemove={handleCompareToggle}
            onClose={() => setShowComparison(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
