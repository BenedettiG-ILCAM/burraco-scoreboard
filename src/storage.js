const CURRENT_GAME_KEY = 'burraco-current-game'
const HISTORY_KEY = 'burraco-game-history'

export function loadCurrentGame(initialState) {
  try {
    const raw = localStorage.getItem(CURRENT_GAME_KEY)
    return raw ? JSON.parse(raw) : initialState
  } catch (err) {
    console.error('Impossibile leggere la partita salvata:', err)
    return initialState
  }
}

export function saveCurrentGame(state) {
  try {
    localStorage.setItem(CURRENT_GAME_KEY, JSON.stringify(state))
  } catch (err) {
    console.error('Impossibile salvare la partita:', err)
  }
}

export function loadGameHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('Impossibile leggere lo storico:', err)
    return []
  }
}

export function appendGameToHistory(game) {
  try {
    const history = loadGameHistory()
    history.push(game)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch (err) {
    console.error('Impossibile aggiornare lo storico:', err)
  }
}