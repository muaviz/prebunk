export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-800 border-t-sky-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium">Loading intelligence data...</p>
      </div>
    </div>
  );
}
