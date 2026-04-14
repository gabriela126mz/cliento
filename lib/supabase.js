import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bxoxibzyzmbwefpknxgf.supabase.co";
const supabaseAnonKey = "sb_publishable_kifozOQxCwKpcVIDahqbag_36jwYURP";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);