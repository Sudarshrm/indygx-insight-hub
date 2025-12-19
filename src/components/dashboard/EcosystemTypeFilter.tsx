import { motion } from 'framer-motion';
import { EcosystemType, ecosystemTypeLabels } from '@/types/ecosystem';
import { Rocket, TrendingUp, Wallet, Building2, Users, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EcosystemTypeFilterProps {
  selectedType: EcosystemType | 'all';
  onTypeChange: (type: EcosystemType | 'all') => void;
  counts: Record<EcosystemType, number>;
}

const typeIcons = {
  accelerator: Rocket,
  investor: TrendingUp,
  funding: Wallet,
  government: Building2,
  coworking: Users,
  incubator: Lightbulb,
};

export const EcosystemTypeFilter = ({ selectedType, onTypeChange, counts }: EcosystemTypeFilterProps) => {
  const types: (EcosystemType | 'all')[] = ['all', 'accelerator', 'investor', 'funding', 'government', 'coworking', 'incubator'];
  
  const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-card rounded-xl border border-border p-2">
      <div className="flex flex-wrap gap-1">
        {types.map((type) => {
          const isSelected = selectedType === type;
          const count = type === 'all' ? totalCount : counts[type] || 0;
          const Icon = type === 'all' ? null : typeIcons[type];

          return (
            <motion.button
              key={type}
              onClick={() => onTypeChange(type)}
              className={cn(
                "relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{type === 'all' ? 'All Players' : ecosystemTypeLabels[type]}</span>
              <span className={cn(
                "ml-1 px-1.5 py-0.5 text-xs rounded-md",
                isSelected 
                  ? "bg-primary-foreground/20 text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              )}>
                {count}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
