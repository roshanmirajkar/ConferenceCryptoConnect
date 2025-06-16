# CryptoConnect - Permissionless Conference Networking App

A modern networking app designed for crypto conference attendees to connect, share portfolios, and discover events. Built with React, TypeScript, and Express.

## Features

- **👥 User Discovery & Networking**: Browse and connect with conference attendees
- **💰 Portfolio Sharing**: Display crypto holdings with mock Coinbase API integration
- **📅 Event Schedule**: View conference sessions with speaker information and descriptions
- **💬 Messaging System**: Connect and communicate with other attendees
- **🎨 Modern UI**: Mobile-first design with crypto-themed gradients and animations

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for routing
- **TanStack Query** for data fetching
- **Tailwind CSS** with custom crypto theme
- **Shadcn/ui** component library
- **Lucide React** for icons

### Backend
- **Express.js** with TypeScript
- **In-memory storage** for demo purposes
- **Zod** for data validation
- **Drizzle ORM** schemas

### Development
- **Vite** for fast development and building
- **ESBuild** for TypeScript compilation
- **PostCSS** with Tailwind

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crypto-connect
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── ui/              # Shadcn/ui components
│   │   │   ├── discover-tab.tsx # User discovery
│   │   │   ├── portfolio-tab.tsx# Portfolio display
│   │   │   ├── schedule-tab.tsx # Event schedule
│   │   │   └── messages-tab.tsx # Messaging
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utilities and config
│   │   ├── pages/               # Route components
│   │   ├── services/            # API services
│   │   └── main.tsx             # App entry point
├── server/
│   ├── index.ts                 # Express server
│   ├── routes.ts                # API routes
│   ├── storage.ts               # In-memory data store
│   └── vite.ts                  # Vite integration
├── shared/
│   └── schema.ts                # Shared TypeScript types
└── package.json
```

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user

### Connections
- `GET /api/connections/:userId` - Get user connections
- `POST /api/connections` - Create connection request
- `PUT /api/connections/:id/status` - Update connection status

### Messages
- `GET /api/conversations/:userId` - Get user conversations
- `GET /api/messages/:userId1/:userId2` - Get messages between users
- `POST /api/messages` - Send message

### Events
- `GET /api/events` - Get all conference events

### Portfolio (Mock Coinbase API)
- `GET /api/coinbase/portfolio/:userId` - Get user portfolio
- `GET /api/coinbase/prices` - Get current crypto prices

## Features in Detail

### User Discovery
- Browse conference attendees with filtering by interests
- View user profiles with company information and bio
- Send connection requests to other users
- See mutual connections and recommended matches

### Portfolio Integration
- Mock Coinbase API integration showing crypto holdings
- Real-time price updates for major cryptocurrencies
- Portfolio value tracking with 24h change indicators
- Recent transaction history display

### Event Schedule
- Comprehensive conference schedule with real event data
- Color-coded categories (Bitcoin, Ethereum, Solana, DeFi, etc.)
- Speaker information and session descriptions
- Bookmark functionality for favorite events

### Messaging
- Real-time messaging interface between connected users
- Conversation history with timestamps
- Quick action buttons for contact sharing and meeting scheduling

## Mobile Optimization

- Mobile-first responsive design
- Touch-friendly interface with 44px minimum touch targets
- Smooth animations and transitions
- Optimized scrolling and gesture handling
- PWA-ready architecture

## Security & Privacy

- No real API keys or sensitive data exposed
- Demo data uses fictional profiles and example.com emails
- All portfolio data is simulated for demonstration purposes
- Client-side validation with server-side verification

## Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linting
npm run type-check   # TypeScript type checking
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for the Permissionless conference networking experience
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**Note**: This is a demonstration app with simulated data. Portfolio values and user information are fictional and for demo purposes only.