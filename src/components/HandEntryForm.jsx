import { useState } from 'react'
import CountSelect from './CountSelect'

const emptyTable = () => ({
  jolly: 0, pinella: 0, assi: 0, dieci: 0, cinque: 0,
  burracoReale: 0, burracoPuro: 0, burracoSemipuro: 0, burracoSporco: 0,
})
const emptyHand = () => ({ jolly: 0, pinella: 0, assi: 0, dieci: 0, cinque: 0 })

const TABLE_FIELDS = [
  ['jolly', 'Jolly'], ['pinella', 'Pinelle'], ['assi', 'Assi'],
  ['dieci', 'Carte da 10'], ['cinque', 'Carte da 5'],
  ['burracoReale', 'Burraco Reale'], ['burracoPuro', 'Burraco Puro'],
  ['burracoSemipuro', 'Burraco Semipuro'], ['burracoSporco', 'Burraco Sporco'],
]
const HAND_FIELDS = [
  ['jolly', 'Jolly'], ['pinella', 'Pinelle'], ['assi', 'Assi'],
  ['dieci', 'Carte da 10'], ['cinque', 'Carte da 5'],
]
const FIELD_INFO = [
  ['jolly', Array.from({ length: 5 }, (_, i) => i)],
  ['pinella', Array.from({ length: 9 }, (_, i) => i)],
  ['assi', Array.from({ length: 9 }, (_, i) => i)],
  ['dieci', Array.from({ length: 26 }, (_, i) => i)],
  ['cinque', Array.from({ length: 26 }, (_, i) => i)],
  ['burracoReale', Array.from({ length: 6 }, (_, i) => i)],
  ['burracoPuro', Array.from({ length: 6 }, (_, i) => i)],
  ['burracoSemipuro', Array.from({ length: 6 }, (_, i) => i)],
  ['burracoSporco', Array.from({ length: 6 }, (_, i) => i)],
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
        [section]: { ...prev[playerId][section], [field]: value },
      },
    }))
  }

  const handleClosedPlayerChange = (playerId) => {
    setClosedPlayerId(playerId)
    setPozzettoMissedIds((prev) => prev.filter((id) => id !== playerId))
    setError(null)
  }

  const togglePozzettoMissed = (playerId) => {
    if (playerId === closedPlayerId) return
    setPozzettoMissedIds((prev) =>
      prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]
    )
  }

  const handSum = (playerId) => {
    const h = entries[playerId].hand
    return h.jolly + h.pinella + h.assi + h.dieci + h.cinque
  }

  const validate = () => {
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
              {p.name} {isCloser && <span className="text-emerald-400 text-xs">(Chiude!)</span>}
            </p>

            <div>
              <p className="text-xs text-slate-400 mb-1">Ha messo in tavola:</p>
              <div className="grid grid-cols-2 gap-2 gap-y-3">
                {TABLE_FIELDS.map(([field, label]) => (
                  <label key={field} className="flex items-center justify-between gap-1 text-xs">
                    <span className="text-slate-300">{label}</span>
                    <CountSelect
                      value={entries[p.id].table[field]}
                      onChange={(v) => updateField(p.id, 'table', field, v)}
                      countOptions={FIELD_INFO.find(([f]) => f === field)?.[1] || Array.from({ length: 26 }, (_, i) => i)}
                    />
                  </label>
                ))}
              </div>
            </div>

            {!isCloser && (
              <div>
                <p className="text-xs text-slate-400 mb-1">Sono rimaste in mano:</p>
                <div className="grid grid-cols-2 gap-2">
                  {HAND_FIELDS.map(([field, label]) => (
                    <label key={field} className="flex items-center justify-between gap-1 text-xs">
                      <span className="text-slate-300">{label}</span>
                      <CountSelect
                        value={entries[p.id].hand[field]}
                        onChange={(v) => updateField(p.id, 'hand', field, v)}
                        countOptions={FIELD_INFO.find(([f]) => f === field)?.[1] || Array.from({ length: 21 }, (_, i) => i)}
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
