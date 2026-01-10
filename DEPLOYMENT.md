# Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Production Deploy**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir=dist
   ```

### Option 3: GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json scripts**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Update vite.config.js** (add base path)
   ```javascript
   export default defineConfig({
     base: '/little-trencher/',
     // ... rest of config
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

### Option 4: Self-Hosted (VPS/Server)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Copy dist folder to your server**
   ```bash
   scp -r dist/* user@server:/var/www/html/
   ```

3. **Configure Nginx** (example)
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

---

## Pre-Deployment Checklist

### 1. Update Contract Address
Edit `src/App.jsx`:
```javascript
const CONTRACT_ADDRESS = "YourActualContractAddress";
```

### 2. Update Social Links
Edit `src/App.jsx`:
```javascript
// X.com link
<a href="https://x.com/yourusername">

// Dexscreener link
<a href="https://dexscreener.com/solana/yourtoken">
```

### 3. Update Metadata
Edit `index.html`:
```html
<meta name="description" content="Your custom description" />
<title>Your Custom Title</title>
```

### 4. Test Build Locally
```bash
npm run build
npm run preview
```

### 5. Optimize Assets (Optional)
- Compress SVGs if needed
- Optimize any custom images
- Test on mobile devices

---

## Environment Variables (Optional)

If you want to use environment variables for sensitive data:

1. **Create `.env` file**
   ```env
   VITE_CONTRACT_ADDRESS=your_address_here
   VITE_TWITTER_URL=https://x.com/yourhandle
   VITE_DEXSCREENER_URL=https://dexscreener.com/solana/yourtoken
   ```

2. **Update App.jsx**
   ```javascript
   const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
   ```

3. **Add to .gitignore**
   ```
   .env
   .env.local
   .env.production
   ```

---

## Performance Optimization

### Already Implemented
✅ Code splitting (React vendor, Animation vendor chunks)
✅ Minification and tree-shaking
✅ Lazy-loaded animations
✅ Optimized SVGs (inline, no external dependencies)
✅ Mobile-first responsive design

### Additional Optimizations (Optional)
- Add CDN for font delivery
- Implement service worker for caching
- Use image optimization service if adding photos
- Add analytics (Plausible, Fathom, etc.)

---

## Domain & SSL

### Custom Domain
Most hosting providers (Vercel, Netlify) offer easy custom domain setup:

1. Add your domain in the hosting dashboard
2. Update DNS records to point to hosting provider
3. SSL is typically auto-configured

### Vercel Custom Domain
```bash
vercel domains add yourdomain.com
```

---

## Post-Deployment Testing

### Mobile Testing
- iPhone Safari
- Android Chrome
- Tablet views (iPad, Android tablet)

### Desktop Testing
- Chrome
- Firefox
- Safari
- Edge

### Performance Testing
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- Test on slow 3G/4G connections

### Functionality Testing
- [ ] All scroll sections animate properly
- [ ] Glossary tooltips work on hover
- [ ] Copy contract address works
- [ ] Social links open correctly
- [ ] Mobile navigation works
- [ ] No console errors

---

## Monitoring & Analytics

### Recommended Tools
- **Plausible Analytics** - Privacy-friendly, lightweight
- **Fathom Analytics** - Simple, privacy-focused
- **Google Analytics** - Comprehensive (if you don't mind Google)

### Error Monitoring
- **Sentry** - For catching runtime errors
- **LogRocket** - Session replay and error tracking

---

## SEO Optimization

### Meta Tags (Already Added)
✅ Title
✅ Description
✅ Viewport
✅ Theme color

### Additional SEO (Optional)
```html
<!-- Open Graph -->
<meta property="og:title" content="The Little Trencher That Couldn't" />
<meta property="og:description" content="An interactive satirical storybook" />
<meta property="og:image" content="/og-image.jpg" />
<meta property="og:url" content="https://yourdomain.com" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="The Little Trencher That Couldn't" />
<meta name="twitter:description" content="An interactive satirical storybook" />
<meta name="twitter:image" content="/twitter-card.jpg" />
```

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Blank Page After Deploy
- Check browser console for errors
- Verify `base` path in vite.config.js
- Ensure dist folder uploaded correctly

### Fonts Not Loading
- Verify Google Fonts link in index.html
- Check CSP headers if self-hosting
- Clear browser cache

---

## Budget Estimates

### Free Tier Options
- **Vercel**: Free for personal projects
- **Netlify**: Free for personal projects
- **GitHub Pages**: Free
- **Cloudflare Pages**: Free

### Paid Options (Optional)
- Custom domain: ~$10-15/year
- Premium hosting: ~$5-20/month
- CDN: Usually included free

---

## Support & Updates

For issues or questions:
1. Check [GitHub Issues](https://github.com/yourusername/little-trencher/issues)
2. Review console errors
3. Test in incognito/private browsing
4. Clear cache and hard reload

---

**Ready to deploy? Let's get this trencher on the rails! 🚂**
