import React from 'react';
import { useTabsManager } from '../hooks/useTabsManager';

const defaultStyles = {
  container: "w-full h-full flex flex-col",
  tabBar: "flex-none flex bg-gray-800 border-b border-gray-700 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800",
  tab: (isActive, isDragging) => `
    flex items-center min-w-[200px] max-w-[200px]
    px-4 py-3 border-r border-gray-700 cursor-move
    transition-all duration-200 relative
    ${isDragging ? 'opacity-50' : ''}
    ${isActive 
      ? 'bg-gray-700 text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500' 
      : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
  `,
  tabContent: "flex-1 flex items-center overflow-hidden group px-2",
  tabLabel: "truncate flex-1 text-sm font-medium",
  closeButton: `
    ml-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100
    transition-opacity duration-200
    hover:bg-gray-600 cursor-pointer
  `,
  closeIcon: "h-4 w-4 text-gray-400 hover:text-red-400",
  contentArea: "flex-1 bg-gray-900",
  activeTabContent: "h-full",
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
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className={mergedStyles.closeButton}
                  title="Fechar aba"
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
