import { useState } from 'react';
import { connectionStatusLabels } from '../services/connectionService.js';

function NavigationHeader(props) {
  const ctxStatus = connectionStatusLabels[props.ctx];

  return (
    <nav>
      <h1>LLamaLO</h1>
      {props.activeConvo.length > 0 && <p>{props.list.find(c => c.id === props.activeConvo ).name}</p>}
      <p>connection: {ctxStatus}</p>
      <p>settings</p>
    </nav>
  )
}

export default NavigationHeader
