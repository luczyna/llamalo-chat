import { useState } from 'react';
import * as sts from '../services/storageService.js';

// props
// {
//   ready: is the app ready to send this REQUEST,
//   list: chatlist of ollama conversations
//   model: current model
//   activeConvo: current conversation
//   requestOllamaResponse: send the message responsibility up to parent App
// }
function ConversateForm(props) {
  const [message, setMessage] = useState('');
  const [submittable, setSubmittable] = useState(false);

  function captureMessage(event) {
    const value = event.target.value;

    setMessage(value);

    if (!value.length && submittable) {
      setSubmittable(false);
    } else if (value.length && !submittable) {
      setSubmittable(true);
    }
  }

  function sendConvoMessage() {
    sts.updateConvUserSays(props.activeConvo, props.model, message, props.list);
    setMessage('');
    props.requestOllamaResponse();
  }

  const disabled = !submittable || !props.activeConvo.length || !props.ready;

  return (
    <div class="message-composer-wrapper">
      <textarea value={message} onChange={captureMessage} />
      <button type="button" onClick={sendConvoMessage} disabled={disabled}>send</button>
    </div>
  )
}

export default ConversateForm
