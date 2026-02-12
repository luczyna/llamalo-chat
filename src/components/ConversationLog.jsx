import { useState } from 'react';

// ConversationLog props
// {
//   activeConvo: id of the active conversation
//   convoData: data on the convo
// }
function ConversationLog(props) {
  // console.log(props.convoData)

  if (props.convoData == undefined) {
    return (
      <div>
        <p>choose a convo</p>
      </div>
    )
  } else {
    if (!props.convoData.messages.length) {
      return (
        <div>
          <p>no messages...</p>
        </div>
      )
    } else if (props.convoData.messages.length) {
      return props.convoData.messages.map((message, i) => {
        const postdate = new Date(message.createdAt);
        const day = postdate.toLocaleDateString(navigator.language, {dateStyle: 'long'});
        const time = postdate.toLocaleTimeString(navigator.language, {timeStyle: 'short'});


        return <div className="message-wrapper" key={message.id}>
          <header>
            <span>{message.role}</span>
            <span>{[day, time].join(', ')}</span>
          </header>
          <div>
            <p>{message.content}</p>
          </div>
          <footer>
          </footer>
        </div>
      });
    }
  }
}

export default ConversationLog
