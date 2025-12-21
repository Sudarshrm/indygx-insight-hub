import { supabase } from '@/lib/supabase';
import { CapitalType, EcosystemStats, EcosystemType, Organization, Stage } from '@/types/ecosystem';

// Helper to normalize potential one-to-many relations into a single record when only one row is expected.
const first = <T>(value?: T | T[] | null) => {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
};

const stageOrder: Stage[] = ['idea', 'early', 'growth', 'scale'];

const filterStages = (stages?: string[] | null): Stage[] => {
  if (!stages) return [];
  return stages.filter((stage): stage is Stage => stageOrder.includes(stage as Stage));
};

const filterType = (type?: string | null): EcosystemType | undefined => {
  const allowed: EcosystemType[] = ['accelerator', 'investor', 'funding', 'government', 'coworking', 'incubator'];
  return allowed.includes(type as EcosystemType) ? (type as EcosystemType) : undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

interface CompanyPrimaryRow extends AnyRecord {
  company_id: number;
  company_name?: string | null;
  year_of_incorporation?: string | null;
  industry_segment?: string | null;
  nature_of_company?: string | null;
  website_url?: string | null;
  linkedin_profile_url?: string | null;
  ceo_name?: string | null;
  ceo_linkedin_url?: string | null;
  employee_size?: string | null;
  services_offerings?: string | null;
  core_value_proposition?: string | null;
  focus_sectors_industries?: string | null;
  countries_operating_in?: string | null;
  geographic_coverage_india?: string | null;
  company_secondary?: AnyRecord | AnyRecord[] | null;
  competitive_intelligence?: AnyRecord | AnyRecord[] | null;
  contact_information?: AnyRecord | AnyRecord[] | null;
  digital_presence_brand?: AnyRecord | AnyRecord[] | null;
  financials_funding?: AnyRecord | AnyRecord[] | null;
  partnerships_ecosystem?: AnyRecord | AnyRecord[] | null;
  indygx_specific_assessment?: AnyRecord | AnyRecord[] | null;
}

const splitCSV = (value?: string | null): string[] => {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

const deriveType = (nature?: string | null, industry?: string | null): EcosystemType => {
  const normalized = `${nature || ''} ${industry || ''}`.toLowerCase();
  if (normalized.includes('invest') || normalized.includes('vc') || normalized.includes('venture capital')) return 'investor';
  if (normalized.includes('fund') && !normalized.includes('founder')) return 'funding';
  if (normalized.includes('government') || normalized.includes('govt') || normalized.includes('public sector')) return 'government';
  if (normalized.includes('cowork') || normalized.includes('co-work') || normalized.includes('workspace')) return 'coworking';
  if (normalized.includes('incubat')) return 'incubator';
  if (normalized.includes('accelerat')) return 'accelerator';
  // Default based on services
  if (normalized.includes('office') || normalized.includes('space')) return 'coworking';
  return 'accelerator';
};

const parseYear = (year?: string | null): number => {
  if (!year) return 0;
  const parsed = parseInt(year, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const parseNumber = (value?: string | null): number => {
  if (!value) return 0;
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const parseFinancialAmount = (value?: string | null): number | undefined => {
  if (!value) return undefined;
  const cleaned = value.toLowerCase().replace(/[^0-9.kmb]/g, '');
  let multiplier = 1;
  if (cleaned.includes('k')) multiplier = 1000;
  else if (cleaned.includes('m')) multiplier = 1000000;
  else if (cleaned.includes('b')) multiplier = 1000000000;
  const num = parseFloat(cleaned.replace(/[kmb]/g, ''));
  return Number.isNaN(num) ? undefined : num * multiplier;
};

const mapSupabaseCompanyToOrganization = (row: CompanyPrimaryRow): Organization => {
  const secondary = first(row.company_secondary) ?? {};
  const financials = first(row.financials_funding) ?? {};
  const competitive = first(row.competitive_intelligence) ?? {};

  const yearFounded = parseYear(row.year_of_incorporation);
  const currentYear = new Date().getFullYear();
  const yearsActive = yearFounded ? Math.max(currentYear - yearFounded, 0) : 0;

  const targetStages = filterStages(splitCSV(competitive.key_challenges_and_needs));
  const targetSectors = splitCSV(row.focus_sectors_industries);
  const geographicFocus = splitCSV(row.countries_operating_in || row.geographic_coverage_india);

  const supportTypes = splitCSV(row.services_offerings);
  const capitalTypes: CapitalType[] = [];

  // Extract metrics from available fields
  const startupsSupported = parseNumber(row.employee_size) || parseNumber(secondary.processing_time) || 0;
  const capitalDeployed = parseFinancialAmount(financials.total_capital_raised_to_date) 
    || parseFinancialAmount(financials.annual_revenues)
    || parseFinancialAmount(financials.company_valuation);
  const portfolioSize = parseNumber(secondary.success_rate_portfolio_exits_graduations);

  return {
    id: String(row.company_id),
    name: row.company_name ?? 'Unknown Organization',
    type: deriveType(row.nature_of_company, row.industry_segment),
    tagline: row.core_value_proposition ?? row.industry_segment ?? '',
    description: row.services_offerings ?? row.core_value_proposition ?? '',
    yearFounded,
    headquarters: row.countries_operating_in ?? '—',
    website: row.website_url ?? '#',
    linkedin: row.linkedin_profile_url ?? undefined,
    startupsSupported,
    capitalDeployed,
    portfolioSize: portfolioSize || undefined,
    investmentRange: undefined,
    programDuration: undefined,
    yearsActive,
    targetStages,
    targetSectors,
    geographicFocus,
    capitalTypes,
    supportTypes,
    tags: splitCSV(row.industry_segment).concat(splitCSV(row.nature_of_company)),
    impactFocus: false,
    inclusionFocus: false,
    founderProfiles: splitCSV(row.ceo_name),
  };
};

export const calculateEcosystemStats = (organizations: Organization[]): EcosystemStats => {
  const byType = organizations.reduce((acc, org) => {
    acc[org.type] = (acc[org.type] || 0) + 1;
    return acc;
  }, {} as Record<EcosystemType, number>);

  const byStage = organizations.reduce((acc, org) => {
    org.targetStages.forEach((stage) => {
      acc[stage] = (acc[stage] || 0) + 1;
    });
    return acc;
  }, {} as Record<Stage, number>);

  const byGeography = organizations.reduce((acc, org) => {
    org.geographicFocus.forEach((geo) => {
      acc[geo] = (acc[geo] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const bySector = organizations.reduce((acc, org) => {
    org.targetSectors.forEach((sector) => {
      acc[sector] = (acc[sector] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const totalStartupsSupported = organizations.reduce((sum, org) => sum + org.startupsSupported, 0);
  const totalCapitalDeployed = organizations.reduce((sum, org) => sum + (org.capitalDeployed || 0), 0);
  const orgsWithPortfolio = organizations.filter((org) => org.portfolioSize);
  const averagePortfolioSize = orgsWithPortfolio.length > 0
    ? Math.round(orgsWithPortfolio.reduce((sum, org) => sum + (org.portfolioSize || 0), 0) / orgsWithPortfolio.length)
    : 0;

  return {
    totalPlayers: organizations.length,
    totalStartupsSupported,
    totalCapitalDeployed,
    averagePortfolioSize,
    byType,
    byStage,
    byGeography,
    bySector,
  };
};

export const getAllCompanies = async (): Promise<Organization[]> => {
  const { data, error } = await supabase
    .from('company_primary')
    .select(`
      company_id,
      company_name,
      year_of_incorporation,
      industry_segment,
      nature_of_company,
      website_url,
      linkedin_profile_url,
      ceo_name,
      ceo_linkedin_url,
      employee_size,
      services_offerings,
      core_value_proposition,
      focus_sectors_industries,
      countries_operating_in,
      geographic_coverage_india,
      company_secondary (*),
      competitive_intelligence (*),
      contact_information (*),
      digital_presence_brand (*),
      financials_funding (*),
      partnerships_ecosystem (*),
      indygx_specific_assessment (*)
    `);

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapSupabaseCompanyToOrganization);
};

export const getCompanyProfile = async (companyId: string): Promise<Organization | null> => {
  const { data, error } = await supabase
    .from('company_primary')
    .select(`
      company_id,
      company_name,
      year_of_incorporation,
      industry_segment,
      nature_of_company,
      website_url,
      linkedin_profile_url,
      ceo_name,
      ceo_linkedin_url,
      employee_size,
      services_offerings,
      core_value_proposition,
      focus_sectors_industries,
      countries_operating_in,
      geographic_coverage_india,
      company_secondary (*),
      competitive_intelligence (*),
      contact_information (*),
      digital_presence_brand (*),
      financials_funding (*),
      partnerships_ecosystem (*),
      indygx_specific_assessment (*)
    `)
    .eq('company_id', companyId)
    .single();

  if (error) {
    throw error;
  }

  return data ? mapSupabaseCompanyToOrganization(data as CompanyPrimaryRow) : null;
};

export const getCompanyDashboardData = (companyId: string) => getCompanyProfile(companyId);

export const subscribeToCompanyChanges = (onChange: () => void) => {
  const channel = supabase
    .channel('company_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'company_primary' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'company_secondary' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'competitive_intelligence' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_information' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'digital_presence_brand' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'financials_funding' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'partnerships_ecosystem' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'indygx_specific_assessment' }, onChange);

  channel.subscribe();

  return () => {
    channel.unsubscribe();
  };
};
