import { CircleX } from 'lucide-react'

/**
 * Error Component
 * 
 * Displays an error message with a red styled container and an icon.
 * Props:
 * - error (string): The error message text to display.
*/

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
