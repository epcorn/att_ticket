import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react'


function ModalComponent({ open, btn, size = 'sm', setOpen, disabled = false, header = '', children, buttonLabel = '' }) {

  return (
    <div className='m-2'>
      <Button type='button' size={size} disabled={disabled} onClick={() => setOpen(true)} className={`cursor-pointer hover:scale-102 hover:shadow-lg transition-all duration-700 ${btn}`}>{buttonLabel}</Button>
      <Modal dismissible show={open} onClose={() => setOpen(false)} >
        <ModalHeader className='bg-linear-60 from-green-50 from-10% to-green-200'>{header}</ModalHeader>
        <ModalBody className='bg-white'>{children}</ModalBody>
      </Modal>
    </div>
  )
}

export default ModalComponent;
