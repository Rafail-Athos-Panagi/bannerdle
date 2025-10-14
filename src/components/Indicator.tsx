export default function MedievalIndicator() {
  return (
    <div
      className="flex flex-col items-center w-full max-w-3xl mx-auto p-2 md:p-3 bg-amber-100 border-2 border-amber-900 rounded shadow-lg animate-flip"
      style={{
        backgroundImage: "url('/scroll.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        animationDelay: "0.3s",
      }}
    >
      <div className="relative w-full text-center mb-2 md:mb-3">
        <div className="absolute left-0 top-1/2 h-px w-1/4 bg-amber-800"></div>
        <div className="absolute right-0 top-1/2 h-px w-1/4 bg-amber-800"></div>
        <h2 className="inline-block px-3 text-base md:text-xl font-bold text-amber-900 font-serif">
          Status Indicators
        </h2>
      </div>

      {/* Mobile Layout - 2 rows of 3 indicators each */}
      <div className="md:hidden w-full space-y-3">
        {/* First row */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-green-800 border-2 border-amber-900 rounded shadow-md mb-1 flex items-center justify-center"></div>
            <span className="font-serif text-amber-900 text-xs text-center">True</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-amber-600 border-2 border-amber-900 rounded shadow-md mb-1 flex items-center justify-center"></div>
            <span className="font-serif text-amber-900 text-xs text-center">Partial</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-red-800 border-2 border-amber-900 rounded shadow-md mb-1 flex items-center justify-center"></div>
            <span className="font-serif text-amber-900 text-xs text-center">False</span>
          </div>
        </div>

        {/* Second row */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-[#292929] border-2 border-amber-900 rounded shadow-md mb-1 flex items-center justify-center">
              <img
                src="/sword4.png"
                alt="Sword"
                className="w-6 h-8 rotate-180"
              />
            </div>
            <span className="font-serif text-amber-900 text-xs text-center">Higher</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-[#292929] border-2 border-amber-900 rounded shadow-md mb-1 flex items-center justify-center">
              <img src="/sword4.png" alt="Sword" className="w-6 h-8" />
            </div>
            <span className="font-serif text-amber-900 text-xs text-center">Lower</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-[#292929] border-2 border-amber-900 rounded shadow-md mb-1 flex items-center justify-center">
              <img src="/sword_same1.png" alt="Sword" className="w-8 h-8" />
            </div>
            <span className="font-serif text-amber-900 text-xs text-center">Same</span>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Single row */}
      <div className="hidden md:flex justify-between w-full max-w-2xl">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-green-800 border-2 border-amber-900 rounded shadow-md mb-2 flex items-center justify-center"></div>
          <span className="font-serif text-amber-900">True</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-amber-600 border-2 border-amber-900 rounded shadow-md mb-2 flex items-center justify-center"></div>
          <span className="font-serif text-amber-900">Partial</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-red-800 border-2 border-amber-900 rounded shadow-md mb-2 flex items-center justify-center"></div>
          <span className="font-serif text-amber-900">False</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-[#292929] border-2 border-amber-900 rounded shadow-md mb-2 flex items-center justify-center">
            <img
              src="/sword4.png"
              alt="Sword"
              className="w-10 h-14 rotate-180"
            />
          </div>
          <span className="font-serif text-amber-900">Greater Tier</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-[#292929] border-2 border-amber-900 rounded shadow-md mb-2 flex items-center justify-center">
            <img src="/sword4.png" alt="Sword" className="w-10 h-14" />
          </div>
          <span className="font-serif text-amber-900">Lower Tier</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-[#292929] border-2 border-amber-900 rounded shadow-md mb-2 flex items-center justify-center">
            <img src="/sword_same1.png" alt="Sword" className="w-14 h-14" />
          </div>
          <span className="font-serif text-amber-900">True Tier</span>
        </div>
      </div>
    </div>
  );
}
