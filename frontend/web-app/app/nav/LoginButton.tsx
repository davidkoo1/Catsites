'use client'

import { Button } from 'flowbite-react'
import { signIn } from 'next-auth/react'
import React from 'react'

export default function LoginButton() {
  return (
    <button onClick={() => signIn('id-server', { callbackUrl: '/' })} className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded'>
      Login
    </button>
  )
}
