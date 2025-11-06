export default function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="animate-pulse text-2xl">
        <span className="font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
            BETA
        </span>
        <span className="font-light text-slate-600">report</span>
      </div>
    </div>
  );
}
