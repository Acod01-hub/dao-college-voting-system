# 🚀 Deployment Guide

## Deploy to Vercel (Recommended)

### Method 1: GitHub + Vercel (Easiest)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: DAO Voting System"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/dao-voting-system.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect settings:
     - Framework: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Click "Deploy"
   - Your app will be live in ~1 minute! 🎉

### Method 2: Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow the prompts:**
   - Set up and deploy? Yes
   - Which scope? (your account)
   - Link to existing project? No
   - Project name? dao-voting-system
   - Directory? ./
   - Override settings? No

4. **Production deployment:**
   ```bash
   vercel --prod
   ```

## Deploy to Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   netlify deploy
   ```

4. **For production:**
   ```bash
   netlify deploy --prod
   ```

## Deploy to GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json:**
   Add to scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
   
   Add homepage:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/dao-voting-system"
   ```

3. **Update vite.config.js:**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/dao-voting-system/'
   })
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

## Environment Variables (if needed)

Create `.env` file:
```
VITE_CONTRACT_ADDRESS=your_contract_address
VITE_CHAIN_ID=80001
```

Access in code:
```javascript
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
```

## Post-Deployment Checklist

- ✅ Test wallet connection
- ✅ Verify all pages load correctly
- ✅ Check responsive design on mobile
- ✅ Test voting flow end-to-end
- ✅ Verify transaction hash generation
- ✅ Test results and audit pages

## Custom Domain (Optional)

### On Vercel:
1. Go to project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as shown

### On Netlify:
1. Go to "Domain settings"
2. Add custom domain
3. Configure DNS

## Troubleshooting

**Build fails:**
- Check Node.js version (18+)
- Clear node_modules and reinstall
- Check for missing dependencies

**Blank page after deployment:**
- Check browser console for errors
- Verify base path in vite.config.js
- Check routing configuration

**Wallet not connecting:**
- Ensure MetaMask is installed
- Check network configuration
- Verify Web3 provider setup

## Performance Optimization

Already included:
- ✅ Vite for fast builds
- ✅ Code splitting
- ✅ Lazy loading ready
- ✅ Optimized assets

For further optimization:
- Enable compression on hosting
- Use CDN for static assets
- Implement service workers for PWA

---

**Need help?** Open an issue on GitHub!
