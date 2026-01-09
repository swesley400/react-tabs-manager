import { create } from 'zustand';

const useTabsStore = create((set) => ({
  tabs: [],
  activeTabId: null,
  addTab: (tab) => set((state) => {
    const activeIndex = state.tabs.findIndex(t => t.id === state.activeTabId);
    const newTabs = [...state.tabs];
    const insertIndex = activeIndex !== -1 ? activeIndex + 1 : state.tabs.length;
    newTabs.splice(insertIndex, 0, tab);
    return { tabs: newTabs, activeTabId: tab.id };
  }),
  removeTab: (tabId) => set((state) => {
    const index = state.tabs.findIndex(tab => tab.id === tabId);
    if (index === -1) return state;

    const newTabs = state.tabs.filter(tab => tab.id !== tabId);
    let newActiveId = state.activeTabId;

    if (tabId === state.activeTabId) {
      newActiveId = newTabs[index]?.id || newTabs[index - 1]?.id || null;
    }

    return { tabs: newTabs, activeTabId: newActiveId };
  }),
  setActiveTab: (tabId) => set({ activeTabId: tabId }),
  moveTab: (fromIndex, toIndex) => set((state) => {
    const newTabs = [...state.tabs];
    const [movedTab] = newTabs.splice(fromIndex, 1);
    newTabs.splice(toIndex, 0, movedTab);
    return { tabs: newTabs };
  }),
}));

export const useTabsManager = () => {
  const store = useTabsStore();

  return {
    tabs: store.tabs,
    activeTabId: store.activeTabId,
    openTab: store.addTab,
    closeTab: store.removeTab,
    setActiveTab: store.setActiveTab,
    moveTab: store.moveTab,
  };
};
