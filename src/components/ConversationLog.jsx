import { useContext } from 'react';
import MarkdownView from 'react-showdown';
import AssistantMessageLoading from './AssistantMessageLoading.jsx';
import { ConversationContext } from '../context/ConversationContext.js';

// ConversationLog props
// {
//   removeMessage: delete the message from the conversation
//   wrapperRef: ref data to assign to the wrapper to enable scrolling updates
// }
function ConversationLog(props) {
  const {convolist: list, activeConvoId} = useContext(ConversationContext);
  const activeConvo = list.find(l => l.id === activeConvoId);

  // instead of <pre class="fancycontent">{message.content}</pre>
  const markdownOptions = {
    simpleLineBreaks: true,
    tables: true
  }

  if (activeConvo == undefined) {
    return (
      <div class="messages-wrapper" ref={props.wrapperRef}>
        <p class="empty-message wrapper-center">choose a conversation<br /> or<br />create a new one</p>
      </div>
    )
  } else {
    if (!activeConvo.messages.length) {
      return (
        <div class="messages-wrapper" ref={props.wrapperRef}>
          <p class="empty-message wrapper-center">no messages...</p>
        </div>
      )
    } else if (activeConvo.messages.length) {
      const messages = activeConvo.messages.map((message, i) => {
        const postdate = new Date(message.createdAt);
        const day = postdate.toLocaleDateString(navigator.language, {dateStyle: 'long'});
        const time = postdate.toLocaleTimeString(navigator.language, {timeStyle: 'short'});

        const classnames = ['message-wrapper']
        classnames.push((message.role === 'user') ? 'messagetype-user' : 'messagetype-assistant');

        return <div className={classnames.join(' ')} key={message.id}>
          <header>
            <span>{message.role}{(message.role === 'assistant' && ': ' + message.model)}</span>
            <span>{[day, time].join(', ')}</span>
          </header>

          <div class="message-body">
            {(message.role === 'assistant' && message.activeResponse && !message.content.length) && <AssistantMessageLoading />}
            <MarkdownView markdown={message.content} options={markdownOptions} />
          </div>

          <footer class="text-gray-300 text-sm text-right mt-2 px-4 py-2 hover:text-gray-600">
            <button class="hover:cursor-pointer hover:underline" type="button" onClick={e => {
              props.removeMessage(activeConvo.id, message.id);
            }}>delete</button>
          </footer>
        </div>
      });

      return (
        <div class="messages-wrapper" ref={props.wrapperRef}>
          <div class="wrapper-center">
            {messages}
          </div>
        </div>
      )
    }
  }
}

export default ConversationLog
