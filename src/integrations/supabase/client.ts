// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zodidixpxznfsopxdhyr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZGlkaXhweHpuZnNvcHhkaHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NDYyNzcsImV4cCI6MjA2NTUyMjI3N30.QrJGt1D-NUbvUxYGZ6XY0x-67AIh7lgIjX6qwk-v6mg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);