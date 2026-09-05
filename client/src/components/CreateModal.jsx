import {
  Button,
  Label,
  Radio,
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
import { useCreateTicket } from "../api/useTicket";

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

function CreateModal({ view }) {
  const savedForm = JSON.parse(localStorage.getItem("create_ticket")) || {};

  const { data: contracts, isFetching, isError } = useGetContract({ staleTime: Infinity, gcTime: Infinity, refetchOnWindowFocus: false, });
  const { mutateAsync: create, isPending: creatingTicket } = useCreateTicket();

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { complainMode: "email", ...savedForm } });
  const {
    status,
    billToName,
    billToAddress,
    shipToName,
    shipToAddress,
    filterError,
    setFilteredContract,
    resetStore,
  } = useContractStore();

  const number = watch("contract.number");
  const complainMode = watch("complainMode");

  const submit = async (formData) => {
    console.log(formData);
    await create(formData);
    toast.success("form submitted");
  };

  useEffect(() => {
    const subscription = watch((values) => {
      localStorage.setItem("create_ticket", JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // fetch contraact
  const fetchContract = async (e) => {
    e.preventDefault();
    resetStore();

    if (contracts.length !== 0 && number) {
      setFilteredContract(contracts, number);
    }
  };

  // set fetchd values
  useEffect(() => {
    if (billToAddress) setValue("contract.billToAddress", billToAddress, { shouldValidate: true });
    if (billToName) setValue("contract.billToName", billToName, { shouldValidate: true });
    if (shipToAddress) setValue("contract.shipToAddress", shipToAddress, { shouldValidate: true });
    if (shipToName) setValue("contract.shipToName", shipToName, { shouldValidate: true });
  }, [billToAddress, billToName, shipToAddress, shipToName, setValue]);


  useEffect(() => {
    if (isFetching) toast.warn("contracts are fetching");
    if (isError) toast.info("Contracts fetching error, reload page");
  }, [isFetching, isError]);

  return (
    <div className="p-1 ">
      <form action="" className="space-y-3" onSubmit={handleSubmit(submit)}>
        <div className="mx-auto w-fit">
          <label htmlFor="contractsearch">Contract No</label>
          <div className="flex gap-4">
            <TextInput
              id="contractsearch"
              type="search"
              placeholder="find Contracts"
              color={inputTheme[status]}
              {...register("contract.number", { required: true })}
            />
            <Button
              outline
              className="cursor-pointer"
              disabled={isFetching}
              onClick={fetchContract}>
              {isFetching ? "fetching..." : "Fetch"}
            </Button>
          </div>
          {filterError && <p className="text-red-600 shake">{filterError}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3 my-5 bg-gray-300 p-2 rounded-md ">
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
              required
              value={billToName || ""}
              {...register("contract.billToName", { required: true })}
            />
            <Label>
              BillToAddrss<span className="text-red-500">*</span>
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
              value={billToAddress || ""}
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
              value={shipToName || ""}
              readOnly
              {...register("contract.shipToName", { required: true })}
            />
            <Label>
              Project Addrss<span className="text-red-500">*</span>
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
              value={shipToAddress || ""}
              {...register("contract.shipToAddress", { required: true })}
            />
          </div>
        </div>
        <div className={`${modeClr[complainMode]} rounded-lg`}>
          <div className={`flex flex-col gap-2 p-2 border-b`}>
            <h3 className="font-bold">
              Complaint Mode<span className="text-red-500">*</span>
              {errors?.complainMode && (
                <span className="text-xs text-red-600 font-medium">
                  {" "}
                  --Required--
                </span>
              )}
            </h3>
            <div className="flex flex-wrap items-center gap-4 **:cursor-pointer">
              <div className="flex items-center gap-2">
                <Label htmlFor="email">Email</Label>
                <Radio
                  id="email"
                  {...register("complainMode")}
                  value={"email"}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Radio
                  id="phone"
                  {...register("complainMode")}
                  value={"phone"}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="insp">Inspection</Label>
                <Radio
                  id="insp"
                  {...register("complainMode")}
                  value={"inspection"}
                />
              </div>
            </div>
          </div>
          {complainMode === "email" && (
            <div className={`p-2 rounded-md`}>
              <h3 className="font-bold">Email Screenshot</h3>
              <ImageUploader
                buttonLabel={"Image Upload"}
                header={"Image Upload"}
              />
            </div>
          )}
          {complainMode === "phone" && (
            <div className="flex flex-col gap-2 p-2">
              <Label>
                {" "}
                <span>Date</span>
                <span className="text-red-500">*</span>
                {errors?.complainMode?.phone?.date && (
                  <span className="text-xs text-red-600 font-medium">
                    {" "}
                    --Required--
                  </span>
                )}
                <TextInput
                  type="date"
                  value={new Date().toISOString().split("T")[0]}
                  {...register("modeDetails.phone.date")}
                />
              </Label>
              <Label>
                {" "}
                <span>Phone number </span>
                <span className="text-red-500">*</span>
                {errors?.complainMode?.phone?.phone && (
                  <span className="text-xs text-red-600 font-medium">
                    {" "}
                    --Required--
                  </span>
                )}
                <TextInput
                  placeholder="Enter caller phone number"
                  {...register("modeDetails.phone.number")}
                />
              </Label>
              <Label>
                {" "}
                <span>Caller Name</span>
                <span className="text-red-500">*</span>
                {errors?.complainMode?.phone?.callerName && (
                  <span className="text-xs text-red-600 font-medium">
                    {" "}
                    --Required--
                  </span>
                )}
                <TextInput
                  placeholder="Enter caller name"
                  {...register("modeDetails.phone.callerName")}
                />
              </Label>
            </div>
          )}
        </div>
        <div className="bg-linear-60 from-blue-300 to-blue-700 p-2 rounded-md">
          <h3 className="font-bold ">Complaint Details</h3>
          <div>
            <Label>What is the Problem<span className="text-red-600">*</span>
              <TextInput id="problem" {...register("issue.problem", { required: true })} />
            </Label>
          </div>
          <div>
            <Label>What is the Problem<span className="text-red-600">*</span>
              <Textarea id="detail" {...register("issue.details", { required: true })} />
            </Label>
          </div>
        </div>
        {view &&
          <div>
            
          </div>
        }
        <Button
          type="submit"
          className={`m-3 mx-auto transition-all duration-700 ${creatingTicket ? "bg-linear-30 from-green-400 to-emerald-800" : "bg-linear-30 from-green-800 to-emerald-400"}`}>
          {creatingTicket ? (
            <div className="flex items-center gap-3">
              <Spinner color="pink" size="md" />
              Creating Ticket...
            </div>
          ) : (
            "Create Ticket"
          )}
        </Button>
      </form>
    </div>
  );
}

export default CreateModal;
