/*export default function Navbar() {
    return (
        <div>
            JSX/TSX
        </div>
    )
}*/

//rfc
import React from 'react';
import { AiFillCar } from 'react-icons/ai';

export default function Navbar() {
  return (
    <header className='sticky top-0 z-50 flex justify-between bg-black p-4 items-center text-gray-300 shadow-xl'>
      <div className='flex items-center gap-2 text-3xl font-bold'>
        <AiFillCar size={30} />
        <div>Carsities Auctions</div>
      </div>
      <div>
        <input type="search" placeholder="Search..." className="w-80 form-input rounded-xl text-black p-2" />
      </div>
      
      <button className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded'>Login</button>
    </header>
  );
}





