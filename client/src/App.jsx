import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import io from 'socket.io-client'

import Login from './pages/Login'
import Signup from './pages/Signup'
import UserHome from './pages/UserHome'
import { useEffect, useState } from 'react'

function App() {
    const [authUser, setAuthUser] = useState(
        JSON.parse(localStorage.getItem('authUser')) || null
    )

    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState()

    useEffect(() => {
        if (authUser) {
            const socket = io('http://localhost:3000', {
                query: {
                    userId: authUser._id,
                },
            })
            setSocket(socket)

            socket.on('getOnlineUsers', (users) => {
                setOnlineUsers(users)
            })

            return () => {
                socket.close()
            }
        } else {
            if (socket) {
                socket.close()
                setSocket(null)
            }
        }
    }, [])

    return (
        <div className='p-4 h-screen flex items-center justify-center'>
            <Routes>
                <Route
                    path='/'
                    element={
                        authUser ? (
                            <UserHome
                                authUser={authUser}
                                setAuthUser={setAuthUser}
                                socket={socket}
                                onlineUsers={onlineUsers}
                            />
                        ) : (
                            <Navigate to='/login' />
                        )
                    }
                />
                <Route
                    path='/signup'
                    element={
                        authUser ? (
                            <Navigate to='/' />
                        ) : (
                            <Signup
                                authUser={authUser}
                                setAuthUser={setAuthUser}
                            />
                        )
                    }
                />
                <Route
                    path='/login'
                    element={
                        !authUser ? (
                            <Login
                                authUser={authUser}
                                setAuthUser={setAuthUser}
                            />
                        ) : (
                            <Navigate to='/' />
                        )
                    }
                />
            </Routes>
            <Toaster />
        </div>
    )
}

export default App
