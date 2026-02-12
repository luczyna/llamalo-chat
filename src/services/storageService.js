import {
  Conversation,
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

  localStorage.setItem('llamaTexts', JSON.stringify(conversations));
  return newConversation.id;
}

export function updateConvUserSays(convoId, modelname, message, conversations) {
  const newMessage = new UserMessage(convoId, modelname, message);

  const convo = conversations.find( c => c.id === convoId );
  convo.messages.push(newMessage);

  localStorage.setItem('llamaTexts', JSON.stringify(conversations));
  return newMessage.id;
}

export function deleteConversation() {}
