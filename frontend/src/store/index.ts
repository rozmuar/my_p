import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { HttpRequest, Collection, Environment, HttpResponse, RequestHistory } from '@/types';

interface AppState {
  // Collections
  collections: Collection[];
  activeCollectionId: string | null;
  selectedCollectionId: string | null;
  expandedCollections: string[];
  
  // Requests
  activeRequestId: string | null;
  selectedRequestId: string | null;
  activeRequest: HttpRequest | null;
  requestHistory: RequestHistory[];
  favorites: string[];
  recentRequests: string[];
  
  // Environments  
  environments: Environment[];
  activeEnvironmentId: string | null;
  
  // UI State
  selectedTab: 'request' | 'response' | 'history';
  sidebarCollapsed: boolean;
  
  // Actions
  addCollection: (collection: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>) => void;
  createCollection: (collection: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCollection: (id: string, updates: Partial<Collection>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  setActiveCollection: (id: string | null) => void;
  setSelectedCollection: (id: string | null) => void;
  toggleCollectionExpanded: (id: string) => void;
  
  addRequest: (collectionId: string, request: Omit<HttpRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  createRequest: (request: Omit<HttpRequest, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRequest: (id: string, updates: Partial<HttpRequest>) => Promise<void>;
  deleteRequest: (id: string) => void;
  setActiveRequest: (id: string | null) => void;
  setSelectedRequest: (id: string | null) => void;
  executeRequest: (request: HttpRequest) => Promise<void>;
  
  addToHistory: (requestId: string, response?: HttpResponse, error?: string) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
  
  // Favorites
  addToFavorites: (requestId: string) => void;
  removeFromFavorites: (requestId: string) => void;
  
  addEnvironment: (environment: Omit<Environment, 'id'>) => void;
  updateEnvironment: (id: string, updates: Partial<Environment>) => void;
  deleteEnvironment: (id: string) => void;
  setActiveEnvironment: (id: string | null) => void;
  
  setSelectedTab: (tab: 'request' | 'response' | 'history') => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        collections: [],
        activeCollectionId: null,
        selectedCollectionId: null,
        expandedCollections: [],
        activeRequestId: null,
        selectedRequestId: null,
        activeRequest: null,
        requestHistory: [],
        favorites: [],
        recentRequests: [],
        environments: [
          {
            id: 'local',
            name: 'Local',
            variables: { baseUrl: 'http://localhost:3001' },
            isActive: true,
          },
        ],
        activeEnvironmentId: 'local',
        selectedTab: 'request',
        sidebarCollapsed: false,

        // Collection actions
        addCollection: (collection) =>
          set((state) => {
            const newCollection: Collection = {
              ...collection,
              id: uuidv4(),
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            return {
              collections: [...state.collections, newCollection],
              activeCollectionId: newCollection.id,
              selectedCollectionId: newCollection.id,
            };
          }),

        createCollection: async (collection) => {
          // For MVP, just add to local state
          get().addCollection(collection);
        },

        updateCollection: async (id, updates) => {
          set((state) => ({
            collections: state.collections.map((col) =>
              col.id === id ? { ...col, ...updates, updatedAt: new Date() } : col
            ),
          }));
        },

        deleteCollection: async (id) => {
          set((state) => ({
            collections: state.collections.filter((col) => col.id !== id),
            activeCollectionId: state.activeCollectionId === id ? null : state.activeCollectionId,
            selectedCollectionId: state.selectedCollectionId === id ? null : state.selectedCollectionId,
          }));
        },

        setActiveCollection: (id) => set({ activeCollectionId: id }),
        setSelectedCollection: (id) => set({ selectedCollectionId: id }),
        
        toggleCollectionExpanded: (id) =>
          set((state) => ({
            expandedCollections: state.expandedCollections.includes(id)
              ? state.expandedCollections.filter(cId => cId !== id)
              : [...state.expandedCollections, id]
          })),

        // Request actions
        addRequest: (collectionId, request) =>
          set((state) => {
            const newRequest: HttpRequest = {
              ...request,
              id: uuidv4(),
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            return {
              collections: state.collections.map((col) =>
                col.id === collectionId
                  ? { ...col, requests: [...col.requests, newRequest] }
                  : col
              ),
              activeRequestId: newRequest.id,
              selectedRequestId: newRequest.id,
            };
          }),

        createRequest: async (request) => {
          // For MVP, just add to local state
          const collectionId = request.collectionId || get().selectedCollectionId;
          if (collectionId) {
            get().addRequest(collectionId, request);
          }
        },

        updateRequest: async (id, updates) => {
          set((state) => ({
            collections: state.collections.map((col) => ({
              ...col,
              requests: col.requests.map((req) =>
                req.id === id ? { ...req, ...updates, updatedAt: new Date() } : req
              ),
            })),
          }));
        },

        deleteRequest: (id) =>
          set((state) => ({
            collections: state.collections.map((col) => ({
              ...col,
              requests: col.requests.filter((req) => req.id !== id),
            })),
            activeRequestId: state.activeRequestId === id ? null : state.activeRequestId,
            selectedRequestId: state.selectedRequestId === id ? null : state.selectedRequestId,
            favorites: state.favorites.filter(fId => fId !== id),
            recentRequests: state.recentRequests.filter(rId => rId !== id),
          })),

        setActiveRequest: (id) => set({ activeRequestId: id }),
        setSelectedRequest: (id) => 
          set((state) => {
            // Update recent requests
            const newRecent = id ? [id, ...state.recentRequests.filter(rId => rId !== id)].slice(0, 10) : state.recentRequests;
            return { 
              selectedRequestId: id,
              recentRequests: newRecent
            };
          }),

        executeRequest: async (request) => {
          // For MVP, simulate request execution
          const requestId = request.id || uuidv4();
          
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const response: HttpResponse = {
              status: 200,
              statusText: 'OK',
              headers: { 'content-type': 'application/json' },
              data: { message: 'Симуляция успешного ответа', timestamp: new Date().toISOString() },
              time: Math.floor(Math.random() * 500) + 100,
              size: 256
            };

            get().addToHistory(requestId, response);
          } catch (error) {
            get().addToHistory(requestId, undefined, (error as Error).message);
          }
        },

        // History actions
        addToHistory: (requestId, response, error) =>
          set((state) => {
            const request = state.collections
              .flatMap(col => col.requests)
              .find(req => req.id === requestId);

            const historyEntry: RequestHistory = {
              id: uuidv4(),
              requestId,
              method: request?.method || 'GET',
              url: request?.url || '',
              name: request?.name,
              headers: request?.headers,
              body: request?.body,
              auth: request?.auth,
              timestamp: new Date(),
              response,
              error,
              collectionName: state.collections.find(col => 
                col.requests.some(req => req.id === requestId)
              )?.name
            };
            return {
              requestHistory: [historyEntry, ...state.requestHistory.slice(0, 99)], // Keep last 100 entries
            };
          }),

        clearHistory: () => set({ requestHistory: [] }),
        removeFromHistory: (id) => 
          set((state) => ({ 
            requestHistory: state.requestHistory.filter(h => h.id !== id) 
          })),

        // Favorites
        addToFavorites: (requestId) =>
          set((state) => ({
            favorites: [...new Set([...state.favorites, requestId])]
          })),

        removeFromFavorites: (requestId) =>
          set((state) => ({
            favorites: state.favorites.filter(id => id !== requestId)
          })),

        // Environment actions
        addEnvironment: (environment) =>
          set((state) => {
            const newEnv: Environment = { ...environment, id: uuidv4() };
            return { environments: [...state.environments, newEnv] };
          }),

        updateEnvironment: (id, updates) =>
          set((state) => ({
            environments: state.environments.map((env) =>
              env.id === id ? { ...env, ...updates } : env
            ),
          })),

        deleteEnvironment: (id) =>
          set((state) => ({
            environments: state.environments.filter((env) => env.id !== id),
            activeEnvironmentId: state.activeEnvironmentId === id ? null : state.activeEnvironmentId,
          })),

        setActiveEnvironment: (id) => set({ activeEnvironmentId: id }),

        // UI actions
        setSelectedTab: (tab) => set({ selectedTab: tab }),
        toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
        setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      }),
      {
        name: 'postapi-storage',
        partialize: (state) => ({
          collections: state.collections,
          environments: state.environments,
          activeEnvironmentId: state.activeEnvironmentId,
          sidebarCollapsed: state.sidebarCollapsed,
          favorites: state.favorites,
          selectedCollectionId: state.selectedCollectionId,
          expandedCollections: state.expandedCollections,
        }),
      }
    ),
    { name: 'PostAPI Store' }
  )
);