const Header = () => {
  return (
    <header className="gradient-amway shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
        <img src="/logo.png" alt="Amway" className="h-7 brightness-0 invert" />
        <div className="h-5 w-px bg-white/30" />
        <span className="font-display text-white text-lg font-semibold tracking-wide">
          QAS Evaluation
        </span>
      </div>
    </header>
  );
};

export default Header;
