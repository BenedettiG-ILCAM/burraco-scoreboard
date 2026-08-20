import { useState } from 'react'
import PointValueSelect from './PointValueSelect'

const PLAYER_COUNT_OPTIONS = [2, 3, 4, 5, 6]

const POINT_LABELS = {
  jolly: 'Jolly',
  pinella: 'Pinella',
  assi: 'Asso',
  dieci: 'Carta da 8 a K',
  cinque: 'Carta da 3 a 7',
  chiusura: 'Bonus per la chiusura',
  malusPozzetto: 'Malus se non prendi il pozzetto',
  burracoReale: 'Burraco reale',
  burracoPuro: 'Burraco puro',
  burracoSemipuro: 'Burraco semipuro',
  burracoSporco: 'Burraco sporco',
}

function GameSetup({
  playerCount,
  playerNames,
  endMode,
  endValue,
  pointsConfig,
  onPlayerCountChange,
  onNameChange,
  onEndModeChange,
  onEndValueChange,
  onPointsConfigChange,
  onStartGame,
}) {
  const [showPoints, setShowPoints] = useState(false)

  const handlePointChange = (key, value) => {
    onPointsConfigChange({ ...pointsConfig, [key]: value })
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md space-y-5">
      <h1 className="text-2xl font-bold text-center">Burraco Scoreboard</h1>

      <select
        className="w-full px-3 py-2 rounded-lg bg-slate-700 text-slate-300 outline-none focus:ring-2 focus:ring-emerald-500"
        onChange={(e) => onPlayerCountChange(Number(e.target.value))}
        value={playerCount}
      >
        {PLAYER_COUNT_OPTIONS.map((n) => (
          <option key={n} value={n}>
            {n} giocatori/coppie
          </option>
        ))}
      </select>

      <div className="space-y-2">
        {playerNames.map((name, index) => (
          <input
            key={index}
            type="text"
            value={name}
            onChange={(e) => onNameChange(index, e.target.value)}
            placeholder={`Nome giocatore ${index + 1}`}
            className="w-full px-3 py-2 rounded-lg bg-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        ))}
      </div>

      <div>
        <p className="text-sm text-slate-400 mb-2">Fine partita quando</p>
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => onEndModeChange('score')}
            className={`flex-1 px-3 py-2 rounded-lg font-semibold ${
              endMode === 'score'
                ? 'bg-emerald-500 text-slate-900'
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            Soglia punti
          </button>
          <button
            onClick={() => onEndModeChange('hands')}
            className={`flex-1 px-3 py-2 rounded-lg font-semibold ${
              endMode === 'hands'
                ? 'bg-emerald-500 text-slate-900'
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            Numero mani
          </button>
        </div>

        <input
          type="number"
          value={endValue === 0 ? '' : endValue}
          onChange={(e) => {
            const raw = e.target.value
            onEndValueChange(raw === '' ? 0 : Number(raw))
          }}
          className="w-full px-3 py-2 rounded-lg bg-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <p className="text-xs text-slate-500 mt-1">
          {endMode === 'score'
            ? `La partita finisce appena un giocatore supera ${endValue} punti`
            : `La partita finisce dopo ${endValue} mani, vince chi ha più punti`}
        </p>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowPoints((v) => !v)}
          className="text-sm text-emerald-400 underline"
        >
          {showPoints ? 'Nascondi' : 'Personalizza'} punteggi
        </button>

        {showPoints && (
          <div className="mt-3 space-y-2">
            {Object.entries(pointsConfig).map(([key, value]) => (
              <div key={key} className="flex items-top justify-between gap-2">
                <label className="text-sm text-slate-300">{POINT_LABELS[key]}</label>
                <PointValueSelect
                  value={value}
                  onChange={(newValue) => handlePointChange(key, newValue)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onStartGame}
        className="w-full py-2 rounded-lg bg-emerald-500 text-slate-900 font-bold hover:bg-emerald-400"
      >
        Inizia partita
      </button>
    </div>
  )
}

export default GameSetup
