# Website AI Scanner

A comprehensive, AI-powered web application for analyzing websites with advanced scanning capabilities, SEO audits, accessibility checks, and performance insights.

## Features

### 🔍 **Advanced Scanning**
- Comprehensive website crawling and analysis
- Asset discovery (images, scripts, stylesheets, videos)
- Real-time progress tracking with animated indicators
- Intelligent retry mechanisms with exponential backoff

### 🤖 **AI-Powered Analysis**
- Expert website analyzer persona with deep technical knowledge
- SEO analysis and optimization recommendations
- Accessibility auditing (WCAG compliance)
- Performance analysis with Core Web Vitals
- Technology stack detection
- Content analysis and summarization

### 📊 **Comprehensive Reports**
- Export functionality (CSV, JSON, PDF)
- Detailed asset explorer with filtering and search
- Interactive chat interface with AI assistant
- Real-time conversation history
- Professional PDF reports with branding

### 🎨 **Modern UI/UX**
- Clean, responsive design with Tailwind CSS
- Dark mode support (prefers-color-scheme)
- Smooth animations and transitions
- Accessibility-focused design
- Mobile-responsive interface

### 🔧 **Technical Excellence**
- React 18 with TypeScript
- Modern functional components and hooks
- Comprehensive state management
- Local storage persistence
- CORS proxy integration
- Error handling and retry logic

## Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd website-ai-scanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Usage

### 1. **Enter Website URL**
- Input a valid website URL (e.g., `https://example.com`)
- Confirm you have permission to scan the website
- Click "Start Scan"

### 2. **Monitor Scanning Progress**
- Watch real-time progress indicators
- View detailed scanning stages
- See live statistics during the scan

### 3. **Chat with AI Assistant**
- Ask questions about the website
- Request specific analyses (SEO, accessibility, performance)
- Use quick action buttons for common requests
- Review conversation history

### 4. **Explore Assets**
- Browse discovered assets in the sidebar
- Filter by type (images, scripts, stylesheets, etc.)
- Search for specific assets
- View detailed asset information

### 5. **Export Results**
- Export scan results as JSON for technical analysis
- Export asset lists as CSV for spreadsheet analysis
- Generate PDF reports for presentations

## AI Assistant Capabilities

The AI assistant can help with:

### **SEO Analysis**
- Title and meta description optimization
- Heading structure analysis
- Keyword density and placement
- Internal linking strategies
- Technical SEO recommendations

### **Accessibility Auditing**
- WCAG 2.1 compliance checking
- Color contrast validation
- Alt text verification
- Keyboard navigation testing
- Screen reader compatibility

### **Performance Optimization**
- Core Web Vitals assessment (LCP, FID, CLS)
- Loading speed analysis
- Resource optimization suggestions
- Caching strategies
- Image optimization recommendations

### **Technology Detection**
- CMS identification
- Framework and library detection
- Server and hosting analysis
- Third-party service identification
- Security assessment

### **Content Analysis**
- Readability scoring
- Content structure evaluation
- Topic extraction and summarization
- Competitive analysis insights
- Content strategy recommendations

## Architecture

### **Component Structure**
```
src/
├── components/          # React components
│   ├── UrlInput.tsx    # Initial URL input screen
│   ├── ScanningProgress.tsx  # Loading and progress
│   ├── ChatInterface.tsx     # AI chat UI
│   └── AssetExplorer.tsx     # Asset sidebar
├── services/           # Business logic
│   ├── aiService.ts    # AI processing and analysis
│   ├── crawlerService.ts     # Web scraping and parsing
│   └── exportService.ts      # Export functionality
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### **Key Technologies**
- **React 18** - Modern UI framework with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful, consistent icons
- **React Markdown** - Markdown rendering for AI responses

### **State Management**
- React hooks (useState, useEffect, useCallback)
- Local storage persistence
- Centralized state in App component
- Optimistic updates for better UX

## Configuration

### **Environment Variables**
Create a `.env` file for configuration:

```env
REACT_APP_CORS_PROXY=https://api.allorigins.win/raw?url=
REACT_APP_MAX_RETRIES=3
REACT_APP_RETRY_DELAY=2000
```

### **Customization**

#### **Styling**
- Modify `tailwind.config.js` for custom themes
- Update `src/index.css` for global styles
- Component-specific styles use Tailwind classes

#### **AI Behavior**
- Edit `src/services/aiService.ts` to modify AI responses
- Update system prompts for different personas
- Add new analysis capabilities

#### **Scanning Behavior**
- Configure retry logic in `crawlerService.ts`
- Modify user agent rotation
- Adjust timeout and concurrency settings

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations

- **Concurrent Scanning**: Limited to prevent server overload
- **Asset Caching**: Results cached in localStorage
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Automatic format detection
- **Memory Management**: Proper cleanup of resources

## Security Features

- **CORS Proxy**: Bypasses cross-origin restrictions safely
- **User Consent**: Requires permission before scanning
- **Rate Limiting**: Prevents server overload
- **Input Validation**: URL and data sanitization
- **No Data Storage**: Scans remain private by default

## Troubleshooting

### **Common Issues**

1. **Scanning Fails**
   - Check URL validity
   - Verify website accessibility
   - Check CORS proxy status

2. **AI Not Responding**
   - Refresh the page
   - Check browser console for errors
   - Ensure JavaScript is enabled

3. **Export Not Working**
   - Check browser download permissions
   - Disable popup blockers temporarily
   - Try different export format

### **Performance Tips**

- Use modern browsers for best experience
- Disable browser extensions that interfere
- Clear localStorage if experiencing issues
- Check internet connection stability

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, feature requests, or questions:
- Create an issue in the repository
- Check existing documentation
- Review troubleshooting section

---

**Built with ❤️ using React, TypeScript, and modern web technologies**