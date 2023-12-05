import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { verify } from '../services/auth'
import { setUser } from '../store/actions/user'


import Loader from '../components/Loader'

const Root = () => {
    const [cookies] = useCookies(['access_token', 'refresh_token'])
    const navigate = useNavigate()
    let beforePathname;
    const verifyHandle = async () => {
         beforePathname = sessionStorage.getItem('beforePathname')
        console.log('verifyHandle - beforePathnam: ', beforePathname)

        if (!cookies?.access_token) return navigate('/auth/login')
        const response = await verify(cookies?.access_token)
        if (response?.error) return navigate('/auth/login')
        setUser({ ...response, tokens: { access_token: cookies.access_token, refresh_token: cookies.refresh_token } })
        navigate(beforePathname ?? '/dashboard')
    }

    useEffect(() => {
        verifyHandle()
    }, [])

    return <Loader className="fixed top-0 left-0 z-[9999]" />
}

export default Root