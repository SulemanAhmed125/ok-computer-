import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Image, 
  FileText, 
  Code, 
  Video, 
  Music, 
  Archive,
  ExternalLink,
  Play,
  Pause,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Asset, ScanResult } from '../types';

interface AssetExplorerProps {
  assets: Asset[];
  scanResults: Map<string, ScanResult>;
  onAssetSelect: (asset: Asset) => void;
  onFullSiteScan: () => void;
  onStopScan: () => void;
  isScanning: boolean;
}

const AssetExplorer: React.FC<AssetExplorerProps> = ({
  assets,
  scanResults,
  onAssetSelect,
  onFullSiteScan,
  onStopScan,
  isScanning,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const assetTypes = [
    { value: 'all', label: 'All Types', icon: <Filter className="w-4 h-4" /> },
    { value: 'image', label: 'Images', icon: <Image className="w-4 h-4" /> },
    { value: 'script', label: 'Scripts', icon: <Code className="w-4 h-4" /> },
    { value: 'stylesheet', label: 'Stylesheets', icon: <FileText className="w-4 h-4" /> },
    { value: 'video', label: 'Videos', icon: <Video className="w-4 h-4" /> },
    { value: 'audio', label: 'Audio', icon: <Music className="w-4 h-4" /> },
    { value: 'pdf', label: 'PDFs', icon: <FileText className="w-4 h-4" /> },
    { value: 'document', label: 'Documents', icon: <Archive className="w-4 h-4" /> },
  ];

  const assetStatuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'scanned', label: 'Scanned' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
  ];

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch = asset.url.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || asset.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || asset.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [assets, searchTerm, selectedType, selectedStatus]);

  const stats = useMemo(() => {
    const total = assets.length;
    const scanned = assets.filter(a => a.status === 'scanned').length;
    const pending = assets.filter(a => a.status === 'pending').length;
    const failed = assets.filter(a => a.status === 'failed').length;
    
    return { total, scanned, pending, failed };
  }, [assets]);

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'script':
        return <Code className="w-4 h-4" />;
      case 'stylesheet':
        return <FileText className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'audio':
        return <Music className="w-4 h-4" />;
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      default:
        return <Archive className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scanned':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scanned':
        return 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30';
      case 'pending':
        return 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30';
      case 'failed':
        return 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-800';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const truncateUrl = (url: string, maxLength: number = 40) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  return (
    <div className="w-96 bg-white dark:bg-secondary-800 border-l border-secondary-200 dark:border-secondary-700 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
            Asset Explorer
          </h2>
          <div className="flex items-center space-x-2">
            {isScanning ? (
              <button
                onClick={onStopScan}
                className="btn-secondary text-xs px-2 py-1 flex items-center space-x-1"
              >
                <Pause className="w-3 h-3" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                onClick={onFullSiteScan}
                className="btn-primary text-xs px-2 py-1 flex items-center space-x-1"
              >
                <Play className="w-3 h-3" />
                <span>Full Scan</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="text-center p-2 bg-secondary-50 dark:bg-secondary-700 rounded">
            <div className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
              {stats.total}
            </div>
            <div className="text-xs text-secondary-600 dark:text-secondary-400">
              Total Assets
            </div>
          </div>
          <div className="text-center p-2 bg-secondary-50 dark:bg-secondary-700 rounded">
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
              {stats.scanned}
            </div>
            <div className="text-xs text-secondary-600 dark:text-secondary-400">
              Scanned
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 input-field text-sm"
          />
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full input-field text-sm py-1"
          >
            {assetTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full input-field text-sm py-1"
          >
            {assetStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Asset List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredAssets.length === 0 ? (
          <div className="text-center py-8 text-secondary-500 dark:text-secondary-400">
            <p className="text-sm">No assets found</p>
            <p className="text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredAssets.map((asset) => (
            <div
              key={asset.url}
              onClick={() => onAssetSelect(asset)}
              className="p-3 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg cursor-pointer hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 bg-secondary-200 dark:bg-secondary-600 rounded flex items-center justify-center">
                    {getAssetIcon(asset.type)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium text-secondary-600 dark:text-secondary-400">
                      {asset.type.toUpperCase()}
                    </span>
                    {getStatusIcon(asset.status)}
                  </div>
                  
                  <div className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1 break-all">
                    {truncateUrl(asset.url)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(asset.status)}`}>
                      {asset.status}
                    </span>
                    
                    <div className="flex items-center space-x-1">
                      {asset.size && (
                        <span className="text-xs text-secondary-500 dark:text-secondary-400">
                          {formatFileSize(asset.size)}
                        </span>
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(asset.url, '_blank');
                        }}
                        className="p-1 hover:bg-secondary-200 dark:hover:bg-secondary-600 rounded transition-colors duration-200"
                      >
                        <ExternalLink className="w-3 h-3 text-secondary-500 dark:text-secondary-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center justify-between text-xs text-secondary-500 dark:text-secondary-400 mb-2">
          <span>Pending: {stats.pending}</span>
          <span>Failed: {stats.failed}</span>
        </div>
        
        <button
          onClick={() => {
            // Refresh assets logic would go here
            console.log('Refreshing assets...');
          }}
          className="w-full btn-secondary text-xs py-2 flex items-center justify-center space-x-1"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
};

export default AssetExplorer;