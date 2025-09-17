import ModalUI from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
// AdminOverviewCardComponent.tsx
import React, { useState } from 'react';
import ShowUpcomingLeaves from '../../pop-ups/ShowUpcomingLeaves';

type AdminOverviewCardComponentProps = {
  text?: string;
  number?: string;
  percentage?: any;
  trend?: string;
  className?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  description?: string;
  showUpcomingLeavesDetails?: boolean;
};

const AdminOverviewCardComponent: React.FC<AdminOverviewCardComponentProps> = ({
  text,
  number = '0',
  percentage,
  trend,
  className = '',
  icon,
  iconBg = '',
  iconColor = '',
  description,
  showUpcomingLeavesDetails,
}) => {
  const [showUpcomingLeavesDetailsModal, setShowUpcomingLeavesDetailsModal] = useState(false);
  return (
    <div className={`group relative w-full  overflow-hidden rounded-lg p-4 transition-all duration-300 ${className}`}>
      {/* Icon and Title Section */}
      <div className="flex items-start justify-between">
        <div className={`rounded-lg ${iconBg} p-2`}>
          <div className={`${iconColor}`}>{icon}</div>
        </div>
        {showUpcomingLeavesDetails && (
          <Button onClick={() => setShowUpcomingLeavesDetailsModal(true)} variant="outline" className="w-auto px-3 text-xs" size="icon">
            View Details
          </Button>
        )}
      </div>

      {/* Decorative line */}
      <hr className="mt-4 h-[2px] w-8 border-0 bg-current opacity-20" />

      {/* Content Section */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-600">{text}</h3>
        <div className="mt-2 flex items-baseline">
          <p className="text-2xl font-semibold text-gray-800">{number}</p>
          {percentage && (
            <span className="ml-2 text-sm text-gray-500">
              (
              {percentage}
              )
            </span>
          )}
        </div>
        {trend && (
          <div className="mt-2 flex items-center text-green-600">
            <TrendingUp className="mr-1 size-4" />
            <span className="text-sm">{trend}</span>
          </div>
        )}
        {description && (
          <p className="mt-2 text-xs text-gray-500">{description}</p>
        )}
      </div>

      {/* Background decoration */}
      <div className="absolute -bottom-4 -right-4 opacity-5 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      {showUpcomingLeavesDetailsModal && (
        <ModalUI
          isOpen={showUpcomingLeavesDetailsModal}
          handleClose={() => setShowUpcomingLeavesDetailsModal(false)}
        >
          <ShowUpcomingLeaves onClose={() => setShowUpcomingLeavesDetailsModal(false)} />
        </ModalUI>
      )}
    </div>
  );
};

export default AdminOverviewCardComponent;
