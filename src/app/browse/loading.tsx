import { Skeleton } from '@/components/ui/skeleton'

export default function BrowseLoading() {
  return (
    <div className='container mx-auto px-4 py-8 lg:px-6'>
      <div className='mb-8 flex flex-col justify-between gap-4 md:flex-row'>
        <div className='space-y-2'>
          <Skeleton className='h-10 w-48' />
          <Skeleton className='h-4 w-24' />
        </div>
        <Skeleton className='h-10 w-[180px]' />
      </div>

      <div className='flex gap-8'>
        {/* Sidebar Skeleton */}
        <div className='hidden w-64 space-y-6 lg:block'>
          <Skeleton className='h-8 w-full' />
          <Skeleton className='h-40 w-full' />
          <Skeleton className='h-40 w-full' />
        </div>

        {/* Grid Skeleton */}
        <div className='grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className='space-y-3'>
              <Skeleton className='h-[200px] w-full rounded-lg' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
