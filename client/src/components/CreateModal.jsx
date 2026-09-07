import {
  Button,
  Label,
  Radio,
  Select,
  Spinner,
  Textarea,
  TextInput,
} from "flowbite-react";
import ImageUploader from "./ImageUploader";
import { useGetContract } from "../api/useContract";
import { useContractStore } from "../store/useContractStore";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useCreateTicket, useUpdateTicket } from "../api/useTicket";
import { timings } from "../utils/constData";

const inputTheme = {
  success: "success",
  error: "failure",
  initial: "info",
};

const modeClr = {
  phone: "bg-linear-20 from-amber-100 to-amber-300",
  email: "bg-linear-20 from-green-100 to-green-300",
  inspection: "bg-linear-20 from-red-100 to-red-300",
};

function CreateModal({ view = false, edit = false, ticket, onClose }) {
  const savedForm = JSON.parse(localStorage.getItem("create_ticket")) || {};

  const { data: contracts, isFetching } = useGetContract({
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: !view && !edit,
  });

  const { mutateAsync: create, isPending: creatingTicket } = useCreateTicket();
  const { mutateAsync: update, isPending: updating } = useUpdateTicket();

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues:
      view || edit
        ? {
          contract: {
            number: ticket?.contract?.number || "",
            billToName: ticket?.contract?.billToName || "",
            billToAddress: ticket?.contract?.billToAddress || "",
            shipToName: ticket?.contract?.shipToName || "",
            shipToAddress: ticket?.contract?.shipToAddress || "",
          },
          complainMode: ticket?.complainMode || "email",
          modeDetails: ticket?.modeDetails || {},
          issue: ticket?.issue || {},
        }
        : { complainMode: "email", ...savedForm },
  });


  const {
    status,
    billToName,
    billToAddress,
    shipToName,
    shipToAddress,
    filterError,
    setFilteredContract,
    resetStore,
    shipToEmail,
    billToEmail,
  } = useContractStore();

  const number = watch("contract.number");
  const complainMode = watch("complainMode");

  const submit = async (data) => {

    try {
      if (edit) {
        if (!data.agent || !data.scheduledDate || !data.scheduledTime) return
        const payload = { agent: data.agent, scheduledDate: data.scheduledDate, scheduledTime: data.scheduledTime, status: data.status }
        await update({ id: ticket._id, data: payload });
        toast.success("Ticket updated");
      }
      if (!view && !edit) {
        await create(data);
      }
      toast.success("Ticket created successfully");
      if (onClose) onClose();
    } catch (error) {
      toast.error("U oooh!!!! ticket creation failed");
      console.error(error);
    }
  };

  // Local storage cache listener
  useEffect(() => {
    if (view || edit) return;

    const subscription = watch((values) => {
      localStorage.setItem("create_ticket", JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [watch, view, edit]);

  // Handle Contract Reset/Fetch
  const fetchContract = async (e) => {
    e.preventDefault();
    resetStore();

    if (contracts?.length && number) {
      setFilteredContract(contracts, number);
    }
  };

  // Reset values when switching ticket prop
  useEffect(() => {
    if ((view || edit) && ticket) {
      reset({
        contract: {
          number: ticket?.contract?.number || "",
          billToName: ticket?.contract?.billToName || "",
          billToAddress: ticket?.contract?.billToAddress || "",
          shipToName: ticket?.contract?.shipToName || "",
          shipToAddress: ticket?.contract?.shipToAddress || "",
        },
        complainMode: ticket?.complainMode || "email",
        modeDetails: ticket?.modeDetails || {},
        issue: ticket?.issue || {},
        agent: ticket?.agent || "",
        scheduledDate: ticket?.scheduledDate || "",
        scheduledTime: ticket?.scheduledTime || "",
        resource: ticket?.resource || "",
      });
    }
  }, [view, edit, ticket, reset]);

  // Sync values from Zustand contract store safely
  useEffect(() => {
    if (view || edit) return;

    if (billToAddress) setValue("contract.billToAddress", billToAddress);
    if (billToName) setValue("contract.billToName", billToName);
    if (shipToAddress) setValue("contract.shipToAddress", shipToAddress);
    if (shipToName) setValue("contract.shipToName", shipToName);
    if (billToEmail) setValue("contract.billToEmail", billToEmail);
    if (shipToEmail) setValue("contract.shipToEmail", shipToEmail);
  }, [
    billToAddress,
    billToEmail,
    billToName,
    shipToEmail,
    shipToAddress,
    shipToName,
    setValue,
    view,
    edit,
  ]);

  return (
    <div className="p-1">
      <form className="space-y-3" onSubmit={handleSubmit(submit, (err) => console.log(err))}>
        <div className="mx-auto w-fit">
          <label htmlFor="contractsearch">Contract No</label>
          <div className="flex gap-4">
            <TextInput
              id="contractsearch"
              type="search"
              placeholder="find Contracts"
              color={inputTheme[status]}
              disabled={view || edit}
              {...register("contract.number", { required: true })}
            />
            {!view && !edit && (
              <Button
                outline
                className="cursor-pointer"
                disabled={isFetching}
                onClick={fetchContract}>
                {isFetching ? "fetching..." : "Fetch"}
              </Button>
            )}
          </div>
          {isFetching && (
            <p className="text-gray-600 animate-pulse font-bold">
              contracts are fetching...
            </p>
          )}
          {filterError && <p className="text-red-600 shake">{filterError}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3 my-5 bg-gray-300 p-2 rounded-md">
          <div>
            <Label>
              <span>BillToName</span>
              <span className="text-red-500">*</span>
              {errors?.contract?.billToName && (
                <span className="text-xs text-red-600 font-medium">
                  {" "}
                  --Required--
                </span>
              )}
            </Label>
            <TextInput
              readOnly
              {...register("contract.billToName", { required: true })}
            />
            <Label>
              BillToAddress<span className="text-red-500">*</span>
              {errors?.contract?.billToAddress && (
                <span className="text-xs text-red-600 font-medium">
                  {" "}
                  --Required--
                </span>
              )}
            </Label>
            <Textarea
              readOnly
              rows={4}
              className="resize-none"
              {...register("contract.billToAddress", { required: true })}
            />
          </div>

          <div>
            <Label>
              Project Name<span className="text-red-500">*</span>
              {errors?.contract?.shipToName && (
                <span className="text-xs text-red-600 font-medium">
                  {" "}
                  --Required--
                </span>
              )}
            </Label>
            <TextInput
              readOnly
              {...register("contract.shipToName", { required: true })}
            />
            <Label>
              Project Address<span className="text-red-500">*</span>
              {errors?.contract?.shipToAddress && (
                <span className="text-xs text-red-600 font-medium">
                  {" "}
                  --Required--
                </span>
              )}
            </Label>
            <Textarea
              readOnly
              rows={4}
              className="resize-none"
              {...register("contract.shipToAddress", { required: true })}
            />
          </div>
        </div>

        <div className={`${modeClr[complainMode] || "bg-gray-200"} rounded-lg`}>
          <div className="flex flex-col gap-2 p-2 border-b">
            <h3 className="font-bold">
              Complaint Mode<span className="text-red-500">*</span>
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="email">Email</Label>
                <Radio
                  id="email"
                  disabled={view || edit}
                  {...register("complainMode")}
                  value="email"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Radio
                  id="phone"
                  disabled={view || edit}
                  {...register("complainMode")}
                  value="phone"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="insp">Inspection</Label>
                <Radio
                  id="insp"
                  disabled={view || edit}
                  {...register("complainMode")}
                  value="inspection"
                />
              </div>
            </div>
          </div>

          {complainMode === "email" && (
            <div className="p-2 rounded-md">
              <h3 className="font-bold">Email Screenshot</h3>
              <ImageUploader
                disabled={view || edit}
                buttonLabel="Image Upload"
                header="Image Upload"
              />
            </div>
          )}

          {complainMode === "phone" && (
            <div className="flex flex-col gap-2 p-2">
              <Label>
                <span>Date</span>
                <span className="text-red-500">*</span>
                <TextInput
                  type="date"
                  disabled={view || edit}
                  {...register("modeDetails.phone.date")}
                />
              </Label>
              <Label>
                <span>Phone number</span>
                <span className="text-red-500">*</span>
                <TextInput
                  disabled={view || edit}
                  placeholder="Enter caller phone number"
                  {...register("modeDetails.phone.number")}
                />
              </Label>
              <Label>
                <span>Caller Name</span>
                <span className="text-red-500">*</span>
                <TextInput
                  disabled={view || edit}
                  placeholder="Enter caller name"
                  {...register("modeDetails.phone.callerName")}
                />
              </Label>
            </div>
          )}
        </div>

        <div className="bg-linear-60 from-blue-300 to-blue-700 p-2 rounded-md">
          <h3 className="font-bold">Complaint Details</h3>
          <div>
            <Label>
              What is the Problem<span className="text-red-600">*</span>
              <TextInput
                id="problem"
                disabled={view || edit}
                {...register("issue.location", { required: !edit })}
              />
            </Label>
          </div>
          <div>
            <Label>
              Problem Details<span className="text-red-600">*</span>
              <Textarea
                id="detail"
                disabled={view || edit}
                {...register("issue.details", { required: !edit })}
              />
            </Label>
          </div>
        </div>

        {edit && (
          <div className="space-y-3 mt-4">
            <p className="my-2 text-red-700 font-bold">Edit Details Below <span className="text-3xl">👇</span></p>
            <div>
              <Label className="font-semibold">
                Select Agent<span className="text-red-600">*</span>
              </Label>
              <Select {...register("agent", { required: edit })}>
                <option value="">Please select agent</option>
                <option value="Executive">Executive</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Executive + Supervisor">
                  Executive + Supervisor
                </option>
              </Select>
            </div>
            <div>
              <Label>Select Date</Label>
              <TextInput
                type="date"
                disabled={view}
                {...register("scheduledDate")}
              />

            </div>
            <div>
              <Label>Select Time</Label>
              <Select {...register('scheduledTime')} disabled={view}>
                <option value="">Select time range</option>
                {timings.map(t => (
                  <option key={t.value} value={t.value}>{t.value}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Resources</Label>
              <Textarea {...register('resource')} placeholder="All resources" className="placeholder:text-gray-500">
              </Textarea>
            </div>
          </div>
        )}

        {!view && (
          <Button
            type="submit"
            className={`m-3 mx-auto transition-all duration-700 ${creatingTicket ? "bg-emerald-800" : "bg-emerald-600"}`}>
            {creatingTicket || updating ? (
              <div className="flex items-center gap-3">
                <Spinner color="pink" size="md" />
                Saving...
              </div>
            ) : edit ? (
              "Update Ticket"
            ) : (
              "Create Ticket"
            )}
          </Button>
        )}
      </form>
    </div>
  );
}

export default CreateModal;