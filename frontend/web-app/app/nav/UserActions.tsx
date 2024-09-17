'use client'

import { useParamsStore } from '@/hooks/useParamsStore'
import { Button, Dropdown, DropdownItem } from 'flowbite-react'
import { User } from 'next-auth'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { AiFillCar, AiFillTrophy, AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai'
import { HiBell, HiHeart, HiUser } from 'react-icons/hi'
import { HiCog } from 'react-icons/hi2'

type Props = {
  user: User
}

export default function UserActions({ user }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const setParams = useParamsStore(state => state.setParams);

  function setWinner() {
    setParams({ winner: user.username, seller: undefined, isInWishlist: undefined });
    if (pathname !== '/') router.push('/');
  }

  function setSeller() {
    setParams({ seller: user.username, winner: undefined, isInWishlist: undefined });
    if (pathname !== '/') router.push('/');
  }

  function setWishlist() {
    setParams({ winner: undefined, seller: undefined, isInWishlist: true });
    if (pathname !== '/') router.push('/');
  }

  return (
    <Dropdown label={`Welcome ${user.name}`} inline>
      <DropdownItem icon={HiUser} onClick={setSeller}>
        My Auctions
      </DropdownItem>
      <DropdownItem icon={HiHeart} onClick={setWishlist}>
        My Wishlist
      </DropdownItem>
      <DropdownItem icon={AiFillTrophy} onClick={setWinner}>
        Auctions Won
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
