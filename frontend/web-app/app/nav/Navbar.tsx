/*export default function Navbar() {
    return (
        <div>
            JSX/TSX
        </div>
    )
}*/

//rfc
import React from 'react';
import Search from './Search';
import Logo from './Logo';

export default function Navbar() {
  return (
    <header className='sticky top-0 z-50 flex justify-between bg-black p-4 items-center text-gray-300 shadow-xl'>
      <Logo />
      <Search />

      <button className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded'>Login</button>
    </header>
  );
}





