import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://amivdicqjbodvtpfbsew.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtaXZkaWNxamJvZHZ0cGZic2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDA2MDksImV4cCI6MjA3NTQ3NjYwOX0.qjJtU9RiBntJiTKvvLzoDaZqnne4sPcCO3n38ZkokLU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
