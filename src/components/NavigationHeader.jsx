import { useState } from 'react';
import { connectionStatusLabels } from '../services/connectionService.js';
import SettingsIcon from './SettingsIcon.jsx'
import NavigationWorkingIndicator from './NavigationWorkingIndicator.jsx';
import * as sts from '../services/storageService.js'

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

  function hideConvoSettings() {
    setShowConvoSettings(false);
  }

  function updateConvoDefaultModel(e) {
    console.log(e.target.value)
    const model = e.target.value;

    sts.updateConvModel(props.activeConvo, model, props.list);
    props.updateActiveModel(model);
  }

  // console.log(props.activeConvo);

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
        <div class="defaults-wrapper">
          <label class="text-label" title="override the conversation model default">
            <span>choose default model for this conversation</span>
            <select class="select-input" onChange={updateConvoDefaultModel} value={props.list.find(c=>c.id === props.activeConvo).model}>
              {props.modellist.map(model => {
                return <option value={model.name} key={model.id}>{model.name}</option>
              })}
            </select>
          </label>
        </div>
        <footer class="defaults-footer">
          <button type="button" class="btnb btn-cancel" onClick={hideConvoSettings}>close settings</button>
        </footer>
      </div>}
    </nav>
  )
}

export default NavigationHeader
