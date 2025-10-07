import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Transaction } from "@/interface";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DetailPage() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/v1/data/${id}`).then((response) => {
      setTransaction(response.data.data || null);
    });
  }, [id]);

  if (!transaction) {
    return <div>Loading...</div>;
  }

  return (
    <div className='min-h-screen h-full p-4'>
      <Card className='max-w-md mx-auto'>
        <CardHeader className='font-bold text-lg'>
          Transaction Details
        </CardHeader>
        <CardContent>
          <div className='mb-2 flex flex-col gap-4'>
            <div className='flex justify-between gap-4 items-center'>
              <div className='flex flex-col'>
                <span className='text-gray-600'>Account</span>
                <p className='text-left'>{transaction.customerName}</p>
              </div>
              <div>
                <p className='text-gray-600'>{transaction.transactionDate}</p>
              </div>
            </div>
            <Separator />
            <div className='flex justify-between gap-4 items-center'>
              <div className='flex flex-col'>
                <p className='text-left text-2xl font-semibold'>
                  -Rp{transaction.amount}
                </p>
              </div>
              <Badge
                className={`${
                  transaction.status === 0
                    ? "bg-green-300 text-green-800"
                    : "bg-red-500"
                }`}
              >
                {transaction.statusName}
              </Badge>
            </div>
          </div>
          <Separator />
          <Card className='mt-4'>
            <CardHeader hidden aria-hidden />
            <CardContent>
              <div className='flex flex-col gap-2'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Product ID:</span>
                  <span>{transaction.productID}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Product Name:</span>
                  <span>{transaction.productName}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Created By:</span>
                  <span>{transaction.createBy}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Created On:</span>
                  <span>{transaction.createOn}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
