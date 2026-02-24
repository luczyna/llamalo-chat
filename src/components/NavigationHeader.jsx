import { useState } from 'react';
import { connectionStatusLabels } from '../services/connectionService.js';
import SettingsIcon from './SettingsIcon.jsx'
import NavigationWorkingIndicator from './NavigationWorkingIndicator.jsx';

function NavigationHeader(props) {
  const ctxStatus = connectionStatusLabels[props.ctx];

  return (
    <nav class={"navigation-header " + ((props.ctx === 2) ? 'nav-error-alert' : '') }>
      <h1 class="app-name">
        llamalo
        <button type="button" class="app-settings-btn" title="settings"><SettingsIcon /></button>
      </h1>

      {props.activeConvo.length > 0 && <h2 class="convo-nav-name">{props.list.find(c => c.id === props.activeConvo ).name}</h2>}

      <div class="app-connection-status">
        {(props.ctx === 0) && <NavigationWorkingIndicator />}
        <p>connection: {ctxStatus}</p>
      </div>
    </nav>
  )
}

export default NavigationHeader
