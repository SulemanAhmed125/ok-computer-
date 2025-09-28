import { ScanResult, SEOData, AccessibilityData, PerformanceData } from '../types';

export class CrawlerService {
  private corsProxy = 'https://api.allorigins.win/raw?url=';
  private maxRetries = 3;
  private retryDelay = 2000;

  async scanPage(url: string, onProgress?: (progress: number) => void): Promise<ScanResult> {
    try {
      // Update progress
      onProgress?.(10);

      // Fetch the page content using CORS proxy
      const response = await this.fetchWithRetry(url);
      const html = await response.text();

      onProgress?.(30);

      // Parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      onProgress?.(50);

      // Extract basic information
      const title = doc.querySelector('title')?.textContent || '';
      const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';

      onProgress?.(60);

      // Extract links
      const links = Array.from(doc.querySelectorAll('a[href]'))
        .map(a => a.getAttribute('href'))
        .filter(href => href && this.isValidUrl(href))
        .slice(0, 50); // Limit to prevent overwhelming the UI

      onProgress?.(70);

      // Extract images
      const images = Array.from(doc.querySelectorAll('img[src]'))
        .map(img => img.getAttribute('src'))
        .filter(src => src)
        .map(src => this.resolveUrl(src!, url));

      onProgress?.(80);

      // Extract scripts
      const scripts = Array.from(doc.querySelectorAll('script[src]'))
        .map(script => script.getAttribute('src'))
        .filter(src => src)
        .map(src => this.resolveUrl(src!, url));

      // Extract stylesheets
      const stylesheets = Array.from(doc.querySelectorAll('link[rel="stylesheet"][href]'))
        .map(link => link.getAttribute('href'))
        .filter(href => href)
        .map(href => this.resolveUrl(href!, url));

      onProgress?.(90);

      // Perform SEO analysis
      const seoData = await this.analyzeSEOFromDoc(doc);

      onProgress?.(100);

      return {
        url,
        status: 'completed',
        title,
        description,
        html,
        links,
        images,
        scripts,
        stylesheets,
        seoData,
        scannedAt: new Date(),
      };
    } catch (error) {
      console.error('Scan failed:', error);
      return {
        url,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        scannedAt: new Date(),
      };
    }
  }

  private async fetchWithRetry(url: string, retries = 0): Promise<Response> {
    try {
      const proxiedUrl = `${this.corsProxy}${encodeURIComponent(url)}`;
      const response = await fetch(proxiedUrl, {
        headers: {
          'User-Agent': this.getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      if (retries < this.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retries + 1)));
        return this.fetchWithRetry(url, retries + 1);
      }
      throw error;
    }
  }

  private getRandomUserAgent(): string {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }

  private isValidUrl(href: string): boolean {
    try {
      new URL(href);
      return true;
    } catch {
      return false;
    }
  }

  private resolveUrl(url: string, baseUrl: string): string {
    try {
      return new URL(url, baseUrl).href;
    } catch {
      return url;
    }
  }

  private async analyzeSEOFromDoc(doc: Document): Promise<SEOData> {
    const title = doc.querySelector('title')?.textContent || '';
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const h1Tags = Array.from(doc.querySelectorAll('h1')).map(h1 => h1.textContent?.trim() || '');
    const h2Tags = Array.from(doc.querySelectorAll('h2')).map(h2 => h2.textContent?.trim() || '');
    
    // Count words in body text
    const bodyText = doc.body?.textContent || '';
    const wordCount = bodyText.trim().split(/\s+/).filter(word => word.length > 0).length;

    // Extract Open Graph data
    const openGraph: Record<string, string> = {};
    doc.querySelectorAll('meta[property^="og:"]').forEach(meta => {
      const property = meta.getAttribute('property') || '';
      const content = meta.getAttribute('content') || '';
      if (property && content) {
        openGraph[property] = content;
      }
    });

    // Extract Twitter Card data
    const twitterCard: Record<string, string> = {};
    doc.querySelectorAll('meta[name^="twitter:"]').forEach(meta => {
      const name = meta.getAttribute('name') || '';
      const content = meta.getAttribute('content') || '';
      if (name && content) {
        twitterCard[name] = content;
      }
    });

    // Extract structured data
    const structuredData: any[] = [];
    doc.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
      try {
        const data = JSON.parse(script.textContent || '');
        structuredData.push(data);
      } catch (e) {
        // Ignore invalid JSON
      }
    });

    return {
      title,
      titleLength: title.length,
      metaDescription,
      metaDescriptionLength: metaDescription.length,
      h1Tags,
      h2Tags,
      wordCount,
      canonicalUrl: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || undefined,
      robots: doc.querySelector('meta[name="robots"]')?.getAttribute('content') || undefined,
      openGraph,
      twitterCard,
      structuredData,
    };
  }

  async scanPages(urls: string[]): Promise<ScanResult[]> {
    const results: ScanResult[] = [];
    
    for (const url of urls) {
      try {
        const result = await this.scanPage(url);
        results.push(result);
      } catch (error) {
        results.push({
          url,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          scannedAt: new Date(),
        });
      }
    }
    
    return results;
  }

  async extractData(url: string, dataType: string): Promise<any> {
    // Simulate data extraction
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    switch (dataType) {
      case 'contact':
        return {
          emails: ['contact@example.com'],
          phones: ['+1-555-0123'],
          addresses: ['123 Main St, City, State'],
        };
      
      case 'products':
        return [
          { name: 'Product A', price: '$99', description: 'Sample product' },
          { name: 'Product B', price: '$149', description: 'Another sample' },
        ];
      
      case 'blog_posts':
        return [
          { title: 'Blog Post 1', date: '2024-01-01', excerpt: 'Sample excerpt' },
          { title: 'Blog Post 2', date: '2024-01-15', excerpt: 'Another excerpt' },
        ];
      
      default:
        return { message: 'Data extraction completed' };
    }
  }

  async analyzeSEO(url: string): Promise<SEOData> {
    // This would typically fetch the page and analyze SEO
    // For now, return mock data
    return {
      title: 'Example Website - Welcome',
      titleLength: 25,
      metaDescription: 'Welcome to our example website with comprehensive information.',
      metaDescriptionLength: 65,
      h1Tags: ['Welcome', 'Our Services'],
      h2Tags: ['About Us', 'Features', 'Contact'],
      wordCount: 1500,
      score: 78,
    };
  }

  async analyzeImage(url: string, prompt: string): Promise<any> {
    // Simulate image analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      description: 'Sample image analysis result',
      optimizationSuggestions: [
        'Consider using WebP format for better compression',
        'Add descriptive alt text',
        'Optimize file size for faster loading',
      ],
      technicalDetails: {
        format: 'JPEG',
        size: '250KB',
        dimensions: '1200x800',
      },
    };
  }

  async fetchSitemap(url: string): Promise<any> {
    try {
      const sitemapUrl = new URL('/sitemap.xml', url).href;
      const response = await this.fetchWithRetry(sitemapUrl);
      const xmlText = await response.text();
      
      // Basic XML parsing for sitemap
      const urls = xmlText.match(/<loc>(.*?)<\/loc>/g)?.map(match => 
        match.replace('<loc>', '').replace('</loc>', '')
      ) || [];
      
      return { urls, source: 'sitemap.xml' };
    } catch (error) {
      // Try robots.txt
      try {
        const robotsUrl = new URL('/robots.txt', url).href;
        const response = await this.fetchWithRetry(robotsUrl);
        const robotsText = await response.text();
        
        const sitemapMatch = robotsText.match(/Sitemap:\s*(.*)/i);
        if (sitemapMatch) {
          return { sitemapUrl: sitemapMatch[1], source: 'robots.txt' };
        }
        
        return { message: 'No sitemap found' };
      } catch {
        return { message: 'No sitemap or robots.txt found' };
      }
    }
  }

  async checkAccessibility(url: string): Promise<AccessibilityData> {
    // Simulate accessibility analysis
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
      score: 85,
      contrastIssues: [
        {
          element: '.button-primary',
          issue: 'Low contrast ratio (3.2:1)',
          severity: 'high',
          recommendation: 'Increase contrast to at least 4.5:1',
        },
      ],
      altTextIssues: [
        {
          element: 'img[src="banner.jpg"]',
          issue: 'Missing alt text',
          severity: 'medium',
          recommendation: 'Add descriptive alt text',
        },
      ],
      ariaIssues: [],
      keyboardNavigationIssues: [],
    };
  }

  async analyzePerformance(url: string): Promise<PerformanceData> {
    // Simulate performance analysis
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      score: 92,
      lcp: 2.1,
      fid: 45,
      cls: 0.05,
      recommendations: [
        'Optimize images by using WebP format',
        'Enable browser caching',
        'Minify CSS and JavaScript',
      ],
    };
  }

  async summarizePage(url: string): Promise<any> {
    // Simulate content summarization
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      summary: 'This website provides comprehensive services with a focus on user experience and modern design principles.',
      keyTopics: ['Services', 'About', 'Contact', 'Features'],
      readingTime: '3 minutes',
      readingLevel: 'Intermediate',
      wordCount: 1200,
    };
  }

  async detectTechStack(url: string): Promise<any> {
    // Simulate technology detection
    await new Promise(resolve => setTimeout(resolve, 900));
    
    return {
      technologies: [
        'React 18.2.0',
        'Node.js',
        'Express.js',
        'Bootstrap 5',
        'Google Analytics',
        'Cloudflare CDN',
      ],
      cms: 'Custom',
      server: 'Nginx',
      language: 'JavaScript',
      framework: 'React',
    };
  }
}