# React Tabs Manager

A React library for managing multiple states (tabs/sections) with caching and prioritization.

**Perfect for web applications, Electron apps, IDEs, dashboards, and any multi-window interface!**

## ✨ Features

- Global state management for tabs
- Automatic content caching for inactive tabs
- Simple and intuitive interface
- Styling with Tailwind CSS
- Conditional rendering support
- Configurable cache limit
- Full TypeScript support with type declarations included
- Drag & Drop to reorder tabs
- Works perfectly in web browsers and Electron apps

## ⚠️ Requirements

**IMPORTANT:** This library requires **Tailwind CSS** installed and configured in your project to work correctly.

## 📦 Installation

### 1. Install the library

```bash
npm install react-tabs-manager
```

### 2. Install and configure Tailwind CSS (if you don't have it)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Configure Tailwind

Add the library's file paths to your `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tabs-manager/**/*.{js,jsx}" // Add this line
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 4. Import Tailwind in your CSS

In your main CSS file (e.g., `src/index.css`), add:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 🚀 Basic Usage

```jsx
import { TabsProvider, TabsContainer, Tab, useTabsManager } from 'react-tabs-manager';
import { useEffect, useRef } from 'react';

function TabsDemo() {
  const { openTab, tabs } = useTabsManager();
  const initialized = useRef(false);

  useEffect(() => {
    // Register initial tabs only once (important to use useRef!)
    if (!initialized.current && tabs.length === 0) {
      initialized.current = true;
      openTab({ id: 'home', label: 'Home' });
      openTab({ id: 'about', label: 'About' });
    }
  }, [tabs.length, openTab]);

  return (
    <TabsContainer>
      <Tab id="home" label="Home">
        <div>Home Content</div>
      </Tab>
      <Tab id="about" label="About">
        <div>About Content</div>
      </Tab>
    </TabsContainer>
  );
}

function App() {
  return (
    <TabsProvider cacheLimit={5}>
      <TabsDemo />
    </TabsProvider>
  );
}
```

> **⚠️ Important:** Use `useRef` to ensure initial tabs are created only once, especially in React StrictMode which runs effects twice in development.

## 🎣 Available Hooks

### useTabsManager

```jsx
const { 
  tabs,           // List of tabs
  activeTabId,    // Active tab ID
  openTab,        // Function to open new tab
  closeTab,       // Function to close tab
  setActiveTab    // Function to activate tab
} = useTabsManager();
```

### useCache

```jsx
const {
  setInCache,     // Store data in cache
  getFromCache,   // Retrieve data from cache
  clearCache,     // Clear all cache
  setCacheLimit   // Set cache limit
} = useCache();
```

## 📚 Use Cases and Complete Examples

### 🎯 Use Case 1: Multi-Window System (IDE-like)

Perfect for creating editors, dashboards, or systems with multiple open views.

```jsx
import { TabsProvider, TabsContainer, Tab, useTabsManager } from 'react-tabs-manager';
import { useEffect, useState, useRef } from 'react';

// Custom theme for IDE
const ideTheme = {
  container: "w-full h-full flex flex-col bg-slate-900",
  tabBar: "flex bg-slate-800 border-b border-slate-700",
  tab: (isActive) => `
    px-4 py-2 border-r border-slate-700 cursor-move transition-all
    ${isActive 
      ? 'bg-slate-900 text-white border-b-2 border-blue-500' 
      : 'text-slate-400 hover:bg-slate-750'}
  `,
  tabContent: "flex items-center gap-2 group",
  tabLabel: "text-sm font-medium",
  closeButton: "ml-auto p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 cursor-pointer z-20",
  closeIcon: "h-3.5 w-3.5 text-slate-400 hover:text-red-400",
  contentArea: "flex-1 bg-slate-900",
  activeTabContent: "h-full p-6"
};

function Editor() {
  const { openTab, closeTab, tabs } = useTabsManager();
  const [files, setFiles] = useState([]);
  const initialized = useRef(false);

  useEffect(() => {
    // Open initial files
    if (!initialized.current && tabs.length === 0) {
      initialized.current = true;
      openTab({ id: 'welcome', label: '📄 Welcome.md', icon: '📄' });
    }
  }, [tabs.length, openTab]);

  const handleOpenFile = (fileName) => {
    const fileId = `file-${fileName}`;
    // Check if already open
    if (!tabs.find(t => t.id === fileId)) {
      openTab({ 
        id: fileId, 
        label: `📝 ${fileName}`,
        icon: '📝'
      });
      setFiles(prev => [...prev, { id: fileId, name: fileName, content: '' }]);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-900">
      {/* Toolbar */}
      <div className="bg-slate-800 p-3 flex gap-2 border-b border-slate-700">
        <button 
          onClick={() => handleOpenFile(`file-${Date.now()}.js`)}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
        >
          + New File
        </button>
        <span className="text-slate-400 text-sm py-1 px-2">
          {tabs.length} file(s) open
        </span>
      </div>

      {/* Editor with tabs */}
      <div className="flex-1 overflow-hidden">
        <TabsContainer styles={ideTheme}>
          <Tab id="welcome" label="Welcome">
            <div className="text-slate-300">
              <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
              <p>Use the button above to create new files.</p>
            </div>
          </Tab>
          
          {files.map(file => (
            <Tab key={file.id} id={file.id} label={file.name}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl text-slate-200">{file.name}</h2>
                  <button
                    onClick={() => {
                      closeTab(file.id);
                      setFiles(prev => prev.filter(f => f.id !== file.id));
                    }}
                    className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                  >
                    Close File
                  </button>
                </div>
                <textarea
                  className="w-full h-96 bg-slate-800 text-slate-200 p-4 rounded font-mono"
                  placeholder="Write your code here..."
                  defaultValue={file.content}
                />
              </div>
            </Tab>
          ))}
        </TabsContainer>
      </div>
    </div>
  );
}

function App() {
  return (
    <TabsProvider cacheLimit={10}>
      <Editor />
    </TabsProvider>
  );
}
```

### 🌐 Use Case 2: Page Browser (Browser-like)

Simulates a browser with multiple navigable tabs.

```jsx
function Browser() {
  const { openTab, closeTab, tabs } = useTabsManager();
  const [pages, setPages] = useState([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && tabs.length === 0) {
      initialized.current = true;
      openTab({ id: 'home', label: '🏠 Home' });
      openTab({ id: 'about', label: 'ℹ️ About' });
    }
  }, [tabs.length, openTab]);

  const handleNewTab = () => {
    const newId = `page-${Date.now()}`;
    openTab({ 
      id: newId, 
      label: '🌐 New Page',
    });
    setPages(prev => [...prev, { id: newId, url: '' }]);
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="bg-gray-100 p-2 flex gap-2 items-center border-b">
        <button 
          onClick={handleNewTab}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          + New Tab
        </button>
      </div>

      <TabsContainer>
        <Tab id="home" label="Home">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Home</h1>
            <p>Browser home page</p>
          </div>
        </Tab>
        
        <Tab id="about" label="About">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">About</h1>
            <p>Browser information</p>
          </div>
        </Tab>

        {pages.map(page => (
          <Tab key={page.id} id={page.id} label={page.url || 'New Page'}>
            <div className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Enter URL..."
                className="w-full p-2 border rounded"
                onChange={(e) => {
                  setPages(prev => prev.map(p => 
                    p.id === page.id ? { ...p, url: e.target.value } : p
                  ));
                }}
              />
              <button
                onClick={() => {
                  closeTab(page.id);
                  setPages(prev => prev.filter(p => p.id !== page.id));
                }}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Close This Tab
              </button>
            </div>
          </Tab>
        ))}
      </TabsContainer>
    </div>
  );
}
```

### 📊 Use Case 3: Dashboard with Reports

Multiple reports open simultaneously with data caching.

```jsx
function Dashboard() {
  const { openTab, closeTab, tabs } = useTabsManager();
  const { setInCache, getFromCache } = useCache();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && tabs.length === 0) {
      initialized.current = true;
      openTab({ id: 'overview', label: '📊 Overview' });
    }
  }, [tabs.length, openTab]);

  const handleOpenReport = (reportType) => {
    const reportId = `report-${reportType}`;
    
    // Check cache before opening
    const cachedData = getFromCache(reportId);
    
    if (!tabs.find(t => t.id === reportId)) {
      openTab({ 
        id: reportId, 
        label: `📈 ${reportType}`,
      });
      
      // If no cache, fetch data
      if (!cachedData) {
        // Simulate data fetch
        setTimeout(() => {
          setInCache(reportId, {
            data: `Report data for ${reportType}`,
            timestamp: new Date().toISOString()
          });
        }, 1000);
      }
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="bg-gray-900 text-white p-4 flex gap-3">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button onClick={() => handleOpenReport('Sales')} className="px-3 py-1 bg-blue-600 rounded">
          Sales
        </button>
        <button onClick={() => handleOpenReport('Stock')} className="px-3 py-1 bg-green-600 rounded">
          Stock
        </button>
        <button onClick={() => handleOpenReport('Financial')} className="px-3 py-1 bg-purple-600 rounded">
          Financial
        </button>
      </div>

      <TabsContainer>
        <Tab id="overview" label="Overview">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">General Overview</h2>
            <p>Click the buttons above to open specific reports.</p>
          </div>
        </Tab>

        {tabs.filter(t => t.id.startsWith('report-')).map(tab => {
          const reportType = tab.id.replace('report-', '');
          const cachedData = getFromCache(tab.id);

          return (
            <Tab key={tab.id} id={tab.id} label={tab.label}>
              <div className="p-6 space-y-4">
                <h2 className="text-2xl font-bold">Report: {reportType}</h2>
                {cachedData ? (
                  <div className="bg-gray-100 p-4 rounded">
                    <p className="font-mono">{cachedData.data}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Generated at: {new Date(cachedData.timestamp).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <p>Loading data...</p>
                )}
                <button
                  onClick={() => closeTab(tab.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Close Report
                </button>
              </div>
            </Tab>
          );
        })}
      </TabsContainer>
    </div>
  );
}
```

### 🎮 How to Close Tabs

#### 1. Close with X button on tab
```jsx
// Automatic! Just click the X that appears on hover
<TabsContainer>
  <Tab id="example" label="Example">
    Content...
  </Tab>
</TabsContainer>
```

#### 2. Close programmatically
```jsx
const { closeTab } = useTabsManager();

// Inside a button or action
<button onClick={() => closeTab('tab-id')}>
  Close This Tab
</button>
```

#### 3. Close all except one
```jsx
const { tabs, closeTab, activeTabId } = useTabsManager();

const closeAllOthers = () => {
  tabs.forEach(tab => {
    if (tab.id !== activeTabId) {
      closeTab(tab.id);
    }
  });
};
```

#### 4. Close all
```jsx
const { tabs, closeTab } = useTabsManager();

const closeAll = () => {
  tabs.forEach(tab => closeTab(tab.id));
};
```

## 🎨 Style Customization

The library uses Tailwind CSS and allows you to create **your own completely custom theme**!

### Available Style Properties

You can customize each part of the tabs through the `styles` prop:

```jsx
const myTheme = {
  container: string,                           // Main container
  tabBar: string,                              // Tabs bar
  tab: (isActive, isDragging) => string,      // Each tab (function)
  tabContent: string,                          // Tab inner content
  tabLabel: string,                            // Label/text of tab
  closeButton: string,                         // Close button (X)
  closeIcon: string,                           // Close button icon
  contentArea: string,                         // Tabs content area
  activeTabContent: string,                    // Active tab content
  dropIndicator: string                        // Drop indicator (drag)
};
```

### Custom Theme Examples

#### Modern Dark Theme

```jsx
const darkTheme = {
  container: "w-full h-full flex flex-col bg-gradient-to-br from-slate-900 to-slate-800",
  tabBar: "flex bg-slate-900 border-b border-slate-700",
  tab: (isActive, isDragging) => `
    px-4 py-3 border-r border-slate-700 cursor-move transition-all
    ${isDragging ? 'opacity-50' : ''}
    ${isActive 
      ? 'bg-slate-800 text-white border-b-2 border-blue-500' 
      : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
  `,
  tabContent: "flex items-center gap-2 group",
  tabLabel: "text-sm font-medium",
  closeButton: "ml-auto p-1 rounded opacity-50 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 cursor-pointer z-20",
  closeIcon: "h-3.5 w-3.5",
  contentArea: "flex-1 bg-slate-900",
  activeTabContent: "h-full p-6",
  dropIndicator: "absolute w-1 bg-blue-500"
};

<TabsContainer styles={darkTheme}>
  {/* your tabs */}
</TabsContainer>
```

#### Cyberpunk Theme (Complete with Animations)

```jsx
const cyberpunkTheme = {
  container: "w-full h-full flex flex-col bg-black",
  tabBar: "flex-none flex bg-black border-b-2 border-cyan-500/50 overflow-x-auto scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-black shadow-lg shadow-cyan-500/20",
  tab: (isActive, isDragging) => `
    flex items-center min-w-[180px] max-w-[220px]
    px-4 py-3 border-r border-cyan-500/30 cursor-move
    transition-all duration-300 ease-in-out relative
    ${isDragging ? 'opacity-40 scale-95' : 'opacity-100 scale-100'}
    ${isActive 
      ? 'bg-cyan-950/50 text-cyan-300 shadow-lg shadow-cyan-500/30 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-cyan-400 after:via-pink-500 after:to-cyan-400 after:animate-pulse' 
      : 'text-cyan-500/70 hover:bg-cyan-950/30 hover:text-cyan-400'}
  `,
  tabContent: "flex-1 flex items-center overflow-hidden group px-2 gap-2",
  tabLabel: "truncate flex-1 text-sm font-bold tracking-wide uppercase",
  closeButton: `
    ml-auto p-1 rounded opacity-50 group-hover:opacity-100
    transition-all duration-200
    hover:bg-pink-500/20 hover:text-pink-400 hover:scale-110
    cursor-pointer relative z-20 flex items-center justify-center
    border border-pink-500/30 hover:border-pink-400 hover:shadow-lg hover:shadow-pink-500/50
  `,
  closeIcon: "h-3.5 w-3.5 text-cyan-400 hover:text-pink-400 transition-colors",
  contentArea: "flex-1 bg-black overflow-hidden",
  activeTabContent: "h-full overflow-auto",
  dropIndicator: "absolute top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-pink-500 to-cyan-400 transition-all duration-200 shadow-lg shadow-pink-500/50 animate-pulse"
};

// Complete usage
function CyberpunkApp() {
  return (
    <div className="w-screen h-screen bg-black">
      <div className="bg-gradient-to-r from-cyan-950 via-black to-pink-950 text-cyan-300 p-4 border-b-2 border-cyan-500/50">
        <h1 className="text-3xl font-bold tracking-wider uppercase">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-cyan-400">
            Cyberpunk Tabs
          </span>
        </h1>
      </div>
      
      <TabsContainer styles={cyberpunkTheme}>
        <Tab id="home" label="Home">
          <div className="text-cyan-300 space-y-4">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
              Welcome to the Future
            </h2>
            <p className="text-cyan-200/80">Cyberpunk content...</p>
          </div>
        </Tab>
      </TabsContainer>
    </div>
  );
}
```

#### Minimalist Theme

```jsx
const minimalTheme = {
  container: "w-full h-full flex flex-col",
  tabBar: "flex border-b",
  tab: (isActive) => `
    px-4 py-2 cursor-move
    ${isActive ? 'border-b-2 border-black font-semibold' : 'text-gray-500'}
  `,
  tabContent: "flex items-center gap-2 group",
  tabLabel: "text-sm",
  closeButton: "ml-2 opacity-0 group-hover:opacity-100 cursor-pointer z-20",
  closeIcon: "h-3 w-3",
  contentArea: "flex-1",
  activeTabContent: "h-full p-4"
};
```

### Customization Tips

- Use Tailwind classes for maximum flexibility
- The `tab` function receives `isActive` and `isDragging` for different states
- Use `group` and `group-hover:` for hover effects
- `closeButton` should have `z-20` and `cursor-pointer` to work well
- `dropIndicator` appears during drag & drop

## TypeScript

The library includes TypeScript type declarations. No need to install `@types` separately.

```tsx
import { Tab, UseTabsManagerReturn } from 'react-tabs-manager';

const myTab: Tab = {
  id: 'example',
  label: 'Example Tab',
  icon: <Icon />
};
```

## 💡 Advanced Tips and Best Practices

### 1. Prevent Tab Duplication
```jsx
const { openTab, tabs } = useTabsManager();

const handleOpenTab = (id, label) => {
  // Check if already exists before opening
  if (!tabs.find(t => t.id === id)) {
    openTab({ id, label });
  } else {
    // Just activate existing tab
    setActiveTab(id);
  }
};
```

### 2. Synchronize Local State with Tabs
```jsx
const [localData, setLocalData] = useState([]);

// Keep synchronized when tabs are closed
useEffect(() => {
  const tabIds = tabs.map(t => t.id);
  setLocalData(prev => prev.filter(item => tabIds.includes(item.id)));
}, [tabs]);
```

### 3. Persist Tabs in localStorage
```jsx
const { tabs, openTab } = useTabsManager();

// Save on close
useEffect(() => {
  localStorage.setItem('saved-tabs', JSON.stringify(tabs));
}, [tabs]);

// Restore on open
useEffect(() => {
  const saved = localStorage.getItem('saved-tabs');
  if (saved) {
    const savedTabs = JSON.parse(saved);
    savedTabs.forEach(tab => openTab(tab));
  }
}, []);
```

### 4. Keyboard Shortcuts
```jsx
useEffect(() => {
  const handleKeyPress = (e) => {
    // Ctrl+W to close active tab
    if (e.ctrlKey && e.key === 'w') {
      e.preventDefault();
      if (activeTabId) closeTab(activeTabId);
    }
    
    // Ctrl+Tab for next tab
    if (e.ctrlKey && e.key === 'Tab') {
      e.preventDefault();
      const currentIndex = tabs.findIndex(t => t.id === activeTabId);
      const nextTab = tabs[(currentIndex + 1) % tabs.length];
      if (nextTab) setActiveTab(nextTab.id);
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [tabs, activeTabId, closeTab, setActiveTab]);
```

### 5. Confirmation Before Closing
```jsx
const handleCloseWithConfirm = (tabId) => {
  if (window.confirm('Are you sure you want to close this tab?')) {
    closeTab(tabId);
  }
};
```

### 6. Context Menu (Right Click)
```jsx
const [contextMenu, setContextMenu] = useState(null);

const handleContextMenu = (e, tabId) => {
  e.preventDefault();
  setContextMenu({ x: e.clientX, y: e.clientY, tabId });
};

// No JSX
<div onContextMenu={(e) => handleContextMenu(e, tab.id)}>
  {/* Tab content */}
</div>

{contextMenu && (
  <div 
    style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x }}
    className="bg-white shadow-lg rounded p-2"
  >
    <button onClick={() => closeTab(contextMenu.tabId)}>Close</button>
    <button onClick={() => closeAllOthers(contextMenu.tabId)}>Close Others</button>
  </div>
)}
```

### 7. Limit of Open Tabs
```jsx
const MAX_TABS = 10;

const handleOpenTab = (tab) => {
  if (tabs.length >= MAX_TABS) {
    alert(`Maximum of ${MAX_TABS} tabs open!`);
    return;
  }
  openTab(tab);
};
```

### 8. Custom Icons by File Type
```jsx
const getFileIcon = (fileName) => {
  if (fileName.endsWith('.js')) return '📜';
  if (fileName.endsWith('.tsx')) return '⚛️';
  if (fileName.endsWith('.css')) return '🎨';
  if (fileName.endsWith('.md')) return '📝';
  return '📄';
};

openTab({ 
  id: fileId, 
  label: fileName,
  icon: getFileIcon(fileName)
});
```

## 🔧 Additional Configuration

### For Web Applications

This library works perfectly in web applications! Just follow the installation steps above and you're ready to go.

### For Electron Projects

If you followed the installation steps above, Tailwind CSS is already configured and the library will work correctly.

For Electron projects, make sure that:
- Tailwind CSS is processing the library files
- Styles are being loaded correctly in the rendering environment
- `nodeIntegration` is disabled (security)

### Performance with Many Tabs

If you have many open tabs (>20), consider:
1. Increasing `cacheLimit` in `TabsProvider`
2. Implementing virtualization for the tabs list
3. Using `React.memo` on tab content components

## 📝 Changelog

### v1.2.0
- ✅ Close tab button fixed (drag no longer interferes)
- ✅ Simplified and neutral default theme
- ✅ Focus on user customization
- ✅ Complete documentation with use cases

## 🤝 Contributing

**Contributions are welcome!** Feel free to:
- ⭐ Star this repository if you find it useful
- 🐛 Report bugs by opening an issue
- 💡 Suggest new features
- 🔀 Submit pull requests
- 💬 Improve documentation

Please read our contribution guidelines before submitting PRs.

## 📄 License

MIT
