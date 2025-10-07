import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./components/ui/table";
import { Button } from "./components/ui/button";
import type { Transaction } from "./interface";

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Make sure this URL matches your backend API endpoint
        const response = await axios.get("http://localhost:3000/api/v1/data");
        setTransactions(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Get status name based on status code
  const getStatusBadge = (status: number) => {
    const statusClass = status === 0 ? "success" : "failed";
    const statusText = status === 0 ? "SUCCESS" : "FAILED";

    return <span className={`status-badge ${statusClass}`}>{statusText}</span>;
  };

  return (
    <div className=' mx-auto p-4'>
      <div className='justify-between mb-4 flex items-center'>
        <h1 className='text-3xl font-bold'>Transaction Data</h1>
        <Button>
          <a href='/data/add'>Add Data</a>
        </Button>
      </div>

      {loading && <div className='loading'>Loading data...</div>}

      {error && <div className='error-message'>{error}</div>}

      {!loading && !error && transactions.length === 0 && (
        <div className='no-data'>No transactions found.</div>
      )}

      {!loading && !error && transactions.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Transaction Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className='font-medium'>{tx.id}</TableCell>
                <TableCell>{tx.productName}</TableCell>
                <TableCell className='text-right'>{tx.amount}</TableCell>
                <TableCell>{tx.customerName}</TableCell>
                <TableCell>{getStatusBadge(tx.status)}</TableCell>
                <TableCell>{formatDate(tx.transactionDate)}</TableCell>
                <TableCell className='space-x-2'>
                  <Button variant='default'>
                    <a href={`/data/${tx.id}`}>View Detail</a>
                  </Button>
                  <Button variant='default'>
                    <a href={`/data/${tx.id}/edit`}>Edit</a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default App;
