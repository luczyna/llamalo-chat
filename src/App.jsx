import { useState, useEffect, useRef } from 'react'
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

  const conversationMessagesWrapper = useRef(null);

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

  function converseWithOllama(model=activeModel) {
    // TODO make a queue for multiple conversations
    // show the user message
    checkConversations();
    // update the status of the connection to Ollama
    updateConnection(0);
    // scroll to the user message
    // scrollToConversationListBottom();
    window.setTimeout(() => {
      scrollToConversationListBottom();
    }, 250);

    // we start watching the user scroll
    // if they do while the bot is working, then we do not upset their behavior
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event
    let disturbAutoScrolling = false;
    let watchingUserScroll = true;
    conversationMessagesWrapper.current.addEventListener('wheel', userGeneratedScroll, true);

    // create the assistant message in LocalStorage
    // save the response to the assistant message
    // send the prompt to Ollama
    const conversation = convolist.find(c => c.id === activeConvo);
    const messageId = sts.startConvAssistantSays(activeConvo, activeModel, '', convolist);
    checkConversations();
    ols.getOllamaResponse(OLLAMA_URL, activeModel, conversation, updateStreamingMessage, finishingTouches);

    function userGeneratedScroll() {
      disturbAutoScrolling = true;
    }

    function updateStreamingMessage(accumulatedMessage) {
      sts.updateConvAssistantSays(messageId, activeConvo, accumulatedMessage, convolist);

      checkConversations();

      if (!disturbAutoScrolling) {
        scrollToConversationListBottom();
      } else if (watchingUserScroll && disturbAutoScrolling) {
        conversationMessagesWrapper.current.removeEventListener('wheel', userGeneratedScroll, true);
        watchingUserScroll = false;
      }
    }

    function finishingTouches(hasError) {
      if (hasError) {
        updateConnection(2);
      } else {
        updateConnection(1);
      }

      if (watchingUserScroll) {
        conversationMessagesWrapper.current.removeEventListener('wheel', userGeneratedScroll, true);
      }

      sts.updateConvAssistantActive(messageId, activeConvo, false, convolist);
      // console.log('i am finishededed');
    }
  }

  function scrollToConversationListBottom() {
    conversationMessagesWrapper.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    });
  }


  return (
    <>
      <NavigationHeader
        ctx={connectionStatus}
        list={convolist}
        activeConvo={activeConvo} />
      <main class="maincontent">
        <ConversationList
          list={convolist}
          model={activeModel}
          activeConvo={activeConvo}
          updateConvoList={updateConvolist}
          updateActiveConvo={updateActiveConvo}
          scrollToConversationListBottom={scrollToConversationListBottom}
          ctx={connectionStatus} />

        <div class="conversation-container">
          <ConversationLog
            activeConvo={activeConvo}
            convoData={convolist.find( c => c.id === activeConvo )}
            wrapperRef={conversationMessagesWrapper} />
          <ConversateForm
            ready={connectionStatus === 1}
            list={convolist}
            model={activeModel}
            modellist={modellist}
            activeConvo={activeConvo}
            requestOllamaResponse={converseWithOllama} />
        </div>

      </main>
    </>
  )
}

export default App
