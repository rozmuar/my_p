import Sidebar from '@/components/Sidebar';
import RequestPanel from '@/components/RequestPanel';
import ResponsePanel from '@/components/ResponsePanel';
import Header from '@/components/Header';
import { useAppStore } from '@/store';
import { t } from '@/i18n/russian';
import { PanelLeftIcon, PanelLeftOpenIcon } from 'lucide-react';

const HomePage = () => {
  const { sidebarCollapsed, activeRequestId } = useAppStore();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div 
          className={`transition-all duration-300 ease-in-out bg-white border-r border-gray-200 ${
            sidebarCollapsed ? 'w-12' : 'w-80'
          } overflow-hidden flex-shrink-0`}
        >
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {activeRequestId ? (
            <WorkspaceView />
          ) : (
            <WelcomeView />
          )}
        </div>
      </div>
    </div>
  );
};

const WorkspaceView = () => {
  return (
    <>
      {/* Request Panel */}
      <div className="flex-1 border-r border-gray-200 bg-white">
        <RequestPanel />
      </div>
      
      {/* Response Panel */}
      <div className="w-1/2 bg-white">
        <ResponsePanel />
      </div>
    </>
  );
};

const WelcomeView = () => {
  const { addCollection } = useAppStore();

  const handleCreateCollection = () => {
    addCollection({
      name: t.newCollection,
      description: 'Новая коллекция для API запросов',
      requests: [],
      folders: [],
      variables: [],
      isShared: false,
      collaborators: [],
    });
  };

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
            onClick={handleCreateCollection}
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