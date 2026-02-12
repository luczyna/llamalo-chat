export async function getOllamaModels(OLLAMA_URL) {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);

    if (!response.ok) {
      throw new Error('failed to fetch models');
    }

    const data = await response.json();
    const modelList = data.models || [];

    return modelList;
  } catch (error) {
    throw new Error('ollama server not found');
  }
}

function makeNewUserMessage(convoId, modelToAsk, message) {
    const newMessage = {
      id: generateId(),
      chatId: convoId,
      createdAt: new Date().toISOString(),
      model: modelToAsk,
      owner: 'user',
      // TODO where does AI santitastion wow
      content: message
    }

    cl = state.chatList.find(c => c.id === state.selectedChat);
    if (cl) {
      cl.messages.push(newMessage);
      saveChatStorage();

      modelmessages = cl.messages.map(m => {
        return {
          role: m.owner,
          content: m.content
        }
      });

      elem.humantext.value = "";
      updateChatContent(false, newMessage.id);
      askLlama(modelToAsk, modelmessages);
    }
  }

  function makeNewAssistantMessage() {
    const modelToAsk = elem.modelselect.value;
    const chat = state.selectedChat;
    const id = generateId();

    const newMessage = {
      id: id,
      chatId: chat,
      createdAt: new Date().toISOString(),
      model: modelToAsk,
      owner: 'assistant',
      content: '',
    }

    cl = state.chatList.find(c => c.id === chat);
    if (cl) {
      cl.messages.push(newMessage);
      saveChatStorage();
      updateChatContent(false, newMessage.id);
    }

    return id;
  }
