import { createContext } from 'react';

export const ConversationContext = createContext({
    convolist: [],
    activeConvoId: '',
    updateConvoList: () => {},
    updateActiveConvo: () => {}
});
