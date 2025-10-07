import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Status, Transaction } from "@/interface";
import axios from "axios";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function EditPage() {
  const { id } = useParams();
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<
    { productName: string; productID: string }[]
  >([]);
  const [transactionData, setTransactionData] = useState<Transaction | null>(
    null
  );
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusesResponse, productsResponse, transactionResponse] =
          await Promise.all([
            axios.get("http://localhost:3000/api/v1/statuses"),
            axios.get("http://localhost:3000/api/v1/products"),
            axios.get(`http://localhost:3000/api/v1/data/${id}`),
          ]);

        setStatuses(statusesResponse.data.data || []);
        setProducts(productsResponse.data.data || []);

        // Debug all responses
        console.log("Status response:", statusesResponse.data);
        console.log("Products response:", productsResponse.data);
        console.log("Transaction response:", transactionResponse.data);

        // The backend API might return the transaction data directly in data field
        // or nested in a data property
        const transaction =
          transactionResponse.data.data || transactionResponse.data;
        console.log("Transaction object:", transaction);

        setTransactionData(transaction);

        // Initialize date if transaction exists
        if (transaction?.transactionDate) {
          setSelectedDate(new Date(transaction.transactionDate));
        }

        if (!transaction) {
          //navigate to home if no data
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      customerName: formData.get("customerName"),
      productName: formData.get("productName"),
      productID: products.find(
        (product) => product.productName === formData.get("productName")
      )?.productID,
      amount: formData.get("amount"),
      status: statuses.find((status) => status.name === formData.get("status"))
        ?.id,
      createBy: "abc", // Hardcoded for simplicity
      transactionDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : null,
    };

    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/data/${id}`,
        data
      );
      console.log("Data submitted successfully:", response.data);

      // Redirect to home page after successful submission
      navigate("/");
    } catch (error: unknown) {
      console.error("Error submitting data:", error);

      // Extract error message from Axios error response
      if (axios.isAxiosError(error) && error.response) {
        // Backend returned an error response
        const errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          `Error: ${error.response.status} ${error.response.statusText}`;
        setError(errorMessage);
      } else {
        // Something else went wrong
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='min-h-screen h-full p-4'>
      <Card className='max-w-md mx-auto'>
        <CardHeader className='text-2xl font-bold mb-4'>
          Edit Transaction
        </CardHeader>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <CardContent className='grid gap-4'>
            <div>
              <Label className='mb-2 font-medium' htmlFor='customerName'>
                Customer Name
              </Label>
              <Input
                type='text'
                id='customerName'
                name='customerName'
                defaultValue={transactionData?.customerName ?? ""}
              />
            </div>
            <div>
              <Label className='mb-2 font-medium' htmlFor='productName'>
                Product Name
              </Label>
              <Select
                name='productName'
                defaultValue={transactionData?.productName}
                value={transactionData?.productName}
                onValueChange={(value) => {
                  setTransactionData((prev) =>
                    prev ? { ...prev, productName: value } : null
                  );
                }}
              >
                <SelectTrigger
                  id='productName'
                  name='productName'
                  className='w-full'
                >
                  <SelectValue placeholder='Select Product' />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem
                      key={product.productID}
                      value={product.productName}
                    >
                      {product.productName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* <Input type='text' id='productName' name='productName'  /> */}
            </div>
            <div>
              <Label className='mb-2 font-medium' htmlFor='amount'>
                Amount
              </Label>
              <Input
                type='number'
                name='amount'
                defaultValue={transactionData?.amount || ""}
              />
            </div>
            <div className='w-full'>
              <Label className='mb-2 font-medium' htmlFor='status'>
                Status
              </Label>
              <Select
                name='status'
                defaultValue={transactionData?.statusName}
                value={transactionData?.statusName}
                onValueChange={(value) => {
                  setTransactionData((prev) =>
                    prev ? { ...prev, statusName: value } : null
                  );
                }}
              >
                <SelectTrigger id='status' name='status' className='w-full'>
                  <SelectValue placeholder='Select Status' />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.id} value={status.name}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className='mb-2 font-medium' htmlFor='createBy'>
                Transaction Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={
                      transactionData?.transactionDate
                        ? new Date(transactionData.transactionDate)
                        : selectedDate
                    }
                    onSelect={setSelectedDate}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    captionLayout='dropdown'
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
          <CardFooter className='flex flex-col gap-3'>
            {error && (
              <div className='text-red-500 text-sm w-full'>{error}</div>
            )}
            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
