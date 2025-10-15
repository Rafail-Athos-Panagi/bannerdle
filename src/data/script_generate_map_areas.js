// run node script_generate_map_areas.js

import fs from 'fs';

// Read map areas data
const mapAreasData = JSON.parse(fs.readFileSync('src/data/map_areas.json', 'utf8'));
const mapAreaNames = mapAreasData.map(area => area.name);

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
const guessedMapAreas = {};

// Shuffle map area names to get unique random selections
const shuffledMapAreas = shuffleArray(mapAreaNames);

// Ensure we don't exceed available map areas
const daysToGenerate = Math.min(380, mapAreaNames.length);

for (let i = 0; i < daysToGenerate; i++) {
  const currentDate = new Date(startDate);
  currentDate.setDate(startDate.getDate() + i);
  const dateString = currentDate.toISOString().split('T')[0];
  
  // Select unique map area from shuffled array
  const selectedMapArea = shuffledMapAreas[i];
  
  guessedMapAreas[dateString] = {
    id: i + 1,
    name: selectedMapArea
  };
}

// Write to file
fs.writeFileSync('src/data/guessed_map_areas.json', JSON.stringify(guessedMapAreas, null, 2));
console.log(`Generated guessed_map_areas.json with ${daysToGenerate} unique map area selections`);
console.log('Total map areas available:', mapAreaNames.length);
console.log('First few entries:', Object.entries(guessedMapAreas).slice(0, 5));

// Verify no duplicates
const selectedNames = Object.values(guessedMapAreas).map(item => item.name);
const uniqueNames = new Set(selectedNames);
console.log('Verification - Total selections:', selectedNames.length);
console.log('Verification - Unique selections:', uniqueNames.size);
console.log('Verification - No duplicates:', selectedNames.length === uniqueNames.size);