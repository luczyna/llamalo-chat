import {
  Conversation,
  ConversationOptions,
  UserMessage,
  AssistantMessage
} from './modelService.js';

export function getConversations() {
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
  const newConversation = new Conversation(chatname, modelname);

  conversations.push(newConversation);

  setLocalStorage(conversations);
  return newConversation.id;
}

export function deleteConversation(convoId, conversations) {
  const convo = conversations.findIndex( c => c.id === convoId );
  conversations.splice(convo, 1);

  setLocalStorage(conversations);
}

export function updateConvUserSays(convoId, modelname, message, conversations) {
  const newMessage = new UserMessage(convoId, modelname, message);

  const convo = conversations.find( c => c.id === convoId );
  convo.messages.push(newMessage);

  setLocalStorage(conversations);
  return newMessage.id;
}

export function startConvAssistantSays(convoId, modelname, message, conversations) {
  const newMessage = new AssistantMessage(convoId, modelname, message);

  const convo = conversations.find( c => c.id === convoId );
  convo.messages.push(newMessage);

  setLocalStorage(conversations);
  return newMessage.id;
}

export function updateConvAssistantSays(messageId, convoId, message, conversations) {
  const convo = conversations.find( c => c.id === convoId );
  const streamingMessage = convo.messages.find(m => m.id === messageId);
  streamingMessage.content = message;

  setLocalStorage(conversations);
}

export function updateConvAssistantActive(messageId, convoId, isActive, conversations) {
  const convo = conversations.find( c => c.id === convoId );
  const streamingMessage = convo.messages.find(m => m.id === messageId);
  streamingMessage.activeResponse = isActive;

  setLocalStorage(conversations);
}

export function updateConvModel(convoId, model, conversations) {
  const convo = conversations.find( c => c.id === convoId );
  convo.model = model;

  setLocalStorage(conversations);
}

export function updateConvName(convoId, name, conversations) {
  const convo = conversations.find( c => c.id === convoId );
  convo.name = name;

  setLocalStorage(conversations);
}

export function updateConvOptions(convoId, options, conversations) {
  const convo = conversations.find( c => c.id === convoId );
  convo.options = new ConversationOptions(options);

  setLocalStorage(conversations);
}

export function removeConversationMessage(convoId, messageId, conversations) {
  const convo = conversations.findIndex( c => c.id === convoId );
  const message = conversations[convo].messages.findIndex( m => m.id === messageId );
  conversations[convo].messages.splice(message, 1);

  setLocalStorage(conversations);
}

function setLocalStorage(conversations) {
  localStorage.setItem('llamaTexts', JSON.stringify(conversations));
}
