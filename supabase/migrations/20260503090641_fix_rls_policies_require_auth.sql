/*
  # Fix RLS Policies — Require Authentication for All Access

  ## Problem
  The existing INSERT policies on `market_intel_reports` and `bug_bounty_reports`
  used `WITH CHECK (true)`, allowing anyone (including anonymous users) to insert
  rows without restriction. SELECT policies also allowed unrestricted anonymous reads.

  ## Changes
  - Drop the four permissive (always-true) policies on both tables.
  - Add new INSERT policies that require an authenticated session and enforce
    that the `user_id` column matches the requesting user's `auth.uid()`.
  - Add new SELECT policies that allow authenticated users to read only their
    own rows.
  - Add `user_id` column (uuid, nullable for existing rows) to both tables so
    ownership can be tracked per-user.

  ## Security
  - Anonymous users can no longer read or write any rows.
  - Authenticated users can only access rows they created.
*/

-- Add user_id column to market_intel_reports if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'market_intel_reports' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE market_intel_reports ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Add user_id column to bug_bounty_reports if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bug_bounty_reports' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE bug_bounty_reports ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Drop old permissive policies on market_intel_reports
DROP POLICY IF EXISTS "Anyone can read market intel drafts" ON market_intel_reports;
DROP POLICY IF EXISTS "Anyone can insert market intel drafts" ON market_intel_reports;

-- Drop old permissive policies on bug_bounty_reports
DROP POLICY IF EXISTS "Anyone can read bug bounty drafts" ON bug_bounty_reports;
DROP POLICY IF EXISTS "Anyone can insert bug bounty drafts" ON bug_bounty_reports;

-- market_intel_reports: authenticated users read only their own rows
CREATE POLICY "Authenticated users can read own market intel reports"
  ON market_intel_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- market_intel_reports: authenticated users insert only rows they own
CREATE POLICY "Authenticated users can insert own market intel reports"
  ON market_intel_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- bug_bounty_reports: authenticated users read only their own rows
CREATE POLICY "Authenticated users can read own bug bounty reports"
  ON bug_bounty_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- bug_bounty_reports: authenticated users insert only rows they own
CREATE POLICY "Authenticated users can insert own bug bounty reports"
  ON bug_bounty_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
