import Evt from './evt'

interface BoardParams extends Evt {
  width?: number
  height?: number
}

class Board extends Evt {
  width = 600 
  height = 400
  /* 
   * I have elected to use numbers here rather than booleans 
   * because this allows for some interesting flexibility in the future
   */
  state: number[]
  t = 0

  constructor(params?: BoardParams) {
    super()

    if (params) {
      Object.assign(this, params)
    }

    this.state = new Array<number>(this.height * this.width).fill(0)
  }

  resizeBoard({ height = this.height, width = this.width }: { height?: number, width?: number}) {
    /* set the new board size and fire an event */

    /* this would be a noop */
    if (this.state.length && height === this.height && width === this.width) { return }

    const widthDiff = width - this.width

    let newState = new Array<number>()
    for (let y = 0; y < height; y++) {
      let row = this.state.slice(y * this.width, (y + 1) * this.width)
      if (widthDiff < 0) {
        row = row.slice(0, width)
      } else { 
        row = row.concat(new Array<number>(widthDiff).fill(0))
      }
      newState = newState.concat(row)
    }

    this.height = height
    this.width = width

    this.setState(newState)
    this.fire('resize-board', { height, width, state: this.state })
  }

  setState(newState: number[]) {
    this.state = newState
    this.fire('set-state', { state: this.state, t: this.t })
  }

  /* run a single step of simulation */
  step(count = 1) {
    
    /*
     *  From Wikipedia: 
     *  Any live cell with two or three live neighbours survives.
     *  Any dead cell with three live neighbours becomes a live cell.
     *  All other live cells die in the next generation. Similarly, all other dead cells stay dead.
     */

    const width = this.width
    const height = this.height

    const newState = this.state.slice()
    for (let c = 0; c < count; c++) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const positionInd = y * width + x 
          const isLive = this.state[positionInd] >= 1
          /* 
           * the 3 x 3 array of adjacent index values to process
           * but skip the middle cell
           */
          const kernel = [
            positionInd - width - 1, positionInd - width, positionInd - width + 1,
            positionInd - 1,  /* notice the skip here */  positionInd + 1,
            positionInd + width - 1, positionInd + width, positionInd + width + 1 
          ]
         
          const liveNeighbors = kernel.reduce((sum, ind) => sum + (this.state[ind] || 0), 0)
          if (!isLive && liveNeighbors === 3) { 
            newState[positionInd] = 1
          } else if (isLive && (liveNeighbors < 2 || liveNeighbors > 3)) {
            newState[positionInd] = 0
          }
        }
      }
      this.t++
    }
    this.setState(newState)
  }

  setCell(index: number, value: number) {
    this.state[index] = value
    this.fire('set-state', { state: this.state, t: this.t })
  }

  toggleCell(index: number) {
    this.state[index] = 1 - this.state[index]
    this.fire('set-state', { state: this.state, t: this.t })
  }

  clear() {
    this.setState(new Array<number>(this.height * this.width).fill(0))
  }
}

export default Board
