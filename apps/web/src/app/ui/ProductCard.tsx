import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface ProductCardProps {
  id: string
  name: string
  category: string
  price: number
  imageUrl: string
}

export function ProductCard({
  id,
  name,
  category,
  price,
  imageUrl
}: ProductCardProps) {
  return (
    <div className='group overflow-hidden rounded-lg bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl'>
      <Link href={`/products/${id}`} className='block'>
        <Image
          src={imageUrl}
          alt={name}
          width={400}
          height={300}
          className='h-48 w-full object-cover'
        />
      </Link>
      <div className='p-4'>
        <h3 className='truncate text-lg font-semibold transition-colors group-hover:text-blue-600'>
          <Link href={`/products/${id}`}>{name}</Link>
        </h3>
        <p className='mt-1 text-sm text-gray-500'>{category}</p>
        <div className='mt-4 flex items-center justify-between'>
          <p className='text-xl font-bold text-blue-700'>
            NT$ {price.toLocaleString()}
          </p>
          <button className='rounded-full p-2 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-500'>
            <HeartIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}>
      <path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' />
    </svg>
  )
}
