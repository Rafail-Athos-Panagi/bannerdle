'use client';

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import BannerHint from "@/components/BannerHint";
import { Home } from "@/components/Home";
import MedievalNavbar from "@/components/MedievalNavbar";
import PageRefreshLoader from "@/components/PageRefreshLoader";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Troop } from "@/types/Troop.type";
import { TroopService, TroopGameState } from "@/services/TroopService";

// Dynamically import CustomSelect to prevent hydration issues
const CustomSelect = dynamic(() => import("@/components/CustomSelect"), {
  ssr: false,
  loading: () => <div className="w-full mt-8 mb-16">Loading...</div>
});

export default function TroopGuessGame() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [troopGameState, setTroopGameState] = useState<TroopGameState | null>(null);

  // Initialize game state
  useEffect(() => {
    // Only run on client side to prevent hydration mismatches
    if (typeof window === 'undefined') return;
    
    const gameState = TroopService.getGameState();
    setTroopGameState(gameState);
  }, []);

  // Scheduling logic: clear localStorage and then call selectTroop
  useEffect(() => {
    // Only run on client side to prevent hydration mismatches
    if (typeof window === 'undefined') return;

    function scheduleLocalStorageClearAndSelectTroop(
      targetHour: number,
      targetMinute: number
    ) {
      const now = new Date();
      const targetTime = new Date();

      // Set target time to today at targetHour:targetMinute:00
      targetTime.setHours(targetHour, targetMinute, 0, 0);

      // If the target time is already past for today, schedule for tomorrow
      if (targetTime <= now) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      // Calculate the delay until the target time
      const delay = targetTime.getTime() - now.getTime();
      console.log(`Action scheduled for: ${targetTime.toLocaleString()}`);

      // Set a timeout for the initial action at targetTime
      setTimeout(async () => {
        // Clear localStorage
        localStorage.clear();
        console.log(
          `localStorage cleared at ${new Date().toLocaleTimeString()}`
        );

        // Call the dailyTroopSelection service
        try {
          await TroopService.dailyTroopSelection();
        } catch (error) {
          console.error("Error calling dailyTroopSelection service:", error);
        }

        // Set an interval to repeat the clear and API call every 24 hours
        setInterval(async () => {
          localStorage.clear();
          console.log(
            `localStorage cleared at ${new Date().toLocaleTimeString()}`
          );
          try {
            await TroopService.dailyTroopSelection();
          } catch (error) {
            console.error("Error calling dailyTroopSelection service:", error);
          }
        }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
      }, delay);
    }

    // Schedule the action for 21:05 (9:05 PM)
    scheduleLocalStorageClearAndSelectTroop(2, 20);
  }, []);

  const scrollTo = (direction: string) => {
    console.log(`scrollTo called with direction: ${direction}`);
    if (scrollContainerRef.current) {
      console.log("Scroll container found");
      if (direction === "bottom") {
        console.log("Scrolling to bottom");
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      } else {
        console.log("Scrolling to top");
        scrollContainerRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } else {
      console.log("Scroll container not found!");
    }
  };

  if (!troopGameState) {
    return <LoadingSpinner message="Loading Troop Quest..." size="large" />;
  }

  return (
    <PageRefreshLoader loadingMessage="Refreshing Troop Quest...">
      <div 
        className="h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col"
        style={{ 
          backgroundImage: 'url(/bg-1.jpg)',
          backgroundAttachment: 'fixed'
        }}
        suppressHydrationWarning={true}
      >
        <MedievalNavbar />
        <div
          className="relative scrollbar-thin h-screen flex justify-center overflow-y-auto scroll-smooth mt-9 lg:mt-11"
          ref={scrollContainerRef}
        >
          <div className="flex flex-col z-10 rounded-lg w-full max-w-2xl mx-auto px-1.5 sm:px-2.5 py-1.5">
            <div className="flex items-center justify-center">
              <BannerHint
                scrollTo={scrollTo}
                setShowIndicatorApp={(showIndicator) => {
                  TroopService.updateShowIndicator(showIndicator);
                  setTroopGameState(prev => prev ? { ...prev, showIndicator } : null);
                }}
              />
            </div>
            <Home correctGuess={troopGameState.correctGuess?.troop || {} as Troop} />
            <div className="flex flex-col">
              <CustomSelect
                scrollTo={scrollTo}
                troopGameState={troopGameState}
                setTroopGameState={setTroopGameState}
              />
            </div>
          </div>
        </div>
      </div>
    </PageRefreshLoader>
  );
}
