import { useState, useEffect } from 'react'

// custom hook to handle logic
import useWordle from './hooks/useWordle'

import Grid from './components/Grid'

import './App.css'


function App() {
  // state to trigger focus change to new input field
  const [changeFocus, setChangeFocus] = useState(true)
  
  const [ choices, activeIndex, activeRow, numRights, handleInput, handleKeyPress ] = useWordle()

  useEffect(() => {
    // set forcus to right input on re-render
    document.querySelector(`input[name="${activeRow}${activeIndex}"]`).focus()
  }, [changeFocus, activeIndex, activeRow])

  return (
    <Grid 
      choices = {choices}
      activeIndex = {activeIndex}
      activeRow = {activeRow}
      numRights = {numRights}
      handleInput = {handleInput}
      handleKeyPress = {handleKeyPress}
      setChangeFocus = {setChangeFocus}
    />
  )
}

export default App