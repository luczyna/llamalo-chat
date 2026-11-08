import { createContext } from 'react';

export const ConnectionContext = createContext({
  connectionStatus: 1,
  updateConnection: () => {}
});
