import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { t } from '@/i18n/russian';
import { 
  Send, 
  Plus, 
  Minus, 
  Code, 
  Eye, 
  EyeOff,
  Save,
  MoreVertical,
  Globe,
  Book,
  Clock,
  Download
} from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import { apiService } from '@/services/api';
import { formatJson, getMethodColor } from '@/utils';
import type { HttpRequest, HttpMethod, AuthConfig, HttpResponse } from '@/types';
import toast from 'react-hot-toast';

const RequestPanel = () => {
  const { 
    collections, 
    activeRequestId, 
    activeEnvironmentId,
    environments,
    updateRequest,
    addToHistory,
    setSelectedTab 
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body' | 'auth'>('params');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<HttpResponse | null>(null);
  const [requestData, setRequestData] = useState<Partial<HttpRequest>>({});

  const activeEnvironment = environments.find(env => env.id === activeEnvironmentId);
  const activeRequest = collections
    .flatMap(col => col.requests)
    .find(req => req.id === activeRequestId);

  useEffect(() => {
    if (activeRequest) {
      setRequestData(activeRequest);
    }
  }, [activeRequest]);

  if (!activeRequest) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Code className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium mb-2">Выберите запрос</p>
          <p className="text-sm">Выберите запрос из боковой панели, чтобы начать работу</p>
        </div>
      </div>
    );
  }

  const handleSendRequest = async () => {
    if (!requestData.url) {
      toast.error('URL обязателен');
      return;
    }

    setIsLoading(true);
    try {
      const requestToSend: HttpRequest = {
        id: activeRequest.id,
        name: requestData.name || activeRequest.name,
        method: requestData.method || 'GET',
        url: requestData.url,
        headers: requestData.headers || {},
        body: requestData.body || '',
        params: requestData.params || {},
        description: requestData.description || '',
        createdAt: activeRequest.createdAt,
        updatedAt: new Date(),
      };

      const result = await apiService.executeRequest(
        requestToSend, 
        activeEnvironment?.variables
      );
      
      setResponse(result);
      setSelectedTab('response');
      addToHistory(activeRequest.id, result);
      toast.success('Запрос выполнен успешно');
    } catch (error) {
      toast.error('Ошибка при выполнении запроса');
      console.error('Request failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRequest = () => {
    if (requestData) {
      updateRequest(activeRequest.id, requestData);
      toast.success('Запрос сохранен');
    }
  };

  const updateRequestField = <K extends keyof HttpRequest>(field: K, value: HttpRequest[K]) => {
    setRequestData(prev => ({ ...prev, [field]: value }));
  };

  const methodOptions: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            value={requestData.name || ''}
            onChange={(e) => updateRequestField('name', e.target.value)}
            className="text-lg font-semibold bg-transparent border-none outline-none text-gray-900 w-full"
            placeholder="Название запроса"
          />
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSaveRequest}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Сохранить"
            >
              <Save className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Request Line */}
        <div className="flex items-center space-x-3">
          <select
            value={requestData.method || 'GET'}
            onChange={(e) => updateRequestField('method', e.target.value as HttpMethod)}
            className={`px-3 py-2 rounded-lg border font-medium text-sm ${getMethodColor(requestData.method || 'GET')}`}
          >
            {methodOptions.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>

          <input
            type="url"
            value={requestData.url || ''}
            onChange={(e) => updateRequestField('url', e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Введите URL запроса..."
          />

          <button
            onClick={handleSendRequest}
            disabled={isLoading || !requestData.url}
            className="btn-primary px-6 py-2 flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{isLoading ? 'Отправка...' : 'Отправить'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0">
        <div className="flex border-b border-gray-200">
          {(['params', 'headers', 'body', 'auth'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t[tab as keyof typeof t] || tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'params' && (
          <ParamsTab 
            params={requestData.params || {}}
            onChange={(params) => updateRequestField('params', params)}
          />
        )}
        {activeTab === 'headers' && (
          <HeadersTab 
            headers={requestData.headers || {}}
            onChange={(headers) => updateRequestField('headers', headers)}
          />
        )}
        {activeTab === 'body' && (
          <BodyTab 
            body={requestData.body || ''}
            contentType={requestData.headers?.['content-type'] || 'application/json'}
            onChange={(body) => updateRequestField('body', body)}
          />
        )}
        {activeTab === 'auth' && (
          <AuthTab 
            auth={requestData.auth}
            onChange={(auth) => updateRequestField('auth', auth)}
          />
        )}
      </div>

      {/* Response Preview */}
      {response && (
        <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">Последний ответ</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className={`px-2 py-1 rounded text-white ${
                response.status >= 200 && response.status < 300 ? 'bg-green-500' :
                response.status >= 400 ? 'bg-red-500' : 'bg-yellow-500'
              }`}>
                {response.status} {response.statusText}
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{response.time}ms</span>
              </span>
              <span>{response.size} bytes</span>
            </div>
          </div>
          <div className="text-sm text-gray-700 bg-white rounded p-2 overflow-x-auto">
            <pre>{JSON.stringify(response.data, null, 2).substring(0, 200)}...</pre>
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент для параметров
const ParamsTab = ({ params, onChange }: { 
  params: Record<string, string>; 
  onChange: (params: Record<string, string>) => void; 
}) => {
  const [paramList, setParamList] = useState<Array<{key: string, value: string, enabled: boolean}>>([]);

  useEffect(() => {
    const list = Object.entries(params).map(([key, value]) => ({ key, value, enabled: true }));
    if (list.length === 0) {
      list.push({ key: '', value: '', enabled: true });
    }
    setParamList(list);
  }, [params]);

  const handleParamChange = (index: number, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    const newParams = [...paramList];
    newParams[index] = { ...newParams[index], [field]: value };
    setParamList(newParams);

    // Update parent
    const activeParams = newParams
      .filter(p => p.enabled && p.key)
      .reduce((acc, p) => ({ ...acc, [p.key]: p.value }), {});
    onChange(activeParams);
  };

  const addParam = () => {
    setParamList([...paramList, { key: '', value: '', enabled: true }]);
  };

  const removeParam = (index: number) => {
    const newParams = paramList.filter((_, i) => i !== index);
    setParamList(newParams);
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-3">
        {paramList.map((param, index) => (
          <div key={index} className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={param.enabled}
              onChange={(e) => handleParamChange(index, 'enabled', e.target.checked)}
              className="w-4 h-4 text-primary-600"
            />
            <input
              type="text"
              value={param.key}
              onChange={(e) => handleParamChange(index, 'key', e.target.value)}
              placeholder="Ключ"
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              value={param.value}
              onChange={(e) => handleParamChange(index, 'value', e.target.value)}
              placeholder="Значение"
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={() => removeParam(index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addParam}
        className="mt-3 flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Добавить параметр</span>
      </button>
    </div>
  );
};

// Компонент для заголовков
const HeadersTab = ({ headers, onChange }: {
  headers: Record<string, string>;
  onChange: (headers: Record<string, string>) => void;
}) => {
  const [headerList, setHeaderList] = useState<Array<{key: string, value: string, enabled: boolean}>>([]);

  useEffect(() => {
    const list = Object.entries(headers).map(([key, value]) => ({ key, value, enabled: true }));
    if (list.length === 0) {
      list.push({ key: '', value: '', enabled: true });
    }
    setHeaderList(list);
  }, [headers]);

  const handleHeaderChange = (index: number, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    const newHeaders = [...headerList];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    setHeaderList(newHeaders);

    const activeHeaders = newHeaders
      .filter(h => h.enabled && h.key)
      .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});
    onChange(activeHeaders);
  };

  const addHeader = () => {
    setHeaderList([...headerList, { key: '', value: '', enabled: true }]);
  };

  const removeHeader = (index: number) => {
    const newHeaders = headerList.filter((_, i) => i !== index);
    setHeaderList(newHeaders);
  };

  const commonHeaders = [
    'Content-Type',
    'Authorization',
    'Accept',
    'User-Agent',
    'X-API-Key',
  ];

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-3">
        {headerList.map((header, index) => (
          <div key={index} className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={header.enabled}
              onChange={(e) => handleHeaderChange(index, 'enabled', e.target.checked)}
              className="w-4 h-4 text-primary-600"
            />
            <input
              type="text"
              value={header.key}
              onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
              placeholder="Заголовок"
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              list={`headers-${index}`}
            />
            <datalist id={`headers-${index}`}>
              {commonHeaders.map(h => <option key={h} value={h} />)}
            </datalist>
            <input
              type="text"
              value={header.value}
              onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
              placeholder="Значение"
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={() => removeHeader(index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addHeader}
        className="mt-3 flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Добавить заголовок</span>
      </button>
    </div>
  );
};

// Компонент для тела запроса
const BodyTab = ({ body, contentType, onChange }: {
  body: string;
  contentType: string;
  onChange: (body: string) => void;
}) => {
  const [bodyType, setBodyType] = useState<'none' | 'json' | 'text' | 'form'>('json');

  useEffect(() => {
    if (contentType.includes('application/json')) setBodyType('json');
    else if (contentType.includes('application/x-www-form-urlencoded')) setBodyType('form');
    else if (body) setBodyType('text');
    else setBodyType('none');
  }, [contentType, body]);

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center space-x-4 mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            checked={bodyType === 'none'}
            onChange={() => setBodyType('none')}
            className="w-4 h-4 text-primary-600"
          />
          <span>Нет</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            checked={bodyType === 'json'}
            onChange={() => setBodyType('json')}
            className="w-4 h-4 text-primary-600"
          />
          <span>JSON</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            checked={bodyType === 'text'}
            onChange={() => setBodyType('text')}
            className="w-4 h-4 text-primary-600"
          />
          <span>Текст</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            checked={bodyType === 'form'}
            onChange={() => setBodyType('form')}
            className="w-4 h-4 text-primary-600"
          />
          <span>Form</span>
        </label>
      </div>

      {bodyType !== 'none' && (
        <div className="flex-1">
          <Editor
            height="100%"
            language={bodyType === 'json' ? 'json' : 'text'}
            value={body}
            onChange={(value) => onChange(value || '')}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              wordWrap: 'on',
            }}
          />
        </div>
      )}
    </div>
  );
};

// Компонент для авторизации
const AuthTab = ({ auth, onChange }: {
  auth?: AuthConfig;
  onChange: (auth: AuthConfig) => void;
}) => {
  const [authType, setAuthType] = useState<'none' | 'bearer' | 'basic' | 'api-key'>('none');

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Тип авторизации</label>
          <select
            value={authType}
            onChange={(e) => setAuthType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="none">Нет авторизации</option>
            <option value="bearer">Bearer Token</option>
            <option value="basic">Basic Auth</option>
            <option value="api-key">API Key</option>
          </select>
        </div>

        {authType === 'bearer' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bearer Token</label>
            <input
              type="password"
              placeholder="Введите токен"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        )}

        {authType === 'basic' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Имя пользователя</label>
              <input
                type="text"
                placeholder="Введите имя пользователя"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Пароль</label>
              <input
                type="password"
                placeholder="Введите пароль"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </>
        )}

        {authType === 'api-key' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ключ</label>
              <input
                type="text"
                placeholder="Название ключа"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Значение</label>
              <input
                type="password"
                placeholder="Значение API ключа"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Добавить к</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="header">Заголовок</option>
                <option value="query">Параметры запроса</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestPanel;