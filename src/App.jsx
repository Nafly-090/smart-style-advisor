import React from 'react'
import Nav from './Nav.jsx'
import Fooder from './Fooder.jsx'
import Home from './Home.jsx'
import ImageUpload from './components/ImageUpload.jsx'

const App = () => {
  return (
    <div className='bg-gray-100 min-h-screen'>
      <Nav/>
      <Home/>  
      <Fooder />
    </div>
  )
}

export default App