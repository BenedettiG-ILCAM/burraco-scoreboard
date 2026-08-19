import { useState } from 'react'

const emptyTable = () => ({
  jolly: 0, assi: 0, dieci: 0, cinque: 0,
  burracoReale: 0, burracoPuro: 0, burracoSemipuro: 0, burracoSporco: 0,
})
const emptyHand = () => ({ jolly: 0, assi: 0, dieci: 0, cinque: 0 })

const TABLE_FIELDS = [
  ['jolly', 'Jolly/Pinelle'], ['assi', 'Assi'],
  ['dieci', 'Carte da 10'], ['cinque', 'Carte da 5'],
  ['burracoReale', 'Burraco Reale'], ['burracoPuro', 'Burraco Puro'],
  ['burracoSemipuro', 'Burraco Semipuro'], ['burracoSporco', 'Burraco Sporco'],
]
const HAND_FIELDS = [
  ['jolly', 'Jolly/Pinelle'], ['assi', 'Assi'],
  ['dieci', 'Carte da 10'], ['cinque', 'Carte da 5'],
]

function HandEntryForm({ players, onAddHand }) {
  const makeInitialEntries = () =>
    Object.fromEntries(players.map((p) => [p.id, { table: emptyTable(), hand: emptyHand() }]))

  const [entries, setEntries] = useState(makeInitialEntries)
  const [closedPlayerId, setClosedPlayerId] = useState(players[0]?.id ?? null)
  const [pozzettoMissedIds, setPozzettoMissedIds] = useState([])
  const [error, setError] = useState(null)

  const updateField = (playerId, section, field, value) => {
    setEntries((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [section]: { ...prev[playerId][section], [field]: Number(value) || 0 },
      },
    }))
  }

  // Regola 3: chi chiude non può risultare tra chi non ha preso il pozzetto.
  // Quando cambia il chiuditore, lo rimuovo automaticamente da quella lista.
  const handleClosedPlayerChange = (playerId) => {
    setClosedPlayerId(playerId)
    setPozzettoMissedIds((prev) => prev.filter((id) => id !== playerId))
    setError(null)
  }

  const togglePozzettoMissed = (playerId) => {
    if (playerId === closedPlayerId) return // Regola 3: bottone disabilitato per il chiuditore
    setPozzettoMissedIds((prev) =>
      prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]
    )
  }

  const handSum = (playerId) => {
    const h = entries[playerId].hand
    return h.jolly + h.assi + h.dieci + h.cinque
  }

  const validate = () => {
    // Regola 2: ogni giocatore che NON ha chiuso deve avere almeno una carta in mano segnata
    const missingHandData = players
      .filter((p) => p.id !== closedPlayerId)
      .filter((p) => handSum(p.id) === 0)

    if (missingHandData.length > 0) {
      const names = missingHandData.map((p) => p.name).join(', ')
      return `Inserisci le carte rimaste in mano per: ${names}`
    }
    return null
  }

  const handleSubmit = () => {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    // Il chiuditore non ha carte in mano per definizione: azzero quel campo
    // per sicurezza, indipendentemente da cosa fosse rimasto nello stato locale.
    const cleanedEntries = {
      ...entries,
      [closedPlayerId]: { ...entries[closedPlayerId], hand: emptyHand() },
    }

    onAddHand({ entries: cleanedEntries, closedPlayerId, pozzettoMissedIds })
    setEntries(makeInitialEntries())
    setPozzettoMissedIds([])
    setError(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-slate-400 mb-2">Chi ha chiuso la mano</p>
        <div className="flex flex-wrap gap-2">
          {players.map((p) => (
            <button
              key={p.id}
              onClick={() => handleClosedPlayerChange(p.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                closedPlayerId === p.id
                  ? 'bg-emerald-500 text-slate-900'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-slate-400 mb-2">Chi NON ha preso il pozzetto</p>
        <div className="flex flex-wrap gap-2">
          {players.map((p) => {
            const isCloser = p.id === closedPlayerId
            return (
              <button
                key={p.id}
                onClick={() => togglePozzettoMissed(p.id)}
                disabled={isCloser}
                title={isCloser ? 'Chi chiude ha per forza preso il pozzetto' : undefined}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                  isCloser
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : pozzettoMissedIds.includes(p.id)
                    ? 'bg-red-500 text-slate-900'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {p.name}
              </button>
            )
          })}
        </div>
      </div>

      {players.map((p) => {
        const isCloser = p.id === closedPlayerId
        return (
          <div key={p.id} className="bg-slate-700/50 rounded-lg p-3 space-y-3">
            <p className="font-semibold">
              {p.name} {isCloser && <span className="text-emerald-400 text-xs">(chiude)</span>}
            </p>

            <div>
              <p className="text-xs text-slate-400 mb-1">In tavola</p>
              <div className="grid grid-cols-2 gap-2">
                {TABLE_FIELDS.map(([field, label]) => (
                  <label key={field} className="flex items-center justify-between gap-1 text-xs">
                    <span className="text-slate-300">{label}</span>
                    <input
                      type="number"
                      min="0"
                      value={entries[p.id].table[field]}
                      onChange={(e) => updateField(p.id, 'table', field, e.target.value)}
                      className="w-14 px-1 py-1 rounded bg-slate-600 text-right outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Regola 1: il giocatore che chiude non ha carte in mano, niente sezione da mostrare */}
            {!isCloser && (
              <div>
                <p className="text-xs text-slate-400 mb-1">Rimaste in mano</p>
                <div className="grid grid-cols-2 gap-2">
                  {HAND_FIELDS.map(([field, label]) => (
                    <label key={field} className="flex items-center justify-between gap-1 text-xs">
                      <span className="text-slate-300">{label}</span>
                      <input
                        type="number"
                        min="0"
                        value={entries[p.id].hand[field]}
                        onChange={(e) => updateField(p.id, 'hand', field, e.target.value)}
                        className="w-14 px-1 py-1 rounded bg-slate-600 text-right outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}

      {error && (
        <p className="text-sm text-red-400 bg-red-950/50 rounded-lg px-3 py-2">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        className="w-full py-2 rounded-lg bg-emerald-500 text-slate-900 font-bold hover:bg-emerald-400"
      >
        Registra mano
      </button>
    </div>
  )
}

export default HandEntryForm
