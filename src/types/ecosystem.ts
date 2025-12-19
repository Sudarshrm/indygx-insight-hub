export type EcosystemType = 
  | 'accelerator' 
  | 'investor' 
  | 'funding' 
  | 'government' 
  | 'coworking' 
  | 'incubator';

export type Stage = 'idea' | 'early' | 'growth' | 'scale';

export type CapitalType = 'equity' | 'grant' | 'debt' | 'blended' | 'convertible';

export interface Organization {
  id: string;
  name: string;
  type: EcosystemType;
  logo?: string;
  tagline: string;
  description: string;
  yearFounded: number;
  headquarters: string;
  website: string;
  linkedin?: string;
  
  // Metrics
  startupsSupported: number;
  capitalDeployed?: number;
  portfolioSize?: number;
  investmentRange?: { min: number; max: number };
  programDuration?: string;
  yearsActive: number;
  
  // Focus areas
  targetStages: Stage[];
  targetSectors: string[];
  geographicFocus: string[];
  capitalTypes?: CapitalType[];
  
  // Support offered
  supportTypes: string[];
  
  // Tags
  tags: string[];
  
  // Impact
  impactFocus?: boolean;
  inclusionFocus?: boolean;
  founderProfiles?: string[];
}

export interface EcosystemStats {
  totalPlayers: number;
  totalStartupsSupported: number;
  totalCapitalDeployed: number;
  averagePortfolioSize: number;
  byType: Record<EcosystemType, number>;
  byStage: Record<Stage, number>;
  byGeography: Record<string, number>;
  bySector: Record<string, number>;
}

export const ecosystemTypeLabels: Record<EcosystemType, string> = {
  accelerator: 'Accelerators',
  investor: 'Investors',
  funding: 'Funding Platforms',
  government: 'Government',
  coworking: 'Co-working',
  incubator: 'Incubators',
};

export const ecosystemTypeIcons: Record<EcosystemType, string> = {
  accelerator: 'Rocket',
  investor: 'TrendingUp',
  funding: 'Wallet',
  government: 'Building2',
  coworking: 'Users',
  incubator: 'Lightbulb',
};

export const stageLabels: Record<Stage, string> = {
  idea: 'Idea Stage',
  early: 'Early Stage',
  growth: 'Growth Stage',
  scale: 'Scale Stage',
};

export const capitalTypeLabels: Record<CapitalType, string> = {
  equity: 'Equity',
  grant: 'Grants',
  debt: 'Debt',
  blended: 'Blended Finance',
  convertible: 'Convertible Notes',
};
