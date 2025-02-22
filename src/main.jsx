import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { UserNotificationProvider } from './context/UserNotificationContext.jsx'
// import { AuthProvider } from './context/AuthProvider.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <NotificationProvider>
    <UserNotificationProvider>

    <BrowserRouter>
    <App />
    </BrowserRouter>
 
 
    </UserNotificationProvider >
    </NotificationProvider>
  
  </StrictMode>
)
