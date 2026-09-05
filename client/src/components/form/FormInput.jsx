import { Label, TextInput } from 'flowbite-react'

function FormInput({ label, type = "text", register, errors, value, id, required }) {
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
        readOnly
        required
        value={value || ""}
        {...register(id, { required: required })}
      />
    </div>
  )
}

export default FormInput