function HandHistory({ hands, players }) {
  if (hands.length === 0) {
    return <p className="text-sm text-slate-500 text-center">Nessuna mano giocata ancora</p>
  }

  const playerName = (id) => players.find((p) => p.id === id)?.name ?? '—'

  // Dalla più recente alla più vecchia: creo un array di indici invertito
  // invece di usare .reverse() direttamente su hands, per non mutare l'array originale
  const reversedHands = [...hands].map((hand, i) => ({ hand, number: i + 1 })).reverse()

  return (
    <div className="space-y-2">
      {reversedHands.map(({ hand, number }) => (
        <div key={number} className="bg-slate-700/50 rounded-lg p-3 text-sm space-y-1">
          <div className="flex justify-between text-slate-300">
            <span className="font-semibold">Mano #{number}</span>
            <span className="text-emerald-400">Chiude: {playerName(hand.closedPlayerId)}</span>
          </div>

          {hand.pozzettoMissedIds.length > 0 && (
            <p className="text-xs text-red-400">
              Pozzetto non preso: {hand.pozzettoMissedIds.map(playerName).join(', ')}
            </p>
          )}

          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 pt-1">
            {players.map((p) => (
              <div key={p.id} className="flex justify-between">
                <span className="text-slate-400">{p.name}</span>
                <span
                  className={`font-mono ${
                    hand.handScores[p.id] >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {hand.handScores[p.id] >= 0 ? '+' : ''}
                  {hand.handScores[p.id]}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default HandHistory