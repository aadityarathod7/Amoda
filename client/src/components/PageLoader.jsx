export default function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-accent border-t-primary rounded-full animate-spin" />
        <p className="font-serif text-secondary text-sm tracking-widest">Amoda</p>
      </div>
    </div>
  );
}
