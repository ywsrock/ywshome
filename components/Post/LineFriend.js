import Image from 'next/image'
import { XCircleIcon } from '@heroicons/react/outline'

// export default function LineFriend() {
const LineFriend = ({ close }) => {
  return (
    <div className='fixed inline-flex shadow-lg bg-gray-100 dark:bg-gray-400 p-5 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
      <div>
        <XCircleIcon className='flex flex-col justify-center items-center select-none cursor-pointer relative w-5 h-5' onClick={() => close(false)} />
      </div>
      <div>
        <Image
          src='/line-qr.png'
          alt='Line'
          width={200}
          height={200}
        />
      </div>
    </div>
  )
}

export default LineFriend
