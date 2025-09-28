import { ChatMessage, AppState, ToolCall, ToolResult } from '../types';

export class AIService {
  private systemPrompt: string;

  constructor() {
    this.systemPrompt = `You are an expert website analyzer with deep knowledge of web technologies, SEO, accessibility, and performance optimization. Your role is to help users understand and improve their websites through comprehensive analysis.

Your capabilities include:
- SEO analysis and recommendations
- Accessibility auditing (WCAG compliance)
- Performance analysis (Core Web Vitals)
- Technology stack detection
- Content analysis and summarization
- Image analysis and optimization suggestions
- Security assessment
- Competitive analysis

When analyzing websites, you should:
1. Provide actionable insights, not just raw data
2. Prioritize issues by impact and effort required
3. Offer specific recommendations with examples
4. Consider both technical and business perspectives
5. Be concise but comprehensive in your analysis

You have access to specialized tools that can perform deep analysis. Always ask for user approval before running extensive scans or using tools that might impact server performance.

Communication style:
- Professional yet approachable
- Use clear, jargon-free language when possible
- Provide context for technical terms
- Structure responses with headers and bullet points for readability
- Include specific examples and code snippets when helpful`;
  }

  async processMessage(message: string, appState: AppState): Promise<ChatMessage> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerMessage = message.toLowerCase();
    
    // Determine intent and create appropriate response
    if (this.isSEORequest(lowerMessage)) {
      return this.createSEOAnalysisMessage(message, appState);
    } else if (this.isAccessibilityRequest(lowerMessage)) {
      return this.createAccessibilityAnalysisMessage(message, appState);
    } else if (this.isPerformanceRequest(lowerMessage)) {
      return this.createPerformanceAnalysisMessage(message, appState);
    } else if (this.isTechStackRequest(lowerMessage)) {
      return this.createTechStackAnalysisMessage(message, appState);
    } else if (this.isContentAnalysisRequest(lowerMessage)) {
      return this.createContentAnalysisMessage(message, appState);
    } else if (this.isImageAnalysisRequest(lowerMessage)) {
      return this.createImageAnalysisMessage(message, appState);
    } else if (this.isCompetitiveAnalysisRequest(lowerMessage)) {
      return this.createCompetitiveAnalysisMessage(message, appState);
    } else {
      return this.createGeneralResponse(message, appState);
    }
  }

  private isSEORequest(message: string): boolean {
    const seoKeywords = ['seo', 'search engine', 'meta', 'title', 'description', 'keywords', 'ranking', 'google'];
    return seoKeywords.some(keyword => message.includes(keyword));
  }

  private isAccessibilityRequest(message: string): boolean {
    const a11yKeywords = ['accessibility', 'a11y', 'wcag', 'screen reader', 'contrast', 'alt text', 'aria'];
    return a11yKeywords.some(keyword => message.includes(keyword));
  }

  private isPerformanceRequest(message: string): boolean {
    const perfKeywords = ['performance', 'speed', 'loading', 'core web vitals', 'lcp', 'fid', 'cls', 'optimization'];
    return perfKeywords.some(keyword => message.includes(keyword));
  }

  private isTechStackRequest(message: string): boolean {
    const techKeywords = ['tech stack', 'technology', 'framework', 'cms', 'wordpress', 'react', 'angular', 'vue'];
    return techKeywords.some(keyword => message.includes(keyword));
  }

  private isContentAnalysisRequest(message: string): boolean {
    const contentKeywords = ['content', 'text', 'words', 'readability', 'summary', 'topics'];
    return contentKeywords.some(keyword => message.includes(keyword));
  }

  private isImageAnalysisRequest(message: string): boolean {
    const imageKeywords = ['image', 'photo', 'picture', 'visual', 'graphic', 'optimization'];
    return imageKeywords.some(keyword => message.includes(keyword));
  }

  private isCompetitiveAnalysisRequest(message: string): boolean {
    const compKeywords = ['competitor', 'competition', 'similar', 'alternative', 'market'];
    return compKeywords.some(keyword => message.includes(keyword));
  }

  private createSEOAnalysisMessage(message: string, appState: AppState): ChatMessage {
    const toolCall: ToolCall = {
      id: `tool_${Date.now()}`,
      name: 'performSeoAnalysis',
      parameters: { url: appState.currentUrl },
      status: 'pending',
    };

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I'll analyze the SEO performance of ${appState.currentUrl}. This will include checking title tags, meta descriptions, heading structure, and other important SEO factors.`,
      timestamp: new Date(),
      toolCall,
    };
  }

  private createAccessibilityAnalysisMessage(message: string, appState: AppState): ChatMessage {
    const toolCall: ToolCall = {
      id: `tool_${Date.now()}`,
      name: 'checkAccessibility',
      parameters: { url: appState.currentUrl },
      status: 'pending',
    };

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I'll perform a comprehensive accessibility audit of ${appState.currentUrl}. This will check for WCAG compliance, color contrast, alt text, keyboard navigation, and screen reader compatibility.`,
      timestamp: new Date(),
      toolCall,
    };
  }

  private createPerformanceAnalysisMessage(message: string, appState: AppState): ChatMessage {
    const toolCall: ToolCall = {
      id: `tool_${Date.now()}`,
      name: 'analyzePerformance',
      parameters: { url: appState.currentUrl },
      status: 'pending',
    };

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I'll analyze the performance of ${appState.currentUrl}, including Core Web Vitals (LCP, FID, CLS), loading speeds, and provide optimization recommendations.`,
      timestamp: new Date(),
      toolCall,
    };
  }

  private createTechStackAnalysisMessage(message: string, appState: AppState): ChatMessage {
    const toolCall: ToolCall = {
      id: `tool_${Date.now()}`,
      name: 'detectTechStack',
      parameters: { url: appState.currentUrl },
      status: 'pending',
    };

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I'll identify the technology stack used on ${appState.currentUrl}, including the CMS, frameworks, libraries, analytics tools, and hosting platform.`,
      timestamp: new Date(),
      toolCall,
    };
  }

  private createContentAnalysisMessage(message: string, appState: AppState): ChatMessage {
    const toolCall: ToolCall = {
      id: `tool_${Date.now()}`,
      name: 'summarizePage',
      parameters: { url: appState.currentUrl },
      status: 'pending',
    };

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I'll analyze the content structure, readability, and key topics of ${appState.currentUrl}. This includes word count, reading level, and content organization.`,
      timestamp: new Date(),
      toolCall,
    };
  }

  private createImageAnalysisMessage(message: string, appState: AppState): ChatMessage {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I can see there are ${appState.assets.filter(a => a.type === 'image').length} images discovered on the website. For detailed image analysis, I would need to examine each image individually for optimization opportunities, alt text, and visual content analysis. 

Would you like me to:
1. Analyze image optimization opportunities
2. Check for missing alt text
3. Review image formats and sizes
4. Assess visual content quality`,
      timestamp: new Date(),
    };
  }

  private createCompetitiveAnalysisMessage(message: string, appState: AppState): ChatMessage {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Based on the content and structure of ${appState.currentUrl}, I can help identify potential competitors. To provide accurate competitive analysis, I would need to:

1. Analyze the website's industry/niche
2. Identify key topics and keywords
3. Research similar businesses in the same market
4. Compare features, content strategy, and positioning

This analysis would help you understand your competitive landscape and identify opportunities for differentiation.`,
      timestamp: new Date(),
    };
  }

  private createGeneralResponse(message: string, appState: AppState): ChatMessage {
    const responses = [
      `I've analyzed the website and I'm ready to help with specific aspects. What would you like me to focus on? I can provide detailed analysis of SEO, accessibility, performance, or technology stack.`,
      
      `Based on my initial scan, I can see this website has various elements to analyze. Would you like me to dive deeper into any specific area such as content structure, technical implementation, or user experience?`,
      
      `I'm here to help you understand every aspect of this website. I can perform comprehensive analysis across multiple dimensions. What specific insights are you looking for?`,
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: randomResponse,
      timestamp: new Date(),
    };
  }

  // Simulate tool execution (in a real implementation, this would call actual analysis functions)
  async executeTool(toolCall: ToolCall): Promise<ToolResult> {
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock results based on tool name
    let result: any = {};

    switch (toolCall.name) {
      case 'performSeoAnalysis':
        result = {
          score: 78,
          title: 'Example Website - Welcome to Our Site',
          titleLength: 42,
          metaDescription: 'This is an example website with comprehensive content and modern design.',
          metaDescriptionLength: 78,
          h1Tags: ['Welcome to Our Website', 'Our Services'],
          h2Tags: ['About Us', 'Features', 'Contact Information'],
          wordCount: 1250,
          issues: [
            {
              type: 'title_length',
              severity: 'low',
              message: 'Title is slightly long, consider shortening to under 60 characters',
            },
            {
              type: 'missing_alt',
              severity: 'medium',
              message: '5 images missing alt text',
            },
          ],
        };
        break;

      case 'checkAccessibility':
        result = {
          score: 85,
          issues: [
            {
              element: 'img[src="banner.jpg"]',
              issue: 'Missing alt text',
              severity: 'medium',
              recommendation: 'Add descriptive alt text for screen readers',
            },
            {
              element: '.button-primary',
              issue: 'Low contrast ratio (3.2:1)',
              severity: 'high',
              recommendation: 'Increase contrast to at least 4.5:1',
            },
          ],
        };
        break;

      case 'analyzePerformance':
        result = {
          score: 92,
          lcp: 2.1,
          fid: 45,
          cls: 0.05,
          recommendations: [
            'Optimize images by using WebP format',
            'Enable browser caching for static assets',
            'Minify CSS and JavaScript files',
          ],
        };
        break;

      case 'detectTechStack':
        result = {
          technologies: [
            'React 18.2.0',
            'Node.js',
            'Express.js',
            'MongoDB',
            'Bootstrap 5',
            'Google Analytics',
            'Cloudflare CDN',
          ],
        };
        break;

      case 'summarizePage':
        result = {
          summary: 'This website provides comprehensive information about their services with a modern, user-friendly design. The content is well-structured and covers key topics including company background, service offerings, and contact information.',
          keyTopics: ['Services', 'About Company', 'Contact', 'Features', 'Pricing'],
          readingTime: '4 minutes',
          readingLevel: 'Intermediate',
        };
        break;

      default:
        result = { message: 'Analysis completed successfully' };
    }

    return {
      toolCallId: toolCall.id,
      result,
    };
  }
}