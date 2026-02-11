import { useState, useEffect } from 'react'
import NavigationHeader from './components/NavigationHeader.jsx'
import ConversationList from './components/ConversationList.jsx'
import ConversationLog from './components/ConversationLog.jsx'
import ConversateForm from './components/ConversateForm.jsx'

import * as ols from './services/ollamaService.js'
import * as sts from './services/storageService.js'

function App() {
  const [connectionStatus, updateConnection] = useState(1);
  const [chatlist, updateChatlist] = useState([]);
  const [modellist, updateModellist] = useState([]);
  const [activeModel, updateActiveModel] = useState(null);
  const [activeConvo, updateActiveConvo] = useState(null);

  const OLLAMA_URL = localStorage.getItem("ollamaUrl") || "http://127.0.0.1:11434";

  useEffect(() => {
    // check for ollama availability by first checking for models
    console.log('App useEffect');
    checkOllamaAvailability();
    checkConversations();
  }, []);

  async function checkOllamaAvailability() {
    updateConnection(0);
    try {
      const models = await ols.getOllamaModels(OLLAMA_URL);
      updateModellist(models);

      if (models.length) {
        // use the first model in the list
        updateActiveModel(0);
      }
    } catch(e) {
      console.log(e);
      updateConnection(2);
    } finally {
      updateConnection(1);
    }
  }

  function checkConversations() {
    const conversations = sts.getConversations();

    if (conversations && conversations.length) {
      updateChatlist(conversations);
    }
  }

  return (
    <>
      <h1>LLamaLO App</h1>
      <NavigationHeader ctx={connectionStatus} />
      <ConversationList
        list={chatlist}
        model={activeModel}
        activeConvo={activeConvo}
        updateChatlist={updateChatlist}
        updateActiveConvo={updateActiveConvo}/>
      <ConversationLog />
      <ConversateForm />
    </>
  )
}

export default App
