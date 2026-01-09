import React, { memo } from 'react';
import { useTabsManager } from '../hooks/useTabsManager';
import { useCache } from '../hooks/useCache';

export const Tab = memo(({ id, label, children }) => {
  const { activeTabId } = useTabsManager();
  const { setInCache, getFromCache } = useCache();
  const isActive = activeTabId === id;

  React.useEffect(() => {
    if (!isActive) {
      setInCache(id, children);
    }
  }, [id, isActive, children, setInCache]);

  if (!isActive) {
    return null;
  }

  return (
    <div className="w-full h-full overflow-auto p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50">
      <div className="max-w-7xl mx-auto">
        {children || getFromCache(id)}
      </div>
    </div>
  );
});
