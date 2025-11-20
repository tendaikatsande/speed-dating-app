# SpeedDate - Modern Speed Dating Application 💕

A trendy and feature-rich speed dating application built with Next.js 14 and Supabase. Connect with like-minded people through exciting speed dating events.

## ✨ Features

### Core Features
- 🔐 **Authentication System** - Secure signup/login with Supabase Auth
- 👤 **User Profiles** - Create and customize your dating profile with interests and preferences
- 📅 **Event Management** - Browse and register for upcoming speed dating events
- 💘 **Smart Matching** - Match with people you both showed interest in
- 💬 **Real-time Chat** - Message your matches instantly
- ⭐ **Rating System** - Rate and review events you've attended
- 🎨 **Responsive Design** - Beautiful UI that works on all devices
- ✨ **Smooth Animations** - Engaging user experience with Framer Motion

### Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **UI**: Custom components with shadcn/ui style
- **Icons**: Lucide React
- **State Management**: Zustand (optional)
- **Date Handling**: date-fns

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/tendaikatsande/speed-dating-app.git
cd speed-dating-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
- Create a new project at [supabase.com](https://supabase.com)
- Go to Project Settings > API to find your credentials
- Run the SQL schema from `supabase/schema.sql` in the Supabase SQL Editor

4. **Configure environment variables**
Copy `.env.example` to `.env.local` and add your Supabase credentials:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
speed-dating-app/
├── app/                      # Next.js App Router pages
│   ├── auth/                # Authentication routes
│   ├── dashboard/           # Main dashboard
│   ├── events/              # Event pages
│   ├── login/               # Login page
│   ├── matches/             # Matches page
│   ├── messages/            # Chat/messaging
│   ├── profile/             # User profile
│   └── signup/              # Sign up page
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── auth/                # Auth-related components
│   ├── events/              # Event components
│   └── navigation.tsx       # Main navigation
├── lib/                     # Utility libraries
│   ├── supabase/           # Supabase client setup
│   ├── types/              # TypeScript types
│   └── utils.ts            # Helper functions
├── supabase/               # Database schema
│   └── schema.sql          # SQL schema for Supabase
└── public/                 # Static assets
```

## 🗄️ Database Schema

The application uses the following main tables:
- **profiles** - User profile information
- **events** - Speed dating events
- **registrations** - Event registrations
- **matches** - User matches from events
- **messages** - Chat messages between matches
- **ratings** - Event ratings and reviews

All tables include Row Level Security (RLS) policies for secure data access.

## 🎯 Key Features Explained

### Authentication Flow
1. Users sign up with email and password
2. Profile creation during onboarding
3. Secure session management with Supabase Auth
4. Protected routes with middleware

### Event System
- Browse upcoming events
- View event details (date, time, location, capacity)
- Register for events
- Automatic capacity tracking

### Matching Algorithm
- Users indicate interest during events
- Mutual interest creates a match
- Matches unlock messaging capabilities

### Real-time Chat
- Message matches instantly
- Read receipts
- Real-time updates with Supabase subscriptions

## 🎨 Customization

### Styling
The app uses Tailwind CSS with a custom color scheme centered around rose/pink tones. To customize:
1. Edit `tailwind.config.ts` for color schemes
2. Modify components in `components/ui/` for UI elements
3. Update `app/globals.css` for global styles

### Add New Features
The modular structure makes it easy to add new features:
1. Create new components in `components/`
2. Add routes in the `app/` directory
3. Update database schema in `supabase/schema.sql`
4. Add types in `lib/types/`

## 🔒 Security

- Row Level Security (RLS) on all database tables
- Server-side session validation
- Protected API routes
- Secure authentication flow
- Environment variable protection

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

### Deploy to Vercel
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Deploy to Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean
- AWS

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- Tailwind CSS for the styling system
- Lucide for the beautiful icons

## 📞 Support

For support, email support@speeddate.com or open an issue on GitHub.

---

Built with ❤️ using Next.js and Supabase
