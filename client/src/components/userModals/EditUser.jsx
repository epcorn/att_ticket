import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

function EditUser({ user, update }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      username: user?.username || "",
      password: "",
      rights: {
        admin: !!user?.rights?.admin,
        create: !!user?.rights?.create,
        markDone: !!user?.rights?.markDone,
        assign: !!user?.rights?.assign,
      },
    },
  });

  // Keep form updated if user prop changes
  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        password: "",
        rights: {
          admin: !!user?.rights?.admin,
          create: !!user?.rights?.create,
          markDone: !!user?.rights?.markDone,
          assign: !!user?.rights?.assign,
        },
      });
    }
  }, [user, reset]);

  const submit = async (data) => {
    try {
      await update.update({ id: user._id, creds: data });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(submit)} >
        <div className="flex flex-col gap-3">
          <Label>
            <span>Enter User Name</span>
            <TextInput {...register("username")} />
          </Label>
          <Label>
            <span>Enter Password</span><span className="text-gray-600"> (leave empty if no changes)</span>
            <TextInput type="password" {...register("password")} placeholder="Leave empty to keep unchanged" />
          </Label>
        </div>

        <div className="flex justify-around my-3">
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

        <Button type="submit" disabled={update?.updating} className="mx-auto mt-4">
          Save
        </Button>
      </form>
    </div>
  );
}

export default EditUser;