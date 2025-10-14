import React from 'react'

import Sidebar from '../components/Sidebar';
import Player from '../components/Player';
import Header from '../components/Header';
import Display from '../components/Display';

const Home = () => {
  return (
    <div className='h-screen bg-black text-white'>
      <Header />
      <div className='h-[88%] flex px-2 pb-1.5 pt-1'>
        <Sidebar />
        <Display />
      </div>
      <Player />
    </div>
  )
}

export default Home