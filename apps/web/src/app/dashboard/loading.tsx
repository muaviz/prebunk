export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-24 bg-muted rounded-md"></div>
        <div className="h-24 bg-muted rounded-md"></div>
        <div className="h-24 bg-muted rounded-md"></div>
      </div>
      <div className="h-96 bg-muted rounded-md mt-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="h-40 bg-muted rounded-md"></div>
        <div className="h-40 bg-muted rounded-md"></div>
        <div className="h-40 bg-muted rounded-md"></div>
      </div>
    </div>
  );
}
