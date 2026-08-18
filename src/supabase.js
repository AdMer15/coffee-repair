import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yptbpjqwulhbsutcwvkj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwdGJwanF3dWxoYnN1dGN3dmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5ODI0MTYsImV4cCI6MjEwMjU1ODQxNn0.BnblOghuHGptWNeZiwp34HVvVcylO7lZskdlW0wEKbE'

export const supabase = createClient(supabaseUrl, supabaseKey)