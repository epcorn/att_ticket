import { Button, Checkbox, Label, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { toast } from "react-toastify";

import { useAddUser, useGetUsers, useUpdateUser } from "../api/useUser";
import { TableError, TableLoading } from "../components/TableStats";
import CreateUser from "../components/userModals/CreateUser";
import ModalComponent from "../components/ModalComponent";
import EditUser from "../components/userModals/EditUser";
import { useMyStore } from "../store/useStore";

const rights = ['admin', 'markDone', 'assign', 'create'];

function Users() {
  const { data: users, isFetching, isError } = useGetUsers({ retry: 4 });
  const { mutateAsync: update, isPending: updating } = useUpdateUser();
  const { mutateAsync: create, isPending: creating } = useAddUser();

  const { setToggle, id, status } = useMyStore();
  console.log(users)

  return (
    <>
      <div className="outline-4 m-5 p-2 rounded-2xl outline-amber-600">
        <ModalComponent
          open={id === 'create' && status}
          setOpen={(isOpen) => setToggle('create', isOpen)}
          header="Create User"
          buttonLabel="Add Users"
          btn="bg-amber-600 hover:bg-amber-800"
          size="md"
        >
          <CreateUser
            creates={{ create, creating }}
            setOpen={(isOpen) => setToggle('create', isOpen)}
          />
        </ModalComponent>
      </div>
      <div className="mx-10 md:mx-22 mt-12 overflow-x-auto">
        <Table className="table-auto w-full">
          <TableHead className="sticky top-0">
            <TableRow className="[&_th]:bg-neutral-300 text-sm text-center">
              <TableHeadCell>User</TableHeadCell>
              <TableHeadCell>Rights</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y divide-gray-400">
            {isError ? (
              <TableError count={3} />
            ) : isFetching ? (
              <TableLoading count={3} yes={false} />
            ) : !users?.length ? (
              <TableRow>
                <TableCell colSpan={3} className="p-5 text-center">
                  No users Found! refresh page
                </TableCell>
              </TableRow>
            ) : (
              users?.map((user) => (
                <TableRow key={user._id} className="text-center">
                  {/* User Name */}
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    {user?.username || ""}
                  </TableCell>

                  {/* Rights/Permissions Layout */}
                  <TableCell>
                    <div className="flex items-center justify-end gap-6 py-2">
                      {rights.map((r) => {
                        const uniqueId = `${user._id}-${r}`;
                        return (
                          <div key={r} className="flex flex-col items-center gap-1.5">
                            <Checkbox
                              id={uniqueId}
                              disabled
                              checked={!!user?.rights?.[r]}
                              readOnly
                            />
                            <Label htmlFor={uniqueId} className="capitalize text-xs cursor-pointer select-none">
                              {r === 'markDone' ? 'Mark Done' : r}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex gap-2 items-center justify-end">
                      <ModalComponent
                        header="Edit User"
                        buttonLabel="Edit"
                        pill outline
                        open={id === `${user?._id}edit` && status}
                        setOpen={(isOpen) => setToggle(`${user?._id}edit`, isOpen)}
                      >
                        <EditUser user={user} update={{ update, updating }} />
                      </ModalComponent>
                      <Button pill outline color={user?.active ? "yellow" : "green"} className="transition-all duration-700 cursor-pointer"
                        onClick={async () => {
                          try {
                            await update({ creds: { active: !user.active }, id: user._id })
                            toast.success("user updated")
                          } catch (error) {
                            console.error(error);
                            toast.error("user update failed")
                          }

                        }}
                      >
                        {!user?.active ? "Activate" : "Deactivate"}
                      </Button>
                      <Button pill outline size="sm" color="red" className="transition-all duration-700 cursor-pointer" onClick={() => alert("this feature is not available")}>Remove</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default Users;