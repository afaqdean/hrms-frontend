import type { HRMSModification, SalaryComparisonResult } from '@/hooks/useSalaryComparison';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ChevronDown, ChevronRight, Info } from 'lucide-react';

import React, { useState } from 'react';

type HRMSModificationsWarningProps = {
  comparisonResult: SalaryComparisonResult;
  onAcknowledge?: () => void;
  showDetails?: boolean;
};

const HRMSModificationsWarning: React.FC<HRMSModificationsWarningProps> = ({
  comparisonResult,
  onAcknowledge,
  showDetails = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const [acknowledged, setAcknowledged] = useState(false);

  if (!comparisonResult.hasModifications) {
    return null;
  }

  const handleAcknowledge = () => {
    setAcknowledged(true);
    onAcknowledge?.();
  };

  const getModificationIcon = (type: HRMSModification['type']) => {
    switch (type) {
      case 'bonus':
        return '';
      case 'deduction':
        return '';
      case 'salary_increment':
        return '';
      case 'loan':
        return '';
      default:
        return '';
    }
  };

  const getModificationColor = (type: HRMSModification['type']) => {
    switch (type) {
      case 'bonus':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'deduction':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'salary_increment':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'loan':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getModificationLabel = (type: HRMSModification['type']) => {
    switch (type) {
      case 'bonus':
        return 'Bonus';
      case 'deduction':
        return 'Deduction';
      case 'salary_increment':
        return 'Salary Increment';
      case 'loan':
        return 'Loan Repayment';
      default:
        return 'Modification';
    }
  };

  if (acknowledged) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-amber-700">
            <Info className="size-4" />
            <span className="text-sm font-medium">
              Warning acknowledged. Please ensure all manual HRMS modifications are properly reflected in your salary calculations.
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-300 bg-amber-50 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <AlertTriangle className="size-5 text-amber-600" />
          Manual HRMS Modifications Detected
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Warning Message */}
        <div className="rounded-lg bg-amber-100 p-3">
          <p className="mb-2 text-sm text-amber-800">
            {comparisonResult.warningMessage}
          </p>
          <p className="text-xs text-amber-700">
            These modifications were manually entered through the HRMS system and may not be reflected in your uploaded salaries.xlsx file.
            Please review and ensure they are properly included in your salary calculations.
          </p>
        </div>

        {/* Summary Badges */}
        <div className="flex flex-wrap gap-2">
          {comparisonResult.summary.bonuses > 0 && (
            <Badge variant="outline" className="border-green-300 bg-green-100 text-green-800">
              {comparisonResult.summary.bonuses}
              {' '}
              Manual Bonus(es)
            </Badge>
          )}
          {comparisonResult.summary.deductions > 0 && (
            <Badge variant="outline" className="border-red-300 bg-red-100 text-red-800">
              {comparisonResult.summary.deductions}
              {' '}
              Manual Deduction(s)
            </Badge>
          )}
          {comparisonResult.summary.salaryIncrements > 0 && (
            <Badge variant="outline" className="border-blue-300 bg-blue-100 text-blue-800">
              {comparisonResult.summary.salaryIncrements}
              {' '}
              Manual Salary Increment(s)
            </Badge>
          )}
          {comparisonResult.summary.loans > 0 && (
            <Badge variant="outline" className="border-orange-300 bg-orange-100 text-orange-800">
              {comparisonResult.summary.loans}
              {' '}
              Manual Active Loan(s)
            </Badge>
          )}
        </div>

        {/* Detailed Modifications */}
        <div className="border-t border-amber-200 pt-3">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center gap-2 rounded-md p-2 text-left text-amber-700 transition-colors hover:bg-amber-100 hover:text-amber-800"
          >
            {isExpanded
              ? (
                  <ChevronDown className="size-4" />
                )
              : (
                  <ChevronRight className="size-4" />
                )}
            <span className="text-sm font-medium">
              {isExpanded ? 'Hide' : 'Show'}
              {' '}
              Detailed Modifications (
              {comparisonResult.modifications.length}
              )
            </span>
          </button>

          {isExpanded && (
            <div className="mt-3 space-y-3">
              {comparisonResult.modifications.map(modification => (
                <div
                  key={modification.id}
                  className="rounded-lg border border-amber-200 bg-white p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getModificationIcon(modification.type)}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getModificationColor(modification.type)}`}
                          >
                            {getModificationLabel(modification.type)}
                          </Badge>
                          <span className="text-sm font-medium text-gray-900">
                            {modification.employeeName}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {modification.reason}
                        </p>
                        {modification.notes && (
                          <p className="mt-1 text-xs text-gray-500">
                            {modification.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        PKR
                        {' '}
                        {modification.amount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(modification.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleAcknowledge}
            variant="outline"
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            Acknowledge Warning
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HRMSModificationsWarning;
