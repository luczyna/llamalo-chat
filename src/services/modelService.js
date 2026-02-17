export function Conversation(convoname, modelname) {
  return {
    id: generateId(),
    name: convoname,
    messages: [],
    model: modelname,
    createdAt: new Date().toISOString()
  }
}

export function UserMessage(convoId, modelname, message) {
  return {
    id: generateId(),
    convoId: convoId,
    model: modelname,
    role: 'user',
    content: message,
    createdAt: new Date().toISOString()
  }
}

export function AssistantMessage(convoId, modelname) {
  return {
    id: generateId(),
    convoId: convoId,
    model: modelname,
    role: 'assistant',
    content: '',
    createdAt: new Date().toISOString()
  }
}

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
