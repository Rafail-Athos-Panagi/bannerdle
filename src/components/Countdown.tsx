import { useState, useEffect } from "react";

export default function MedievalCountdownModal() {
  function calculateTimeLeft() {
    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(23, 59, 0, 0);

    if (now >= targetTime) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    const difference = targetTime.getTime() - now.getTime();

    return {
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="animate-flip w-full flex justify-center items-center mt-4"
      style={{
        animationDelay: "1.5s",
      }}
    >
      <div className="rounded max-w-md w-full relative animate-fadeIn">
        <div className="relative w-full text-center py-2 border-b border-yellow-600">
          <h2 className="text-xl font-bold text-yellow-600 font-serif tracking-wide">
            TIMER COUNTDOWN
          </h2>
        </div>

        <div className="p-4 flex justify-center">
          <div className="flex items-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-900 border-2 border-yellow-600 rounded flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-400 font-serif">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
              </div>
              <span className="text-sm text-yellow-600 font-serif mt-1 block">
                Hours
              </span>
            </div>

            <span className="text-xl text-yellow-600 font-bold mx-2">:</span>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-900 border-2 border-yellow-600 rounded flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-400 font-serif">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
              </div>
              <span className="text-sm text-yellow-600 font-serif mt-1 block">
                Minutes
              </span>
            </div>

            <span className="text-xl text-yellow-600 font-bold mx-2">:</span>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-900 border-2 border-yellow-600 rounded flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-400 font-serif">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
              <span className="text-sm text-yellow-600 font-serif mt-1 block">
                Seconds
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-yellow-600 p-3 text-center">
          <p className="text-yellow-600 text-sm font-serif italic">
            "New troop is arriving at 23:59"
          </p>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
