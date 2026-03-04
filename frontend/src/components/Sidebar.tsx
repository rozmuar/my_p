import { useState } from 'react';
import { useAppStore } from '@/store';
import { 
  Plus, 
  Folder, 
  FolderOpen, 
  Search, 
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  FileText,
  Copy,
  Trash2,
  Edit3,
  Share,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { getMethodColor } from '@/utils';
import { t } from '@/i18n/russian';
import InputModal from './InputModal';
import type { Collection, HttpRequest } from '@/types';

const Sidebar = () => {
  const { 
    collections, 
    activeRequestId, 
    activeCollectionId,
    sidebarCollapsed,
    addCollection, 
    addRequest,
    setActiveRequest,
    setActiveCollection,
    toggleSidebar
  } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set());
  const [showCreateCollectionModal, setShowCreateCollectionModal] = useState(false);
  const [showCreateRequestModal, setShowCreateRequestModal] = useState(false);
  const [pendingRequestCollectionId, setPendingRequestCollectionId] = useState<string | null>(null);

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.requests.some(request => 
      request.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleCollection = (collectionId: string) => {
    const newExpanded = new Set(expandedCollections);
    if (newExpanded.has(collectionId)) {
      newExpanded.delete(collectionId);
    } else {
      newExpanded.add(collectionId);
    }
    setExpandedCollections(newExpanded);
  };

  const handleCreateCollection = (name: string) => {
    addCollection({
      name,
      description: '',
      requests: [],
      folders: [],
      variables: [],
      isShared: false,
      collaborators: [],
    });
  };

  const handleCreateRequest = (collectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingRequestCollectionId(collectionId);
    setShowCreateRequestModal(true);
  };

  const handleCreateRequestConfirm = (name: string) => {
    if (pendingRequestCollectionId) {
      addRequest(pendingRequestCollectionId, {
        name,
        method: 'GET',
        url: 'https://api.example.com',
        headers: { 'Content-Type': 'application/json' },
        body: '',
        params: {},
        description: '',
      });
      setPendingRequestCollectionId(null);
    }
  };

  if (sidebarCollapsed) {
    return (
      <div className="w-12 h-full flex flex-col items-center py-4 border-r border-gray-200">
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          title={t.collections}
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <button
                onClick={toggleSidebar}
                className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors duration-200 flex-shrink-0"
                title="Свернуть"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900 truncate">{t.collections}</h2>
            </div>
            <button
              onClick={() => setShowCreateCollectionModal(true)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
              title={t.createCollection}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t.searchCollections}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Collections List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredCollections.length === 0 ? (
            <div className="text-center py-8">
              <Folder className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-4">
                {searchTerm ? t.noCollectionsFound : t.noCollections}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowCreateCollectionModal(true)}
                  className="btn-primary text-sm"
                >
                  {t.createCollection}
                </button>
              )}
            </div>
          ) : (
            filteredCollections.map((collection) => (
              <CollectionItem
                key={collection.id}
                collection={collection}
                isExpanded={expandedCollections.has(collection.id)}
                onToggle={() => toggleCollection(collection.id)}
                onCreateRequest={handleCreateRequest}
                activeRequestId={activeRequestId}
                activeCollectionId={activeCollectionId}
                onSelectRequest={setActiveRequest}
                onSelectCollection={setActiveCollection}
              />
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <InputModal
        isOpen={showCreateCollectionModal}
        onClose={() => setShowCreateCollectionModal(false)}
        onConfirm={handleCreateCollection}
        title={t.createCollection}
        placeholder={t.enterName}
      />

      <InputModal
        isOpen={showCreateRequestModal}
        onClose={() => {
          setShowCreateRequestModal(false);
          setPendingRequestCollectionId(null);
        }}
        onConfirm={handleCreateRequestConfirm}
        title={t.newRequest}
        placeholder={t.enterName}
      />
    </>
  );
};

interface CollectionItemProps {
  collection: Collection;
  isExpanded: boolean;
  onToggle: () => void;
  onCreateRequest: (collectionId: string, e: React.MouseEvent) => void;
  activeRequestId: string | null;
  activeCollectionId: string | null;
  onSelectRequest: (requestId: string) => void;
  onSelectCollection: (collectionId: string) => void;
}

const CollectionItem = ({
  collection,
  isExpanded,
  onToggle,
  onCreateRequest,
  activeRequestId,
  activeCollectionId,
  onSelectRequest,
  onSelectCollection,
}: CollectionItemProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleCollectionClick = () => {
    onSelectCollection(collection.id);
    onToggle();
  };

  const handleRequestClick = (request: HttpRequest, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectRequest(request.id);
  };

  return (
    <div className="space-y-1">
      {/* Collection Header */}
      <div
        className={`group flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
          activeCollectionId === collection.id ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
        }`}
        onClick={handleCollectionClick}
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <div className="flex items-center">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-gray-600 ml-1" />
            ) : (
              <Folder className="w-4 h-4 text-gray-600 ml-1" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{collection.name}</div>
            <div className="text-xs text-gray-500">
              {collection.requests.length} {t.requests}
              {collection.isShared && (
                <span className="ml-2 text-primary-600">{t.shared}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => onCreateRequest(collection.id, e)}
            className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-all duration-150"
            title={t.addRequest}
          >
            <Plus className="w-4 h-4" />
          </button>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-all duration-150"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-medium border border-gray-200 py-2 z-50">
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors duration-150 text-gray-700 flex items-center space-x-2">
                  <Edit3 className="w-4 h-4" />
                  <span>{t.rename}</span>
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors duration-150 text-gray-700 flex items-center space-x-2">
                  <Copy className="w-4 h-4" />
                  <span>{t.duplicate}</span>
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors duration-150 text-gray-700 flex items-center space-x-2">
                  <Share className="w-4 h-4" />
                  <span>{t.share}</span>
                </button>
                <hr className="my-2" />
                <button className="w-full text-left px-3 py-2 hover:bg-red-50 transition-colors duration-150 text-red-600 flex items-center space-x-2">
                  <Trash2 className="w-4 h-4" />
                  <span>{t.delete}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Requests List */}
      {isExpanded && (
        <div className="ml-6 space-y-1">
          {collection.requests.length === 0 ? (
            <div className="py-3 px-3 text-sm text-gray-500 italic">
              {t.noRequests}
            </div>
          ) : (
            collection.requests.map((request) => (
              <div
                key={request.id}
                className={`group flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                  activeRequestId === request.id ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                }`}
                onClick={(e) => handleRequestClick(request, e)}
              >
                <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{request.name}</div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getMethodColor(request.method)}`}>
                      {request.method}
                    </span>
                    <span className="text-gray-500 truncate">{request.url}</span>
                  </div>
                </div>

                <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-all duration-150">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;