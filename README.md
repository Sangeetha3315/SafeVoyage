# Tourist Safety Website

A comprehensive web application designed to help tourists stay safe while traveling. The platform provides real-time emergency services, location tracking, safety tips, and administrative tools for managing tourist safety initiatives.

## Features

### For Tourists
- **Emergency SOS Button**: Quick access to emergency services with one click
- **Location Tracking**: Real-time location sharing with emergency contacts
- **Interactive Maps**: View safe zones and identify risky areas
- **Emergency Contacts**: Manage and organize emergency contact information
- **AI Chatbot Support**: 24/7 instant support for safety questions
- **Safety Overview Dashboard**: Real-time safety status and alerts
- **Call Interface**: Direct emergency calling capabilities

### For Administrators
- **Admin Dashboard**: Manage users, incidents, and safety data
- **Incident Tracking**: Monitor and track reported incidents
- **Blockchain Tracker**: Immutable record of safety events
- **User Management**: Control and manage user accounts
- **Analytics**: View safety statistics and trends

## Technology Stack

- **Frontend**: Next.js 16 with React 19
- **Styling**: Tailwind CSS v4 with custom animations
- **UI Components**: shadcn/ui with Radix UI
- **Form Handling**: React Hook Form + Zod for validation
- **Data Visualization**: Recharts
- **State Management**: React hooks with session management
- **Authentication**: Custom auth service with role-based access
- **Notifications**: Sonner for toast notifications

## Project Structure

```
├── app/
│   ├── page.tsx              # Main entry point with auth routing
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── auth/                 # Authentication components
│   │   └── login-form.tsx    # Login/signup form
│   ├── emergency/            # Emergency features
│   │   ├── sos-button.tsx    # Emergency SOS button
│   │   ├── custom-sos.tsx    # Custom SOS interface
│   │   └── blockchain-tracker.tsx
│   ├── home-page.tsx         # User home page
│   ├── dashboard/
│   │   └── safety-overview.tsx
│   ├── admin/
│   │   └── admin-dashboard.tsx
│   ├── contacts/
│   │   └── emergency-contacts.tsx
│   ├── location/
│   │   ├── interactive-map.tsx
│   │   └── location-tracker.tsx
│   ├── call/
│   │   └── call-interface.tsx
│   ├── support/
│   │   └── chatbot.tsx
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── auth.ts               # Authentication service
│   ├── emergency.ts          # Emergency services logic
│   ├── blockchain.ts         # Blockchain integration
│   ├── location.ts           # Location services
│   └── utils.ts              # Utility functions
├── hooks/
│   ├── use-mobile.ts         # Mobile detection hook
│   └── use-toast.ts          # Toast notification hook
└── public/                   # Static assets
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tourist-safety-website
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## Authentication

The application uses a custom authentication service with support for two roles:

- **User**: Regular tourist with access to safety features
- **Administrator**: Admin dashboard with full management capabilities

### Default Test Credentials
Users can sign up or test with the provided authentication form. The system includes session management with automatic refresh every 5 minutes.

## Key Features Explained

### Emergency SOS Button
One-tap emergency activation that:
- Alerts emergency contacts
- Shares real-time location
- Initiates emergency calling
- Logs incident to blockchain

### Location Tracking
- Real-time GPS location sharing
- Integration with interactive maps
- Safe zone identification
- Historical location tracking

### Safety Overview
Dashboard displaying:
- Current threat level
- Nearby incidents
- Emergency contact status
- Quick access to safety resources

### Admin Dashboard
Administrators can:
- View all incidents and reports
- Manage user accounts
- Monitor location data
- Access blockchain incident logs
- Generate safety reports and analytics

## Styling & Customization

The project uses Tailwind CSS v4 with custom design tokens configured in `globals.css`. Colors and spacing follow a semantic design system that can be customized in the CSS variables.

### Theme Variables
Customize these in `globals.css`:
- `--background`: Primary background color
- `--foreground`: Primary text color
- `--primary`: Brand color
- `--secondary`: Secondary color
- `--muted`: Muted text/background
- `--radius`: Border radius size

## API Integration

The application integrates with several services:
- **Location Services**: Geolocation API for GPS tracking
- **Emergency Services**: Integration with local emergency numbers
- **Blockchain**: Immutable incident logging
- **AI Chatbot**: Real-time support responses

## Performance Optimizations

- **Next.js 16**: Server-side rendering and static generation
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Automatic image optimization
- **CSS-in-JS**: Tailwind CSS for minimal bundle size

## Security

- **Session Management**: HTTP-only cookies with automatic expiration
- **Role-Based Access Control**: User and admin level permissions
- **Input Validation**: Zod schema validation
- **XSS Protection**: Built-in React sanitization
- **CSRF Protection**: Next.js built-in CSRF handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click

```bash
vercel deploy
```

### Deploy to Other Platforms

The application can be deployed to any platform supporting Node.js 18+:
- AWS
- Google Cloud
- Azure
- Heroku
- Docker containers

## Troubleshooting

### Development Server Issues
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `pnpm install`
- Check port 3000 is available

### Build Errors
- Ensure all TypeScript types are correct
- Check for missing imports
- Verify environment variables are set

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please:
- Open an issue on GitHub
- Contact the development team
- Check documentation at [project-docs-url]

## Roadmap

- [ ] Push notifications for safety alerts
- [ ] Video calling integration
- [ ] Multi-language support
- [ ] Offline functionality
- [ ] Machine learning-based threat detection
- [ ] Integration with wearable devices
- [ ] Community safety ratings

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Data visualization with [Recharts](https://recharts.org/)

---

**Last Updated**: April 2026

For more information and latest updates, visit the project repository.
