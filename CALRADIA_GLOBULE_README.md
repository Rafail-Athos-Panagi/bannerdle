# Calradia Globule Game

A map-based guessing game inspired by Wordle, where players try to find a randomly selected settlement on the Bannerlord map of Calradia.

## How to Play

1. **Objective**: Find the hidden settlement on the map within 6 guesses
2. **Making Guesses**: Click on any settlement on the map to make a guess
3. **Feedback**: After each incorrect guess, you'll receive:
   - **Distance hint**: How far your guess is from the target (Very close, Close, Moderate distance, Far, Very far)
   - **Direction hint**: Which direction the target is from your guess (N, NE, E, SE, S, SW, W, NW)
4. **Winning**: Find the correct settlement to win!
5. **Losing**: Use all 6 guesses without finding the target

## Game Features

- **Daily Challenge**: A new settlement is randomly selected each day
- **Interactive Map**: Click on settlements to make guesses
- **Visual Feedback**: 
  - Green highlighting for correct guesses
  - Red highlighting for incorrect guesses
  - Hover effects for better interaction
- **Guess History**: See all your previous guesses with distance and direction hints
- **Game Statistics**: Track your performance over time

## Technical Implementation

- Built with React, TypeScript, and Vite
- Uses Leaflet for interactive map functionality
- Responsive design with Tailwind CSS
- Local storage for game state persistence
- Daily reset functionality

## Navigation

- Access the game from the main Banner Eureka page using the map icon
- Use the "Back to Banner Eureka" button to return to the main game
- Reset button available for testing purposes

## Settlement Data

The game includes major settlements from all factions:
- **Vlandia**: Ocs Hall, Sargot, Charas, Prawica
- **Sturgia**: Varcheg, Omur, Talsh
- **Empire**: Lageta, Poros, Amitatys, Danustica
- **Battania**: Marunath, Seonon, Pen Cannoc
- **Khuzait**: Ortongard, Akkalat, Makand
- **Aserai**: Hubyar, Quyaz, Sanala, Askar

Each settlement has defined coordinates and clickable regions on the map.
