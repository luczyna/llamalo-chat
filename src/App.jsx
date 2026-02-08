import { useState } from 'react'
import NavigationHeader from './components/NavigationHeader.jsx'
import ConversationList from './components/ConversationList.jsx'
import ConversationLog from './components/ConversationLog.jsx'
import ConversateForm from './components/ConversateForm.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>LLamaLO App</h1>
      <NavigationHeader />
      <ConversationList />
      <ConversationLog />
      <ConversateForm />
    </>
  )
}

export default App
