export interface ScanResult {
  url: string;
  status: 'pending' | 'scanning' | 'completed' | 'failed';
  title?: string;
  description?: string;
  html?: string;
  links?: string[];
  images?: string[];
  scripts?: string[];
  stylesheets?: string[];
  seoData?: SEOData;
  accessibility?: AccessibilityData;
  performance?: PerformanceData;
  techStack?: string[];
  error?: string;
  scannedAt?: Date;
}

export interface SEOData {
  title: string;
  titleLength: number;
  metaDescription: string;
  metaDescriptionLength: number;
  h1Tags: string[];
  h2Tags: string[];
  wordCount: number;
  canonicalUrl?: string;
  robots?: string;
  openGraph?: Record<string, string>;
  twitterCard?: Record<string, string>;
  structuredData?: any[];
}

export interface AccessibilityData {
  contrastIssues: AccessibilityIssue[];
  altTextIssues: AccessibilityIssue[];
  ariaIssues: AccessibilityIssue[];
  keyboardNavigationIssues: AccessibilityIssue[];
  score: number;
}

export interface AccessibilityIssue {
  element: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
}

export interface PerformanceData {
  lcp: number;
  fid: number;
  cls: number;
  score: number;
  recommendations: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolCall?: ToolCall;
  toolResult?: ToolResult;
}

export interface ToolCall {
  id: string;
  name: string;
  parameters: any;
  status: 'pending' | 'approved' | 'declined' | 'completed' | 'failed';
}

export interface ToolResult {
  toolCallId: string;
  result: any;
  error?: string;
}

export interface Asset {
  url: string;
  type: 'image' | 'script' | 'stylesheet' | 'pdf' | 'video' | 'audio' | 'document';
  size?: number;
  status: 'pending' | 'scanned' | 'failed';
  metadata?: any;
}

export interface AppState {
  currentView: 'input' | 'scanning' | 'chat';
  currentUrl: string;
  scanResults: Map<string, ScanResult>;
  chatHistory: ChatMessage[];
  assets: Asset[];
  isScanning: boolean;
  scanProgress: number;
  selectedAsset?: Asset;
  darkMode: boolean;
}

export interface AIAnalysisRequest {
  url: string;
  analysisType: 'seo' | 'accessibility' | 'performance' | 'tech_stack' | 'content' | 'comprehensive';
  context?: string;
}