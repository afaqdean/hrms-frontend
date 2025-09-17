export type Payslip = {
  id?: string;
  _id?: string;
  period: string;
  netPay: number;
  basePay: number;
  bonuses: number;
  deductions: number;
  // Add any other fields as needed
};
