-- Seed data for Speed Dating App
-- Run this after creating your Supabase project and applying schema.sql

-- Note: You need to create users in Supabase Auth first (via dashboard or API)
-- Then use their UUIDs below. These are placeholder UUIDs for demonstration.

-- ============================================================================
-- IMPORTANT: Replace these UUIDs with actual user IDs from your auth.users table
-- You can create users via Supabase Dashboard > Authentication > Users
-- ============================================================================

-- Sample Admin/Organizer UUIDs (replace with real ones)
-- Admin 1: admin@speeddating.com
-- Admin 2: organizer@speeddating.com

DO $$
DECLARE
    admin_user_id UUID;
    organizer_user_id UUID;
BEGIN
    -- Get the first two users from auth.users to use as admins
    -- If you want specific users, replace this query with hardcoded UUIDs
    SELECT id INTO admin_user_id FROM auth.users ORDER BY created_at LIMIT 1;
    SELECT id INTO organizer_user_id FROM auth.users ORDER BY created_at LIMIT 1 OFFSET 1;

    -- If only one user exists, use the same for both
    IF organizer_user_id IS NULL THEN
        organizer_user_id := admin_user_id;
    END IF;

    -- Exit if no users exist
    IF admin_user_id IS NULL THEN
        RAISE NOTICE 'No users found in auth.users. Please create users first via Supabase Dashboard.';
        RETURN;
    END IF;

    -- Insert admin profile (if not exists)
    INSERT INTO profiles (user_id, full_name, bio, date_of_birth, gender, interests, looking_for, location)
    VALUES (
        admin_user_id,
        'Admin User',
        'Speed Dating Event Organizer and Administrator',
        '1990-01-15',
        'Non-binary',
        ARRAY['Event Planning', 'Community Building', 'Networking'],
        ARRAY['Professional Connections'],
        'New York, NY'
    )
    ON CONFLICT (user_id) DO NOTHING;

    -- Insert organizer profile (if not exists and different user)
    IF organizer_user_id != admin_user_id THEN
        INSERT INTO profiles (user_id, full_name, bio, date_of_birth, gender, interests, looking_for, location)
        VALUES (
            organizer_user_id,
            'Event Organizer',
            'Professional event coordinator specializing in singles events',
            '1988-06-20',
            'Female',
            ARRAY['Social Events', 'Dating Coaching', 'Hospitality'],
            ARRAY['Meaningful Connections'],
            'Los Angeles, CA'
        )
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    -- Seed Events
    -- Event 1: Upcoming Valentine's Event
    INSERT INTO events (title, description, date, time, location, capacity, price, organizer_id, status, image_url)
    VALUES (
        'Valentine''s Speed Dating Night',
        'Join us for a romantic evening of speed dating! Meet 15-20 potential matches in a fun, relaxed atmosphere. Light refreshments and appetizers included. Ages 25-40.',
        CURRENT_DATE + INTERVAL '30 days',
        '19:00:00',
        'The Rose Lounge, 123 Main St, New York, NY',
        30,
        45.00,
        admin_user_id,
        'upcoming',
        '/images/events/valentines.jpg'
    );

    -- Event 2: Professional Mixer
    INSERT INTO events (title, description, date, time, location, capacity, price, organizer_id, status, image_url)
    VALUES (
        'Young Professionals Speed Dating',
        'Network and find love! Perfect for busy professionals looking to meet like-minded singles. Business casual dress code. Premium cocktails included. Ages 28-45.',
        CURRENT_DATE + INTERVAL '14 days',
        '18:30:00',
        'The Executive Club, 456 Business Ave, New York, NY',
        40,
        55.00,
        admin_user_id,
        'upcoming',
        '/images/events/professional.jpg'
    );

    -- Event 3: Weekend Brunch Dating
    INSERT INTO events (title, description, date, time, location, capacity, price, organizer_id, status, image_url)
    VALUES (
        'Sunday Brunch Speed Dating',
        'Start your Sunday with mimosas and meaningful connections! A relaxed daytime event perfect for those who prefer morning meetups. Brunch buffet included. Ages 30-50.',
        CURRENT_DATE + INTERVAL '7 days',
        '11:00:00',
        'Sunny Side Cafe, 789 Brunch Blvd, Brooklyn, NY',
        24,
        65.00,
        admin_user_id,
        'upcoming',
        '/images/events/brunch.jpg'
    );

    -- Event 4: LGBTQ+ Friendly Event
    INSERT INTO events (title, description, date, time, location, capacity, price, organizer_id, status, image_url)
    VALUES (
        'Rainbow Connections Speed Dating',
        'An inclusive speed dating event for the LGBTQ+ community. All orientations and gender identities welcome. Safe, supportive environment. Drinks and snacks provided. Ages 21+.',
        CURRENT_DATE + INTERVAL '21 days',
        '19:30:00',
        'Pride Community Center, 321 Rainbow Way, Manhattan, NY',
        36,
        35.00,
        admin_user_id,
        'upcoming',
        '/images/events/rainbow.jpg'
    );

    -- Event 5: 40+ Singles Night
    INSERT INTO events (title, description, date, time, location, capacity, price, organizer_id, status, image_url)
    VALUES (
        'Elegant Evening: 40+ Speed Dating',
        'Sophisticated speed dating for singles over 40. Meet mature, interesting individuals in an upscale setting. Wine tasting included. Smart casual attire.',
        CURRENT_DATE + INTERVAL '10 days',
        '20:00:00',
        'The Vintage Wine Bar, 555 Elegant St, Upper East Side, NY',
        28,
        60.00,
        admin_user_id,
        'upcoming',
        '/images/events/elegant.jpg'
    );

    -- Event 6: Outdoor Adventure Singles
    INSERT INTO events (title, description, date, time, location, capacity, price, organizer_id, status, image_url)
    VALUES (
        'Hiking & Dating Adventure',
        'Combine your love of nature with meeting new people! Easy 3-mile scenic hike followed by a picnic speed dating session. Active singles only. Ages 25-45.',
        CURRENT_DATE + INTERVAL '35 days',
        '09:00:00',
        'Central Park Boathouse, Central Park, NY',
        20,
        40.00,
        admin_user_id,
        'upcoming',
        '/images/events/hiking.jpg'
    );

    RAISE NOTICE 'Seed data inserted successfully!';
    RAISE NOTICE 'Admin user ID: %', admin_user_id;
    RAISE NOTICE 'Created 6 upcoming events';
END $$;

-- ============================================================================
-- Alternative: Direct INSERT statements (if you have specific UUIDs)
-- Uncomment and modify the section below if you prefer hardcoded UUIDs
-- ============================================================================

/*
-- Replace 'YOUR-ADMIN-UUID-HERE' with actual UUID from auth.users
INSERT INTO profiles (user_id, full_name, bio, date_of_birth, gender, interests, looking_for, location)
VALUES (
    'YOUR-ADMIN-UUID-HERE',
    'Admin User',
    'Speed Dating Event Organizer',
    '1990-01-15',
    'Non-binary',
    ARRAY['Event Planning', 'Community Building'],
    ARRAY['Professional Connections'],
    'New York, NY'
);

INSERT INTO events (title, description, date, time, location, capacity, price, organizer_id, status)
VALUES (
    'Speed Dating Night',
    'Fun evening of speed dating!',
    '2025-02-14',
    '19:00:00',
    'The Rose Bar',
    30,
    45.00,
    'YOUR-ADMIN-UUID-HERE',
    'upcoming'
);
*/
