import { useState } from 'react';
import { useAppStore } from '@/store';
import { Editor } from '@monaco-editor/react';
import { 
  Copy, 
  Download,
  Clock,
  Database,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { formatBytes, formatTime, getStatusColor, copyToClipboard, downloadFile } from '@/utils';
import { codeGenerators } from '@/utils/codeGenerators';
import toast from 'react-hot-toast';

const ResponsePanel = () => {
  const { 
    selectedTab, 
    setSelectedTab, 
    requestHistory, 
    activeRequestId,
    collections 
  } = useAppStore();

  const activeRequest = collections
    .flatMap(col => col.requests)
    .find(req => req.id === activeRequestId);

  const latestResponse = requestHistory
    .filter(entry => entry.requestId === activeRequestId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <nav className="flex">
          {(['response', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 ${
                selectedTab === tab
                  ? 'bg-white border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {selectedTab === 'response' && (
          <ResponseTab
            response={latestResponse?.response}
            error={latestResponse?.error}
            request={activeRequest}
          />
        )}
        
        {selectedTab === 'history' && (
          <HistoryTab requestId={activeRequestId} />
        )}
      </div>
    </div>
  );
};

interface ResponseTabProps {
  response?: any;
  error?: string;
  request?: any;
}

const ResponseTab = ({ response, error, request }: ResponseTabProps) => {
  const [activeTab, setActiveTab] = useState<'body' | 'headers' | 'cookies' | 'code'>('body');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [rawView, setRawView] = useState(false);

  if (!response && !error) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium mb-2">No response yet</p>
          <p className="text-sm">Send a request to see the response here</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Failed</h3>
          <p className="text-gray-600 bg-red-50 p-4 rounded-lg font-mono text-sm">
            {error}
          </p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status >= 400) return <XCircle className="w-5 h-5 text-red-600" />;
    return <AlertCircle className="w-5 h-5 text-yellow-600" />;
  };

  const handleCopyResponse = () => {
    const text = rawView 
      ? JSON.stringify(response.data, null, 2)
      : typeof response.data === 'string' 
        ? response.data 
        : JSON.stringify(response.data, null, 2);
    
    copyToClipboard(text);
    toast.success('Ответ скопирован в буфер обмена');
  };

  const handleDownloadResponse = () => {
    const text = typeof response.data === 'string' 
      ? response.data 
      : JSON.stringify(response.data, null, 2);
    
    downloadFile(text, `response-${Date.now()}.json`, 'application/json');
    toast.success('Ответ скачан');
  };

  const generateCode = () => {
    if (!request) return '';
    
    const generator = codeGenerators.find(g => g.language === codeLanguage);
    return generator ? generator.generate(request) : '';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Response Status */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon(response.status)}
              <span className={`text-lg font-semibold ${getStatusColor(response.status)}`}>
                {response.status} {response.statusText}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatTime(response.time)}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Database className="w-4 h-4" />
                <span>{formatBytes(response.size)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyResponse}
              className="btn-secondary flex items-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
            
            <button
              onClick={handleDownloadResponse}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Response Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6 px-4">
          {(['body', 'headers', 'cookies', 'code'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'body' && (
          <div className="h-full flex flex-col">
            <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Response Body</span>
                {typeof response.data === 'object' && (
                  <button
                    onClick={() => setRawView(!rawView)}
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{rawView ? 'Pretty' : 'Raw'}</span>
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <Editor
                language="json"
                value={
                  typeof response.data === 'string' 
                    ? response.data
                    : rawView
                      ? JSON.stringify(response.data)
                      : JSON.stringify(response.data, null, 2)
                }
                theme="vs-light"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  lineNumbers: 'on',
                  folding: true,
                  wordWrap: 'on',
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="p-4 overflow-y-auto">
            <div className="space-y-2">
              {Object.entries(response.headers).map(([key, value]) => (
                <div key={key} className="flex items-start space-x-4 py-2 border-b border-gray-100">
                  <div className="font-medium text-gray-900 min-w-0 flex-1">
                    {key}
                  </div>
                  <div className="text-gray-600 min-w-0 flex-2 font-mono text-sm">
                    {value as string}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cookies' && (
          <div className="p-4 text-center text-gray-500">
            <p>No cookies received</p>
          </div>
        )}

        {activeTab === 'code' && request && (
          <div className="h-full flex flex-col">
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <select
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="input text-sm"
                >
                  {codeGenerators.map((generator) => (
                    <option key={generator.language} value={generator.language}>
                      {generator.name}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={() => {
                    copyToClipboard(generateCode());
                    toast.success('Код скопирован в буфер обмена');
                  }}
                  className="btn-secondary flex items-center space-x-2 text-sm"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
              </div>
            </div>
            
            <div className="flex-1">
              <Editor
                language={codeLanguage}
                value={generateCode()}
                theme="vs-light"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  lineNumbers: 'on',
                  folding: true,
                  wordWrap: 'on',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface HistoryTabProps {
  requestId: string | null;
}

const HistoryTab = ({ requestId }: HistoryTabProps) => {
  const { requestHistory } = useAppStore();

  const history = requestHistory
    .filter(entry => entry.requestId === requestId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (!requestId || history.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium mb-2">No history yet</p>
          <p className="text-sm">Send some requests to see the history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-y-auto">
      <div className="space-y-3">
        {history.map((entry) => (
          <div key={entry.id} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {entry.error ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                
                {entry.response && (
                  <span className={`font-medium ${getStatusColor(entry.response.status)}`}>
                    {entry.response.status} {entry.response.statusText}
                  </span>
                )}
                
                {entry.error && (
                  <span className="text-red-600 font-medium">Error</span>
                )}
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{new Date(entry.timestamp).toLocaleString()}</span>
              </div>
            </div>
            
            {entry.error && (
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-red-700 font-mono text-sm">{entry.error}</p>
              </div>
            )}
            
            {entry.response && (
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(entry.response.time)}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Database className="w-4 h-4" />
                  <span>{formatBytes(entry.response.size)}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponsePanel;