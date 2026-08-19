import { useState, useReducer } from 'react'
import { gameReducer, initialGameState } from './gameReducer'
import { DEFAULT_POINTS } from './scoring'
import GameSetup from './components/GameSetup'
import GameBoard from './components/GameBoard'

function App() {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState)
  const [playerCount, setPlayerCount] = useState(2)
  const [playerNames, setPlayerNames] = useState(['', ''])
  const [endMode, setEndMode] = useState(initialGameState.endMode)
  const [endValue, setEndValue] = useState(initialGameState.endValue)
  const [pointsConfig, setPointsConfig] = useState(DEFAULT_POINTS)

  const handlePlayerCountChange = (newCount) => {
    setPlayerCount(newCount)
    setPlayerNames((prevNames) =>
      Array.from({ length: newCount }, (_, i) => prevNames[i] || '')
    )
  }

  const handleNameChange = (index, value) => {
    setPlayerNames((prevNames) => {
      const updated = [...prevNames]
      updated[index] = value
      return updated
    })
  }

  const handleEndModeChange = (mode) => {
    setEndMode(mode)
    setEndValue(mode === 'score' ? 2000 : 5)
  }

  const handleStartGame = () => {
    dispatch({
      type: 'START_GAME',
      payload: { names: playerNames, endMode, endValue, pointsConfig },
    })
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      {gameState.status === 'setup' ? (
        <GameSetup
          playerCount={playerCount}
          playerNames={playerNames}
          endMode={endMode}
          endValue={endValue}
          pointsConfig={pointsConfig}
          onPlayerCountChange={handlePlayerCountChange}
          onNameChange={handleNameChange}
          onEndModeChange={handleEndModeChange}
          onEndValueChange={setEndValue}
          onPointsConfigChange={setPointsConfig}
          onStartGame={handleStartGame}
        />
      ) : (
        <GameBoard gameState={gameState} dispatch={dispatch} />
      )}
    </div>
  )
}

export default App
