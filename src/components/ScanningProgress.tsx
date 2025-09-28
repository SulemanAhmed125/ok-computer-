import React, { useState, useEffect } from 'react';
import { Scan, CheckCircle, AlertCircle, Loader, Link, Image, FileText, Code } from 'lucide-react';

interface ScanningProgressProps {
  progress: number;
  url: string;
}

interface ScanStage {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'active' | 'completed' | 'failed';
}

const ScanningProgress: React.FC<ScanningProgressProps> = ({ progress, url }) => {
  const [stages, setStages] = useState<ScanStage[]>([
    {
      id: 'connection',
      name: 'Establishing Connection',
      description: 'Connecting to the target website',
      icon: <Link className="w-5 h-5" />,
      status: 'pending',
    },
    {
      id: 'fetch',
      name: 'Fetching Content',
      description: 'Downloading HTML and initial resources',
      icon: <FileText className="w-5 h-5" />,
      status: 'pending',
    },
    {
      id: 'parse',
      name: 'Parsing Structure',
      description: 'Analyzing HTML structure and extracting elements',
      icon: <Code className="w-5 h-5" />,
      status: 'pending',
    },
    {
      id: 'assets',
      name: 'Discovering Assets',
      description: 'Finding images, scripts, and stylesheets',
      icon: <Image className="w-5 h-5" />,
      status: 'pending',
    },
    {
      id: 'analysis',
      name: 'Initial Analysis',
      description: 'Performing preliminary content analysis',
      icon: <Scan className="w-5 h-5" />,
      status: 'pending',
    },
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Update stage statuses based on progress
    setStages(prevStages => {
      return prevStages.map((stage, index) => {
        const stageProgress = (index + 1) * 20;
        
        if (progress >= stageProgress) {
          return { ...stage, status: 'completed' };
        } else if (progress >= stageProgress - 10 && progress < stageProgress) {
          return { ...stage, status: 'active' };
        } else {
          return { ...stage, status: 'pending' };
        }
      });
    });
  }, [progress]);

  const getStageIcon = (stage: ScanStage) => {
    switch (stage.status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'active':
        return <Loader className="w-6 h-6 text-primary-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <div className="w-6 h-6 rounded-full border-2 border-secondary-300 dark:border-secondary-600" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800 p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-full mb-4 animate-pulse-slow">
            <Scan className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
            Scanning Website
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 break-all">
            {url}
          </p>
          <div className="mt-2 text-sm text-secondary-500 dark:text-secondary-500">
            Started at: {formatTime(currentTime)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              Scanning Progress
            </span>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
              {Math.round(progress)}%
            </span>
          </div>
          
          <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-3 mb-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
            </div>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                {Math.floor(progress * 0.8)}
              </div>
              <div className="text-xs text-secondary-500 dark:text-secondary-400">
                Assets Found
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                {Math.floor(progress * 0.3)}
              </div>
              <div className="text-xs text-secondary-500 dark:text-secondary-400">
                Links Discovered
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                {Math.floor(progress * 2.5)}KB
              </div>
              <div className="text-xs text-secondary-500 dark:text-secondary-400">
                Data Processed
              </div>
            </div>
          </div>
        </div>

        {/* Scanning Stages */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            Scanning Stages
          </h3>
          
          <div className="space-y-4">
            {stages.map((stage, index) => (
              <div 
                key={stage.id}
                className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                  stage.status === 'active' 
                    ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800' 
                    : stage.status === 'completed'
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-700'
                }`}
              >
                <div className="flex-shrink-0">
                  {getStageIcon(stage)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-secondary-900 dark:text-secondary-100">
                      {stage.name}
                    </span>
                    {stage.status === 'active' && (
                      <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    {stage.description}
                  </p>
                </div>
                
                <div className="flex-shrink-0 text-secondary-400 dark:text-secondary-500">
                  {stage.icon}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-secondary-500 dark:text-secondary-400">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
            <span>Scanning in progress... This may take a few moments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanningProgress;