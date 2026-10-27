import { useState, useContext } from 'react';
import { connectionStatusLabels } from '../services/connectionService.js';
import SettingsIcon from './SettingsIcon.jsx'
import NavigationWorkingIndicator from './NavigationWorkingIndicator.jsx';
import ConversationSettings from './ConversationSettings.jsx';
import * as sts from '../services/storageService.js';
import { ConvolistContext, ActiveConvoContext } from '../context/ConversationContext.js';

// ctx={connectionStatus}
// *** list={convolist}
// *** activeConvo={activeConvo}
// activeModel
// modellist
// updateActiveModel
// updateConversations
function NavigationHeader(props) {
  const [showConvoSettings, setShowConvoSettings] = useState(false)
  const ctxStatus = connectionStatusLabels[props.ctx];
  const list = useContext(ConvolistContext);
  const activeConvoId = useContext(ActiveConvoContext);
  const activeConvo = list.find(l => l.id === activeConvoId);

  // let activeConvo = null;
  // if (props.activeConvo) {
  //   activeConvo = props.list.find(c => c.id === props.activeConvo );
  // }

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
    <nav class={"navigation-header " + ((props.ctx === 2) ? 'nav-error-alert' : '') }>
      <h1 class="app-name">
        llamalo
      </h1>

      {activeConvo != undefined && <>
        <h2 class="convo-nav-name">{activeConvo.name}</h2>
        <button class="convo-nav-settings btn btn-link" onClick={toggleConvoSettings}>settings</button>
      </>}

      <div class="app-connection-status">
        {(props.ctx === 0) && <NavigationWorkingIndicator />}
        <p>connection: {ctxStatus}</p>
      </div>

      {showConvoSettings && <ConversationSettings
        model={props.model}
        modellist={props.modellist}
        // list={props.list}
        // convo={props.activeConvo}
        updateActiveModel={props.updateActiveModel}
        updateConversations={props.updateConversations}
        closeSettings={hideConvoSettings} />}
    </nav>
  )
}

export default NavigationHeader
