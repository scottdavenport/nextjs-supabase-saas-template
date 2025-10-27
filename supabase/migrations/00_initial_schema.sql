-- Next.js + Supabase SaaS Template - Initial Database Schema
-- This migration creates core tables, RLS policies, functions, and indexes for SaaS applications

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- CORE USER TABLES
-- =============================================

-- Profiles table - linked to auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- External accounts for OAuth connections (generic pattern)
CREATE TABLE external_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- Remove specific provider constraints for flexibility
  provider_user_id TEXT NOT NULL,
  access_token_encrypted TEXT NOT NULL,
  refresh_token_encrypted TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  scopes TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- =============================================
-- EXAMPLE TABLES (Optional - Remove if not needed)
-- =============================================

-- Chat messages with AI assistant (example pattern)
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI API request audit log (example pattern)
CREATE TABLE ai_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  response TEXT,
  model TEXT NOT NULL,
  tokens_used INTEGER,
  cost DECIMAL,
  latency_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_requests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE USING (id = auth.uid());

-- External accounts policies
CREATE POLICY "Users can view own external accounts" ON external_accounts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own external accounts" ON external_accounts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own external accounts" ON external_accounts
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own external accounts" ON external_accounts
  FOR DELETE USING (user_id = auth.uid());

-- Chat messages policies
CREATE POLICY "Users can view own chat messages" ON chat_messages
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own chat messages" ON chat_messages
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own chat messages" ON chat_messages
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own chat messages" ON chat_messages
  FOR DELETE USING (user_id = auth.uid());

-- AI requests policies
CREATE POLICY "Users can view own ai requests" ON ai_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own ai requests" ON ai_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own ai requests" ON ai_requests
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own ai requests" ON ai_requests
  FOR DELETE USING (user_id = auth.uid());

-- =============================================
-- DATABASE FUNCTIONS
-- =============================================

-- Function to auto-create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_external_accounts_updated_at
  BEFORE UPDATE ON external_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Foreign key indexes
CREATE INDEX idx_external_accounts_user_id ON external_accounts(user_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_ai_requests_user_id ON ai_requests(user_id);

-- Time-based queries (most recent first)
CREATE INDEX idx_chat_messages_created_at ON chat_messages(user_id, created_at DESC);

-- Provider lookups for external accounts
CREATE INDEX idx_external_accounts_provider ON external_accounts(user_id, provider);

-- =============================================
-- STORAGE BUCKET FOR AVATARS
-- =============================================

-- Create bucket for user avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for avatar storage
CREATE POLICY "Users can view own avatars" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can upload own avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE profiles IS 'User profile information linked to Supabase auth.users';
COMMENT ON TABLE external_accounts IS 'OAuth connections to external services (generic pattern)';
COMMENT ON TABLE chat_messages IS 'Example: Conversation history with AI assistant';
COMMENT ON TABLE ai_requests IS 'Example: Audit log of AI API requests for cost tracking';

COMMENT ON COLUMN external_accounts.access_token_encrypted IS 'OAuth access token encrypted before storage';
COMMENT ON COLUMN external_accounts.refresh_token_encrypted IS 'OAuth refresh token encrypted before storage';
COMMENT ON COLUMN chat_messages.metadata IS 'Additional context for chat messages (e.g., context used)';
COMMENT ON COLUMN ai_requests.cost IS 'Cost in USD for the AI request';
COMMENT ON COLUMN ai_requests.latency_ms IS 'Response time in milliseconds';

-- =============================================
-- TEMPLATE NOTES
-- =============================================

-- This template includes:
-- 1. Core user management (profiles, auth)
-- 2. Generic OAuth pattern (external_accounts)
-- 3. Example AI/chat patterns (chat_messages, ai_requests)
-- 4. File storage setup (avatars bucket)
-- 5. Complete RLS security policies
-- 6. Performance indexes
-- 7. Auto-profile creation trigger

-- To customize for your app:
-- 1. Add your specific tables after the core tables
-- 2. Update the external_accounts provider constraint if needed
-- 3. Remove example tables (chat_messages, ai_requests) if not needed
-- 4. Add your specific RLS policies for new tables
-- 5. Update indexes based on your query patterns
