import { useState } from 'react';
import { connectionStatusLabels } from '../services/connectionService.js';

function NavigationHeader(props) {
  const ctxStatus = connectionStatusLabels[props.ctx];

  return (
    <nav>
      <p>App Name or Convo Title</p>
      <p>connection: {ctxStatus}</p>
      <p>settings</p>
    </nav>
  )
}

export default NavigationHeader
