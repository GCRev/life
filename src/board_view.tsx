import Board from './client/board'
import LifeClient from './client/life_client'
import style from './client/style'

import { useState, useEffect, useLayoutEffect, useRef } from 'react'

style(`
  .board-view {
    position: relative;
    height: 100%;
    width: 100%;
    background-color: var(--lt-grey);
    cursor: crosshair;
  }

  .board-view > canvas {
    height: 100%;
    width: 100%;
  }
`)

function renderCanvas({
  ref,
  board
}: {
  ref: HTMLCanvasElement,
  board: Board
}) {
  /* do the re-drawing */
  
  /* clear only at the diff to last locations */

  const ctx = ref.getContext('2d')
  if (!ctx) { return }

  const width = ref.offsetWidth
  const height = ref.offsetHeight

  ref.height = height
  ref.width = width

  const cellWidth = width / board.width
  const cellHeight = height / board.height

  const position = (index: number): number[] => {
    /* get x-y position from index */
    const y = Math.floor(index / board.width) * cellHeight
    const x = (index % board.width) * cellWidth
    return [ x, y ]
  }

  /* draw grid lines */

  ctx.strokeStyle = 'rgba(0, 0, 0, 10%)'

  ctx.beginPath()
  for (let x = 0; x < board.width; x++) {
    ctx.moveTo(x * cellWidth, 0)
    ctx.lineTo(x * cellWidth, height)
  }

  for (let y = 0; y < board.height; y++) {
    ctx.moveTo(0, y * cellHeight)
    ctx.lineTo(width, y * cellHeight)
  }

  ctx.stroke()

  ctx.fillStyle = 'black'

  for (let index = 0; index < board.state.length; index++) {
    if (!board.state[index]) { continue }
    const [ x, y ] = position(index)
    ctx.fillRect(x, y, cellWidth, cellHeight)
  }
}

function getIndex(board: Board, el: HTMLElement, clientX: number, clientY: number) {
  /* back out an index value from the x - y position of the mouse */

  const target = el 

  const cellActualWidth = target.offsetWidth / board.width
  const cellActualHeight = target.offsetHeight / board.height

  const yInd = Math.floor(clientY / cellActualHeight)
  const xInd = Math.floor(clientX / cellActualWidth)
  
  const index = yInd * board.width + xInd
  return index
}


interface BoardViewProps {
  board: Board
  client: LifeClient
}

function BoardView({ board, client }: BoardViewProps): JSX.Element {

  const ref = useRef<HTMLCanvasElement>(null)

  const [ playState, setPlayState ]  = useState(client._playState)

  useEffect(() => {

    const onUpdateBoard = () => {
      if (!ref.current) { return }
      renderCanvas({
        ref: ref.current,
        board
      })
    }

    const onSetState = () => {
      if (!ref.current || playState === 'playing') { return }
      renderCanvas({
        ref: ref.current,
        board
      })
    }

    let animId = -1
    const anim = () => {
      if (!ref.current || playState !== 'playing') { return }

      renderCanvas({
        ref: ref.current,
        board
      })

      animId = window.requestAnimationFrame(anim)
    }

    const onSetPlayState = ({ playState: state }: { playState: string }) => {
      setPlayState(state)
      if (state === 'playing') {
        anim()
      } else {
        window.cancelAnimationFrame(animId)
      }
    }

    board.on('resize-board', onUpdateBoard)
    board.on('set-state', onSetState)
    client.on('set-play-state', onSetPlayState)

    if (playState === 'playing') {
      anim()
    }

    return () => {
      board.on('resize-board', onUpdateBoard)
      board.un('set-state', onSetState)
      client.un('set-play-state', onSetPlayState)
      window.cancelAnimationFrame(animId)
    }

  }, [ board, client, playState ])

  useLayoutEffect(() => {
    /* resize the board based on current viewport */

    if (!ref.current) { return }

    const current = ref.current

    const onUpdateBoard = () => {
      const width = current.offsetWidth
      const height = current.offsetHeight
      client.resizeBoardFromViewport({ width, height })
    }

    const resizeObserver = new ResizeObserver(onUpdateBoard)

    resizeObserver.observe(current)

    if (ref.current) {
      renderCanvas({
        ref: ref.current,
        board
      })
    }

    client.on('set-cell-size', onUpdateBoard)

    return () => {
      client.un('set-cell-size', onUpdateBoard)
      resizeObserver.unobserve(current)
    }
  })

  const handleOnMouseDown = (evt: React.MouseEvent) => {

    const target = evt.target as HTMLDivElement

    const startIndex = getIndex(board, target, evt.clientX, evt.clientY)
    const startValue = 1 - board.state[startIndex]

    board.setCell(getIndex(board, target, evt.clientX, evt.clientY), startValue)

    const handleOnMouseMove = (evt: MouseEvent) => {
      board.setCell(getIndex(board, target, evt.clientX, evt.clientY), startValue)
    }

    const handleOnMouseUp = () => {
      window.removeEventListener('mousemove', handleOnMouseMove)
    }

    window.addEventListener('mousemove', handleOnMouseMove)
    window.addEventListener('mouseup', handleOnMouseUp, { once: true })
  }

  return (
    <div 
      className="board-view"
      onMouseDown={ handleOnMouseDown }
    >
      <canvas ref={ ref }/>
    </div>
  )
}

export default BoardView
