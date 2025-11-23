import { createClient } from '@supabase/supabase-js';

// Configuration: Prioritize Environment Variables (for Cloudflare), fallback to hardcoded (for local/testing)
// Casting import.meta to any to avoid "Property 'env' does not exist on type 'ImportMeta'" error
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://bompabgcvizbqryszxpv.supabase.co';
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbXBhYmdjdml6YnFyeXN6eHB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MjQ4NzgsImV4cCI6MjA3OTUwMDg3OH0.MSSsiPuHaxVPQPzDafwCVGX2rUGpCRoOcuVLnkZycY4';

export const supabase = createClient(supabaseUrl, supabaseKey);