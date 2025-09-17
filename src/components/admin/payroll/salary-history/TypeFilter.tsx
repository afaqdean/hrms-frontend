import type { FilterOption } from '@/types/salaryHistory';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter } from 'lucide-react';
import React from 'react';

type TypeFilterProps = {
  selectedType: string;
  onTypeChange: (type: string) => void;
  options: FilterOption[];
  className?: string;
};

const TypeFilter: React.FC<TypeFilterProps> = ({
  selectedType,
  onTypeChange,
  options,
  className,
}) => {
  return (
    <Select value={selectedType} onValueChange={onTypeChange}>
      <SelectTrigger className={`h-8 w-[120px] text-xs ${className || ''}`}>
        <Filter className="size-3.5" />
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TypeFilter;
