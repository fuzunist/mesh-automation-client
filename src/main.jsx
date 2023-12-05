import ReactDOM from 'react-dom/client'
import './assets/css/globals.css'
import {RouterProvider} from  'react-router-dom'
import routes from './routes/index'

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={routes}>
        </RouterProvider>
    )
