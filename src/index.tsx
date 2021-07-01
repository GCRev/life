import './index.css'
import ReactDOM from 'react-dom'
import App from './app'

import LifeClient from './client/life_client'

declare global {
  interface Window { lifeClient: LifeClient }
}

const lifeClient = new LifeClient()
window.lifeClient = lifeClient

setTimeout(() => {
  lifeClient.boardCurrent.setCell(549, 1)
  lifeClient.boardCurrent.setCell(550, 1)
  lifeClient.boardCurrent.setCell(551, 1)
})

ReactDOM.render(
  <App client={ lifeClient } />,
  document.getElementById('root')
)
