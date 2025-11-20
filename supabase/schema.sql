-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    date_of_birth DATE NOT NULL,
    gender TEXT NOT NULL,
    interests TEXT[] DEFAULT '{}',
    looking_for TEXT[] DEFAULT '{}',
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    registered_count INTEGER DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    organizer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')) DEFAULT 'upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('registered', 'checked_in', 'cancelled')) DEFAULT 'registered',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    user_id_1 UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    user_id_2 UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'mutual', 'declined')) DEFAULT 'pending',
    user_1_interested BOOLEAN DEFAULT false,
    user_2_interested BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id_1, user_id_2)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_matches_user_id_1 ON matches(user_id_1);
CREATE INDEX IF NOT EXISTS idx_matches_user_id_2 ON matches(user_id_2);
CREATE INDEX IF NOT EXISTS idx_matches_event_id ON matches(event_id);
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_ratings_event_id ON ratings(event_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Events policies
CREATE POLICY "Events are viewable by everyone" ON events
    FOR SELECT USING (true);

CREATE POLICY "Organizers can insert events" ON events
    FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their events" ON events
    FOR UPDATE USING (auth.uid() = organizer_id);

-- Registrations policies
CREATE POLICY "Users can view their own registrations" ON registrations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own registrations" ON registrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registrations" ON registrations
    FOR UPDATE USING (auth.uid() = user_id);

-- Matches policies
CREATE POLICY "Users can view their own matches" ON matches
    FOR SELECT USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

CREATE POLICY "Users can insert matches" ON matches
    FOR INSERT WITH CHECK (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

CREATE POLICY "Users can update their own matches" ON matches
    FOR UPDATE USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- Messages policies
CREATE POLICY "Users can view messages in their matches" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM matches
            WHERE matches.id = messages.match_id
            AND (matches.user_id_1 = auth.uid() OR matches.user_id_2 = auth.uid())
        )
    );

CREATE POLICY "Users can send messages in their matches" ON messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM matches
            WHERE matches.id = messages.match_id
            AND (matches.user_id_1 = auth.uid() OR matches.user_id_2 = auth.uid())
        )
    );

-- Ratings policies
CREATE POLICY "Everyone can view ratings" ON ratings
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own ratings" ON ratings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" ON ratings
    FOR UPDATE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update event registration count
CREATE OR REPLACE FUNCTION update_event_registered_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'registered' THEN
        UPDATE events
        SET registered_count = registered_count + 1
        WHERE id = NEW.event_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status = 'registered' AND NEW.status != 'registered' THEN
            UPDATE events
            SET registered_count = registered_count - 1
            WHERE id = NEW.event_id;
        ELSIF OLD.status != 'registered' AND NEW.status = 'registered' THEN
            UPDATE events
            SET registered_count = registered_count + 1
            WHERE id = NEW.event_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'registered' THEN
        UPDATE events
        SET registered_count = registered_count - 1
        WHERE id = OLD.event_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update registration count
CREATE TRIGGER update_event_registered_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON registrations
    FOR EACH ROW EXECUTE FUNCTION update_event_registered_count();

-- Function to update match status
CREATE OR REPLACE FUNCTION update_match_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.user_1_interested = true AND NEW.user_2_interested = true THEN
        NEW.status = 'mutual';
    ELSIF NEW.user_1_interested = false OR NEW.user_2_interested = false THEN
        NEW.status = 'declined';
    ELSE
        NEW.status = 'pending';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update match status
CREATE TRIGGER update_match_status_trigger
    BEFORE INSERT OR UPDATE ON matches
    FOR EACH ROW EXECUTE FUNCTION update_match_status();
