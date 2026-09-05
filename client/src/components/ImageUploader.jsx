import { Button, FileInput } from 'flowbite-react'
import ModalComponent from './ModalComponent'
import { useState } from 'react'

function ImageUploader({ buttonLabel, header }) {
  const [open, setOpen] = useState(false)
  return (
    <ModalComponent open={open} setOpen={setOpen} buttonLabel={buttonLabel} header={header}>
      <div>
        <FileInput id="file-upload" accept="image/*" multiple />
        <Button className="mt-5 bg-linear-to-r from-yellow-500 to-amber-500 text-white hover:bg-linear-to-bl focus:ring-2 focus:ring-amber-300 font-medium rounded-lg text-sm px-5 py-2.5">
          Info
        </Button>

      </div>
    </ModalComponent>
  )
}

export default ImageUploader