import { useState, useReducer, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom'
import { gameReducer, initialGameState } from './gameReducer'
import { DEFAULT_POINTS } from './scoring'
import { loadCurrentGame, saveCurrentGame, appendGameToHistory } from './storage'
import GameSetup from './components/GameSetup'
import GameBoard from './components/GameBoard'
import HistoryPage from './components/HistoryPage'

function App() {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState, loadCurrentGame)
  const [playerCount, setPlayerCount] = useState(2)
  const [playerNames, setPlayerNames] = useState(['', ''])
  const [endMode, setEndMode] = useState(initialGameState.endMode)
  const [endValue, setEndValue] = useState(initialGameState.endValue)
  const [pointsConfig, setPointsConfig] = useState(DEFAULT_POINTS)

  const navigate = useNavigate()

  useEffect(() => {
    saveCurrentGame(gameState)
  }, [gameState])

  useEffect(() => {
    if (gameState.status === 'finished' && !gameState.archived) {
      appendGameToHistory(gameState)
      dispatch({ type: 'MARK_ARCHIVED' })
    }
  }, [gameState.status, gameState.archived])

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
    navigate('/game')
  }

  const handleResetGame = () => {
    dispatch({ type: 'RESET_GAME' })
    navigate('/setup')
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4">
      <nav className="w-full max-w-md flex justify-center gap-4 mb-4 text-sm">
        <Link to="/setup" className="text-slate-400 hover:text-emerald-400">
          Setup
        </Link>
        {gameState.status !== 'setup' && (
          <Link to="/game" className="text-slate-400 hover:text-emerald-400">
            Partita
          </Link>
        )}
        <Link to="/history" className="text-slate-400 hover:text-emerald-400">
          Storico
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center w-full">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={gameState.status === 'setup' ? '/setup' : '/game'} replace />}
          />

          <Route
            path="/setup"
            element={
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
            }
          />

          <Route
            path="/game"
            element={
              gameState.status === 'setup' ? (
                <Navigate to="/setup" replace />
              ) : (
                <GameBoard gameState={gameState} dispatch={dispatch} onReset={handleResetGame} />
              )
            }
          />

          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App