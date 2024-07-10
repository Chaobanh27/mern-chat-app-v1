import { useSelector } from 'react-redux'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import Home from '~/pages/Home'
import Login from '~/pages/Login'
import Register from '~/pages/Register'
import { io } from 'socket.io-client'
import { API_ROOT } from './utils/constants'
import SocketContext from './context/SocketContext'

const App = () => {
  const { user } = useSelector((state) => state.user)
  const { access_token } = user
  const URL = API_ROOT.split('/api/v1')[0]

  const socket = io(URL)

  return (
    <SocketContext.Provider value={socket}>
      <div className="dark">
        <Router>
          <Routes>
            <Route
              exact
              path="/"
              element={
                access_token
                  ? <Home /> : <Navigate to="/login" />
              }
            />
            <Route
              exact
              path="/login"
              element={!access_token
                ? <Login /> : <Navigate to="/" />}
            />
            <Route
              exact
              path="/register"
              element={<Register/>}
            />
          </Routes>
        </Router>
      </div>
    </SocketContext.Provider>
  )
}

export default App
