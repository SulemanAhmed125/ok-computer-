# Website AI Scanner - GitHub Pages Deployment Guide

This guide will walk you through deploying the Website AI Scanner to GitHub Pages.

## 🚀 Quick Deployment Options

### Option 1: GitHub Actions (Recommended)
Automated deployment using GitHub Actions workflow.

### Option 2: Manual Deployment
Deploy manually using npm scripts.

---

## 📋 Prerequisites

1. **GitHub Account** - Sign up at [github.com](https://github.com)
2. **Git** - Install from [git-scm.com](https://git-scm.com)
3. **Node.js 16+** - Download from [nodejs.org](https://nodejs.org)

---

## 🔧 Option 1: GitHub Actions Deployment

### Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository named `website-ai-scanner`
3. Make it **Public** (required for GitHub Pages)
4. Don't initialize with README (we'll add our own)

### Step 2: Upload Code to Repository

```bash
# Navigate to your project directory
cd /path/to/website-ai-scanner

# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - Website AI Scanner"

# Add remote repository (replace with your username)
git remote add origin https://github.com/YOUR_USERNAME/website-ai-scanner.git

# Push to main branch
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**

### Step 4: Deploy

The GitHub Actions workflow will automatically deploy your site when you push to the `main` branch.

**Monitor deployment:**
1. Go to **Actions** tab in your repository
2. Watch the deployment workflow
3. Once complete, your site will be available at:
   `https://YOUR_USERNAME.github.io/website-ai-scanner/`

---

## 🛠️ Option 2: Manual Deployment

### Step 1: Install Dependencies

```bash
# Navigate to project directory
cd website-ai-scanner

# Install dependencies
npm install
```

### Step 2: Configure for GitHub Pages

Update `package.json` homepage field:

```json
{
  "name": "website-ai-scanner",
  "homepage": "https://YOUR_USERNAME.github.io/website-ai-scanner",
  // ... rest of package.json
}
```

### Step 3: Build and Deploy

```bash
# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

---

## 📁 Repository Structure

Your repository should look like this:

```
website-ai-scanner/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── components/
│   ├── services/
│   ├── types/
│   └── App.tsx
├── public/
│   └── index.html
├── package.json
├── tailwind.config.js
├── .env
└── README.md
```

---

## 🔧 Configuration

### Environment Variables

Update `.env` file with your configuration:

```env
# For GitHub Pages deployment
REACT_APP_CORS_PROXY=https://api.allorigins.win/raw?url=
REACT_APP_MAX_RETRIES=3
REACT_APP_RETRY_DELAY=2000
```

### Package.json Homepage

**Important:** Update the `homepage` field in `package.json`:

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/website-ai-scanner"
}
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## 🐛 Troubleshooting

### Build Fails

1. **Check Node.js version:**
   ```bash
   node --version  # Should be 16+
   ```

2. **Clear cache and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Build with detailed errors:**
   ```bash
   npm run build --verbose
   ```

### Deployment Issues

1. **GitHub Pages not showing:**
   - Ensure repository is **Public**
   - Check **Settings > Pages** configuration
   - Wait 5-10 minutes for deployment to propagate

2. **404 Errors:**
   - Verify `homepage` field in `package.json`
   - Check that build completed successfully
   - Ensure `build` folder exists

3. **CORS Issues:**
   - The app uses CORS proxy for external requests
   - If proxy fails, try alternative proxies in `.env`

---

## 🎨 Customization

### Branding

1. **Update logo in `src/components/UrlInput.tsx`**
2. **Modify colors in `tailwind.config.js`**
3. **Edit text content in components**

### Features

1. **Add new analysis types in `src/services/aiService.ts`**
2. **Enhance UI in component files**
3. **Extend export formats in `src/services/exportService.ts`**

---

## 📊 Monitoring

### GitHub Actions
- Monitor deployment status in **Actions** tab
- View build logs for debugging
- Check deployment history

### Website Performance
- Use GitHub's built-in analytics
- Monitor page load times
- Track user interactions

---

## 🔒 Security Considerations

1. **Environment Variables:**
   - Never commit sensitive data
   - Use GitHub Secrets for production values

2. **Dependencies:**
   - Keep dependencies updated
   - Run `npm audit` regularly
   - Use security scanning tools

3. **Access Control:**
   - Limit repository access
   - Use branch protection rules
   - Enable two-factor authentication

---

## 🚀 Next Steps

After deployment:

1. **Test the application** - Try scanning different websites
2. **Monitor performance** - Check loading times and responsiveness
3. **Gather feedback** - Improve based on user input
4. **Add features** - Extend functionality as needed
5. **Update regularly** - Keep dependencies and content fresh

---

## 📞 Support

If you encounter issues:

1. **Check this guide** - Most common problems are covered
2. **Review GitHub Actions logs** - Detailed error information
3. **Test locally first** - Use `npm start` to debug
4. **Create an issue** - Report problems in your repository

---

## 🎯 Success Checklist

- [ ] Repository created and code pushed
- [ ] GitHub Pages enabled
- [ ] Environment variables configured
- [ ] Package.json homepage updated
- [ ] Deployment successful
- [ ] Website accessible
- [ ] All features working
- [ ] Mobile responsiveness verified

---

**Congratulations!** 🎉 Your Website AI Scanner is now live on GitHub Pages!

The application provides comprehensive website analysis with AI-powered insights, making it a powerful tool for web developers, SEO specialists, and digital marketers.