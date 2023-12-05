import { Link } from "react-router-dom"
const NotFound = () => {
    return (
        <div className='flex-1 flex flex-col justify-center items-center bg-alert-danger-fg-dark border-alert-danger-fg-light rounded text-white text-lg  py-6'>
            <span>Bir şeyler ters gitti.</span>
            <span className="font-semibold"><Link to="/dashboard">Ana Sayfa</Link></span>
        </div>
    )
}

export default NotFound
