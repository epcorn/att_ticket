import { Label, TextInput } from 'flowbite-react'

function FormInput({ label, type = "text", register, readOnly = false, errors, value, id, required = true }) {
  return (
    <div>
      <Label>
        <span>{label}</span>
        {required &&
          <span className="text-red-500">*</span>
        }
        {errors?.[id] && (
          <span className="text-xs text-red-600 font-medium">
            {" "}
            --Required--
          </span>
        )}
      </Label>
      <TextInput
        type={type}
        readOnly={readOnly}
        value={value}
        {...register(id, { required: required })}
      />
      {errors[id] && (
        <span className="text-xs text-red-500">This field is required</span>
      )}
    </div>
  )
}

export default FormInput