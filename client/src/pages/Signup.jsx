import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const Signup = (props) => {
    const { setAuthUser } = props

    const [fullname, setFullname] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (!fullname || !username || !password || !confirmPassword) {
            console.log('Please fill in all fields')
            toast.error('please fill all details')
            setLoading(false)

            return
        }

        if (password !== confirmPassword) {
            console.log('Passwords do not match')
            toast.error('password do not match')
            setLoading(false)
            return
        }

        if (password.length < 6) {
            console.log('Password must be at least 6 characters')
            toast.error('password must be at least 6 characters')
            setLoading(false)
            return
        }

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullname,
                    username,
                    password,
                    confirmPassword,
                }),
            })

            const data = await res.json()
            if (data.error) {
                throw new Error(data.error)
            }
            localStorage.setItem('chat-user', JSON.stringify(data))
            setAuthUser(data)
        } catch (error) {
            console.log(error.message)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='border-2 border-lightsky flex flex-col rounded-xl items-center justify-center min-w-96 mx-auto'>
            <div className='w-full p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-sm bg-opacity-0'>
                <h1 className='text-3xl font-bold text-center mx-auto mb-5 text-lightsky'>
                    Sign Up
                </h1>
                <form className='flex flex-col gap-4' onSubmit={handleSignup}>
                    <div className='flex flex-col'>
                        <input
                            type='text'
                            placeholder='Full Name'
                            className='w-full rounded-lg p-2 bg-midnight text-sky placeholder-ocean border border-none focus:outline-none focus:border-sky focus:ring-2 focus:ring-sky'
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                        />
                    </div>

                    <div className='flex flex-col'>
                        <input
                            type='text'
                            placeholder='Username'
                            className='w-full rounded-lg p-2 bg-midnight text-sky placeholder-ocean border border-none focus:outline-none focus:border-sky focus:ring-2 focus:ring-sky'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className='flex flex-col'>
                        <input
                            type='password'
                            placeholder='Password'
                            className='w-full rounded-lg p-2 bg-midnight text-sky placeholder-ocean border border-none focus:outline-none focus:border-sky focus:ring-2 focus:ring-sky'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className='flex flex-col'>
                        <input
                            type='password'
                            placeholder='Confirm Password'
                            className='w-full rounded-lg p-2 bg-midnight text-sky placeholder-ocean border border-none focus:outline-none focus:border-sky focus:ring-2 focus:ring-sky'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <Link
                        to='/login'
                        className=' w-fit text-sky hover:text-ocean'
                    >
                        Already have an account?
                    </Link>

                    {loading ? (
                        <button
                            type='submit'
                            className='disabled w-full py-2 rounded-lg bg-ocean text-midnight font-bold hover:bg-deepsea '
                        >
                            <h1 className='m-auto'>
                                <i className='fa-solid fa-spinner animate-spin'></i>
                            </h1>
                        </button>
                    ) : (
                        <button
                            type='submit'
                            className='w-full py-2 rounded-lg bg-ocean text-midnight font-bold hover:bg-deepsea '
                        >
                            Sign Up
                        </button>
                    )}
                </form>
            </div>
        </div>
    )
}

export default Signup
