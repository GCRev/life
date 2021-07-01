import LifeClient from './client/life_client' 
import BoardView from './board_view'
import BoardControls from './board_controls'

import { useState, useEffect } from 'react'

interface AppProps {
  client: LifeClient
}

function App({ client }: AppProps): JSX.Element {

  const [ showControls, setShowControls ] = useState(true)

  return (
    <div>
      <BoardView
        board={ client.boardCurrent }
        client={ client }
      />
      <BoardControls
        board={ client.boardCurrent }
        client={ client }
        open={ showControls }
        setOpen={ setShowControls }
      />
    </div>
  )
}

export default App
