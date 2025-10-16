export default function MedievalIndicator() {
  return (
    <div
      className="flex flex-col items-center w-full max-w-2xl mx-auto p-1 md:p-2 bg-amber-100 border-2 border-amber-900 rounded shadow-lg animate-flip"
      style={{
        backgroundImage: "url('/scroll.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        animationDelay: "0.3s",
      }}
    >
      <div className="relative w-full text-center mb-1 md:mb-2">
        <div className="absolute left-0 top-1/2 h-px w-1/4 bg-amber-800"></div>
        <div className="absolute right-0 top-1/2 h-px w-1/4 bg-amber-800"></div>
        <h2 className="inline-block px-2 text-sm md:text-base font-bold text-amber-900 font-serif">
          Status Indicators
        </h2>
      </div>

      {/* Mobile Layout - 2 rows of 3 indicators each */}
      <div className="md:hidden w-full space-y-2">
        {/* First row */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-green-800 border-2 border-amber-900 rounded shadow-md mb-1 flex items-center justify-center"></div>
            <span className="font-serif text-amber-900 text-[10px] text-center">True</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-amber-600 border-2 border-amber-900 rounded shadow-md mb-1 flex items-center justify-center"></div>
            <span className="font-serif text-amber-900 text-[10px] text-center">Partial</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-red-800 border-2 border-amber-900 rounded shadow-md mb-1 flex items-center justify-center"></div>
            <span className="font-serif text-amber-900 text-[10px] text-center">False</span>
          </div>
        </div>

        {/* Second row */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-[#292929] border-2 border-amber-900 rounded shadow-md mb-1 flex items-center justify-center">
              <img
                src="/sword4.png"
                alt="Sword"
                className="w-5 h-6 rotate-180"
              />
            </div>
            <span className="font-serif text-amber-900 text-[10px] text-center">Higher</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-[#292929] border-2 border-amber-900 rounded shadow-md mb-1 flex items-center justify-center">
              <img src="/sword4.png" alt="Sword" className="w-5 h-6" />
            </div>
            <span className="font-serif text-amber-900 text-[10px] text-center">Lower</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-[#292929] border-2 border-amber-900 rounded shadow-md mb-1 flex items-center justify-center">
              <img src="/sword_same1.png" alt="Sword" className="w-6 h-6" />
            </div>
            <span className="font-serif text-amber-900 text-[10px] text-center">Same</span>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Single row */}
      <div className="hidden md:flex justify-between w-full max-w-xl">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-green-800 border-2 border-amber-900 rounded shadow-md mb-1 flex items-center justify-center"></div>
          <span className="font-serif text-amber-900 text-xs">True</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-amber-600 border-2 border-amber-900 rounded shadow-md mb-1 flex items-center justify-center"></div>
          <span className="font-serif text-amber-900 text-xs">Partial</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-red-800 border-2 border-amber-900 rounded shadow-md mb-1 flex items-center justify-center"></div>
          <span className="font-serif text-amber-900 text-xs">False</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-[#292929] border-2 border-amber-900 rounded shadow-md mb-1 flex items-center justify-center">
            <img
              src="/sword4.png"
              alt="Sword"
              className="w-8 h-10 rotate-180"
            />
          </div>
          <span className="font-serif text-amber-900 text-xs">Greater Tier</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-[#292929] border-2 border-amber-900 rounded shadow-md mb-1 flex items-center justify-center">
            <img src="/sword4.png" alt="Sword" className="w-8 h-10" />
          </div>
          <span className="font-serif text-amber-900 text-xs">Lower Tier</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-[#292929] border-2 border-amber-900 rounded shadow-md mb-1 flex items-center justify-center">
            <img src="/sword_same1.png" alt="Sword" className="w-10 h-10" />
          </div>
          <span className="font-serif text-amber-900 text-xs">True Tier</span>
        </div>
      </div>
    </div>
  );
}
