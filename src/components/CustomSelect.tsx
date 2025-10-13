"use client";
import { useState, useEffect } from "react";
import initialTroops from "@/data/Troops.json";
import ComboBox from "@/components/ComboBox";
import IncorrectList from "@/components/IncorrectGuessesList";
import { Troop } from "@/types/Troop.type";
import Indicator from "@/components/Indicator";
import { TroopService, TroopGameState } from "@/services/TroopService";

// Updated interface for consolidated localStorage
interface CustomSelectProps {
  scrollTo: (direction: string) => void;
  troopGameState: TroopGameState;
  setTroopGameState: (state: TroopGameState | null) => void;
}

const CustomSelect = ({
  scrollTo,
  troopGameState,
  setTroopGameState,
}: CustomSelectProps) => {
  const [availableTroops, setAvailableTroops] = useState<Troop[]>(
    initialTroops as Troop[]
  );
  const [, setCheckResult] = useState<unknown>(null);

  // Fetch lastSelection from Supabase and store it to localStorage
  useEffect(() => {
    // Only run on client side to prevent hydration mismatches
    if (typeof window === 'undefined') return;
    
    if (!troopGameState.lastSelection) {
      const fetchLastSelection = async () => {
        try {
          const data = await TroopService.getLastSelection();
          TroopService.updateLastSelection(data);
          setTroopGameState(troopGameState ? { ...troopGameState, lastSelection: data } : null);
        } catch (error) {
          console.error("Error fetching lastSelection:", error);
        }
      };
      fetchLastSelection();
    }
  }, [troopGameState, setTroopGameState]);

  useEffect(() => {
    const incorrectGuesses = troopGameState.guesses.filter(guess => !guess.isCorrect);
    setAvailableTroops((prev) =>
      prev.filter(
        (t) => !incorrectGuesses.some((guess) => guess.troop.name === t.name)
      )
    );
  }, [troopGameState.guesses]);


  const handleSelect = async (troop: Troop) => {
    setAvailableTroops((prev) => prev.filter((t) => t.name !== troop.name));

    try {
      const result = await TroopService.makeTroopGuess(troop.name);
      
      if (result.success && result.gameState) {
        setTroopGameState(result.gameState);
        setCheckResult(result.guess);
        console.log("Check result:", result.guess);

        if (!result.guess!.isCorrect) {
          // Trigger scroll after state update
          setTimeout(() => {
            console.log("Direct scroll trigger after incorrect guess");
            scrollTo("bottom");
          }, 300);
        } else {
          // For correct guesses, scroll to top after a delay to ensure DOM updates
          setTimeout(() => {
            console.log("Scrolling to top after correct guess");
            scrollTo("top");
          }, 100);
        }
      }
    } catch (error) {
      console.error("Error checking troop:", error);
    }
  };

  return (
    <div className="w-full mt-8 mb-16">
      <ComboBox availableTroops={availableTroops} onSelect={handleSelect} />

      {troopGameState.lastSelection && (
        <div className="flex justify-center items-center mt-4 rounded bg-[#23282E] border-2 border-[#AF9767] p-2 md:p-1.5 mb-6 md:mb-8 mx-4">
          <p className="font-bold text-[#AF9767] text-sm md:text-lg text-center">
            Yesterday&apos;s troop was{" "}
            <span className="text-[#ae8f41]">
              {troopGameState.lastSelection ? troopGameState.lastSelection.name : "Loading..."}
            </span>{" "}
            <span className="text-blue-500">
              {troopGameState.lastSelection ? `#${troopGameState.lastSelection.id}` : ""}
            </span>
          </p>
        </div>
      )}

      <IncorrectList incorrectGuesses={troopGameState.guesses.filter(guess => !guess.isCorrect).map(guess => guess.troopStatus)} />
      {troopGameState.guesses.filter(guess => !guess.isCorrect).length > 0 && troopGameState.showIndicator && <Indicator />}
    </div>
  );
};

export default CustomSelect;
