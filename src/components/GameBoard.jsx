import HandEntryForm from './HandEntryForm'
import HandHistory from './HandHistory'

function GameBoard({ gameState, dispatch }) {
  const { players, status, winnerId, hands } = gameState

  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore)

  const handleAddHand = (payload) => {
    dispatch({ type: 'ADD_HAND', payload })
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md space-y-5">
      <h2 className="text-xl font-bold text-center">
        {status === 'finished' ? 'Partita finita!' : 'Partita in corso'}
      </h2>

      <div className="space-y-1">
        {sortedPlayers.map((p) => (
          <div
            key={p.id}
            className={`flex justify-between px-3 py-2 rounded-lg ${
              p.id === winnerId ? 'bg-emerald-500 text-slate-900 font-bold' : 'bg-slate-700'
            }`}
          >
            <span>{p.name} {p.id === winnerId && '🏆'}</span>
            <span className="font-mono" style={{fontSize: '1.25rem'}}>
              {p.totalScore}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500 text-center">Mani giocate: {hands.length}</p>

      {status === 'playing' && (
        <HandEntryForm players={players} onAddHand={handleAddHand} />
      )}

      <div>
        <p className="text-sm text-slate-400 mb-2">Storico mani</p>
        <HandHistory hands={hands} players={players} />
      </div>

      <button
        onClick={() => dispatch({ type: 'RESET_GAME' })}
        className="w-full text-sm text-slate-400 underline"
      >
        {status === 'finished' ? 'Nuova partita' : 'Annulla partita'}
      </button>
    </div>
  )
}

export default GameBoard
