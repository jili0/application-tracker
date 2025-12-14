# Application Tracker

A minimalist job application tracking system built with Next.js, TypeScript, and MongoDB.

## Features

- **User Authentication**: Secure login with 30-day session persistence
- **Application Management**: Track job applications with company, position, status, and remarks
- **Smart Date Input**: Quick date entry shortcuts (e.g., "08" → "08.04.2025")
- **Status-based Sorting**: Applications automatically sorted by status (Answered → No Answer → Rejected)
- **Search Functionality**: Real-time search with highlighting across all fields
- **Statistics**: View total applications and answered count in the header
- **Print View**: Clean print layout for physical records
- **Minimalist Design**: Clean, paper-like interface focused on usability

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js with JWT
- **Deployment**: Vercel-ready

## Quick Start

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd application-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/application-tracker
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Date Input Shortcuts

- `08` + Enter → `08.04.2025` (current month/year)
- `0804` + Enter → `08.04.2025` (current year)
- `080425` + Enter → `08.04.2025`
- `08042025` + Enter → `08.04.2025`

## Application Status

- **Answered**: Applications that received a response
- **No Answer**: Applications pending response
- **Rejected**: Applications that were declined

## Database Schema

### User Model
```typescript
{
  name: String,
  email: String,
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Application Model
```typescript
{
  date: String,
  company: String,
  position: String,
  status: 'answered' | 'no-answer' | 'rejected',
  remarks: String,
  userId: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- 30-day persistent sessions
- User-isolated data access

## Production Deployment

1. Set up MongoDB Atlas or similar cloud database
2. Configure environment variables in your hosting platform
3. Deploy to Vercel, Netlify, or similar platforms

## License

MIT