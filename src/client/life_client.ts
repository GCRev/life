import Evt from './evt'
import Board from './board'

class LifeClient extends Evt {
  boardInit: Board
  boardCurrent: Board
  rate = 4
  cellSize = 32 /* pixels */

  _playState = 'stopped'
  _timerId = 0

  constructor() {
    super()

    this.boardInit = new Board()
    this.boardCurrent = new Board()
  }


  setPlayState(state = this._playState) {
    if (state === this._playState) { return }

    switch (state) {
    case 'playing': {
      /* store the initial state when starting to play, but only if last state was stopped */
      if (this._playState === 'stopped' ) {
        this.boardInit.setState(this.boardCurrent.state.slice())
      }

      const advance = () => {
        if (state !== 'playing') { return }

        this._timerId = window.setTimeout(() => {
          this.boardCurrent.step()
          advance()
        }, 1000 / this.rate)
      }

      advance()
      break
    }
    case 'paused': {
      window.clearTimeout(this._timerId)
      break
    }
    case 'stopped': {
      window.clearTimeout(this._timerId)
      this.boardCurrent.t = 0

      /* 
       * don't need to slice the array here because it'll just be
       * copied on play anyway
       */
      this.boardCurrent.setState(this.boardInit.state)
      break
    }
    }

    this._playState = state

    this.fire('set-play-state', { playState: state })
  }

  play() {
    this.setPlayState('playing')
  }

  pause() {
    this.setPlayState('paused')
  }

  stop() {
    this.setPlayState('stopped')
  }

  playPause() {
    if (this._playState !== 'playing') {
      this.setPlayState('playing')
    } else {
      this.setPlayState('paused')
    }
  }

  resizeBoardFromViewport({ height, width }: { height: number, width: number }) {
    /* both units are in pixels */

    const newHeight = Math.floor(height / this.cellSize)
    const newWidth = Math.floor(width / this.cellSize)

    this.boardCurrent.resizeBoard({ height: newHeight, width: newWidth })
    this.boardInit.resizeBoard({ height: newHeight, width: newWidth })
  }

  setRate(rate: number) {
    if (rate === this.rate) { return }
    this.rate = Math.max(1, Math.min(rate, 10))
    this.fire('set-rate', { rate: this.rate })
  }

  setCellSize(size: number) {
    if (size === this.cellSize) { return }
    this.cellSize = Math.max(8, Math.min(size, 32))
    this.fire('set-cell-size', { cellSize: this.cellSize })
  }

  clearBoard() {
    this.boardCurrent.clear()
  }

}

export default LifeClient
