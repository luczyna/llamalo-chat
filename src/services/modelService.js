export function Conversation(convoname, modelname) {
  return {
    id: generateId(),
    name: convoname,
    messages: [],
    model: modelname,
    createdAt: new Date().toISOString()
  }
}

export function ConversationOptions(options) {
  let base = {
    seed: undefined,
    temperature: undefined,
    top_k: undefined,
    top_p: undefined,
    min_p: undefined,
    stop: undefined,
    num_ctx: undefined,
    num_predict: undefined
  }

  Object.keys(options).forEach((option, index) => {
    base[option] = options[option];
  });

  Object.keys(base).forEach(key => base[key] === undefined && delete base[key]);

  return base;
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
    createdAt: new Date().toISOString(),
    activeResponse: true
  }
}

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
