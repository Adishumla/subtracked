import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://xjzqjzqjxqjzjxqjzqjz.supabase.co";
const supabaseAnonKey = "https://eyzowvekoomzjzjxkyhn.supabase.co/";
("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5em93dmVrb29temp6anhreWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM5ODg5NzMsImV4cCI6MjAwOTU2NDk3M30.WcxXmr1zcw-ALFBd0Ma9u2tpZrFje64BN5WUTZssq10");
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string */

export default supabase;
