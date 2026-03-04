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
  MoreVertical
} from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import { apiService } from '@/services/api';
import { formatJson, getMethodColor } from '@/utils';
import type { HttpRequest, HttpMethod, AuthConfig } from '@/types';
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

  const activeEnvironment = environments.find(env => env.id === activeEnvironmentId);
  const activeRequest = collections
    .flatMap(col => col.requests)
    .find(req => req.id === activeRequestId);

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
    setIsLoading(true);
    setSelectedTab('response');
    
    try {
      const response = await apiService.executeRequest(
        activeRequest,
        activeEnvironment?.variables
      );
      
      addToHistory(activeRequest.id, response);
      toast.success('Request completed successfully');
    } catch (error) {
      addToHistory(activeRequest.id, undefined, error instanceof Error ? error.message : 'Unknown error');
      toast.error('Request failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRequest = (updates: Partial<HttpRequest>) => {
    updateRequest(activeRequest.id, updates);
  };

  const handleSaveRequest = () => {
    toast.success('Request saved');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            value={activeRequest.name}
            onChange={(e) => handleUpdateRequest({ name: e.target.value })}
            className="text-lg font-semibold bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
            placeholder="Request name"
          />
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSaveRequest}
              className="btn-secondary flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* URL Bar */}
        <div className="flex items-center space-x-3">
          <select
            value={activeRequest.method}
            onChange={(e) => handleUpdateRequest({ method: e.target.value as HttpMethod })}
            className={`px-3 py-2 rounded-lg font-medium text-sm border-none outline-none ${getMethodColor(activeRequest.method)}`}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
            <option value="HEAD">HEAD</option>
            <option value="OPTIONS">OPTIONS</option>
          </select>

          <input
            type="text"
            value={activeRequest.url}
            onChange={(e) => handleUpdateRequest({ url: e.target.value })}
            placeholder="Enter request URL"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />

          <button
            onClick={handleSendRequest}
            disabled={isLoading}
            className="btn-primary flex items-center space-x-2 min-w-[100px]"
          >
            <Send className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} />
            <span>{isLoading ? 'Sending...' : 'Send'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6 px-4">
          {(['params', 'headers', 'body', 'auth'] as const).map((tab) => (
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
        {activeTab === 'params' && (
          <ParamsTab
            params={activeRequest.params}
            onUpdate={(params) => handleUpdateRequest({ params })}
          />
        )}
        
        {activeTab === 'headers' && (
          <HeadersTab
            headers={activeRequest.headers}
            onUpdate={(headers) => handleUpdateRequest({ headers })}
          />
        )}
        
        {activeTab === 'body' && (
          <BodyTab
            body={activeRequest.body || ''}
            method={activeRequest.method}
            onUpdate={(body) => handleUpdateRequest({ body })}
          />
        )}
        
        {activeTab === 'auth' && (
          <AuthTab
            auth={activeRequest.auth}
            onUpdate={(auth) => handleUpdateRequest({ auth })}
          />
        )}
      </div>
    </div>
  );
};

interface ParamsTabProps {
  params: Record<string, string>;
  onUpdate: (params: Record<string, string>) => void;
}

const ParamsTab = ({ params, onUpdate }: ParamsTabProps) => {
  const [paramsList, setParamsList] = useState(
    Object.entries(params).map(([key, value]) => ({ key, value, enabled: true }))
  );

  useEffect(() => {
    const enabledParams = paramsList
      .filter(p => p.enabled && p.key)
      .reduce((acc, p) => ({ ...acc, [p.key]: p.value }), {});
    onUpdate(enabledParams);
  }, [paramsList, onUpdate]);

  const addParam = () => {
    setParamsList([...paramsList, { key: '', value: '', enabled: true }]);
  };

  const removeParam = (index: number) => {
    setParamsList(paramsList.filter((_, i) => i !== index));
  };

  const updateParam = (index: number, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    const updated = [...paramsList];
    updated[index] = { ...updated[index], [field]: value };
    setParamsList(updated);
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-2">
        {paramsList.map((param, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={param.enabled}
              onChange={(e) => updateParam(index, 'enabled', e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            
            <input
              type="text"
              placeholder="Key"
              value={param.key}
              onChange={(e) => updateParam(index, 'key', e.target.value)}
              className="flex-1 input"
            />
            
            <input
              type="text"
              placeholder="Value"
              value={param.value}
              onChange={(e) => updateParam(index, 'value', e.target.value)}
              className="flex-1 input"
            />
            
            <button
              onClick={() => removeParam(index)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      <button
        onClick={addParam}
        className="mt-4 flex items-center space-x-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors duration-200"
      >
        <Plus className="w-4 h-4" />
        <span>Add Parameter</span>
      </button>
    </div>
  );
};

interface HeadersTabProps {
  headers: Record<string, string>;
  onUpdate: (headers: Record<string, string>) => void;
}

const HeadersTab = ({ headers, onUpdate }: HeadersTabProps) => {
  const [headersList, setHeadersList] = useState(
    Object.entries(headers).map(([key, value]) => ({ key, value, enabled: true }))
  );

  useEffect(() => {
    const enabledHeaders = headersList
      .filter(h => h.enabled && h.key)
      .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});
    onUpdate(enabledHeaders);
  }, [headersList, onUpdate]);

  const addHeader = () => {
    setHeadersList([...headersList, { key: '', value: '', enabled: true }]);
  };

  const removeHeader = (index: number) => {
    setHeadersList(headersList.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    const updated = [...headersList];
    updated[index] = { ...updated[index], [field]: value };
    setHeadersList(updated);
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-2">
        {headersList.map((header, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={header.enabled}
              onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            
            <input
              type="text"
              placeholder="Header name (e.g. Content-Type)"
              value={header.key}
              onChange={(e) => updateHeader(index, 'key', e.target.value)}
              className="flex-1 input"
            />
            
            <input
              type="text"
              placeholder="Header value"
              value={header.value}
              onChange={(e) => updateHeader(index, 'value', e.target.value)}
              className="flex-1 input"
            />
            
            <button
              onClick={() => removeHeader(index)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      <button
        onClick={addHeader}
        className="mt-4 flex items-center space-x-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors duration-200"
      >
        <Plus className="w-4 h-4" />
        <span>Add Header</span>
      </button>
    </div>
  );
};

interface BodyTabProps {
  body: string;
  method: HttpMethod;
  onUpdate: (body: string) => void;
}

const BodyTab = ({ body, method, onUpdate }: BodyTabProps) => {
  const [bodyType, setBodyType] = useState<'none' | 'raw' | 'form'>('raw');
  const [rawType, setRawType] = useState<'json' | 'text' | 'xml' | 'html'>('json');

  const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);

  if (!hasBody) {
    return (
      <div className="p-4 h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Code className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>This method doesn't support request body</p>
        </div>
      </div>
    );
  }

  const handleFormat = () => {
    if (rawType === 'json') {
      try {
        const formatted = formatJson(body);
        onUpdate(formatted);
        toast.success('JSON formatted');
      } catch {
        toast.error('Invalid JSON');
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value as any)}
              className="input"
            >
              <option value="none">None</option>
              <option value="raw">Raw</option>
              <option value="form">Form Data</option>
            </select>
            
            {bodyType === 'raw' && (
              <select
                value={rawType}
                onChange={(e) => setRawType(e.target.value as any)}
                className="input"
              >
                <option value="json">JSON</option>
                <option value="text">Text</option>
                <option value="xml">XML</option>
                <option value="html">HTML</option>
              </select>
            )}
          </div>
          
          {bodyType === 'raw' && rawType === 'json' && (
            <button
              onClick={handleFormat}
              className="btn-secondary text-sm"
            >
              Format
            </button>
          )}
        </div>
      </div>
      
      {bodyType === 'raw' && (
        <div className="flex-1 border border-gray-200 m-4 rounded-lg overflow-hidden">
          <Editor
            language={rawType === 'json' ? 'json' : rawType}
            value={body}
            onChange={(value) => onUpdate(value || '')}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              lineNumbers: 'on',
              folding: true,
              wordWrap: 'on',
            }}
          />
        </div>
      )}
    </div>
  );
};

interface AuthTabProps {
  auth?: AuthConfig;
  onUpdate: (auth: AuthConfig) => void;
}

const AuthTab = ({ auth, onUpdate }: AuthTabProps) => {
  const [authType, setAuthType] = useState(auth?.type || 'none');
  const [showPassword, setShowPassword] = useState(false);

  const updateAuth = (updates: Partial<AuthConfig>) => {
    onUpdate({ ...auth, ...updates, type: authType });
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Auth Type
          </label>
          <select
            value={authType}
            onChange={(e) => setAuthType(e.target.value as any)}
            className="input"
          >
            <option value="none">No Auth</option>
            <option value="bearer">Bearer Token</option>
            <option value="basic">Basic Auth</option>
            <option value="api-key">API Key</option>
          </select>
        </div>

        {authType === 'bearer' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token
            </label>
            <input
              type="text"
              value={auth?.token || ''}
              onChange={(e) => updateAuth({ token: e.target.value })}
              placeholder="Enter bearer token"
              className="input"
            />
          </div>
        )}

        {authType === 'basic' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={auth?.username || ''}
                onChange={(e) => updateAuth({ username: e.target.value })}
                placeholder="Enter username"
                className="input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={auth?.password || ''}
                  onChange={(e) => updateAuth({ password: e.target.value })}
                  placeholder="Enter password"
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {authType === 'api-key' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key
              </label>
              <input
                type="text"
                value={auth?.key || ''}
                onChange={(e) => updateAuth({ key: e.target.value })}
                placeholder="Enter API key name"
                className="input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value
              </label>
              <input
                type="text"
                value={auth?.value || ''}
                onChange={(e) => updateAuth({ value: e.target.value })}
                placeholder="Enter API key value"
                className="input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add to
              </label>
              <select
                value={auth?.addTo || 'header'}
                onChange={(e) => updateAuth({ addTo: e.target.value as 'header' | 'query' })}
                className="input"
              >
                <option value="header">Header</option>
                <option value="query">Query Params</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPanel;