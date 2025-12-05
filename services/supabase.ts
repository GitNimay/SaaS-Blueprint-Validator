import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oqtuyjldzdkfpqbybhsq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xdHV5amxkemRrZnBxYnliaHNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NzgyNDUsImV4cCI6MjA4MDQ1NDI0NX0.4mV2TrrDmZ0K-_lYNwrXoB8YZbfFe3srd81B_-dbP2s';

export const supabase = createClient(supabaseUrl, supabaseKey);
