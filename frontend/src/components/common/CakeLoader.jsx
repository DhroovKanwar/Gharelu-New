export default function CakeLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-brand-bg">
      <div className="relative flex h-24 w-24 items-center justify-center">
        {/* Soft ring */}
        <div className="absolute inset-0 animate-[spin_2s_linear_infinite] rounded-full border-[3px] border-brand-line border-t-brand-accent" />

        {/* Cookie */}
        <div className="relative h-14 w-14 animate-[pulse_1.5s_ease-in-out_infinite] rounded-full bg-brand-accent shadow-[0_8px_25px_rgba(0,0,0,0.12)]">
          {/* Cookie chips */}
          <span className="absolute left-3 top-3 h-2 w-2 rounded-full bg-brand-dark/70" />
          <span className="absolute right-3 top-4 h-2.5 w-2.5 rounded-full bg-brand-dark/70" />
          <span className="absolute left-5 bottom-3 h-2 w-2 rounded-full bg-brand-dark/70" />
          <span className="absolute right-2 bottom-5 h-1.5 w-1.5 rounded-full bg-brand-dark/70" />
        </div>
      </div>
    </div>
  );
}