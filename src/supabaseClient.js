import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://suutljskofhupeacctok.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1dXRsanNrb2ZodXBlYWNjdG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjQ3MzIsImV4cCI6MjA5MjY0MDczMn0.q1Dy_z9ngmO63LGD95Pgm6fT2J7A5wsEx4Vkeim-qgs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)