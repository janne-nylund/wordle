import { useState } from 'react' 

const initialChoices = [
  ['', '', '', '', ''], 
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', '']
]

const secretWords = ['REACT', 'REMIX', 'REDUX', 'CONST', 'ARRAY']

const useWordle = () => {

  const [choices, setChoices] = useState(initialChoices)
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeRow, setActiveRow] = useState(0)
  const [numRights, setNumRights] = useState(0)
  const [secretWord, setSecretWord] = useState([...secretWords[Math.floor(Math.random() * 3 )]])

  const handleInput = (e) => {
    if (e.target.value !== '') {
      // check if input is a letter
      if (/^[a-zA-ZäöåÄÖÅ]+$/.test(e.target.value)) {
        
        const newLetters = choices[activeRow].map((letter, index) => index === activeIndex ? e.target.value.toUpperCase() : letter)
        setChoices(choices.map((choice, index) => index === activeRow ? newLetters : choice ))

        const nextSibling = document.querySelector(`input[name="${activeRow}${activeIndex + 1}"]`)
        return nextSibling ? (nextSibling.focus(), setActiveIndex((prev) => prev + 1)) : null
      }

    } else {
      // this handles delete of last element (it's an onChange event because the value changes from a character to empty) so the focus goes to the right element
      const nextSibling = document.querySelector(`input[name="${activeRow}${activeIndex + 1}"]`)
      return nextSibling ? (nextSibling.focus(), setActiveIndex((prev) => prev + 1)) : null
    } 
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Backspace') {
      handleDelete(e)
    } else if (e.key === 'Enter' && choices[activeRow].every(letter => letter !== '')){
      if (activeRow < 5 ) {
        setActiveRow(prev => prev + 1)
      } else {
        const inputs = Array.from(document.querySelectorAll(`#row${activeRow + 1} input`))
        inputs.forEach(element => {

          const disabledInputs = Array.from(document.querySelectorAll(`input`))
  
            //disable all inputs if guess is correct
            disabledInputs.forEach(item => {
              item.setAttribute("disabled", "");
            })
            
            const winWord = 'SORRY'
            element.style.backgroundColor="red"
            // changing the letters to SORRY!
  
            // sleep function to "trick" setTimeOut to work in loop (otherwise only the first letter gets the timeout)
            const sleep = (milliseconds) => {
              return new Promise(resolve => setTimeout(resolve, milliseconds))
            }
  
            // loop calls sleep() that pauses before input is changed  
            const showWinLetters = async () => {
              for (const input of inputs) {
                // increases the speed for every letter e.g. shorter sleep
                await sleep(600 - (30 * inputs.indexOf(input)));
                input.style.backgroundColor="red" 
                input.value = winWord.charAt(inputs.indexOf(input))
                
              }
            }
  
            // delay for first letter
            setTimeout(() => {
              showWinLetters()
            }, 1000);
            
            setTimeout(() => {
                document.querySelectorAll('#wrapper input').forEach(element => {
                element.style.backgroundColor = "#ffffff"
                element.style.color = "#000000"
                element.style.borderColor = "#94A3B8"
              })
              setActiveRow(0)
              setActiveIndex(0)
              setChoices(initialChoices)
              setSecretWord([...secretWords[Math.floor(Math.random() * 3 )]])
              //remove disabled attribute on reset
              disabledInputs.forEach(item => {
                item.removeAttribute("disabled")
              })
            }, 7000);    
        })
      }
      setActiveIndex(0)

      const inputs = Array.from(document.querySelectorAll(`#row${activeRow + 1} input`))

      // how many of each letter in the secret word
      const secretOccurrances = [secretWord.reduce(function (acc, curr) {
        acc[curr] ? ++acc[curr] : acc[curr] = 1
        return acc
      }, {})];
      
      inputs.forEach((element, index) => {
        // styling of the inputs if match 'green' else 'gray'      
        element.style.color = "#ffffff"
        element.style.borderColor = "#ffffff"
        if (secretWord[index] === element.value) {
          element.style.backgroundColor = "#7DB700"
        } else {
          element.style.backgroundColor = "#999999"
        }
      })

      // ordering the inputs by letter
      const individualInputs = inputs.reduce((acc, curr) => {
        acc[curr.value] ? acc[curr.value].push(curr) :
        acc[curr.value] = [curr]
        return acc
      },{})
      
      Object.entries(individualInputs).forEach(item => {
        // how many of the inputs are already 'green'
        const numGreens = inputs.reduce((acc, curr) => {
          if (curr.value === item[0] && curr.style.backgroundColor === 'rgb(125, 183, 0)') {
            acc++
          }
          return acc
        }, 0)

        // check the limit of how many elements should be colored 'yellow' based on instances in the secret word vs inputs
        // it should always be the lesser of the two e.g not trying to color inputs that doesn't exist
        // when equal the number of 'greens' should also be deducted 
        const limit = secretOccurrances[0][item[0]] > individualInputs[item[0]].length ? individualInputs[item[0]].length 
        : secretOccurrances[0][item[0]] === individualInputs[item[0]].length ? secretOccurrances[0][item[0]] 
        : secretOccurrances[0][item[0]] - numGreens
  
        for (let i = 0; i < limit; i++) {
          if (inputs[inputs.indexOf(item[1][i])].style.backgroundColor !== 'rgb(125, 183, 0)') {
            item[1][i].style.backgroundColor = "#FFE800"
          }
        }      
      })

      inputs.forEach(element => {
        // checkning if guess is correct           
        if (secretWord.every((letter, indx) => letter === choices[activeRow][indx])) {
          const disabledInputs = Array.from(document.querySelectorAll(`input`))

          //disable all inputs if guess is correct
          disabledInputs.forEach(item => {
            item.setAttribute("disabled", "");
          })

          setNumRights(numRights+1)
          element.style.backgroundColor = "#228C22"
          
          const winWord = 'NICE!'

          // changing the letter to NICE!

          // sleep function to "trick" setTimeOut to work in loop (otherwise only the first letter gets the timeout)
          const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
          }

          // loop calls sleep() that pauses before input is changed  
          const showWinLetters = async () => {
            for (const input of inputs) {
              // increases the speed for every letter e.g. shorter sleep
              await sleep(600 - (30 * inputs.indexOf(input)));
              input.value = winWord.charAt(inputs.indexOf(input))
            }
          }

          // delay for first letter
          setTimeout(() => {
            showWinLetters()
          }, 1000);
          
          setTimeout(() => {
              document.querySelectorAll('#wrapper input').forEach(element => {
              element.style.backgroundColor = "#ffffff"
              element.style.color = "#000000"
              element.style.borderColor = "#94A3B8"
            })
            setActiveRow(0)
            setActiveIndex(0)
            setChoices(initialChoices)

            setSecretWord([...secretWords[Math.floor(Math.random() * 3 )]])

            //remove disabled attribute on reset
            disabledInputs.forEach(item => {
              item.removeAttribute("disabled")
            })
          }, 7000);    
        }
      })     
    }  
  }

  const handleDelete = (e) => {
    if (e.key === 'Backspace' && choices[activeRow][activeIndex] !== '' && activeIndex <= 4) {
      
      const newLetters = choices[activeRow].map((letter, index) => index === activeIndex ? '' : letter)
      setChoices(choices.map((choice, index) => index === activeRow ? newLetters : choice ))

      const prevSibling = document.querySelector(
        `input[name="${activeRow}${activeIndex - 1}"]`
      )
      if (prevSibling !== null) {
        prevSibling.focus()
        setActiveIndex((prev) => prev - 1)
      }
      // this is so that the deletion of the first element works (so the focus does not go outside => -1)
    } else if (e.key === 'Backspace' && choices[activeRow][activeIndex - 1] !== '' && activeIndex > 0) {
      
      const newLetters = choices[activeRow].map((letter, index) => index === activeIndex - 1 ? '' : letter)
      setChoices(choices.map((choice, index) => index === activeRow ? newLetters : choice ))

      const prevSibling = document.querySelector(
        `input[name="${activeRow}${activeIndex - 1}"]`
      )
      if (prevSibling !== null) {
        prevSibling.focus()
        setActiveIndex((prev) => prev - 1)
      }
    }
  }

  return [ choices, activeIndex, activeRow, numRights, handleInput, handleKeyPress ]
}

export default useWordle