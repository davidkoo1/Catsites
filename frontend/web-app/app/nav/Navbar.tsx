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
import LoginButton from './LoginButton';

export default function Navbar() {
  return (
    <header className='sticky top-0 z-50 flex justify-between bg-black p-4 items-center text-gray-300 shadow-xl'>
      <Logo />
      <Search />
      <LoginButton />
    </header>
  );
}





