export type EmployeeInfo = {
  name?: string;
  profileImage?: string;
  employeeID?: string;
  position?: string;
  salary?: number;
};

export type SalaryHistoryProps = {
  employeeId: string;
  employee?: EmployeeInfo;
  onBack?: () => void;
};

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export type FilterState = {
  dateRange: DateRange;
  selectedType: string;
};

export type FilterOption = {
  value: string;
  label: string;
};

export type BadgeConfig = {
  baseBadge: React.ReactNode;
  typeDetails?: React.ReactNode;
  sourceBadge?: React.ReactNode;
};

export type AmountDisplayProps = {
  amount: number;
};
