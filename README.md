# Bannerlord Quest - Next.js Version

This is the Next.js migration of the Bannerlord Quest application, originally built with Vite + React.

## Features

- **Troop Quest**: Daily troop guessing game with strategic hints
- **Map Quest**: Interactive map exploration game for Calradia settlements
- **Responsive Design**: Mobile-friendly medieval-themed UI
- **Real-time Updates**: Supabase integration for game state management

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Maps**: Leaflet with React-Leaflet
- **Icons**: React Icons

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
│   ├── troop-quest/       # Troop guessing game page
│   ├── calradia-globule/  # Map exploration game page
│   └── page.tsx           # Homepage
├── components/            # React components
├── services/             # Business logic services
├── types/                # TypeScript type definitions
├── data/                 # Static data files
└── lib/                  # Utility libraries
```

## API Routes

- `GET /api/checkTroop` - Check troop guess
- `POST /api/selectTroop` - Manual troop selection
- `POST /api/dailyTroopSelection` - Daily troop selection
- `GET /api/lastSelection` - Get last selection data

## Migration Notes

This project was migrated from Vite + React to Next.js with the following changes:

- Converted React Router to Next.js App Router
- Updated all import paths to use Next.js aliases (`@/`)
- Converted API endpoints to Next.js API routes
- Updated navigation components to use Next.js Link
- Maintained all original functionality and styling

## Database Setup

Run the SQL scripts in the root directory to set up your Supabase database:

- `supabase-schema.sql` - Main database schema
- `initialize_first_area.sql` - Initialize map areas
- `intialize_first_troop.sql` - Initialize troop data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.