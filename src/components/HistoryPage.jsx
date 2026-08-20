import { useState, useEffect } from 'react'
import { loadGameHistory, deleteGameFromHistory } from '../storage'

function HistoryPage() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    setHistory(loadGameHistory())
  }, [])

  const handleDelete = (savedAt) => {
    const updated = deleteGameFromHistory(savedAt)
    setHistory(updated)
  }

  if (history.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md text-center text-slate-400">
        Nessuna partita conclusa ancora
      </div>
    )
  }

  const reversedHistory = [...history].reverse()

  return (
    <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md space-y-3">
      <h2 className="text-xl font-bold text-center">Storico partite</h2>

      {reversedHistory.map((game) => {
        const winner = game.players.find((p) => p.id === game.winnerId)
        const sortedPlayers = [...game.players].sort((a, b) => b.totalScore - a.totalScore)

        return (
          <div key={game.savedAt} className="bg-slate-700/50 rounded-lg p-3 space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="font-semibold">
                🏆 {winner ? winner.name : '—'}
              </span>
              <span className="text-xs text-slate-500">{game.hands.length} mani</span>
            </div>
            <div className="space-y-0.5">
              {sortedPlayers.map((p) => (
                <div key={p.id} className="flex justify-between text-slate-300">
                  <span>{p.name}</span>
                  <span className="font-mono">{p.totalScore}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleDelete(game.savedAt)}
              className="w-full mt-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/20 text-red-400 hover:bg-red-500/30"
            >
              Elimina dallo storico
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default HistoryPage