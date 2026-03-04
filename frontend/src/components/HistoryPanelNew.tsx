import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { t } from '@/i18n/russian';
import {
  Clock,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Copy,
  Trash2,
  Star,
  Calendar,
  TrendingUp,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Eye
} from 'lucide-react';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import toast from 'react-hot-toast';
import type { RequestHistory } from '@/types';

const HistoryPanel = () => {
  const { 
    requestHistory, 
    favorites,
    clearHistory,
    removeFromHistory,
    addToFavorites,
    removeFromFavorites,
    setSelectedRequest,
    executeRequest
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'error' | 'pending'>('all');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortBy, setSortBy] = useState<'time' | 'method' | 'status' | 'duration'>('time');
  const [groupBy, setGroupBy] = useState<'none' | 'date' | 'method' | 'status' | 'collection'>('none');

  const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

  // Фильтрация истории
  const filteredHistory = requestHistory.filter(history => {
    // Поиск по URL и имени
    if (searchQuery && !history.url.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !history.name?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Фильтр по статусу
    if (filterStatus !== 'all') {
      if (filterStatus === 'success' && (!history.response || history.response.status < 200 || history.response.status >= 300)) {
        return false;
      }
      if (filterStatus === 'error' && (!history.error && history.response && history.response.status >= 200 && history.response.status < 300)) {
        return false;
      }
      if (filterStatus === 'pending' && (history.response || history.error)) {
        return false;
      }
    }

    // Фильтр по методу
    if (filterMethod !== 'all' && history.method !== filterMethod) {
      return false;
    }

    // Фильтр по дате
    if (dateFilter !== 'all') {
      const historyDate = new Date(history.timestamp);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          if (historyDate.toDateString() !== now.toDateString()) return false;
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (historyDate < weekAgo) return false;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (historyDate < monthAgo) return false;
          break;
      }
    }

    return true;
  });

  // Сортировка истории
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    switch (sortBy) {
      case 'time':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case 'method':
        return a.method.localeCompare(b.method);
      case 'status':
        const aStatus = a.response?.status || (a.error ? 0 : 999);
        const bStatus = b.response?.status || (b.error ? 0 : 999);
        return aStatus - bStatus;
      case 'duration':
        const aDuration = a.response?.time || 0;
        const bDuration = b.response?.time || 0;
        return bDuration - aDuration;
      default:
        return 0;
    }
  });

  // Группировка истории
  const groupedHistory = () => {
    if (groupBy === 'none') {
      return { 'Все запросы': sortedHistory };
    }

    const groups: Record<string, RequestHistory[]> = {};

    sortedHistory.forEach(history => {
      let groupKey = '';
      
      switch (groupBy) {
        case 'date':
          groupKey = new Date(history.timestamp).toLocaleDateString('ru-RU');
          break;
        case 'method':
          groupKey = history.method;
          break;
        case 'status':
          if (history.error) {
            groupKey = 'Ошибки';
          } else if (history.response) {
            const status = history.response.status;
            if (status >= 200 && status < 300) groupKey = 'Успешные (2xx)';
            else if (status >= 300 && status < 400) groupKey = 'Перенаправления (3xx)';
            else if (status >= 400 && status < 500) groupKey = 'Ошибки клиента (4xx)';
            else if (status >= 500) groupKey = 'Ошибки сервера (5xx)';
            else groupKey = 'Прочие';
          } else {
            groupKey = 'Ожидание';
          }
          break;
        case 'collection':
          groupKey = history.collectionName || 'Без коллекции';
          break;
        default:
          groupKey = 'Все запросы';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(history);
    });

    return groups;
  };

  const handleClearHistory = () => {
    if (window.confirm('Очистить всю историю запросов? Это действие нельзя отменить.')) {
      clearHistory();
      toast.success('История очищена');
    }
  };

  const handleRemoveFromHistory = (historyId: string) => {
    removeFromHistory(historyId);
    toast.success('Запрос удален из истории');
  };

  const handleToggleFavorite = (requestId: string) => {
    if (favorites.includes(requestId)) {
      removeFromFavorites(requestId);
      toast.success('Удалено из избранного');
    } else {
      addToFavorites(requestId);
      toast.success('Добавлено в избранное');
    }
  };

  const handleReplayRequest = async (history: RequestHistory) => {
    try {
      // Создаем новый запрос на основе истории
      await executeRequest({
        id: crypto.randomUUID(),
        name: 'Replay Request',
        method: history.method,
        url: history.url,
        headers: history.headers || {},
        body: history.body,
        auth: history.auth,
        params: {},
        createdAt: new Date(),
        updatedAt: new Date()
      });
      toast.success('Запрос выполнен повторно');
    } catch (error) {
      toast.error('Ошибка выполнения запроса');
    }
  };

  const handleCopyAsCode = (history: RequestHistory, format: 'curl' | 'javascript' | 'python') => {
    let code = '';
    
    switch (format) {
      case 'curl':
        code = generateCurlCommand(history);
        break;
      case 'javascript':
        code = generateJavaScriptCode(history);
        break;
      case 'python':
        code = generatePythonCode(history);
        break;
    }

    navigator.clipboard.writeText(code);
    toast.success(`Скопировано как ${format.toUpperCase()}`);
  };

  const getStatusIcon = (history: RequestHistory) => {
    if (history.error) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    if (history.response) {
      const status = history.response.status;
      if (status >= 200 && status < 300) {
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      }
      if (status >= 400) {
        return <XCircle className="w-4 h-4 text-red-500" />;
      }
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
    return <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />;
  };

  const getStatusColor = (history: RequestHistory) => {
    if (history.error) return 'bg-red-100 text-red-800';
    if (history.response) {
      const status = history.response.status;
      if (status >= 200 && status < 300) return 'bg-green-100 text-green-800';
      if (status >= 400) return 'bg-red-100 text-red-800';
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const generateStats = () => {
    const total = filteredHistory.length;
    const successful = filteredHistory.filter(h => h.response && h.response.status >= 200 && h.response.status < 300).length;
    const errors = filteredHistory.filter(h => h.error || (h.response && h.response.status >= 400)).length;
    const avgTime = filteredHistory
      .filter(h => h.response?.time)
      .reduce((sum, h) => sum + (h.response?.time || 0), 0) / 
      Math.max(1, filteredHistory.filter(h => h.response?.time).length);

    return { total, successful, errors, avgTime };
  };

  const stats = generateStats();

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            История
          </h2>
          
          <div className="flex items-center space-x-2">
            <DropdownMenu
              trigger={
                <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
                  <BarChart3 className="w-4 h-4" />
                </button>
              }
            >
              <div className="p-3 min-w-48">
                <h4 className="font-medium text-gray-900 mb-2">Статистика</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Всего запросов:</span>
                    <span className="font-medium">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Успешных:</span>
                    <span className="font-medium text-green-600">{stats.successful}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">С ошибками:</span>
                    <span className="font-medium text-red-600">{stats.errors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Среднее время:</span>
                    <span className="font-medium">{Math.round(stats.avgTime)}ms</span>
                  </div>
                </div>
              </div>
            </DropdownMenu>

            <DropdownMenu
              trigger={
                <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              }
            >
              <div className="py-1">
                <button
                  onClick={() => {/* TODO: Export history */}}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Экспорт истории</span>
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={handleClearHistory}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Очистить историю</span>
                </button>
              </div>
            </DropdownMenu>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск в истории..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border border-gray-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Все статусы</option>
            <option value="success">Успешные</option>
            <option value="error">С ошибками</option>
            <option value="pending">Ожидание</option>
          </select>

          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Все методы</option>
            {httpMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="border border-gray-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Все время</option>
            <option value="today">Сегодня</option>
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
          </select>

          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as any)}
            className="border border-gray-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="none">Без группировки</option>
            <option value="date">По дате</option>
            <option value="method">По методу</option>
            <option value="status">По статусу</option>
            <option value="collection">По коллекции</option>
          </select>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto">
        {filteredHistory.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            {requestHistory.length === 0 ? (
              <>
                <p className="mb-2">История запросов пуста</p>
                <p className="text-sm">Выполните запрос, чтобы увидеть его здесь</p>
              </>
            ) : (
              <p>Нет запросов, соответствующих фильтрам</p>
            )}
          </div>
        ) : (
          <div className="py-2">
            {Object.entries(groupedHistory()).map(([groupName, histories]) => (
              <div key={groupName}>
                {groupBy !== 'none' && (
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700">{groupName}</h4>
                  </div>
                )}
                
                {histories.map((history) => (
                  <HistoryItem
                    key={history.id}
                    history={history}
                    onReplay={() => handleReplayRequest(history)}
                    onToggleFavorite={() => handleToggleFavorite(history.requestId || history.id)}
                    onRemove={() => handleRemoveFromHistory(history.id)}
                    onCopyAsCode={(format) => handleCopyAsCode(history, format)}
                    isFavorite={favorites.includes(history.requestId || history.id)}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Компонент элемента истории
interface HistoryItemProps {
  history: RequestHistory;
  onReplay: () => void;
  onToggleFavorite: () => void;
  onRemove: () => void;
  onCopyAsCode: (format: 'curl' | 'javascript' | 'python') => void;
  isFavorite: boolean;
}

const HistoryItem = ({
  history,
  onReplay,
  onToggleFavorite,
  onRemove,
  onCopyAsCode,
  isFavorite
}: HistoryItemProps) => {
  const getStatusIcon = () => {
    if (history.error) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    if (history.response) {
      const status = history.response.status;
      if (status >= 200 && status < 300) {
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      }
      if (status >= 400) {
        return <XCircle className="w-4 h-4 text-red-500" />;
      }
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
    return <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />;
  };

  return (
    <div className="group px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getStatusIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${
              history.method === 'GET' ? 'bg-green-100 text-green-700' :
              history.method === 'POST' ? 'bg-blue-100 text-blue-700' :
              history.method === 'PUT' ? 'bg-orange-100 text-orange-700' :
              history.method === 'DELETE' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {history.method}
            </span>

            {history.response && (
              <span className={`text-xs px-2 py-0.5 rounded ${
                history.response.status >= 200 && history.response.status < 300 
                  ? 'bg-green-100 text-green-700'
                  : history.response.status >= 400 
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {history.response.status}
              </span>
            )}

            {history.response?.time && (
              <span className="text-xs text-gray-500">
                {history.response.time}ms
              </span>
            )}
          </div>

          <div className="font-medium text-gray-900 text-sm mb-1 truncate">
            {history.name || new URL(history.url).pathname}
          </div>
          
          <div className="text-sm text-gray-600 truncate mb-1">
            {history.url}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {new Date(history.timestamp).toLocaleString('ru-RU')}
            </span>

            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={onReplay}
                className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                title="Повторить запрос"
              >
                <Play className="w-3 h-3" />
              </button>

              <button
                onClick={onToggleFavorite}
                className={`p-1 rounded transition-colors ${
                  isFavorite 
                    ? 'text-yellow-500 hover:text-yellow-600' 
                    : 'text-gray-400 hover:text-yellow-500'
                }`}
                title={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
              >
                <Star className={`w-3 h-3 ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              <DropdownMenu
                trigger={
                  <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                    <MoreHorizontal className="w-3 h-3" />
                  </button>
                }
              >
                <div className="py-1">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b">
                    Копировать как код
                  </div>
                  <button
                    onClick={() => onCopyAsCode('curl')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    cURL
                  </button>
                  <button
                    onClick={() => onCopyAsCode('javascript')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    JavaScript
                  </button>
                  <button
                    onClick={() => onCopyAsCode('python')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Python
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={onRemove}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Удалить</span>
                  </button>
                </div>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Утилиты для генерации кода
const generateCurlCommand = (history: RequestHistory): string => {
  let cmd = `curl -X ${history.method} "${history.url}"`;
  
  if (history.headers) {
    Object.entries(history.headers).forEach(([key, value]) => {
      cmd += ` \\\n  -H "${key}: ${value}"`;
    });
  }

  if (history.body && ['POST', 'PUT', 'PATCH'].includes(history.method)) {
    if (typeof history.body === 'object') {
      cmd += ` \\\n  -d '${JSON.stringify(history.body)}'`;
    } else {
      cmd += ` \\\n  -d '${history.body}'`;
    }
  }

  return cmd;
};

const generateJavaScriptCode = (history: RequestHistory): string => {
  const bodyData = history.body ? 
    (typeof history.body === 'object' ? JSON.stringify(history.body, null, 2) : history.body) : 
    null;

  return `fetch("${history.url}", {
  method: "${history.method}",${history.headers ? `
  headers: ${JSON.stringify(history.headers, null, 2)},` : ''}${bodyData ? `
  body: ${typeof history.body === 'object' ? 'JSON.stringify(' + JSON.stringify(history.body, null, 2) + ')' : `"${bodyData}"`}` : ''}
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`;
};

const generatePythonCode = (history: RequestHistory): string => {
  let code = `import requests\n\n`;
  
  if (history.headers) {
    code += `headers = ${JSON.stringify(history.headers, null, 2).replace(/"/g, "'")}\n\n`;
  }
  
  if (history.body) {
    if (typeof history.body === 'object') {
      code += `data = ${JSON.stringify(history.body, null, 2).replace(/"/g, "'")}\n\n`;
    } else {
      code += `data = "${history.body}"\n\n`;
    }
  }

  code += `response = requests.${history.method.toLowerCase()}("${history.url}"`;
  
  if (history.headers) {
    code += `, headers=headers`;
  }
  
  if (history.body && ['POST', 'PUT', 'PATCH'].includes(history.method)) {
    code += typeof history.body === 'object' ? `, json=data` : `, data=data`;
  }
  
  code += `)\n\nprint(response.json())`;

  return code;
};

export default HistoryPanel;