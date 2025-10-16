import { TroopStatus } from "@/types/Troop.type";
import { FaQuestionCircle } from "react-icons/fa";
import Tooltip from "@/components/Tooltip";

interface IncorrectListProps {
  incorrectGuesses: TroopStatus[];
  showIndicator?: boolean;
  onToggleIndicator?: () => void;
}

const IncorrectList = ({ incorrectGuesses, showIndicator, onToggleIndicator }: IncorrectListProps) => {
  if (incorrectGuesses.length === 0) return null;
  return (
    <div className="mt-6">
      <div
        style={{ animationDelay: "0.4s" }}
        className="animate-flip bg-[#342B26] p-2 rounded"
      >
        <div className="w-full bg-[#342B26] flex flex-col items-center justify-center relative">
          <h2
            style={{ animationDelay: "0.8s" }}
            className="animate-flip text-lg font-bold text-[#D7B587] text-center bg-[#342B26] p-1"
          >
            Guessed Troops
          </h2>
          <p className="border-b-2 border-[#53481b] rounded w-2/4"></p>
          
          {/* Question mark chip in upper right corner - responsive sizing */}
          {onToggleIndicator && (
            <div className="absolute top-1 right-1 z-10">
              <Tooltip 
                content={showIndicator ? "Hide status indicators" : "Show status indicators"}
                position="left"
                delay={300}
              >
                <button
                  onClick={onToggleIndicator}
                  className={`flex items-center justify-center rounded-full border transition-all duration-200 hover:scale-110 text-xs font-bold w-3 h-3 sm:w-6 sm:h-6 ${
                    showIndicator 
                      ? "bg-[#AF9767] border-[#AF9767] text-black hover:bg-[#8B6F47]" 
                      : "bg-[#39352D] border-[#AF9767] text-[#AF9767] hover:bg-[#4A4538]"
                  }`}
                >
                  <FaQuestionCircle className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                </button>
              </Tooltip>
            </div>
          )}
        </div>
        <div className="hidden md:grid grid-cols-8 gap-4 mt-2">
          <div className="animate-flip text-center text-[#D7B587] font-bold text-xs" style={{ animationDelay: "1.2s" }}>Image</div>
          <div className="animate-flip text-center text-[#D7B587] font-bold text-xs" style={{ animationDelay: "1.4s" }}>Name</div>
          <div className="animate-flip text-center text-[#D7B587] font-bold text-xs" style={{ animationDelay: "1.6s" }}>Tier</div>
          <div className="animate-flip text-center text-[#D7B587] font-bold text-xs" style={{ animationDelay: "1.8s" }}>Type</div>
          <div className="animate-flip text-center text-[#D7B587] font-bold text-xs" style={{ animationDelay: "2.0s" }}>Occupation</div>
          <div className="animate-flip text-center text-[#D7B587] font-bold text-xs" style={{ animationDelay: "2.2s" }}>Banner</div>
          <div className="animate-flip text-center text-[#D7B587] font-bold text-xs" style={{ animationDelay: "2.4s" }}>Culture</div>
          <div className="animate-flip text-center text-[#D7B587] font-bold text-xs" style={{ animationDelay: "2.6s" }}>Faction</div>
        </div>
      </div>
      <div className="space-y-4 mt-1 bg-[#111827] p-1 md:p-2 shadow-lg">
        {incorrectGuesses.map((guess, index) => (
          <div
            key={guess.name}
            style={{ animationDelay: `${index * 0.4}s` }}
            className="animate-flip md:grid md:grid-cols-8 md:gap-4 md:h-32 p-2 md:p-3 rounded bg-gradient-to-r from-[#1c1c1c] via-[#2d2d2d] to-[#1c1c1c] transition-all duration-300 ease hover:shadow-[0_0_12px_rgba(255,215,0,0.5)]"
          >
            {/* Mobile Layout */}
            <div className="md:hidden space-y-2">
              <div className="flex items-center space-x-2">
                <img
                  src={guess.image}
                  alt={guess.name}
                  className="w-10 h-10 rounded"
                />
                <div className="flex-1">
                  <h3 className={`text-sm font-bold ${
                    guess.nameStatus === "Wrong" ? "text-red-500" : "text-green-500"
                  }`}>
                    {guess.name}
                  </h3>
                  <div className="flex items-center justify-start mt-1 space-x-2">
                    <div className="w-12 h-12 bg-[#292929] border-2 border-[#53481b] rounded shadow-md flex items-center justify-center">
                      {guess.tierStatus === "Higher" ? (
                        <img
                          src="/sword4.png"
                          alt="Sword"
                          className="w-8 h-10 rotate-180"
                        />
                      ) : guess.tierStatus === "Lower" ? (
                        <img src="/sword4.png" alt="Sword" className="w-8 h-10" />
                      ) : (
                        <img src="/sword_same1.png" alt="Sword" className="w-10 h-10" />
                      )}
                    </div>
                    <img
                      src={guess.banner}
                      alt={guess.banner.toString()}
                      className={`w-10 h-10 rounded-full border-2 ${
                        guess.bannerStatus === "Wrong"
                          ? "border-red-500"
                          : "border-green-500"
                      }`}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`animate-flip p-2 rounded border-b-4 border-t-4 border-[#53481b] flex flex-col items-center justify-center ${
                  guess.typeStatus === "Wrong"
                    ? "text-red-500"
                    : guess.typeStatus === "Partial"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`} style={{ animationDelay: `${(index * 0.4) + 0.2}s` }}>
                  <span className="font-semibold text-[#D7B587]">Type:</span> {guess.type}
                </div>
                <div className={`animate-flip p-2 rounded border-b-4 border-t-4 border-[#53481b] flex flex-col items-center justify-center ${
                  guess.occupationStatus === "Wrong"
                    ? "text-red-500"
                    : "text-green-500"
                }`} style={{ animationDelay: `${(index * 0.4) + 0.4}s` }}>
                  <span className="font-semibold text-[#D7B587]">Occupation:</span> {guess.occupation}
                </div>
                <div className={`animate-flip p-2 rounded border-b-4 border-t-4 border-[#53481b] flex flex-col items-center justify-center ${
                  guess.cultureStatus === "Wrong"
                    ? "text-red-500"
                    : "text-green-500"
                }`} style={{ animationDelay: `${(index * 0.4) + 0.6}s` }}>
                  <span className="font-semibold text-[#D7B587]">Culture:</span> {guess.culture}
                </div>
                <div className={`animate-flip p-2 rounded border-b-4 border-t-4 border-[#53481b] flex flex-col items-center justify-center ${
                  guess.factionStatus === "Wrong"
                    ? "text-red-500"
                    : "text-green-500"
                }`} style={{ animationDelay: `${(index * 0.4) + 0.8}s` }}>
                  <span className="font-semibold text-[#D7B587]">Faction:</span> {guess.faction}
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex animate-flip justify-center items-center rounded border-b-4 border-t-4 border-[#53481b]" style={{ animationDelay: `${(index * 0.4) + 0.2}s` }}>
              <img
                src={guess.image}
                alt={guess.name}
                className="w-18 h-16 rounded"
              />
            </div>
            <div className="hidden md:flex animate-flip w-full justify-center items-center text-[#D7B587] text-center rounded border-b-4 border-t-4 border-[#53481b]" style={{ animationDelay: `${(index * 0.4) + 0.4}s` }}>
              <span className={`text-sm ${guess.nameStatus === "Wrong" ? "text-red-500" : "text-green-500"}`}>
                {guess.name}
              </span>
            </div>
            <div className="hidden md:block animate-flip relative w-full h-full rounded border-b-4 border-t-4 border-[#53481b]" style={{ animationDelay: `${(index * 0.4) + 0.6}s` }}>
              <div
                style={{
                  backgroundImage:
                    guess.tierStatus === "Same"
                      ? "url('sword_same1.png')"
                      : "url('sword4.png')",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: guess.tierStatus === "Same" ? "140%" : "110%",
                  backgroundPosition: "center",
                  transform:
                    guess.tierStatus === "Higher" ? "rotate(180deg)" : "none",
                  opacity: 0.7,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 0,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top:
                    guess.tierStatus === "Higher"
                      ? "58%"
                      : guess.tierStatus === "Lower"
                      ? "45%"
                      : "48%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1,
                  width: "100%",
                }}
                className="flex justify-center items-center text-[#D7B587] text-sm font-bold"
              >
                {guess.tier}
              </div>
            </div>
            <div className="hidden md:flex animate-flip justify-center items-center text-center rounded border-b-4 border-t-4 border-[#53481b]" style={{ animationDelay: `${(index * 0.4) + 0.8}s` }}>
              <span className={`text-sm ${
                guess.typeStatus === "Wrong"
                  ? "text-red-500"
                  : guess.typeStatus === "Partial"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}>
                {guess.type}
              </span>
            </div>
            <div className="hidden md:flex animate-flip justify-center items-center text-center rounded border-b-4 border-t-4 border-[#53481b]" style={{ animationDelay: `${(index * 0.4) + 1.0}s` }}>
              <span className={`text-sm ${
                guess.occupationStatus === "Wrong"
                  ? "text-red-500"
                  : "text-green-500"
              }`}>
                {guess.occupation}
              </span>
            </div>
            <div className="hidden md:flex animate-flip justify-center items-center rounded border-b-4 border-t-4 border-[#53481b]" style={{ animationDelay: `${(index * 0.4) + 1.2}s` }}>
              <img
                src={guess.banner}
                alt={guess.banner.toString()}
                className={`w-18 h-18 rounded-full border-4 ${
                  guess.bannerStatus === "Wrong"
                    ? "border-red-500"
                    : "border-green-500"
                }`}
              />
            </div>
            <div className="hidden md:flex animate-flip justify-center items-center text-center rounded border-b-4 border-t-4 border-[#53481b]" style={{ animationDelay: `${(index * 0.4) + 1.4}s` }}>
              <span className={`text-sm ${
                guess.cultureStatus === "Wrong"
                  ? "text-red-500"
                  : "text-green-500"
              }`}>
                {guess.culture}
              </span>
            </div>
            <div className="hidden md:flex animate-flip justify-center items-center text-center rounded border-b-4 border-t-4 border-[#53481b]" style={{ animationDelay: `${(index * 0.4) + 1.6}s` }}>
              <span className={`text-sm ${
                guess.factionStatus === "Wrong"
                  ? "text-red-500"
                  : "text-green-500"
              }`}>
                {guess.faction}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncorrectList;
