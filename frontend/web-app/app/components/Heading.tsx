import React from 'react'

type Props = {
    title: string
    subtitle?: string
    center?: boolean
    textColor?: string
}

export default function Heading({ title, subtitle, center, textColor = 'text-black' }: Props) {
  return (
    <div className={center ? 'text-center' : 'text-start'}>
        <div className={`text-2xl font-bold ${textColor}`}>
            {title}
        </div>
        {subtitle && (
            <div className={`font-light ${textColor} mt-2`}>
                {subtitle}
            </div>
        )}
    </div>
  )
}
