import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { t } from '@/i18n/russian';
import { 
  Download, 
  Copy, 
  Maximize2, 
  Minimize2,
  Eye,
  Code,
  Info,
  Clock,
  FileText,
  Image,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import { formatJson } from '@/utils';
import type { HttpResponse } from '@/types';
import toast from 'react-hot-toast';

const ResponsePanel = () => {
  const { requestHistory, activeRequestId, selectedTab } = useAppStore();
  const [activeTab, setActiveTab] = useState<'body' | 'headers' | 'cookies' | 'test'>('body');
  const [viewMode, setViewMode] = useState<'pretty' | 'raw' | 'preview'>('pretty');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get latest response for active request
  const latestResponse = requestHistory
    .filter(h => h.requestId === activeRequestId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  if (!latestResponse?.response && !latestResponse?.error) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 bg-gray-50">
        <div className="text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium mb-2">Нет ответов</p>
          <p className="text-sm">Отправьте запрос, чтобы увидеть ответ здесь</p>
        </div>
      </div>
    );
  }

  const response = latestResponse.response;
  const error = latestResponse.error;

  const getStatusColor = (status?: number) => {
    if (!status) return 'bg-red-500';
    if (status >= 200 && status < 300) return 'bg-green-500';
    if (status >= 300 && status < 400) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (status?: number) => {
    if (!status) return <XCircle className="w-4 h-4" />;
    if (status >= 200 && status < 300) return <CheckCircle className="w-4 h-4" />;
    if (status >= 300 && status < 400) return <AlertCircle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Скопировано в буфер обмена');
    } catch (err) {
      toast.error('Ошибка копирования');
    }
  };

  const downloadResponse = () => {
    if (!response) return;

    const blob = new Blob([JSON.stringify(response.data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`bg-white flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'}`}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900">{t.response}</h3>
            
            {/* Status */}
            {response && (
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1 px-2 py-1 rounded text-white text-sm ${getStatusColor(response.status)}`}>
                  {getStatusIcon(response.status)}
                  <span>{response.status} {response.statusText}</span>
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{response.time}ms</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  {response.size} bytes
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-700 rounded">
                <XCircle className="w-4 h-4" />
                <span className="text-sm">Ошибка запроса</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {response && (
              <>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(response.data, null, 2))}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors text-sm"
                  title="Копировать ответ"
                >
                  <Copy className="w-4 h-4" />
                  <span>Копировать</span>
                </button>
                
                <button
                  onClick={downloadResponse}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors text-sm"
                  title="Скачать ответ"
                >
                  <Download className="w-4 h-4" />
                  <span>Скачать</span>
                </button>
              </>
            )}

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title={isFullscreen ? 'Свернуть' : 'Развернуть'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0">
        <div className="flex border-b border-gray-200">
          {(['body', 'headers', 'cookies', 'test'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab === 'body' && 'Тело ответа'}
              {tab === 'headers' && 'Заголовки'}
              {tab === 'cookies' && 'Cookies'}
              {tab === 'test' && 'Тесты'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {error ? (
          <div className="p-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">Ошибка выполнения запроса</h4>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'body' && response && (
              <BodyTab 
                data={response.data}
                contentType={response.headers['content-type'] || ''}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            )}
            {activeTab === 'headers' && response && (
              <HeadersTab headers={response.headers} />
            )}
            {activeTab === 'cookies' && (
              <CookiesTab />
            )}
            {activeTab === 'test' && (
              <TestTab />
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Компонент для отображения тела ответа
const BodyTab = ({ 
  data, 
  contentType, 
  viewMode, 
  onViewModeChange 
}: {
  data: any;
  contentType: string;
  viewMode: 'pretty' | 'raw' | 'preview';
  onViewModeChange: (mode: 'pretty' | 'raw' | 'preview') => void;
}) => {
  const [formattedData, setFormattedData] = useState('');

  useEffect(() => {
    try {
      if (typeof data === 'object') {
        setFormattedData(JSON.stringify(data, null, 2));
      } else {
        setFormattedData(String(data));
      }
    } catch (err) {
      setFormattedData(String(data));
    }
  }, [data]);

  const isJson = contentType.includes('application/json') || contentType.includes('text/json');
  const isImage = contentType.includes('image/');
  const isText = contentType.includes('text/') && !isJson;

  return (
    <div className="h-full flex flex-col">
      {/* View Mode Selector */}
      <div className="flex-shrink-0 p-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewModeChange('pretty')}
            className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
              viewMode === 'pretty' 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Красивый</span>
          </button>
          
          <button
            onClick={() => onViewModeChange('raw')}
            className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
              viewMode === 'raw' 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Исходный</span>
          </button>

          {(isImage || contentType.includes('text/html')) && (
            <button
              onClick={() => onViewModeChange('preview')}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                viewMode === 'preview' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Предпросмотр</span>
            </button>
          )}
        </div>

        <div className="text-sm text-gray-500">
          {contentType || 'application/octet-stream'}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'preview' && isImage ? (
          <div className="p-4 h-full flex items-center justify-center">
            <img 
              src={`data:${contentType};base64,${data}`} 
              alt="Response" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ) : viewMode === 'preview' && contentType.includes('text/html') ? (
          <iframe 
            srcDoc={formattedData}
            className="w-full h-full border-0"
            title="HTML Preview"
          />
        ) : (
          <Editor
            height="100%"
            language={isJson ? 'json' : isText ? 'text' : 'text'}
            value={formattedData}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              wordWrap: 'on',
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        )}
      </div>
    </div>
  );
};

// Компонент для отображения заголовков ответа
const HeadersTab = ({ headers }: { headers: Record<string, string> }) => (
  <div className="p-4 h-full overflow-y-auto">
    {Object.keys(headers).length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        <Info className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p>Нет заголовков ответа</p>
      </div>
    ) : (
      <div className="space-y-2">
        {Object.entries(headers).map(([key, value]) => (
          <div key={key} className="flex py-2 border-b border-gray-100">
            <div className="w-1/3 font-medium text-gray-700 pr-4">{key}</div>
            <div className="w-2/3 text-gray-900 break-all">{value}</div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Компонент для отображения cookies
const CookiesTab = () => (
  <div className="p-4 h-full overflow-y-auto">
    <div className="text-center py-8 text-gray-500">
      <Info className="w-8 h-8 mx-auto mb-2 text-gray-400" />
      <p>Cookies пока не поддерживаются</p>
      <p className="text-sm mt-1">Будет добавлено в следующих версиях</p>
    </div>
  </div>
);

// Компонент для тестов
const TestTab = () => (
  <div className="p-4 h-full overflow-y-auto">
    <div className="text-center py-8 text-gray-500">
      <Info className="w-8 h-8 mx-auto mb-2 text-gray-400" />
      <p>Тесты пока не поддерживаются</p>
      <p className="text-sm mt-1">Будет добавлено в следующих версиях</p>
    </div>
  </div>
);

export default ResponsePanel;