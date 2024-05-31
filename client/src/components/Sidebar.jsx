import { useState, useEffect } from 'react'
import Conversation from '../components/Conversation'
import toast from 'react-hot-toast'

const Sidebar = (props) => {
    const { setAuthUser, setSelectedConversation, selectedConversation } = props

    const [loading, setLoading] = useState(true)
    const [conv, setConv] = useState([])

    const [search, setSearch] = useState('')

    const handleLogout = () => {
        try {
            console.log('logut')
            localStorage.removeItem('authUser')
            setAuthUser(null)
        } catch (error) {
            console.log(error.message)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchConversations()
    }, [])

    const fetchConversations = async () => {
        try {
            const res = await fetch('/api/message/get/users')
            const data = await res.json()
            if (data.error) {
                throw new Error(data.error)
            }
            setConv(data)
        } catch (error) {
            console.log(error.message)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()

        if (!search) return
        if (search.length < 3) {
            return toast.error('must be atleast 3 character long')
        }

        const con = conv.find((c) =>
            c.fullname.toLowerCase().includes(search.toLowerCase())
        )
        if (con) {
            setSelectedConversation(con)
            setSearch('')
        } else {
            toast.error('no user found')
        }
    }

    return (
        <div className='h-full w-[400px] flex flex-col items-center border-r border-slate-700 p-2 '>
            {loading ? (
                <h1 className='m-auto'>
                    <i className='fa-solid fa-spinner animate-spin'></i>
                </h1>
            ) : (
                <>
                    {/* search */}
                    <div className='w-full px-1'>
                        <form
                            className='flex items-center'
                            onSubmit={handleSearch}
                        >
                            <input
                                type='text'
                                placeholder='Search...'
                                className='w-full p-2 rounded-l-lg bg-midnight text-sky placeholder-ocean border border-none focus:outline-none'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button
                                type='submit'
                                className='px-3 p-2 bg-midnight rounded-r-lg text-sky hover:text-midnight hover:bg-sky hover:border-sky'
                            >
                                <i className='fa-solid fa-magnifying-glass'></i>
                            </button>
                        </form>
                    </div>

                    {/* conversation */}
                    <div className=' overflow-auto max-h-full h-full w-full flex flex-col my-2 sb-hidden'>
                        {conv.map((conversation) => (
                            <Conversation
                                key={conversation._id}
                                conversation={conversation}
                                isSelected={
                                    selectedConversation?._id ===
                                    conversation._id
                                }
                                setSelectedConversation={
                                    setSelectedConversation
                                }
                            />
                        ))}
                    </div>

                    {/* logout */}
                    <div className=' w-full'>
                        <button className='p-2'>
                            <i
                                className='fa-solid fa-right-from-bracket transform -scale-x-[1] text-lightsky'
                                onClick={handleLogout}
                            ></i>
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Sidebar
