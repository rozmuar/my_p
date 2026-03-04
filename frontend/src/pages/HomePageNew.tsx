import { useState } from 'react';
import { useAppStore } from '@/store';
import { t } from '@/i18n/russian';
import { Plus, Play, History, Code, Split, Columns, PanelLeftOpen, PanelRightOpen, Settings } from 'lucide-react';
import Header from '@/components/Header';
import RequestPanelNew from '@/components/RequestPanelNew';
import ResponsePanelNew from '@/components/ResponsePanelNew';
import CollectionManagerNew from '@/components/CollectionManagerNew';
import HistoryPanelNew from '@/components/HistoryPanelNew';
import CodeGeneratorNew from '@/components/CodeGeneratorNew';

const HomePage = () => {
  const { 
    collections, 
    selectedCollectionId, 
    selectedRequestId,
    activeRequest,
    createRequest,
    sidebarCollapsed,
    setSidebarCollapsed,
    addCollection
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'response' | 'code' | 'history'>('response');
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal'); 
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [leftPanelContent, setLeftPanelContent] = useState<'collections' | 'history'>('collections');

  const selectedCollection = collections.find(c => c.id === selectedCollectionId);
  const selectedRequest = selectedCollection?.requests?.find(r => r.id === selectedRequestId);

  const handleCreateNewRequest = async () => {
    if (selectedCollectionId) {
      await createRequest({
        name: 'Новый запрос',
        method: 'GET',
        url: '',
        collectionId: selectedCollectionId
      });
    }
  };

  const getCurrentRequest = () => {
    if (activeRequest) return activeRequest;
    if (selectedRequest) return selectedRequest;
    return null;
  };

  const currentRequest = getCurrentRequest();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        {!sidebarCollapsed && (
          <div className="w-80 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
            {/* Panel Header */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setLeftPanelContent('collections')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  leftPanelContent === 'collections'
                    ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-500'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Коллекции
              </button>
              <button
                onClick={() => setLeftPanelContent('history')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  leftPanelContent === 'history'
                    ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-500'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                История
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-hidden">
              {leftPanelContent === 'collections' && <CollectionManagerNew />}
              {leftPanelContent === 'history' && <HistoryPanelNew />}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                title={sidebarCollapsed ? 'Показать боковую панель' : 'Скрыть боковую панель'}
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-gray-300" />

              <button
                onClick={() => setLayout(layout === 'horizontal' ? 'vertical' : 'horizontal')}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                title={layout === 'horizontal' ? 'Вертикальная раскладка' : 'Горизонтальная раскладка'}
              >
                {layout === 'horizontal' ? <Split className="w-4 h-4" /> : <Columns className="w-4 h-4" />}
              </button>
            </div>

            <div className="text-sm text-gray-600">
              {currentRequest && (
                <span>{currentRequest.method} {currentRequest.name || 'Без названия'}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setRightPanelOpen(!rightPanelOpen)}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                title={rightPanelOpen ? 'Скрыть правую панель' : 'Показать правую панель'}
              >
                <PanelRightOpen className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content Panels */}
          {currentRequest || selectedRequestId ? (
            <WorkspaceView 
              layout={layout} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              currentRequest={currentRequest}
            />
          ) : (
            <WelcomeView onCreateCollection={() => {
              addCollection({
                name: t.newCollection,
                description: 'Новая коллекция для API запросов',
                requests: [],
                folders: [],
                variables: [],
                isShared: false,
                collaborators: [],
              });
            }} />
          )}
        </div>

        {/* Right Sidebar - Environment Variables, Documentation, etc. */}
        {rightPanelOpen && (
          <div className="w-80 bg-white border-l border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Переменные окружения</h3>
            </div>
            <div className="p-4 h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Переменные окружения</p>
                <p className="text-sm">Функция будет добавлена в следующих версиях</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface WorkspaceViewProps {
  layout: 'horizontal' | 'vertical';
  activeTab: 'response' | 'code' | 'history';
  setActiveTab: (tab: 'response' | 'code' | 'history') => void;
  currentRequest: any;
}

const WorkspaceView = ({ layout, activeTab, setActiveTab, currentRequest }: WorkspaceViewProps) => {
  return (
    <div className={`flex-1 flex ${layout === 'horizontal' ? 'flex-col' : 'flex-row'} overflow-hidden`}>
      {/* Request Panel */}
      <div className={`bg-white ${
        layout === 'horizontal' ? 'h-1/2 border-b' : 'w-1/2 border-r'
      } border-gray-200`}>
        <RequestPanelNew />
      </div>

      {/* Bottom/Right Panel with Tabs */}
      <div className={`flex flex-col ${layout === 'horizontal' ? 'h-1/2' : 'w-1/2'}`}>
        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white">
          {[
            { key: 'response' as const, label: t.response, icon: Play },
            { key: 'code' as const, label: 'Код', icon: Code },
            { key: 'history' as const, label: 'История', icon: History }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === key
                  ? 'border-primary-500 text-primary-600 bg-primary-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'response' && <ResponsePanelNew />}
          {activeTab === 'code' && currentRequest && (
            <CodeGeneratorNew
              method={currentRequest.method}
              url={currentRequest.url}
              headers={currentRequest.headers || {}}
              body={currentRequest.body}
              auth={currentRequest.auth}
            />
          )}
          {activeTab === 'code' && !currentRequest && (
            <div className="p-4 h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Code className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Генерация кода</p>
                <p className="text-sm">Выберите запрос для генерации кода</p>
              </div>
            </div>
          )}
          {activeTab === 'history' && <HistoryPanelNew />}
        </div>
      </div>
    </div>
  );
};

interface WelcomeViewProps {
  onCreateCollection: () => void;
}

const WelcomeView = ({ onCreateCollection }: WelcomeViewProps) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-primary-50 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Добро пожаловать в PostAPI</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Современный инструмент для тестирования API. 
            Создавайте коллекции, тестируйте endpoints и работайте в команде.
          </p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={onCreateCollection}
            className="btn-primary w-full py-3 text-lg"
          >
            {t.createCollection}
          </button>
          
          <div className="text-sm text-gray-500">
            Или начните с создания нового запроса в боковой панели
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 text-left">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">⚡ Быстро & Современно</h3>
            <p className="text-sm text-gray-600">
              Создан на React и TypeScript для плавной и отзывчивой работы.
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">🔄 Совместная работа</h3>
            <p className="text-sm text-gray-600">
              Делитесь коллекциями и работайте с командой в реальном времени.
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">⚙️ Генерация кода</h3>
            <p className="text-sm text-gray-600">
              Генерируйте фрагменты кода на разных языках для ваших запросов.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;