import { Button } from '@/components/ui/button';
import React from 'react';

type FormActionButtonsProps = {
  submitText: string;
  isFormDisabled: boolean;
  processingMessage?: string;
  showReset?: boolean;
  onReset?: () => void;
  className?: string;
};

const FormActionButtons: React.FC<FormActionButtonsProps> = ({
  submitText,
  isFormDisabled,
  processingMessage,
  showReset = false,
  onReset,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      <Button
        type="submit"
        disabled={isFormDisabled}
        className="w-full bg-primary-100 hover:bg-primary-100/90 sm:w-auto"
      >
        {isFormDisabled
          ? (
              <>
                <div className="mr-2 size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {processingMessage || 'Processing...'}
              </>
            )
          : (
              submitText
            )}
      </Button>

      {showReset && onReset && (
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          disabled={isFormDisabled}
          className="w-full border-secondary-200 sm:w-auto"
        >
          Reset
        </Button>
      )}
    </div>
  );
};

export default FormActionButtons;
