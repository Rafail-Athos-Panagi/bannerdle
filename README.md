# Bannerlord Quest - Next.js Version

This is the Next.js migration of the Bannerlord Quest application, originally built with Vite + React. A medieval-themed guessing game inspired by Mount & Blade II: Bannerlord, featuring two distinct game modes for testing your knowledge of Calradia's troops and geography.

## Features

- **Troop Quest**: Daily troop guessing game with strategic hints and progressive difficulty
- **Map Quest (Calradia Globule)**: Interactive map exploration game for Calradia settlements and areas
- **Contact Page**: User feedback and support system
- **Responsive Design**: Mobile-friendly medieval-themed UI with custom CSS variables
- **Real-time Updates**: Supabase integration for game state management
- **Local Storage Management**: Client-side game state persistence
- **Scheduler Integration**: Automated daily content updates
- **Interactive Maps**: Leaflet-based map visualization with custom markers
- **Medieval Theme**: Immersive UI with custom fonts, colors, and medieval aesthetics

## Tech Stack

- **Framework**: Next.js 15.5.4 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Maps**: Leaflet 1.9.4 with React-Leaflet 5.0.0
- **Icons**: React Icons 5.5.0
- **Scheduling**: Node-cron 4.2.1
- **Runtime**: React 19.1.0
- **Linting**: ESLint 9 with Next.js config

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── checkMapArea/  # Map area validation
│   │   ├── checkTroop/    # Troop validation
│   │   ├── dailyMapAreaSelection/  # Daily map area selection
│   │   ├── dailyTroopSelection/    # Daily troop selection
│   │   ├── lastMapAreaSelection/   # Get last map area selection
│   │   ├── lastSelection/          # Get last troop selection
│   │   ├── map-areas/             # Map areas data
│   │   ├── scheduler-control/     # Scheduler management
│   │   ├── scheduler-status/      # Scheduler status
│   │   ├── selectTroop/           # Manual troop selection
│   │   ├── settlements/           # Settlements data
│   │   └── troops/               # Troops data
│   ├── calradia-globule/  # Map exploration game page
│   ├── contact/           # Contact page
│   ├── troop-quest/       # Troop guessing game page
│   ├── test-error/        # Error testing page
│   ├── error.tsx          # Global error boundary
│   ├── loading.tsx        # Global loading component
│   ├── not-found.tsx      # 404 page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── BannerHint.tsx     # Troop hint component
│   ├── ComboBox.tsx       # Custom combobox
│   ├── Countdown.tsx      # Countdown timer
│   ├── CustomSelect.tsx   # Custom select component
│   ├── DonationPopup.tsx  # Donation popup
│   ├── Home.tsx           # Home component
│   ├── HowToPlayModal.tsx # Game instructions modal
│   ├── IncorrectGuessesList.tsx # Incorrect guesses display
│   ├── Indicator.tsx      # Game indicator
│   ├── LoadingSpinner.tsx # Loading spinner
│   ├── LocalStorageInitializer.tsx # Local storage setup
│   ├── MapComponent.tsx   # Interactive map component
│   ├── MedievalNavbar.tsx # Navigation bar
│   ├── PageRefreshLoader.tsx # Page refresh loader
│   ├── ThemeImage.tsx     # Themed image component
│   ├── Tooltip.tsx        # Tooltip component
│   ├── UpdateButton.tsx   # Update button
│   └── VictoryBanner.tsx  # Victory banner
├── services/             # Business logic services
│   ├── CalradiaGlobuleService.ts # Map game service
│   ├── DailySelectionService.ts  # Daily selection service
│   ├── MapAreaGameService.ts     # Map area game logic
│   ├── MapAreaService.ts         # Map area service
│   ├── SchedulerService.ts       # Scheduler service
│   └── TroopService.ts           # Troop service
├── types/                # TypeScript type definitions
│   ├── MapArea.type.ts   # Map area types
│   ├── Settlement.type.ts # Settlement types
│   └── Troop.type.ts     # Troop types
├── hooks/                # Custom React hooks
│   └── useLocalStorageInitializer.ts # Local storage hook
├── lib/                  # Utility libraries
│   ├── scheduler-startup.ts # Scheduler initialization
│   └── supabase.ts       # Supabase client
├── dtos/                 # Data transfer objects
│   └── CheckTroop.dto.ts # Troop check DTO
└── config.ts             # App configuration
```

## API Routes

### Troop Quest Endpoints
- `GET /api/checkTroop` - Validate troop guess
- `POST /api/selectTroop` - Manual troop selection
- `POST /api/dailyTroopSelection` - Daily troop selection
- `GET /api/lastSelection` - Get last troop selection data
- `GET /api/troops` - Get all troops data

### Map Quest Endpoints
- `GET /api/checkMapArea` - Validate map area guess
- `POST /api/dailyMapAreaSelection` - Daily map area selection
- `GET /api/lastMapAreaSelection` - Get last map area selection data
- `GET /api/map-areas` - Get all map areas data
- `GET /api/settlements` - Get settlements data

### System Endpoints
- `GET /api/scheduler-status` - Get scheduler status
- `POST /api/scheduler-control` - Control scheduler operations

## Migration Notes

This project was migrated from Vite + React to Next.js with the following changes:

- Converted React Router to Next.js App Router
- Updated all import paths to use Next.js aliases (`@/`)
- Converted API endpoints to Next.js API routes
- Updated navigation components to use Next.js Link
- Maintained all original functionality and styling

## Database Setup

Run the SQL scripts in the root directory to set up your Supabase database:

### Core Schema
- `supabase-schema.sql` - Main database schema
- `supabase-complete-schema.sql` - Complete database schema with all tables

### Data Initialization
- `initialize_first_area.sql` - Initialize map areas data
- `intialize_first_troop.sql` - Initialize troop data
- `seed_map_areas.sql` - Seed map areas with comprehensive data
- `seed_troops.sql` - Seed troops with comprehensive data

### Maintenance
- `database-cleanup.sql` - Database cleanup and maintenance scripts

## Game Modes

### Troop Quest
A daily guessing game where players must identify a mystery troop from Mount & Blade II: Bannerlord using strategic hints:
- **Progressive Difficulty**: Hints become more specific with each incorrect guess
- **Faction Knowledge**: Test your knowledge of different factions and their troops
- **Daily Challenge**: New troop selected every day at 2:20 AM UTC
- **Strategic Thinking**: Use hints wisely to narrow down possibilities

### Map Quest (Calradia Globule)
An interactive map exploration game where players discover settlements and areas across Calradia:
- **Interactive Map**: Leaflet-based map with custom markers and overlays
- **Geographic Knowledge**: Learn about Calradia's geography and settlements
- **Exploration Tracking**: Keep track of discovered areas and their characteristics
- **Distance Hints**: Get directional and distance clues for incorrect guesses

## Development Features

### Local Storage Management
- Client-side game state persistence
- Automatic cleanup and refresh cycles
- Cross-session state management

### Scheduler Integration
- Automated daily content updates
- Cron-based scheduling system
- Manual scheduler control via API

### Responsive Design
- Mobile-first approach
- Custom CSS variables for theming
- Medieval-themed UI components
- Touch-friendly interactions

### Error Handling
- Global error boundaries
- Graceful fallbacks
- User-friendly error messages

## Deployment

### Environment Variables
Create a `.env.local` file with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Build Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

### Vercel Deployment
The project is configured for Vercel deployment with:
- Automatic builds on push
- Environment variable configuration
- Edge runtime optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.