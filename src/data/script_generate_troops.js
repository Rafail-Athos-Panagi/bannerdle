// run node script_generate_troops.js

import fs from 'fs';

// Read troops data
const troopsData = JSON.parse(fs.readFileSync('src/data/troops.json', 'utf8'));
const troopNames = troopsData.map(troop => troop.name);

// Fisher-Yates shuffle algorithm to get unique random selections
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate dates from 2025-10-14 for 194 days
const startDate = new Date('2025-10-14');
const guessedTroops = {};

// Shuffle troop names to get unique random selections
const shuffledTroops = shuffleArray(troopNames);

// Ensure we don't exceed available troops
const daysToGenerate = Math.min(194, troopNames.length);

for (let i = 0; i < daysToGenerate; i++) {
  const currentDate = new Date(startDate);
  currentDate.setDate(startDate.getDate() + i);
  const dateString = currentDate.toISOString().split('T')[0];
  
  // Select unique troop from shuffled array
  const selectedTroop = shuffledTroops[i];
  
  guessedTroops[dateString] = {
    id: i + 1,
    name: selectedTroop
  };
}

// Write to file
fs.writeFileSync('src/data/guessed_troops.json', JSON.stringify(guessedTroops, null, 2));
console.log(`Generated guessed_troops.json with ${daysToGenerate} unique troop selections`);
console.log('Total troops available:', troopNames.length);
console.log('First few entries:', Object.entries(guessedTroops).slice(0, 5));

// Verify no duplicates
const selectedNames = Object.values(guessedTroops).map(item => item.name);
const uniqueNames = new Set(selectedNames);
console.log('Verification - Total selections:', selectedNames.length);
console.log('Verification - Unique selections:', uniqueNames.size);
console.log('Verification - No duplicates:', selectedNames.length === uniqueNames.size);