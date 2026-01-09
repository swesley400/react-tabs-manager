import React from 'react';
import { useTabsManager } from '../hooks/useTabsManager';

const defaultStyles = {
  container: "w-full h-full flex flex-col bg-gray-50",
  tabBar: "flex-none flex bg-white border-b border-gray-200 overflow-x-auto",
  tab: (isActive, isDragging) => `
    flex items-center min-w-[180px] max-w-[220px]
    px-4 py-3 border-r border-gray-200 cursor-move
    transition-all duration-200 relative
    ${isDragging ? 'opacity-50' : 'opacity-100'}
    ${isActive 
      ? 'bg-white text-gray-900 border-b-2 border-blue-500' 
      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
  `,
  tabContent: "flex-1 flex items-center overflow-hidden group px-2 gap-2",
  tabLabel: "truncate flex-1 text-sm font-medium",
  closeButton: `
    ml-auto p-1 rounded opacity-0 group-hover:opacity-100
    transition-all duration-200
    hover:bg-gray-200 hover:text-red-600
    cursor-pointer relative z-20 flex items-center justify-center
  `,
  closeIcon: "h-3.5 w-3.5 text-gray-400 hover:text-red-600 transition-colors",
  contentArea: "flex-1 bg-white overflow-hidden",
  activeTabContent: "h-full overflow-auto",
  dropIndicator: "absolute top-0 bottom-0 w-1 bg-blue-500 transition-all duration-200"
};

export const TabsContainer = ({ 
  children,
  styles = {},
  closeIcon: CloseIcon 
}) => {
  const { tabs, activeTabId, setActiveTab, closeTab, moveTab } = useTabsManager();
  const [draggedTab, setDraggedTab] = React.useState(null);
  const [dropIndicatorPosition, setDropIndicatorPosition] = React.useState(null);
  
  // Mescla os estilos padrão com os personalizados
  const mergedStyles = {
    container: `${defaultStyles.container} ${styles.container || ''}`,
    tabBar: `${defaultStyles.tabBar} ${styles.tabBar || ''}`,
    tab: (isActive, isDragging) => `${defaultStyles.tab(isActive, isDragging)} ${styles.tab?.(isActive) || ''}`,
    tabContent: `${defaultStyles.tabContent} ${styles.tabContent || ''}`,
    tabLabel: `${defaultStyles.tabLabel} ${styles.tabLabel || ''}`,
    closeButton: `${defaultStyles.closeButton} ${styles.closeButton || ''}`,
    closeIcon: `${defaultStyles.closeIcon} ${styles.closeIcon || ''}`,
    contentArea: `${defaultStyles.contentArea} ${styles.contentArea || ''}`,
    activeTabContent: `${defaultStyles.activeTabContent} ${styles.activeTabContent || ''}`,
    dropIndicator: `${defaultStyles.dropIndicator} ${styles.dropIndicator || ''}`
  };

  const handleDragStart = (e, index) => {
    setDraggedTab(index);
    e.dataTransfer.effectAllowed = 'move';
    // Hack para o Firefox
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedTab === null) return;

    const tabElement = e.currentTarget;
    const rect = tabElement.getBoundingClientRect();
    const midPoint = (rect.left + rect.right) / 2;
    const position = e.clientX < midPoint ? 'left' : 'right';
    
    setDropIndicatorPosition({
      index,
      position,
      left: position === 'left' ? rect.left : rect.right
    });
  };

  const handleDragEnd = () => {
    if (draggedTab !== null && dropIndicatorPosition !== null) {
      const toIndex = dropIndicatorPosition.position === 'left' 
        ? dropIndicatorPosition.index 
        : dropIndicatorPosition.index + 1;
      
      if (draggedTab !== toIndex && toIndex !== draggedTab + 1) {
        moveTab(draggedTab, toIndex > draggedTab ? toIndex - 1 : toIndex);
      }
    }
    setDraggedTab(null);
    setDropIndicatorPosition(null);
  };

  // Ícone padrão de fechar
  const DefaultCloseIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 20 20" 
      fill="currentColor"
      className={mergedStyles.closeIcon}
    >
      <path 
        fillRule="evenodd" 
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
        clipRule="evenodd" 
      />
    </svg>
  );

  // Encontra o conteúdo da aba ativa
  const activeTabContent = React.Children.toArray(children).find(
    child => child.props.id === activeTabId
  );

  return (
    <div className={mergedStyles.container}>
      <div className={mergedStyles.tabBar}>
        {dropIndicatorPosition && (
          <div 
            className={mergedStyles.dropIndicator}
            style={{ 
              left: `${dropIndicatorPosition.left}px`,
              transform: 'translateX(-50%)'
            }}
          />
        )}
        {tabs.map((tab, index) => {
          const isActive = activeTabId === tab.id;
          const isDragging = index === draggedTab;
          
          return (
            <div
              key={tab.id}
              className={mergedStyles.tab(isActive, isDragging)}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div 
                className={mergedStyles.tabContent}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon && (
                  <span className="mr-2 opacity-75">{tab.icon}</span>
                )}
                <span className={mergedStyles.tabLabel}>{tab.label}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onDragStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  draggable={false}
                  className={mergedStyles.closeButton}
                  title="Fechar aba"
                  aria-label="Fechar aba"
                >
                  {CloseIcon ? <CloseIcon /> : <DefaultCloseIcon />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className={mergedStyles.contentArea}>
        <div className={mergedStyles.activeTabContent}>
          {activeTabContent}
        </div>
      </div>
    </div>
  );
};
