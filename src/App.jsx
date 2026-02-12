import { useState, useEffect } from 'react'
import NavigationHeader from './components/NavigationHeader.jsx'
import ConversationList from './components/ConversationList.jsx'
import ConversationLog from './components/ConversationLog.jsx'
import ConversateForm from './components/ConversateForm.jsx'

import * as ols from './services/ollamaService.js'
import * as sts from './services/storageService.js'

function App() {
  const [connectionStatus, updateConnection] = useState(1);
  const [convolist, updateConvolist] = useState([]);
  const [modellist, updateModellist] = useState([]);
  const [activeModel, updateActiveModel] = useState('');
  const [activeConvo, updateActiveConvo] = useState('');

  const OLLAMA_URL = localStorage.getItem("ollamaUrl") || "http://127.0.0.1:11434";

  useEffect(() => {
    // check for ollama availability by first checking for models
    checkOllamaAvailability();
    checkConversations();
  }, []);

  async function checkOllamaAvailability() {
    updateConnection(0);
    let foundError = false;

    try {
      const models = await ols.getOllamaModels(OLLAMA_URL);
      updateModellist(models);

      if (models.length) {
        // use the first model in the list
        updateActiveModel(models[0].model);
      }
    } catch(e) {
      console.log(e);
      foundError = true;
    } finally {
      if (foundError) {
        updateConnection(2);
      } else {
        updateConnection(1);
      }
    }
  }

  function checkConversations() {
    const conversations = sts.getConversations();

    if (conversations && conversations.length) {
      updateConvolist(conversations);
    }
  }

  return (
    <>

      <NavigationHeader
        ctx={connectionStatus}
        list={convolist}
        activeConvo={activeConvo} />
      <ConversationList
        list={convolist}
        model={activeModel}
        activeConvo={activeConvo}
        updateConvoList={updateConvolist}
        updateActiveConvo={updateActiveConvo} />
      <ConversationLog
        activeConvo={activeConvo}
        convoData={convolist.find( c => c.id === activeConvo )} />
      <ConversateForm
        ready={connectionStatus === 1}
        list={convolist}
        model={activeModel}
        activeConvo={activeConvo}
        reloadConversations={checkConversations} />
    </>
  )
}

export default App
