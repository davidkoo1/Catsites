'use client'

import { useParamsStore } from '@/hooks/useParamsStore'
import { Button, Dropdown, DropdownItem } from 'flowbite-react'
import { User } from 'next-auth'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { AiFillCar, AiFillTrophy, AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai'
import { HiBell, HiUser } from 'react-icons/hi'
import { HiCog } from 'react-icons/hi2'


type Props = {
  user: User
}

export default function UserActions({ user }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const setParams = useParamsStore(state => state.setParams);

  function setWinner()
  {
    setParams({winner: user.username, seller: undefined})
    if (pathname !== '/') router.push('/');
  }

  function setSeller()
  {
    setParams({winner: undefined, seller: user.username})
    if (pathname !== '/') router.push('/');
  }

  return (
    // <button className='bg-white hover:bg-gray-300 text-black font-semibold py-2 px-4 rounded'>
    //   <Link href='/session'>
    //     Session
    //   </Link>
    // </button>
    <Dropdown label={`Welcome ${user.name}`} inline>
      {/* <DropdownItem icon={HiBell}>
        <Link href='/'>
          Wishlist
        </Link>
      </DropdownItem>
      <DropdownItem icon={HiBell}>
        <Link href='/'>
          Notification
        </Link>
      </DropdownItem> */}
      <DropdownItem icon={HiUser} onClick={setSeller}>
          My Auctions
      </DropdownItem>
      <DropdownItem icon={AiFillTrophy} onClick={setWinner}>
          Aucions won
      </DropdownItem>
      <DropdownItem icon={AiFillCar}>
        <Link href='/auctions/create'>
          Sell my car
        </Link>
      </DropdownItem>
      <DropdownItem icon={HiCog}>
        <Link href='/session'>
          Session (dev only)
        </Link>
      </DropdownItem>
      <Dropdown.Divider />
      <DropdownItem icon={AiOutlineLogout} onClick={() => signOut({ callbackUrl: '/' })}>
        Sign out
      </DropdownItem>
    </Dropdown>
  )
}
