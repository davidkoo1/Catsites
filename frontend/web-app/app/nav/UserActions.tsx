'use client'

import { Button, Dropdown, DropdownItem } from 'flowbite-react'
import { User } from 'next-auth'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { AiFillCar, AiFillTrophy, AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai'
import { HiBell, HiUser } from 'react-icons/hi'
import { HiCog } from 'react-icons/hi2'


type Props = {
  user: Partial<User>
}

export default function UserActions({ user }: Props) {
  return (
    // <button className='bg-white hover:bg-gray-300 text-black font-semibold py-2 px-4 rounded'>
    //   <Link href='/session'>
    //     Session
    //   </Link>
    // </button>
    <Dropdown label={`Welcome ${user.name}`} inline>
      <DropdownItem icon={HiBell}>
        <Link href='/'>
          Notification
        </Link>
      </DropdownItem>
      <DropdownItem icon={HiUser}>
        <Link href='/'>
          My Auctions
        </Link>
      </DropdownItem>
      <DropdownItem icon={AiFillTrophy}>
        <Link href='/'>
          Aucions won
        </Link>
      </DropdownItem>
      <DropdownItem icon={AiFillCar}>
        <Link href='/'>
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
