import { Troop } from "@/types/Troop.type";
import VictoryBanner from "./VictoryBanner";

export const Home = ({ correctGuess, triesCount }: { correctGuess: Troop; triesCount: number }) => {
  return (
    <>
      <div className="relative inline-block">
        <svg
          className="absolute top-[-20px] left-0 w-full h-8"
          viewBox="0 0 400 50"
          preserveAspectRatio="none"
        >
          <rect
            x="0"
            y="20"
            width="400"
            height="30"
            fill="var(--bannerlord-patch-brassy-gold)"
          />
          {[0, 50, 100, 275, 325, 375].map((x) => (
            <rect
              key={x}
              x={x}
              y="0"
              width="25"
              height="20"
              fill="var(--bannerlord-menu-brownish-gray)"
            />
          ))}
        </svg>
        <div className="bg-[var(--bannerlord-patch-deep-bg)] border-2 border-[var(--bannerlord-patch-warm-tan)] p-3 md:p-4 rounded-lg z-10 text-center mt-2 shadow-lg">
          <h1 className="text-base md:text-lg font-bold text-[var(--bannerlord-patch-warm-tan)] mb-2 md:mb-3">
            Guess Today&apos;s Bannerlord Troop
          </h1>

          <p className="text-sm md:text-md text-[var(--bannerlord-patch-gold-text)] mb-3 md:mb-4">
            Type any troop name to begin your quest!
          </p>
          {correctGuess.name && <VictoryBanner correctGuess={correctGuess} triesCount={triesCount} />}
        </div>
      </div>
      <div className="relative inline-block text-left">
        <div
          className={`
          relative flex items-center justify-center
          px-4 py-1 text-lg font-bold
          w-full
          bg-[#1E140C]
          text-[var(--bannerlord-custom-light-cream)]
          transition-colors
        `}
          style={{
            clipPath: "polygon(0 0, 100% 0, 85% 100%, 15% 100%)",
          }}
        >
          {correctGuess.name ? "GOOD JOB!" : "GOOD LUCK!"}
        </div>
      </div>
    </>
  );
};
