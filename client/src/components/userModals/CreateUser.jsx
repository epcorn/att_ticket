import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";

function CreateUser({ creates, setOpen }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      username: "",
      password: "",
      rights: {
        admin: false,
        create: false,
        markDone: false,
        assign: false,
      },
    },
  });

  const submit = async (data) => {
    try {
      await creates.create(data);
      reset();
      if (setOpen) setOpen(false); // Close modal on success
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} autoComplete="off">
      <div>
        <Label>
          User Name
          <TextInput 
            {...register("username")} 
            autoComplete="new-username" 
          />
        </Label>
      </div>
      <div>
        <Label>Password</Label>
        <TextInput 
          type="password" 
          {...register("password")} 
          autoComplete="new-password" 
        />
      </div>
      <div className="grid grid-cols-4 my-3">
        <h3 className="font-semibold col-span-4">Rights</h3>
        <Label className="flex flex-col gap-2 cursor-pointer">
          Admin
          <Checkbox {...register("rights.admin")} />
        </Label>
        <Label className="flex flex-col gap-2 cursor-pointer">
          Create
          <Checkbox {...register("rights.create")} />
        </Label>
        <Label className="flex flex-col gap-2 cursor-pointer">
          MarkDone
          <Checkbox {...register("rights.markDone")} />
        </Label>
        <Label className="flex flex-col gap-2 cursor-pointer">
          Assign
          <Checkbox {...register("rights.assign")} />
        </Label>
      </div>
      <Button type="submit" isPending={creates?.creating} className="mx-auto">
        Add user
      </Button>
    </form>
  );
}

export default CreateUser;