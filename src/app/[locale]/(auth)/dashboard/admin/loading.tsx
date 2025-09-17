import Loader from '@/components/ui/Loader';

export default function AdminDashboardLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <Loader
        size="lg"
        color="#000000"
        withText
        text="Loading admin dashboard..."
      />
    </div>
  );
}
