# React Tabs Manager

Uma biblioteca React para gerenciar múltiplos estados (como abas ou seções) com caching e priorização.

## Características

- Gerenciamento de estado global para abas
- Cache automático de conteúdo de abas inativas
- Interface simples e intuitiva
- Estilização com Tailwind CSS
- Suporte a renderização condicional
- Limite configurável de cache

## Instalação

```bash
npm install react-tabs-manager
```

## Uso Básico

```jsx
import { TabsProvider, TabsContainer, Tab } from 'react-tabs-manager';

function App() {
  return (
    <TabsProvider cacheLimit={5}>
      <TabsContainer>
        <Tab id="home" label="Home">
          <Home />
        </Tab>
        <Tab id="about" label="About">
          <About />
        </Tab>
      </TabsContainer>
    </TabsProvider>
  );
}
```

## Hooks Disponíveis

### useTabsManager

```jsx
const { 
  tabs,           // Lista de abas
  activeTabId,    // ID da aba ativa
  openTab,        // Função para abrir nova aba
  closeTab,       // Função para fechar aba
  setActiveTab    // Função para ativar aba
} = useTabsManager();
```

### useCache

```jsx
const {
  setInCache,     // Armazena dados no cache
  getFromCache,   // Recupera dados do cache
  clearCache,     // Limpa todo o cache
  setCacheLimit   // Define limite do cache
} = useCache();
```

## Exemplo de Uso Avançado

```jsx
import { useTabsManager, useCache } from 'react-tabs-manager';

function MyComponent() {
  const { openTab, closeTab } = useTabsManager();
  const { setInCache } = useCache();

  const handleAddTab = () => {
    const tabId = `tab-${Date.now()}`;
    
    // Armazena dados no cache
    setInCache(tabId, { someData: 'cached data' });
    
    // Abre nova aba
    openTab({
      id: tabId,
      label: 'Nova Aba',
      content: <TabContent />
    });
  };

  return (
    <button onClick={handleAddTab}>
      Adicionar Nova Aba
    </button>
  );
}
```

## Configuração

A biblioteca usa Tailwind CSS para estilização. Certifique-se de ter o Tailwind configurado em seu projeto.

## Licença

MIT
