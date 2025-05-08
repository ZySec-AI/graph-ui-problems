import { forwardRef } from "react"

interface FileUploadProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(({ onChange }, ref) => {
  return <input type="file" ref={ref} onChange={onChange} accept=".json" className="hidden" />
})

FileUpload.displayName = "FileUpload"
