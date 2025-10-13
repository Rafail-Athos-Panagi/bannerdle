-- Database Cleanup/Removal Script
-- This script removes all tables, functions, views, and policies from the Bannerlord Quest database
-- WARNING: This will permanently delete all data!

-- =============================================
-- DROP ALL TABLES (in correct order due to foreign keys)
-- =============================================

-- Drop used tables first (they might reference master tables)
DROP TABLE IF EXISTS used_troops CASCADE;
DROP TABLE IF EXISTS used_map_areas CASCADE;

-- Drop master tables
DROP TABLE IF EXISTS troops CASCADE;
DROP TABLE IF EXISTS map_areas CASCADE;

-- =============================================
-- DROP ALL FUNCTIONS
-- =============================================

DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- =============================================
-- DROP ALL VIEWS
-- =============================================

DROP VIEW IF EXISTS data_status CASCADE;

-- =============================================
-- DROP ALL INDEXES (if they exist independently)
-- =============================================

-- Note: Indexes are automatically dropped when tables are dropped
-- This section is for reference only

-- =============================================
-- DROP ALL POLICIES (if they exist independently)
-- =============================================

-- Note: Policies are automatically dropped when tables are dropped
-- This section is for reference only

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check if tables still exist (should return empty results)
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('troops', 'map_areas', 'used_troops', 'used_map_areas');

-- Check if functions still exist (should return empty results)
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('update_updated_at_column');

-- Check if views still exist (should return empty results)
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name IN ('data_status');

-- =============================================
-- COMPLETION MESSAGE
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '🗑️ Database cleanup completed!';
    RAISE NOTICE 'All Bannerlord Quest tables, functions, and views have been removed.';
    RAISE NOTICE 'Database is now clean and ready for fresh setup.';
END $$;
