import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { t } from '@/i18n/russian';
import {
  Plus,
  FolderOpen,
  Folder,
  FileText,
  Search,
  MoreHorizontal,
  Edit3,
  Trash2,
  Copy,
  Download,
  Upload,
  Settings,
  Users,
  Share2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Filter,
  SortAsc,
  Star,
  Clock
} from 'lucide-react';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { InputModal } from '@/components/ui/InputModal';
import toast from 'react-hot-toast';
import type { Collection, Request } from '@/types';

const CollectionManager = () => {
  const { 
    collections, 
    expandedCollections,
    selectedCollectionId,
    selectedRequestId,
    favorites,
    recentRequests,
    createCollection,
    updateCollection,
    deleteCollection,
    createRequest,
    updateRequest,
    deleteRequest,
    setSelectedCollection,
    setSelectedRequest,
    toggleCollectionExpanded,
    addToFavorites,
    removeFromFavorites
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);
  const [currentRequest, setCurrentRequest] = useState<Request | null>(null);
  const [filter, setFilter] = useState<'all' | 'favorites' | 'recent'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'modified'>('name');
  const [showHidden, setShowHidden] = useState(false);

  // Фильтрация и сортировка коллекций
  const filteredCollections = collections
    .filter(collection => {
      if (!showHidden && collection.isHidden) return false;
      if (searchQuery) {
        return collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               collection.requests?.some(req => 
                 req.name.toLowerCase().includes(searchQuery.toLowerCase())
               );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'modified':
          return new Date(b.updatedAt || b.createdAt).getTime() - 
                 new Date(a.updatedAt || a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const handleCreateCollection = async (name: string) => {
    try {
      await createCollection({
        name,
        description: '',
        isPublic: false,
        isHidden: false
      });
      toast.success('Коллекция создана');
      setShowCreateModal(false);
    } catch (error) {
      toast.error('Ошибка создания коллекции');
    }
  };

  const handleRenameCollection = async (name: string) => {
    if (!currentCollection) return;
    try {
      await updateCollection(currentCollection.id, { name });
      toast.success('Коллекция переименована');
      setShowRenameModal(false);
      setCurrentCollection(null);
    } catch (error) {
      toast.error('Ошибка переименования коллекции');
    }
  };

  const handleDeleteCollection = async (collection: Collection) => {
    if (window.confirm(`Удалить коллекцию "${collection.name}"? Это действие нельзя отменить.`)) {
      try {
        await deleteCollection(collection.id);
        toast.success('Коллекция удалена');
      } catch (error) {
        toast.error('Ошибка удаления коллекции');
      }
    }
  };

  const handleCreateRequest = async (name: string) => {
    if (!currentCollection) return;
    try {
      await createRequest({
        name,
        method: 'GET',
        url: '',
        collectionId: currentCollection.id
      });
      toast.success('Запрос создан');
      setShowNewRequestModal(false);
      setCurrentCollection(null);
    } catch (error) {
      toast.error('Ошибка создания запроса');
    }
  };

  const handleDuplicateCollection = async (collection: Collection) => {
    try {
      await createCollection({
        ...collection,
        name: `${collection.name} (копия)`,
        id: undefined
      });
      toast.success('Коллекция скопирована');
    } catch (error) {
      toast.error('Ошибка копирования коллекции');
    }
  };

  const handleToggleVisibility = async (collection: Collection) => {
    try {
      await updateCollection(collection.id, {
        isHidden: !collection.isHidden
      });
      toast.success(collection.isHidden ? 'Коллекция показана' : 'Коллекция скрыта');
    } catch (error) {
      toast.error('Ошибка изменения видимости');
    }
  };

  const handleExportCollection = (collection: Collection) => {
    const dataStr = JSON.stringify(collection, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${collection.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Коллекция экспортирована');
  };

  const handleImportCollection = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const collection = JSON.parse(e.target?.result as string);
            createCollection({
              ...collection,
              id: undefined,
              name: `${collection.name} (импорт)`
            });
            toast.success('Коллекция импортирована');
          } catch (error) {
            toast.error('Ошибка импорта коллекции');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Коллекции</h2>
          
          <div className="flex items-center space-x-2">
            <DropdownMenu
              trigger={
                <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              }
            >
              <div className="py-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                    filter === 'all' ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                  }`}
                >
                  Все коллекции
                </button>
                <button
                  onClick={() => setFilter('favorites')}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                    filter === 'favorites' ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                  }`}
                >
                  Избранные
                </button>
                <button
                  onClick={() => setFilter('recent')}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                    filter === 'recent' ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                  }`}
                >
                  Недавние
                </button>
              </div>
            </DropdownMenu>

            <DropdownMenu
              trigger={
                <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
                  <SortAsc className="w-4 h-4" />
                </button>
              }
            >
              <div className="py-1">
                <button
                  onClick={() => setSortBy('name')}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                    sortBy === 'name' ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                  }`}
                >
                  По имени
                </button>
                <button
                  onClick={() => setSortBy('created')}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                    sortBy === 'created' ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                  }`}
                >
                  По дате создания
                </button>
                <button
                  onClick={() => setSortBy('modified')}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                    sortBy === 'modified' ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                  }`}
                >
                  По дате изменения
                </button>
              </div>
            </DropdownMenu>

            <button
              onClick={() => setShowHidden(!showHidden)}
              className={`p-1.5 rounded transition-colors ${
                showHidden 
                  ? 'text-primary-600 bg-primary-100' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title={showHidden ? 'Скрыть скрытые' : 'Показать скрытые'}
            >
              {showHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>

            <DropdownMenu
              trigger={
                <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              }
            >
              <div className="py-1">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Создать коллекцию</span>
                </button>
                <button
                  onClick={handleImportCollection}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Импорт коллекции</span>
                </button>
              </div>
            </DropdownMenu>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск коллекций и запросов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Collection List */}
      <div className="flex-1 overflow-y-auto">
        {filteredCollections.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            {searchQuery ? (
              <p>По запросу "{searchQuery}" ничего не найдено</p>
            ) : (
              <>
                <p className="mb-2">У вас пока нет коллекций</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Создать первую коллекцию
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="py-2">
            {filteredCollections.map((collection) => (
              <CollectionItem
                key={collection.id}
                collection={collection}
                isExpanded={expandedCollections.includes(collection.id)}
                isSelected={selectedCollectionId === collection.id}
                onToggleExpanded={() => toggleCollectionExpanded(collection.id)}
                onSelect={() => setSelectedCollection(collection.id)}
                onRename={() => {
                  setCurrentCollection(collection);
                  setShowRenameModal(true);
                }}
                onDelete={() => handleDeleteCollection(collection)}
                onDuplicate={() => handleDuplicateCollection(collection)}
                onExport={() => handleExportCollection(collection)}
                onToggleVisibility={() => handleToggleVisibility(collection)}
                onCreateRequest={() => {
                  setCurrentCollection(collection);
                  setShowNewRequestModal(true);
                }}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <InputModal
          title="Создать коллекцию"
          placeholder="Название коллекции"
          onSubmit={handleCreateCollection}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showRenameModal && currentCollection && (
        <InputModal
          title="Переименовать коллекцию"
          placeholder="Название коллекции"
          defaultValue={currentCollection.name}
          onSubmit={handleRenameCollection}
          onClose={() => {
            setShowRenameModal(false);
            setCurrentCollection(null);
          }}
        />
      )}

      {showNewRequestModal && currentCollection && (
        <InputModal
          title="Создать запрос"
          placeholder="Название запроса"
          onSubmit={handleCreateRequest}
          onClose={() => {
            setShowNewRequestModal(false);
            setCurrentCollection(null);
          }}
        />
      )}
    </div>
  );
};

// Компонент элемента коллекции
interface CollectionItemProps {
  collection: Collection;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpanded: () => void;
  onSelect: () => void;
  onRename: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onExport: () => void;
  onToggleVisibility: () => void;
  onCreateRequest: () => void;
  searchQuery: string;
}

const CollectionItem = ({
  collection,
  isExpanded,
  isSelected,
  onToggleExpanded,
  onSelect,
  onRename,
  onDelete,
  onDuplicate,
  onExport,
  onToggleVisibility,
  onCreateRequest,
  searchQuery
}: CollectionItemProps) => {
  const { 
    selectedRequestId,
    favorites,
    setSelectedRequest,
    addToFavorites,
    removeFromFavorites,
    deleteRequest
  } = useAppStore();

  const handleRequestSelect = (requestId: string) => {
    setSelectedRequest(requestId);
    onSelect(); // Также выделить коллекцию
  };

  const handleToggleFavorite = (requestId: string) => {
    if (favorites.includes(requestId)) {
      removeFromFavorites(requestId);
    } else {
      addToFavorites(requestId);
    }
  };

  const handleDeleteRequest = (request: Request) => {
    if (window.confirm(`Удалить запрос "${request.name}"? Это действие нельзя отменить.`)) {
      deleteRequest(request.id);
      toast.success('Запрос удален');
    }
  };

  // Фильтрация запросов по поисковому запросу
  const filteredRequests = collection.requests?.filter(request => 
    !searchQuery || request.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="mb-1">
      {/* Collection Header */}
      <div 
        className={`group flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer ${
          isSelected ? 'bg-primary-50 border-r-2 border-primary-500' : ''
        } ${collection.isHidden ? 'opacity-60' : ''}`}
        onClick={onSelect}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpanded();
          }}
          className="mr-2 p-0.5 hover:bg-gray-200 rounded"
        >
          {collection.requests?.length ? (
            isExpanded ? 
              <ChevronDown className="w-4 h-4 text-gray-500" /> : 
              <ChevronRight className="w-4 h-4 text-gray-500" />
          ) : (
            <div className="w-4 h-4" />
          )}
        </button>

        <div className="flex-1 flex items-center min-w-0">
          <Folder className={`w-4 h-4 mr-2 flex-shrink-0 ${
            collection.isPublic ? 'text-blue-500' : 'text-gray-500'
          }`} />
          <span className="text-sm font-medium text-gray-900 truncate">
            {collection.name}
          </span>
          
          {collection.isHidden && (
            <EyeOff className="w-3 h-3 ml-1 text-gray-400 flex-shrink-0" />
          )}
          
          {collection.requests?.length > 0 && (
            <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
              {collection.requests.length}
            </span>
          )}
        </div>

        <DropdownMenu
          trigger={
            <button 
              onClick={(e) => e.stopPropagation()}
              className="ml-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          }
        >
          <div className="py-1">
            <button
              onClick={onCreateRequest}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить запрос</span>
            </button>
            <button
              onClick={onRename}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Переименовать</span>
            </button>
            <button
              onClick={onDuplicate}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>Дублировать</span>
            </button>
            <button
              onClick={onExport}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Экспорт</span>
            </button>
            <button
              onClick={onToggleVisibility}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              {collection.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>{collection.isHidden ? 'Показать' : 'Скрыть'}</span>
            </button>
            <div className="border-t border-gray-100 my-1" />
            <button
              onClick={onDelete}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Удалить</span>
            </button>
          </div>
        </DropdownMenu>
      </div>

      {/* Requests */}
      {isExpanded && filteredRequests.length > 0 && (
        <div className="ml-6">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className={`group flex items-center px-3 py-1.5 hover:bg-gray-50 cursor-pointer ${
                selectedRequestId === request.id ? 'bg-primary-50 border-r-2 border-primary-500' : ''
              }`}
              onClick={() => handleRequestSelect(request.id)}
            >
              <div className="flex-1 flex items-center min-w-0">
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded mr-2 flex-shrink-0 ${
                  request.method === 'GET' ? 'bg-green-100 text-green-700' :
                  request.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                  request.method === 'PUT' ? 'bg-orange-100 text-orange-700' :
                  request.method === 'DELETE' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {request.method}
                </span>
                
                <span className="text-sm text-gray-900 truncate">
                  {request.name}
                </span>
              </div>

              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(request.id);
                  }}
                  className={`p-1 hover:bg-gray-200 rounded ${
                    favorites.includes(request.id) ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                  title={favorites.includes(request.id) ? 'Убрать из избранного' : 'Добавить в избранное'}
                >
                  <Star className={`w-3 h-3 ${
                    favorites.includes(request.id) ? 'fill-current' : ''
                  }`} />
                </button>

                <DropdownMenu
                  trigger={
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <MoreHorizontal className="w-3 h-3 text-gray-400" />
                    </button>
                  }
                >
                  <div className="py-1">
                    <button
                      onClick={() => {/* TODO: Duplicate request */}}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Дублировать</span>
                    </button>
                    <button
                      onClick={() => handleDeleteRequest(request)}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Удалить</span>
                    </button>
                  </div>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionManager;