function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function getConversations() {
  // return localStorage.getItem('llamaTexts', JSON.stringify(conversations));

  const savedConversations = localStorage.getItem('llamaTexts');

  if (savedConversations) {
    try {
      const parsed = JSON.parse(savedConversations);

      if (parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved conversations:', e);
    }
  }
}

export function saveConversation(chatname, modelname, conversations) {
  const newConversation = {
    id: generateId(),
    name: chatname,
    messages: [],
    model: modelname,
    createdAt: new Date().toISOString()
  };

  conversations.push(newConversation);

  localStorage.setItem('llamaTexts', JSON.stringify(conversations));
  return newConversation.id;
}
