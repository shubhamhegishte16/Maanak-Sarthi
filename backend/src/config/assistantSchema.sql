CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL DEFAULT 'New Conversation',
  mode VARCHAR(50) NOT NULL DEFAULT 'bis_grounded',
  message_count INT NOT NULL DEFAULT 0,
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS chat_sessions_user_idx ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS chat_sessions_updated_idx ON chat_sessions(updated_at DESC);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  intent VARCHAR(50) DEFAULT 'GENERAL',
  mode VARCHAR(50) DEFAULT 'general',
  confidence VARCHAR(20) DEFAULT 'medium',
  evidence JSONB DEFAULT NULL,
  actions JSONB DEFAULT NULL,
  sources JSONB DEFAULT NULL,
  retrieval_metadata JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS chat_messages_session_idx ON chat_messages(session_id, created_at ASC);

CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  domain VARCHAR(100) NOT NULL,
  source_type VARCHAR(50) NOT NULL DEFAULT 'official_bis',
  content TEXT NOT NULL,
  content_hash VARCHAR(64),
  metadata JSONB DEFAULT '{}',
  retrieved_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS sources_domain_idx ON sources(domain);
CREATE INDEX IF NOT EXISTS sources_type_idx ON sources(source_type);

CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  rating VARCHAR(20) NOT NULL CHECK (rating IN ('positive', 'negative')),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS feedback_message_idx ON feedback(message_id);
