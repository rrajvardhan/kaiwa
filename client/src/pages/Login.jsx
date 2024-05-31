import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const Login = (props) => {
    const { authUser, setAuthUser } = props
    const [loading, setLoading] = useState(false)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()

        if (!username || !password) {
            console.log('fill all fields')
            toast.error('fill all fields')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })

            const data = await response.json()
            if (data.error) {
                throw new Error(data.error)
            }

            //set user
            setAuthUser(data)
            localStorage.setItem('authUser', JSON.stringify(data))
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
                    Login
                </h1>
                <form className='flex flex-col gap-4' onSubmit={handleLogin}>
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

                    <Link
                        to='/signup'
                        className=' w-fit text-sky hover:text-ocean'
                    >
                        Don't have an account? Sign up here.
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
                            Login
                        </button>
                    )}
                </form>
            </div>
        </div>
    )
}

export default Login
