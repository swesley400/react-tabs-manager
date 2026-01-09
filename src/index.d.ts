import { ReactNode, ComponentType } from 'react';

// Tab interface
export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

// TabsProvider props
export interface TabsProviderProps {
  children: ReactNode;
  cacheLimit?: number;
}

export const TabsProvider: React.FC<TabsProviderProps>;

// TabsContainer props and styles
export interface TabsContainerStyles {
  container?: string;
  tabBar?: string;
  tab?: (isActive: boolean, isDragging?: boolean) => string;
  tabContent?: string;
  tabLabel?: string;
  closeButton?: string;
  closeIcon?: string;
  contentArea?: string;
  activeTabContent?: string;
  dropIndicator?: string;
}

export interface TabsContainerProps {
  children: ReactNode;
  styles?: TabsContainerStyles;
  closeIcon?: ComponentType;
}

export const TabsContainer: React.FC<TabsContainerProps>;

// Tab props
export interface TabProps {
  id: string;
  label: string;
  children: ReactNode;
}

export const Tab: React.FC<TabProps>;

// useTabsManager hook
export interface UseTabsManagerReturn {
  tabs: Tab[];
  activeTabId: string | null;
  openTab: (tab: Tab) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  moveTab: (fromIndex: number, toIndex: number) => void;
}

export function useTabsManager(): UseTabsManagerReturn;

// useCache hook
export interface UseCacheReturn {
  setInCache: (key: string, value: any) => void;
  getFromCache: (key: string) => any | null;
  clearCache: () => void;
  setCacheLimit: (limit: number) => void;
}

export function useCache(): UseCacheReturn;
