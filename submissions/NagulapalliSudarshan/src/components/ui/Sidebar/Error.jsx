import React from 'react'
import { CircleX } from 'lucide-react'

const Error = ({ error }) => {
  return (
    <div className="m-2 text-red-500 text-sm p-2 border border-red-500 rounded-md flex items-center gap-2">
        <CircleX size={26} />
        <span>
            {error}
        </span>
    </div>
  )
}

export default Error;
