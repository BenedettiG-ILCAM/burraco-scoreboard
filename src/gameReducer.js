import { DEFAULT_POINTS } from './scoring'

export const initialGameState = {
  status: 'setup',
  players: [],
  hands: [],
  endMode: 'score',
  endValue: 2000,
  winnerId: null,
  pointsConfig: DEFAULT_POINTS,
  archived: false,
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME': {
      const { names, endMode, endValue, pointsConfig } = action.payload
      const players = names.map((name, index) => ({
        id: index,
        name: name.trim() || `Giocatore ${index + 1}`,
        totalScore: 0,
      }))
      return {
        ...state,
        status: 'playing',
        players,
        hands: [],
        endMode,
        endValue,
        winnerId: null,
        pointsConfig,
        archived: false,
      }
    }

    case 'ADD_HAND': {
      const { entries, closedPlayerId, pozzettoMissedIds } = action.payload
      const P = state.pointsConfig
      console.log('pointsConfig ricevuto:', P)
      console.log('entries ricevute:', entries)
      const handScores = {}
      const updatedPlayers = state.players.map((player) => {
        const entry = entries[player.id] ?? {
          table: { jolly: 0, pinella:0, assi: 0, dieci: 0, cinque: 0, burracoReale: 0, burracoPuro: 0, burracoSemipuro: 0, burracoSporco: 0 },
          hand: { jolly: 0, pinella: 0, assi: 0, dieci: 0, cinque: 0 },
        }
        const { table, hand } = entry

        let score = 0
        score += table.jolly * P.jolly
        score += table.pinella * P.pinella
        score += table.assi * P.assi
        score += table.dieci * P.dieci
        score += table.cinque * P.cinque
        score += table.burracoReale * P.burracoReale
        score += table.burracoPuro * P.burracoPuro
        score += table.burracoSemipuro * P.burracoSemipuro
        score += table.burracoSporco * P.burracoSporco

        score -= hand.jolly * P.jolly
        score -= hand.pinella * P.pinella
        score -= hand.assi * P.assi
        score -= hand.dieci * P.dieci
        score -= hand.cinque * P.cinque

        if (player.id === closedPlayerId) score += P.chiusura
        if (pozzettoMissedIds.includes(player.id)) score -= P.malusPozzetto
        handScores[player.id] = score

        return { ...player, totalScore: player.totalScore + score }
      })

      const newHands = [...state.hands, { entries, closedPlayerId, pozzettoMissedIds, handScores  }]

      let status = state.status
      let winnerId = state.winnerId

      if (state.endMode === 'score') {
        const overThreshold = updatedPlayers.filter((p) => p.totalScore >= state.endValue)
        if (overThreshold.length > 0) {
          status = 'finished'
          winnerId = overThreshold.reduce((best, p) => (p.totalScore > best.totalScore ? p : best)).id
        }
      } else if (state.endMode === 'hands') {
        if (newHands.length >= state.endValue) {
          status = 'finished'
          winnerId = updatedPlayers.reduce((best, p) => (p.totalScore > best.totalScore ? p : best)).id
        }
      }

      return { ...state, players: updatedPlayers, hands: newHands, status, winnerId }
    }

    case 'RESET_GAME': {
      return initialGameState
    }

    case 'MARK_ARCHIVED': {
      return { ...state, archived: true }
    }
    default:
      return state
  }
}