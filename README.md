# The Little Trencher That Couldn't

A satirical, interactive storybook website chronicling the journey of a crypto trencher through the absurd landscape of 2024-2026.

## 🎨 Design Philosophy

**Neo-Nostalgic Storybook** aesthetic combining:
- Grainy paper textures
- Cream-colored backgrounds (#F5F5DC)
- Serif fonts (Playfair Display) for narrative
- Monospace terminal fonts for technical terms
- Hand-drawn cursive (Caveat) for the rhymes
- Smooth scroll-based animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Mobile Optimization

This site is **mobile-first** with:
- Responsive typography that scales from mobile to desktop
- Touch-optimized interactive elements (44px minimum touch targets)
- Optimized animations for mobile performance
- Reduced motion support for accessibility
- Mobile-friendly navigation and CTAs

### Responsive Breakpoints
- **xs**: 475px (extra small phones)
- **sm**: 640px (small tablets)
- **md**: 768px (tablets)
- **lg**: 1024px (laptops)
- **xl**: 1280px (desktops)

## 🎭 Features

### Interactive Storybook
Four scroll-based sections telling the trencher's journey:
1. **The Enlistment (2024)** - Naive beginnings
2. **The Euphoric Summit (Q4 2024)** - PolitiFi peak
3. **The Meat Grinder (2025)** - Battle scars
4. **The Cosmic Joke (2026)** - Final realization

### Animated SVG Characters
Custom inline SVG illustrations with Framer Motion animations for each stage.

### Interactive Glossary
Hover over technical terms (Rug-Proof, Bonding Curve, Snipers, etc.) to see terminal-style definitions.

### CTA Section
- Copyable contract address
- Social links (X.com, Dexscreener)
- Degen dashboard with token stats

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **Lucide React** - Icon system

## 📝 Customization

### Update Contract Address
Edit the `CONTRACT_ADDRESS` constant in `src/App.jsx`:

```javascript
const CONTRACT_ADDRESS = "YourContractAddressHere";
```

### Update Social Links
Modify the href attributes in the social links section:

```javascript
<a href="https://x.com/yourhandle">...</a>
<a href="https://dexscreener.com/solana/yourtoken">...</a>
```

### Customize Colors
Edit `tailwind.config.js` to change the color scheme.

## 🎯 Performance

- Code splitting for vendor chunks
- Optimized bundle size with tree-shaking
- Lazy-loaded animations
- Responsive images and SVGs
- Production build minification

## 📄 License

This is a satirical art project. Use responsibly. Not financial advice.

## 🎪 The Story

> "It isn't whether you think you can or think you can't.
> In the trenches, the bonding curve already decided."
> — The Little Trencher, 2026

---

**Built with ❤️ and cope by degens, for degens**
