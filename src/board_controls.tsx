import Board from './client/board'
import LifeClient from './client/life_client'
import style from './client/style'

import { 
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  CSSProperties 
} from 'react'

style(`
  .board-controls {
    position: absolute;
    bottom: 0;
    right: 0; 
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5em;
    transform: translate3d(0, 0, 0);
    transition: transform 300ms var(--ease-out);
    pointer-events: none;
  }

  .board-controls.closed {
    transform: translate3d(0, 100%, 0);
  }

  .board-controls > .content {
    position: relative;
    min-width: 500px;
    min-height: 4em;
    padding: 0.5em 1em;
    border-radius: 4px;
    background-color: var(--white);
    box-shadow: 0 0 24px 0 rgba(0, 0, 0, 20%);
    transition: box-shadow 300ms var(--ease-out);
    display: grid;
    grid-template-areas: "stop playpause ratelbl sizelbl clr"
                         "stop playpause rateinp sizeinp clr";
    grid-column-gap: 8px;
    justify-items: center;
    align-items: center;
    pointer-events: all;
  }

  .board-controls.closed > .content {
    box-shadow: 0 0 24px 0 rgba(0, 0, 0, 0%);
  }
  
  .board-controls > .content > .show-button {
    content: "";
    position: absolute;
    top: -0.5em;
    left: 50%;
    transform: translate3d(-50%, -100%, 0);
    background-color: rgba(0, 0, 0, 30%);
    height: 8px;
    width: 64px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 300ms var(--ease-out);
  }

  .board-controls > .content:hover > .show-button {
    background-color: rgba(0, 0, 0, 50%);
  }

  .board-controls.closed > .content > .show-button {
    top: -1em;
  }
  
  .board-button {
    --col: var(--lt-blue-s);
    padding: 0.5em;
    border: 1px solid rgb(var(--col));
    border-radius: 4px;
    min-width: 5em;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .board-button:hover {
    background-color: rgba(var(--col), 30%);
  }
  
  .board-button.playpause {
    grid-area: playpause;
  }

  .board-button.stop {
    --col: var(--red-s);
    grid-area: stop;
  }

`)

interface BoardControlsProps {
  board: Board
  client: LifeClient
  open: boolean
  setOpen?: (open: boolean) => void
}

function BoardControls({ open, setOpen, board, client }: BoardControlsProps): JSX.Element {

  const [ playState, setPlayState ]  = useState(client._playState)
  const [ cellSize, setCellSize ] = useState(client.cellSize)
  const [ rate, setRate ] = useState(client.rate)

  useEffect(() => {
    const onSetPlayState = ({ playState: state }: { playState: string }) => {
      setPlayState(state)
    }

    const onSetRate = ({ rate }: { rate: number }) => {
      setRate(rate)
    }

    const onSetCellSize = ({ cellSize }: { cellSize: number }) => {
      setCellSize(cellSize)
    }

    client.on('set-play-state', onSetPlayState)
    client.on('set-rate', onSetRate)
    client.on('set-cell-size', onSetCellSize)

    return () => {
      client.un('set-play-state', onSetPlayState)
      client.un('set-rate', onSetRate)
      client.un('set-cell-size', onSetCellSize)
    }
  }, [ client ])

  const handleOnClickShowButton = () => {
    setOpen?.(!open)
  }

  const handleOnPlayPause = () => {
    client.playPause()
  }

  const handleOnStop = () => {
    client.stop()
  }

  const handleOnClear = () => {
    client.clearBoard()
  }

  const handleOnChangeRate = (evt: React.ChangeEvent<HTMLInputElement>) => {
    client.setRate(Number(evt.target.value))
  }

  const handleOnChangeSize = (evt: React.ChangeEvent<HTMLInputElement>) => {
    client.setCellSize(Number(evt.target.value))
  }
  
  return (
    <div 
      className={ `board-controls ${open ? '' : 'closed'}` }
    >
      <div className="content">
        <div 
          className="show-button"
          onClick={ handleOnClickShowButton }
        />
        <div
          className={ `board-button stop` }
          onClick={ handleOnStop }
        >
         STOP
        </div>
        <div
          className={ `board-button playpause ${playState}` }
          onClick={ handleOnPlayPause }
        >
          { playState === 'playing' ? 'PAUSE' : 'PLAY' }
        </div>
        <div style = { { gridArea: 'ratelbl' } }>
          RATE
        </div>
        <input 
          style = { { gridArea: 'rateinp' } }
          type="range"
          min="1"
          max="10"
          value={ rate }
          onChange={ handleOnChangeRate }
        />
        <div style = { { gridArea: 'sizelbl' } }>
          CELL SIZE 
        </div>
        <input 
          style = { { gridArea: 'sizeinp' } }
          type="range"
          min="8"
          max="32"
          value={ cellSize }
          onChange={ handleOnChangeSize }
        />
        <div
          style = { { gridArea: 'clr' } }
          className={ `board-button` }
          onClick={ handleOnClear }
        >
          CLEAR
        </div>
      </div>
    </div>
  )
}

export default BoardControls
