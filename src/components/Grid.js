
const Grid = ( {choices, activeRow, numRights, handleInput, handleKeyPress, setChangeFocus}) => {
  return (
    <div id='wrapper' className="min-w-full min-h-screen mx-auto justify-center items-center text-center bg-slate-300">
    <div className="text-5xl font-bold font-display tracking-wide py-8">WORDLE</div>
    <p><b>Just start typing. Press ENTER to submit.</b></p>
      {
        choices.map((row, index1) => (
          <div key={index1} id={`row${index1 + 1}`}> {
          row.map((letter, index2) => (
          <input
            type="text"
            name={`${index1}${index2}`}
            key={`${index1}${index2}`}
            tabIndex={activeRow + index2 + 1}
            autoFocus={index2 === 0 ? true : false}
            onBlur={() => setChangeFocus((prev) => !prev)}
            onKeyDown={(e) => handleKeyPress(e)}
            className={`font-black text-4xl text-center m-2 w-16 h-16 ${letter ? 'border-4 border-slate-400' : 'focus:border-0 focus:border-slate-400'} caret-transparent ${letter ? 'focus:border-4 focus:border-slate-400' : 'focus:border-0 focus:border-slate-400'} focus:ring-0 focus:outline-0 transition-all`}
            value={letter}
            maxLength="1"
            onChange={(e) => handleInput(e)}
          />
        ))
          }</div>
      ))
      }
      <div className="mt-4 text-sm uppercase font-bold">Number of right guesses: {numRights}</div>
    </div>
  )
}

export default Grid