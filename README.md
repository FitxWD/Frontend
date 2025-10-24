# Frontend

This is the frontend application for Wellness Assistance.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher) or yarn
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/FitxWD/Frontend.git
cd Frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_API_URL=your_backend_api_url
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

## Development

To run the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── (authenticated)/   # Protected routes
│   ├── login/            # Authentication pages
│   └── signup/
├── components/            # Reusable components
├── contexts/             # React contexts
├── lib/                  # Utilities and API functions
├── styles/              # Global styles
└── types/               # TypeScript type definitions
```

## Features

- 🔐 Authentication with Firebase
- 👤 User Dashboard
- 💪 Workout Plan Generation
- 🥗 Diet Plan Management
- 💬 Chat Interface
- 🎤 Voice Assistant
- ⚙️ Admin Dashboard
- 📊 Health Data Tracking

