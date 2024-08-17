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
import { getCurrentUser } from '../actions/authActions';
import UserActions from './UserActions';

export default async function Navbar() {

  const user = await getCurrentUser();

  return (
    <header className='sticky top-0 z-50 flex justify-between bg-black p-4 items-center text-gray-300 shadow-xl'>
      <Logo />
      <Search />
      {user ? (
        <UserActions user={user} />
      ) : (
        <LoginButton />
      )}
    </header>
  );
}





