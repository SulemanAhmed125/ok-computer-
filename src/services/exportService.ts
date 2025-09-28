import { AppState } from '../types';

export class ExportService {
  export(data: any, format: 'csv' | 'json' | 'pdf'): void {
    switch (format) {
      case 'json':
        this.exportJSON(data);
        break;
      case 'csv':
        this.exportCSV(data);
        break;
      case 'pdf':
        this.exportPDF(data);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  private exportJSON(data: any): void {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `website-scan-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private exportCSV(data: any): void {
    const csvContent = this.convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `website-scan-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private exportPDF(data: any): void {
    // For now, create a simple HTML report that can be printed to PDF
    const reportHTML = this.generatePDFReport(data);
    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const windowFeatures = 'width=800,height=600,scrollbars=yes,resizable=yes';
    const printWindow = window.open(url, '_blank', windowFeatures);
    
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
    
    URL.revokeObjectURL(url);
  }

  private convertToCSV(data: any): string {
    const headers = ['URL', 'Status', 'Title', 'Word Count', 'Images', 'Scripts', 'Stylesheets'];
    const rows: string[] = [headers.join(',')];

    if (data.scanResults) {
      data.scanResults.forEach(([url, result]: [string, any]) => {
        const row = [
          url,
          result.status || '',
          result.title || '',
          result.seoData?.wordCount || 0,
          result.images?.length || 0,
          result.scripts?.length || 0,
          result.stylesheets?.length || 0,
        ];
        rows.push(row.map(field => `"${field}"`).join(','));
      });
    }

    // Add assets section
    rows.push([], ['Assets'], ['URL', 'Type', 'Status', 'Size']);
    
    if (data.assets) {
      data.assets.forEach((asset: any) => {
        const row = [
          asset.url,
          asset.type,
          asset.status,
          asset.size || 'Unknown',
        ];
        rows.push(row.map(field => `"${field}"`).join(','));
      });
    }

    return rows.join('\n');
  }

  private generatePDFReport(data: any): string {
    const scanDate = new Date().toLocaleDateString();
    const scanTime = new Date().toLocaleTimeString();

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Website Analysis Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #007bff; border-bottom: 1px solid #dee2e6; padding-bottom: 10px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .card { border: 1px solid #dee2e6; border-radius: 8px; padding: 15px; background: #f8f9fa; }
        .metric { font-size: 24px; font-weight: bold; color: #007bff; }
        .label { font-size: 14px; color: #6c757d; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #dee2e6; padding: 10px; text-align: left; }
        th { background-color: #f8f9fa; font-weight: bold; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #6c757d; }
        @media print {
            body { margin: 20px; }
            .page-break { page-break-before: always; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Website Analysis Report</h1>
        <p>Generated on ${scanDate} at ${scanTime}</p>
    </div>

    <div class="section">
        <h2>Executive Summary</h2>
        <div class="grid">
            <div class="card">
                <div class="metric">${data.assets?.length || 0}</div>
                <div class="label">Total Assets</div>
            </div>
            <div class="card">
                <div class="metric">${data.scanResults?.length || 0}</div>
                <div class="label">Pages Scanned</div>
            </div>
            <div class="card">
                <div class="metric">${data.assets?.filter((a: any) => a.type === 'image').length || 0}</div>
                <div class="label">Images Found</div>
            </div>
            <div class="card">
                <div class="metric">${data.assets?.filter((a: any) => a.type === 'script').length || 0}</div>
                <div class="label">Scripts Found</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Scanned Pages</h2>
        <table>
            <thead>
                <tr>
                    <th>URL</th>
                    <th>Status</th>
                    <th>Title</th>
                    <th>Word Count</th>
                </tr>
            </thead>
            <tbody>
                ${data.scanResults?.map(([url, result]: [string, any]) => `
                    <tr>
                        <td>${url}</td>
                        <td>${result.status}</td>
                        <td>${result.title || 'No title'}</td>
                        <td>${result.seoData?.wordCount || 0}</td>
                    </tr>
                `).join('') || '<tr><td colspan="4">No pages scanned</td></tr>'}
            </tbody>
        </table>
    </div>

    <div class="section page-break">
        <h2>Assets Overview</h2>
        <table>
            <thead>
                <tr>
                    <th>URL</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Size</th>
                </tr>
            </thead>
            <tbody>
                ${data.assets?.slice(0, 50).map((asset: any) => `
                    <tr>
                        <td>${asset.url}</td>
                        <td>${asset.type}</td>
                        <td>${asset.status}</td>
                        <td>${asset.size ? this.formatFileSize(asset.size) : 'Unknown'}</td>
                    </tr>
                `).join('') || '<tr><td colspan="4">No assets found</td></tr>'}
            </tbody>
        </table>
        ${data.assets?.length > 50 ? '<p><em>Note: Showing first 50 assets only</em></p>' : ''}
    </div>

    <div class="section">
        <h2>Chat History Summary</h2>
        <p>This report includes ${data.chatHistory?.length || 0} interactions with the AI assistant covering various aspects of the website analysis.</p>
        <div class="grid">
            <div class="card">
                <div class="metric">${data.chatHistory?.filter((m: any) => m.role === 'user').length || 0}</div>
                <div class="label">User Messages</div>
            </div>
            <div class="card">
                <div class="metric">${data.chatHistory?.filter((m: any) => m.role === 'assistant').length || 0}</div>
                <div class="label">AI Responses</div>
            </div>
        </div>
    </div>

    <div class="footer">
        <p>Generated by Website AI Scanner • ${scanDate} ${scanTime}</p>
        <p>This report contains confidential analysis data. Please handle accordingly.</p>
    </div>
</body>
</html>`;
  }

  private formatFileSize(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }
}