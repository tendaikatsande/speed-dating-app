# Setup Guide for SpeedDate App

This guide will walk you through setting up the SpeedDate application from scratch.

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- A Supabase account (free tier is fine)

## Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/tendaikatsande/speed-dating-app.git
cd speed-dating-app

# Install dependencies
npm install
```

## Step 2: Set Up Supabase

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Project name: `speed-date` (or your preferred name)
   - Database password: Choose a strong password
   - Region: Select closest to your users
5. Click "Create new project"

### Run Database Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql` from this repository
4. Paste it into the SQL Editor
5. Click "Run" or press Cmd/Ctrl + Enter
6. You should see "Success. No rows returned" message

This will create:
- All necessary tables (profiles, events, registrations, matches, messages, ratings)
- Indexes for better query performance
- Row Level Security (RLS) policies
- Database triggers for automated updates

### Get Your API Credentials

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy the following:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Open `.env.local` and update with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚠️ **Important**: Never commit `.env.local` to git. It's already in `.gitignore`.

## Step 4: Run the Application

```bash
# Start development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Step 5: Test the Application

1. **Visit Homepage**: Go to http://localhost:3000
2. **Sign Up**: Click "Get Started" and create an account
3. **Browse Dashboard**: After signup, you'll see the events dashboard
4. **Explore Features**: Navigate through Profile, Matches, and Messages sections

## Troubleshooting

### Authentication Issues

If you can't sign in or sign up:
- Check that your Supabase credentials are correct in `.env.local`
- Verify the database schema was run successfully
- Check Supabase logs in the dashboard under **Logs** > **Auth**

### Database Connection Issues

If you see database errors:
- Verify your Supabase URL and key are correct
- Check that the schema was applied successfully
- Look at Supabase logs under **Logs** > **Postgres**

### Build Issues

If the build fails:
- Delete `.next` folder: `rm -rf .next`
- Clear npm cache: `npm cache clean --force`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Production Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (your production URL)
6. Click "Deploy"

### Update Supabase Settings

After deploying:
1. Go to your Supabase project
2. Navigate to **Authentication** > **URL Configuration**
3. Add your production URL to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: `https://your-app.vercel.app/**`

## Database Seeding (Optional)

To add sample data for testing:

```sql
-- Insert a sample event
INSERT INTO events (title, description, date, time, location, capacity, price, organizer_id, status)
VALUES (
  'Valentine''s Speed Dating',
  'Join us for a fun evening of meeting new people',
  '2024-02-14',
  '19:00:00',
  'The Rose Bar, Downtown',
  30,
  25.00,
  'your-user-id-here',
  'upcoming'
);
```

Replace `your-user-id-here` with your actual user ID from the auth.users table.

## Email Configuration (Optional)

For production, configure email settings in Supabase:

1. Go to **Authentication** > **Email Templates**
2. Customize confirmation and reset password emails
3. Configure SMTP settings under **Project Settings** > **Auth**

## Next Steps

- Add profile setup flow
- Implement event registration
- Enable real-time chat with Supabase subscriptions
- Add image uploads using Supabase Storage
- Implement event creation for organizers
- Add analytics and monitoring

## Support

For issues or questions:
- Check the [main README.md](./README.md)
- Open an issue on GitHub
- Review Supabase documentation at [supabase.com/docs](https://supabase.com/docs)
