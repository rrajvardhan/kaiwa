import { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import Message from './Message'

const DefaultMessage = () => {
    return (
        <div className='flex items-center justify-center w-full h-full'>
            <div className='px-4 text-center text-lg font-semibold text-lightsky flex flex-col items-center gap-2'>
                <p>Select a chat to start messaging</p>
            </div>
        </div>
    )
}

const Messages = ({ selectedConversation, authUser, socket }) => {
    const [loading, setLoading] = useState(true)
    const [isDisabled, setIsDisabled] = useState(false)

    const [messages, setMessages] = useState([])
    const [msg, setMsg] = useState('')
    const messagesEndRef = useRef(null)

    useEffect(() => {
        socket?.on('newMessage', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage])
        })
        return () => {
            socket?.off('newMessage')
        }
    }, [socket,setMessages,messages])

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const res = await fetch(
                    `/api/message/${selectedConversation._id}`
                )
                const data = await res.json()

                if (data.error) {
                    throw new Error(data.error)
                }

                setMessages(data)
                scrollToBottom()
            } catch (error) {
                console.log(error.message)
            } finally {
                setLoading(false)
            }
        }
        if (selectedConversation) {
            fetchData()
        }
    }, [selectedConversation])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'auto' })
        }
    }

    const handleMsg = async (e) => {
        e.preventDefault()
        if (msg.length === 0) return
        setIsDisabled(true)
        try {
            const res = await fetch(
                `/api/message/send/${selectedConversation._id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: msg,
                        sender: authUser._id,
                    }),
                }
            )
            const data = await res.json()

            if (data.error) {
                throw new Error(data.error)
            }

            setMessages((prevMessages) => [...prevMessages, data])
            setMsg('')
        } catch (error) {
            console.log(error.message)
            toast.error(error.message)
        } finally {
            setIsDisabled(false)
        }
    }

    return (
        <div className='h-full flex flex-col items-center justify-center'>
            {/* Receiver details */}
            <div className='w-full p-2 bg-lightsky text-midnight rounded-md'>
                <span className='text-black mx-2'>To:</span>
                {selectedConversation?.fullname}
            </div>
            {/* Messages */}

            {loading ? (
                <div className='m-auto'>
                    <i className='fa-solid fa-spinner text-lightsky animate-spin'></i>
                </div>
            ) : (
                <div className='w-full h-full max-h-full py-2 overflow-hidden flex flex-col items-center justify-center'>
                    <div className='overflow-auto h-full w-full sb-hidden'>
                        <div className='flex flex-col'>
                            {messages.map((message) => (
                                <Message
                                    message={message}
                                    key={message._id}
                                    authUser={authUser}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </div>
            )}

            {/* Message input */}
            <div className='w-full'>
                <form className='flex items-center' onSubmit={handleMsg}>
                    <input
                        type='text'
                        placeholder='Send message'
                        className='w-full p-2 rounded-l-lg bg-midnight text-sky placeholder-ocean border border-none focus:outline-none break-words text-wrap'
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                    />
                    {isDisabled ? (
                        <button
                            type='submit'
                            className='py-2 px-4 bg-midnight rounded-r-lg hover:bg-sky hover:border-sky disabled:'
                        >
                            <i className='fa-solid fa-spinner animate-spin'></i>
                        </button>
                    ) : (
                        <button
                            type='submit'
                            className='py-2 px-4 bg-midnight rounded-r-lg text-sky hover:text-midnight hover:bg-sky hover:border-sky'
                        >
                            <i className='fa-solid fa-paper-plane'></i>
                        </button>
                    )}
                </form>
            </div>
        </div>
    )
}

const MessageContainer = ({
    selectedConversation,
    authUser,
    socket,
}) => {
    return (
        <div className='flex flex-col w-full p-2'>
            {selectedConversation ? (
                <Messages
                    selectedConversation={selectedConversation}
                    authUser={authUser}
                    socket={socket}
                />
            ) : (
                <DefaultMessage />
            )}
        </div>
    )
}

export default MessageContainer
