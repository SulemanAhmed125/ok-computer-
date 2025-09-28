import React, { useState, useEffect, useCallback } from 'react';
import { AppState, ScanResult, ChatMessage, Asset, ToolCall, ToolResult } from './types';
import UrlInput from './components/UrlInput';
import ScanningProgress from './components/ScanningProgress';
import ChatInterface from './components/ChatInterface';
import AssetExplorer from './components/AssetExplorer';
import { AIService } from './services/aiService';
import { CrawlerService } from './services/crawlerService';
import { ExportService } from './services/exportService';

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentView: 'input',
    currentUrl: '',
    scanResults: new Map(),
    chatHistory: [],
    assets: [],
    isScanning: false,
    scanProgress: 0,
    darkMode: false,
  });

  const aiService = new AIService();
  const crawlerService = new CrawlerService();
  const exportService = new ExportService();

  // Dark mode detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setAppState(prev => ({ ...prev, darkMode: mediaQuery.matches }));
    
    const handler = (e: MediaQueryListEvent) => {
      setAppState(prev => ({ ...prev, darkMode: e.matches }));
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('websiteScannerState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        setAppState(prev => ({
          ...prev,
          chatHistory: parsed.chatHistory || [],
          scanResults: new Map(parsed.scanResults || []),
          assets: parsed.assets || [],
        }));
      }
    } catch (error) {
      console.error('Failed to load saved state:', error);
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        chatHistory: appState.chatHistory,
        scanResults: Array.from(appState.scanResults.entries()),
        assets: appState.assets,
      };
      localStorage.setItem('websiteScannerState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }, [appState.chatHistory, appState.scanResults, appState.assets]);

  const handleStartScan = async (url: string) => {
    setAppState(prev => ({
      ...prev,
      currentUrl: url,
      currentView: 'scanning',
      isScanning: true,
      scanProgress: 0,
    }));

    try {
      // Initialize scan
      const scanResult = await crawlerService.scanPage(url, (progress) => {
        setAppState(prev => ({ ...prev, scanProgress: progress }));
      });

      setAppState(prev => {
        const newScanResults = new Map(prev.scanResults);
        newScanResults.set(url, scanResult);
        
        // Extract assets from scan result
        const newAssets: Asset[] = [];
        
        if (scanResult.images) {
          scanResult.images.forEach(img => {
            newAssets.push({
              url: img,
              type: 'image',
              status: 'pending',
            });
          });
        }
        
        if (scanResult.scripts) {
          scanResult.scripts.forEach(script => {
            newAssets.push({
              url: script,
              type: 'script',
              status: 'pending',
            });
          });
        }
        
        if (scanResult.stylesheets) {
          scanResult.stylesheets.forEach(style => {
            newAssets.push({
              url: style,
              type: 'stylesheet',
              status: 'pending',
            });
          });
        }

        return {
          ...prev,
          scanResults: newScanResults,
          assets: [...prev.assets, ...newAssets],
          isScanning: false,
          currentView: 'chat',
          chatHistory: [{
            id: Date.now().toString(),
            role: 'assistant',
            content: `I've successfully scanned ${url}. Here's what I found:\n\n**Title:** ${scanResult.title || 'No title found'}\n**Description:** ${scanResult.description || 'No description found'}\n\nWhat would you like me to analyze further? I can help with:\n• SEO analysis\n• Accessibility audit\n• Performance insights\n• Technology stack detection\n• Content analysis`,
            timestamp: new Date(),
          }],
        };
      });
    } catch (error) {
      console.error('Scan failed:', error);
      setAppState(prev => ({
        ...prev,
        isScanning: false,
        currentView: 'input',
        chatHistory: [...prev.chatHistory, {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error while scanning the website. Please check the URL and try again.',
          timestamp: new Date(),
        }],
      }));
    }
  };

  const handleChatMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setAppState(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, userMessage],
    }));

    try {
      const aiResponse = await aiService.processMessage(message, appState);
      
      setAppState(prev => ({
        ...prev,
        chatHistory: [...prev.chatHistory, aiResponse],
      }));

      // Handle tool calls
      if (aiResponse.toolCall) {
        await handleToolCall(aiResponse.toolCall);
      }
    } catch (error) {
      console.error('AI processing failed:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      
      setAppState(prev => ({
        ...prev,
        chatHistory: [...prev.chatHistory, errorMessage],
      }));
    }
  };

  const handleToolCall = async (toolCall: ToolCall) => {
    // Show approval UI (simplified for this demo - auto-approve for now)
    const toolResult = await executeTool(toolCall);
    
    const resultMessage: ChatMessage = {
      id: (Date.now() + 2).toString(),
      role: 'assistant',
      content: `I've completed the ${toolCall.name} analysis. Here's what I found:\n\n${formatToolResult(toolCall.name, toolResult)}`,
      timestamp: new Date(),
      toolResult: {
        toolCallId: toolCall.id,
        result: toolResult,
      },
    };

    setAppState(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, resultMessage],
    }));
  };

  const executeTool = async (toolCall: ToolCall): Promise<any> => {
    const { name, parameters } = toolCall;
    
    switch (name) {
      case 'scanPages':
        return await crawlerService.scanPages(parameters.urls);
      
      case 'scanAllPendingPages':
        const pendingUrls = Array.from(appState.scanResults.entries())
          .filter(([_, result]) => result.status === 'pending')
          .map(([url, _]) => url);
        return await crawlerService.scanPages(pendingUrls);
      
      case 'extractDataFromPage':
        return await crawlerService.extractData(parameters.url, parameters.dataType);
      
      case 'performSeoAnalysis':
        const scanResult = appState.scanResults.get(parameters.url);
        return scanResult?.seoData || await crawlerService.analyzeSEO(parameters.url);
      
      case 'analyzeImageFromUrl':
        return await crawlerService.analyzeImage(parameters.url, parameters.prompt);
      
      case 'fetchSitemap':
        return await crawlerService.fetchSitemap(parameters.url);
      
      case 'checkAccessibility':
        return await crawlerService.checkAccessibility(parameters.url);
      
      case 'analyzePerformance':
        return await crawlerService.analyzePerformance(parameters.url);
      
      case 'summarizePage':
        return await crawlerService.summarizePage(parameters.url);
      
      case 'detectTechStack':
        return await crawlerService.detectTechStack(parameters.url);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  };

  const formatToolResult = (toolName: string, result: any): string => {
    switch (toolName) {
      case 'performSeoAnalysis':
        return `**SEO Score:** ${result.score || 'N/A'}\n**Title:** ${result.title || 'Not found'}\n**Meta Description:** ${result.metaDescription || 'Not found'}\n**Word Count:** ${result.wordCount || 0}`;
      
      case 'checkAccessibility':
        return `**Accessibility Score:** ${result.score || 'N/A'}\n**Issues Found:** ${result.issues?.length || 0}\n**High Priority:** ${result.issues?.filter((i: any) => i.severity === 'high').length || 0}`;
      
      case 'analyzePerformance':
        return `**Performance Score:** ${result.score || 'N/A'}\n**LCP:** ${result.lcp || 'N/A'}ms\n**FID:** ${result.fid || 'N/A'}ms\n**CLS:** ${result.cls || 'N/A'}`;
      
      case 'detectTechStack':
        return `**Technologies Detected:**\n${result.technologies?.join('\n') || 'None detected'}`;
      
      default:
        return JSON.stringify(result, null, 2);
    }
  };

  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    const data = {
      scanResults: Array.from(appState.scanResults.entries()),
      chatHistory: appState.chatHistory,
      assets: appState.assets,
    };
    
    exportService.export(data, format);
  };

  const handleAssetSelect = (asset: Asset) => {
    setAppState(prev => ({ ...prev, selectedAsset: asset }));
  };

  const handleFullSiteScan = async () => {
    // Implementation for full site scanning
    console.log('Starting full site scan...');
  };

  const handleStopScan = () => {
    setAppState(prev => ({ ...prev, isScanning: false }));
  };

  const renderCurrentView = () => {
    switch (appState.currentView) {
      case 'input':
        return <UrlInput onStartScan={handleStartScan} />;
      
      case 'scanning':
        return (
          <ScanningProgress
            progress={appState.scanProgress}
            url={appState.currentUrl}
          />
        );
      
      case 'chat':
        return (
          <div className="flex h-screen">
            <div className="flex-1 flex flex-col">
              <ChatInterface
                messages={appState.chatHistory}
                onSendMessage={handleChatMessage}
                onExport={handleExport}
              />
            </div>
            <AssetExplorer
              assets={appState.assets}
              scanResults={appState.scanResults}
              onAssetSelect={handleAssetSelect}
              onFullSiteScan={handleFullSiteScan}
              onStopScan={handleStopScan}
              isScanning={appState.isScanning}
            />
          </div>
        );
      
      default:
        return <UrlInput onStartScan={handleStartScan} />;
    }
  };

  return (
    <div className={`min-h-screen ${appState.darkMode ? 'dark' : ''}`}>
      {renderCurrentView()}
    </div>
  );
}

export default App;