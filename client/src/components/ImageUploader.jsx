import { Button, FileInput } from "flowbite-react";
import ModalComponent from "./ModalComponent";
import { useState } from "react";
import { useForm as useLocalForm } from "react-hook-form";
import { toast } from "react-toastify";

function ImageUploader({
  buttonLabel = "Upload Image",
  header = "Upload Image",
  register: externalRegister,
  id = "images",
  required = false,
  errors: externalErrors,
  handleSubmit: externalHandleSubmit,
  upload,
  uploading = false,
  onSuccess,
  open,
  setOpen,
  disabled = false,
  btn = "bg-grad-rose",
}) {
  // Local modal state fallback
  const [localOpen, setLocalOpen] = useState(false);
  const isModalOpen = open !== undefined ? open : localOpen;
  const handleSetOpen = setOpen || setLocalOpen;

  // Local React Hook Form fallback for standalone usage
  const localForm = useLocalForm();
  const register = externalRegister || localForm.register;
  const handleSubmit = externalHandleSubmit || localForm.handleSubmit;
  const errors = externalErrors || localForm.formState.errors;

  const handleFormSubmit = async (data, e) => {
    // Prevent bubbling up if nested inside another <form>
    if (e) e.stopPropagation();

    try {
      const files = data[id];
      if (!files || files.length === 0) {
        toast.error("Please select an image file first");
        return;
      }

      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });

      if (upload) {
        const res = await upload(formData);
        const result = typeof res?.json === "function" ? await res.json() : res;

        toast.success("Image uploaded successfully!");
        
        // Pass result back to parent if callback is supplied
        if (onSuccess) {
          onSuccess(result);
        }
      }

      handleSetOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Error during image upload");
      console.error("Upload error:", error);
    }
  };

  return (
    <ModalComponent
      open={isModalOpen}
      setOpen={handleSetOpen}
      buttonLabel={buttonLabel}
      header={header}
      btn={btn}
      
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSubmit((data) => handleFormSubmit(data, e))(e);
        }}
        className="space-y-4 bg-gradient-to-bl from-gray-800 to-gray-700 p-5 rounded-2xl"
      >
        <div>
          <FileInput
            id={id}
            disabled={disabled || uploading}
            {...register(id, { required: required ? "File upload required" : false })}
            accept="image/*"
            multiple
          />
          {errors?.[id] && (
            <p className="text-red-400 text-sm mt-1">
              {errors[id]?.message || "File upload required"}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={uploading || disabled}
          className="mt-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 font-medium rounded-lg text-sm px-4 py-2"
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </form>
    </ModalComponent>
  );
}

export default ImageUploader;