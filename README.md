# Blossom - Flashcard Study App

Convex dashboard: https://dashboard.convex.dev/d/greedy-chameleon-427
A modern, mobile-optimized flashcard study app built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui. Features a clean iOS-like aesthetic with dark mode support and responsive design.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

4. **Add demo data (optional):**
   Visit [http://localhost:3000/seed](http://localhost:3000/seed) to create sample content

## 📱 Features

### Core Functionality
- **Deck Management**: Create, edit, and delete flashcard decks
- **Card Editor**: Rich textarea inputs for questions and answers
- **Study Mode**: Interactive flashcards with flip animations
- **Progress Tracking**: Visual progress bars and statistics
- **Search & Filter**: Find decks and cards quickly

### User Experience
- **Mobile-First Design**: Optimized for phones and tablets
- **iOS-like Aesthetic**: Rounded corners, soft shadows, smooth animations
- **Dark Mode Support**: Automatic theme detection
- **Keyboard Shortcuts**: Space to flip, 1-6 to grade cards
- **Accessibility**: ARIA labels, focus management, screen reader support

### Study Features
- **Grade System**: 6-level quality rating (Again → Excellent)
- **Study Statistics**: Track reviewed cards and progress
- **Card Tags**: Organize cards with custom tags
- **Study Session Reset**: Start over anytime

## 🏗️ Architecture

### Data Layer
The app uses a **client-side data layer** with localStorage persistence:

```typescript
// Located in src/lib/data.ts
export const deckRepo = {
  async list(): Promise<Deck[]>
  async create(data: { title: string; description?: string }): Promise<Deck>
  async update(id: string, data: { title?: string; description?: string }): Promise<Deck>
  async remove(id: string): Promise<void>
}

export const cardRepo = {
  async listByDeck(deckId: string): Promise<Card[]>
  async create(data: { deckId: string; front: string; back: string; tags?: string[] }): Promise<Card>
  async update(id: string, data: { front?: string; back?: string; tags?: string[] }): Promise<Card>
  async remove(id: string): Promise<void>
  async search(deckId: string, query: string): Promise<Card[]>
}
```

### Custom Hooks
- `useDecks()` - Deck management with CRUD operations
- `useCards(deckId)` - Card management for specific deck
- `useStudyQueue(deckId)` - Study session management

### Component Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page (deck list)
│   ├── deck/[id]/         # Deck detail page
│   ├── study/[deckId]/    # Study mode page
│   └── seed/             # Demo data seeding
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── Flashcard.tsx     # Interactive flashcard
│   ├── DeckCard.tsx      # Deck preview card
│   └── ...
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and data layer
│   ├── data.ts          # Data repository
│   ├── types.ts         # TypeScript definitions
│   └── seed.ts          # Demo data
└── ...
```

## 🎯 60-Second Demo

1. **Start the app**: `npm run dev`
2. **Add demo data**: Visit `/seed` and click "Create Demo Data"
3. **Create a deck**: Click "+" button, add title "My First Deck"
4. **Add cards**: Go to deck → "Add Card" → Enter question/answer
5. **Study**: Click "Study" → Flip cards with spacebar → Grade with 1-6 keys
6. **Track progress**: See progress bar and statistics

## 🔄 Replacing the Data Layer

The data layer is designed to be easily replaceable. To connect to a real backend:

1. **Update the repository functions** in `src/lib/data.ts`
2. **Replace localStorage calls** with API calls
3. **Add authentication** if needed
4. **Update error handling** for network requests

Example API integration:
```typescript
// Replace localStorage with API calls
export const deckRepo = {
  async list(): Promise<Deck[]> {
    const response = await fetch('/api/decks');
    return response.json();
  },
  
  async create(data: CreateDeckData): Promise<Deck> {
    const response = await fetch('/api/decks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
  // ... other methods
}
```

## 🎨 Styling & Theming

### Design System
- **Colors**: CSS custom properties for light/dark themes
- **Typography**: Inter font family with responsive sizing
- **Spacing**: Tailwind's spacing scale (4px base unit)
- **Shadows**: Subtle elevation with `shadow-sm`, `shadow-md`
- **Border Radius**: `rounded-lg` (8px) for cards, `rounded-2xl` (16px) for flashcards

### Mobile Optimizations
- **Touch Targets**: Minimum 44px height for all interactive elements
- **Bottom Navigation**: Fixed mobile nav with icons and labels
- **Responsive Grid**: 1 column mobile → 2 tablet → 3 desktop
- **Safe Areas**: Proper padding for notched devices

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
No environment variables required for the current setup.

### Deployment Platforms
- **Vercel**: `vercel --prod`
- **Netlify**: Connect GitHub repository
- **Docker**: Use `node:18-alpine` base image

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Structure
- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended rules
- **Prettier**: Code formatting (recommended)
- **Tailwind**: Utility-first CSS framework

## 📋 TODO: Future Enhancements

### Spaced Repetition
- [ ] Implement SM-2 algorithm for card scheduling
- [ ] Add due date calculations
- [ ] Track review history and performance

### Advanced Features
- [ ] Card images and media support
- [ ] Import/export functionality
- [ ] Collaborative decks
- [ ] Study analytics and insights
- [ ] Offline support with service workers

### Backend Integration
- [ ] User authentication
- [ ] Cloud synchronization
- [ ] Real-time collaboration
- [ ] Advanced analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Lucide React](https://lucide.dev/) - Beautiful icons
- [Framer Motion](https://www.framer.com/motion/) - Animation library
