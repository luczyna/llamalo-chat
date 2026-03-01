import { useState } from 'react';
import { connectionStatusLabels } from '../services/connectionService.js';
import SettingsIcon from './SettingsIcon.jsx'
import NavigationWorkingIndicator from './NavigationWorkingIndicator.jsx';

// ctx={connectionStatus}
// list={convolist}
// activeConvo={activeConvo}
// activeModel
// modellist
// updateActiveModel
function NavigationHeader(props) {
  const [showConvoSettings, setShowConvoSettings] = useState(false)
  const ctxStatus = connectionStatusLabels[props.ctx];

  function openConvoSettings() {
    setShowConvoSettings(true);
  }

  return (
    <nav class={"navigation-header " + ((props.ctx === 2) ? 'nav-error-alert' : '') }>
      <h1 class="app-name">
        llamalo
        <button type="button" class="app-settings-btn" title="settings"><SettingsIcon /></button>
      </h1>

      {props.activeConvo.length > 0 && <h2 class="convo-nav-name">{props.list.find(c => c.id === props.activeConvo ).name}</h2>}
      {props.activeConvo.length > 0 && <button class="convo-nav-settings btn btn-link" onClick={openConvoSettings}>settings</button>}

      <div class="app-connection-status">
        {(props.ctx === 0) && <NavigationWorkingIndicator />}
        <p>connection: {ctxStatus}</p>
      </div>

      {showConvoSettings && <div class="app-conversation-defaults">
        <div class="s200 bg-teal-100"></div>
      </div>}
    </nav>
  )
}

export default NavigationHeader
