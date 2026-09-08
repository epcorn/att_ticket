import { Button, FileInput } from "flowbite-react";
import ModalComponent from "./ModalComponent";
import { useState } from "react";
import { toast } from "react-toastify";

function ImageUploader({
  buttonLabel,
  header,
  register,
  id = "images",
  required = false,
  errors = {},
  handleSubmit,
  upload,
  uploading,
  open,
  setOpen,
  disabled = false,
  btn = "bg-grad-rose",
}) {
  const [localOpen, setLocalOpen] = useState(false);

  // Fallback to local state if external modal control isn't provided
  const isModalOpen = open !== undefined ? open : localOpen;
  const handleSetOpen = setOpen || setLocalOpen;

  const handleFormSubmit = async (data) => {
    try {
      const files = data[id];
      if (!files || files.length === 0) {
        toast.error("Please select a file first");
        return;
      }

      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });

      if (upload) {
        const res = await upload(formData);

        const result = typeof res?.json === "function" ? await res.json() : res;
        console.log(result)
        toast.success("Image uploaded successfully!");
      }
      handleSetOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Error in image upload");
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
      <form onSubmit={handleSubmit ? handleSubmit(handleFormSubmit) : undefined} className="space-y-4 bg-linear-to-bl from-gray-800 to-gray-50 p-5 rounded-2xl">
        <div>
          <FileInput
            id={id}
            disabled={disabled}
            {...register(id, { required: required ? "File upload required" : false })}
            accept="image/*"
            multiple
          />
          {errors?.[id] && (
            <p className="text-red-600 text-sm mt-1">{errors[id]?.message || "File upload required"}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={uploading}
          className="mt-3 bg-linear-90 from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 font-medium rounded-lg text-sm px-4 py-2"
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </form>
    </ModalComponent>
  );
}

export default ImageUploader;