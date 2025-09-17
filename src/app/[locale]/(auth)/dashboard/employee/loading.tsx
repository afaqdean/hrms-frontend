import Loader from '@/components/ui/Loader';

export default function EmployeeDashboardLoading() {
  return (
    <div className="fixed inset-0 flex size-full items-center justify-center">
      <Loader
        size="lg"
        color="#000000"
        withText
        text="Loading employee dashboard..."
      />
    </div>
  );
}
