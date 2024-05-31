import Sidebar from '../components/Sidebar'
import MessageContainer from '../components/MessageContainer'
import { useState } from 'react'

const UserHome = (props) => {
    const { authUser, setAuthUser,onlineUsers,socket } = props
    const [selectedConversation, setSelectedConversation] = useState(null)

    return (
        <div className=' w-[850px] h-[500px]  border-2 border-lightsky flex rounded-xl backdrop-filter backdrop-blur-sm bg-opacity-0'>
            <Sidebar
                setAuthUser={setAuthUser}
                selectedConversation={selectedConversation}
                setSelectedConversation={setSelectedConversation}
            />
            <MessageContainer
                authUser={authUser}
                selectedConversation={selectedConversation}
                socket={socket}
                onlineUsers={onlineUsers}
            />
        </div>
    )
}

export default UserHome
