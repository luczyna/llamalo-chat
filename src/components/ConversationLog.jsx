import { useState } from 'react';
import MarkdownView from 'react-showdown';

// ConversationLog props
// {
//   activeConvo: id of the active conversation
//   convoData: data on the convo
//   wrapperRef: ref data to assign to the wrapper to enable scrolling updates
// }
function ConversationLog(props) {
  // instead of <pre class="fancycontent">{message.content}</pre>
  const markdownOptions = {
    simpleLineBreaks: true
  }

  if (props.convoData == undefined) {
    return (
      <div class="messages-wrapper" ref={props.wrapperRef}>
        <p>choose a convo</p>
      </div>
    )
  } else {
    if (!props.convoData.messages.length) {
      return (
        <div class="messages-wrapper" ref={props.wrapperRef}>
          <p>no messages...</p>
        </div>
      )
    } else if (props.convoData.messages.length) {
      const messages = props.convoData.messages.map((message, i) => {
        const postdate = new Date(message.createdAt);
        const day = postdate.toLocaleDateString(navigator.language, {dateStyle: 'long'});
        const time = postdate.toLocaleTimeString(navigator.language, {timeStyle: 'short'});

        const classnames = ['message-wrapper']
        classnames.push((message.role === 'user') ? 'messagetype-user' : 'messagetype-assistant');

        return <div className={classnames.join(' ')} key={message.id}>
          <header>
            <span>{message.role}</span>
            <span>{[day, time].join(', ')}</span>
          </header>
          <div class="message-body">
            <MarkdownView markdown={message.content} options={markdownOptions} />
          </div>
          <footer>
          </footer>
        </div>
      });

      return (
        <div class="messages-wrapper" ref={props.wrapperRef}>
          {messages}
        </div>
      )
    }
  }
}

export default ConversationLog
