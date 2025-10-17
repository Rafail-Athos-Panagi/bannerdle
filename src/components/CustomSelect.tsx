"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import React from "react";
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
  onToggleIndicator?: () => void;
}

const CustomSelect = React.memo(({
  scrollTo,
  troopGameState,
  setTroopGameState,
  onToggleIndicator,
}: CustomSelectProps) => {
  const [availableTroops, setAvailableTroops] = useState<Troop[]>([]);
  const [, setCheckResult] = useState<unknown>(null);

  // Memoize incorrect guesses to prevent unnecessary recalculations
  const incorrectGuesses = useMemo(() => 
    troopGameState.guesses.filter(guess => !guess.isCorrect),
    [troopGameState.guesses]
  );

  // Memoize incorrect guesses for IncorrectList
  const incorrectGuessesForList = useMemo(() => 
    incorrectGuesses.map(guess => guess.troopStatus),
    [incorrectGuesses]
  );

  // Fetch troops from API on component mount
  useEffect(() => {
    const fetchTroops = async () => {
      try {
        const response = await fetch('/api/troops');
        if (response.ok) {
          const troops = await response.json();
          setAvailableTroops(troops);
        } else {
          console.error('Failed to fetch troops');
        }
      } catch (error) {
        console.error('Error fetching troops:', error);
      }
    };
    
    fetchTroops();
  }, []);

  // Fetch lastSelection from API and store it to localStorage
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

  // Optimize troop filtering with useMemo
  useEffect(() => {
    setAvailableTroops((prev) =>
      prev.filter(
        (t) => !incorrectGuesses.some((guess) => guess.troop.name === t.name)
      )
    );
  }, [incorrectGuesses]);

  const handleSelect = useCallback(async (troop: Troop) => {
    setAvailableTroops((prev) => prev.filter((t) => t.name !== troop.name));

    try {
      const result = await TroopService.makeTroopGuess(troop.name);
      
      if (result.success && result.gameState) {
        setTroopGameState(result.gameState);
        setCheckResult(result.guess);

        if (!result.guess!.isCorrect) {
          // Trigger scroll after state update
          setTimeout(() => {
            scrollTo("bottom");
          }, 300);
        } else {
          // For correct guesses, scroll to top after a delay to ensure DOM updates
          setTimeout(() => {
            scrollTo("top");
          }, 100);
        }
      }
    } catch (error) {
      console.error("Error checking troop:", error);
    }
  }, [scrollTo, setTroopGameState]);

  return (
    <div className="w-full mt-4 sm:mt-6 lg:mt-8 mb-8 sm:mb-12 lg:mb-16">
      <ComboBox 
        availableTroops={availableTroops} 
        onSelect={handleSelect} 
        disabled={!!troopGameState.correctGuess}
      />

      {troopGameState.lastSelection && (
        <div className="flex justify-center items-center mt-3 sm:mt-4 rounded bg-[#23282E] border border-[#AF9767] p-1.5 sm:p-2 lg:p-2.5 mb-4 sm:mb-6 lg:mb-8 mx-2 sm:mx-4">
          <p className="font-bold text-[#AF9767] text-sm text-center">
            Yesterday&apos;s troop was{" "}
            <span className="text-[#ae8f41]">
              {troopGameState.lastSelection ? troopGameState.lastSelection.name : "Loading..."}
            </span>{" "}
            <span className="text-blue-500">
              {troopGameState.lastSelection?.id ? `#${troopGameState.lastSelection.id}` : ""}
            </span>
          </p>
        </div>
      )}

      <IncorrectList 
        incorrectGuesses={incorrectGuessesForList} 
        showIndicator={troopGameState.showIndicator}
        onToggleIndicator={onToggleIndicator}
      />
      {incorrectGuesses.length > 0 && troopGameState.showIndicator && <Indicator />}
    </div>
  );
});

CustomSelect.displayName = 'CustomSelect';

export default CustomSelect;
