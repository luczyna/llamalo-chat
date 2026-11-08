import { useState, useContext } from 'react';
import { connectionStatusLabels } from '../services/connectionService.js';
import SettingsIcon from './SettingsIcon.jsx'
import NavigationWorkingIndicator from './NavigationWorkingIndicator.jsx';
import ConversationSettings from './ConversationSettings.jsx';

import { ConversationContext } from '../context/ConversationContext.js';
import { ConnectionContext } from '../context/ConnectionContext.js';

function NavigationHeader(props) {
  const [showConvoSettings, setShowConvoSettings] = useState(false)
  const { connectionStatus: ctx } = useContext(ConnectionContext);
  const ctxStatus = connectionStatusLabels[ctx];
  const {
    convolist: list,
    activeConvoId
  } = useContext(ConversationContext);

  const activeConvo = list !== undefined ? list.find(l => l.id === activeConvoId) : undefined;

  function toggleConvoSettings() {
    setShowConvoSettings(!showConvoSettings);
  }

  function openConvoSettings() {
    setShowConvoSettings(true);
  }

  function hideConvoSettings() {
    setShowConvoSettings(false);
  }

  // <button type="button" class="app-settings-btn" title="settings"><SettingsIcon /></button>

  return (
    <nav class={"navigation-header " + ((ctx === 2) ? 'nav-error-alert' : '') }>
      <h1 class="app-name">
        llamalo
      </h1>

      {activeConvo != undefined && <>
        <h2 class="convo-nav-name">{activeConvo.name}</h2>
        <button class="convo-nav-settings btn btn-link" onClick={toggleConvoSettings}>settings</button>
      </>}

      <div class="app-connection-status">
        {(ctx === 0) && <NavigationWorkingIndicator />}
        <p>connection: {ctxStatus}</p>
      </div>

      {showConvoSettings && <ConversationSettings 
        updateConversations={props.updateConversations}
        closeSettings={hideConvoSettings} />}
    </nav>
  )
}

export default NavigationHeader
