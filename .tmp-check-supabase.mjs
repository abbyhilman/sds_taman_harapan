import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const raw = fs.readFileSync('.env','utf8').replace(/^\uFEFF/, '');
const env = {};
for (const line of raw.split(/\r?\n/)) { if (!line.trim()) continue; const i=line.indexOf('='); env[line.slice(0,i).trim()] = line.slice(i+1).trim(); }
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
for (const table of ['welcome_photos','about_us','news','programs','learning_section','gallery_photos','gallery_videos','achievements','facilities']) {
  const { data, error } = await supabase.from(table).select('*').limit(3);
  if (error) { console.log('\nERR', table, error.message); continue; }
  console.log('\nTABLE', table);
  console.log(JSON.stringify(data, null, 2).slice(0, 1200));
}
