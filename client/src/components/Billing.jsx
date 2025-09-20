import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getInvoiceForProject, createInvoice, createStripePaymentIntent } from '../services/api';
import { toast } from 'react-toastify';
import { DollarSign, CheckCircle, Clock } from 'lucide-react';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm.jsx';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Billing = ({ project }) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(project.budget);
  const [clientSecret, setClientSecret] = useState(null); 
  const { user } = useAuth();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const data = await getInvoiceForProject(project._id);
        setInvoice(data);
      } catch (error) {
        console.error("Failed to fetch invoice", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [project._id]);

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      const newInvoice = await createInvoice(project._id, { amount: Number(amount) });
      setInvoice(newInvoice);
      toast.success('Invoice created and sent to client!');
    } catch (error) {
      toast.error(error.message || 'Failed to create invoice.');
    }
  };

  const handleInitiatePayment = async () => {
    if (!invoice) return toast.error("No invoice found.");
    try {
      const { clientSecret } = await createStripePaymentIntent(invoice._id);
      setClientSecret(clientSecret); 
    } catch (error) {
      toast.error(error.message || 'Could not initiate payment.');
    }
  };

  if (loading) return <p>Loading billing information...</p>;

  if (user?._id === project.freelancer?._id) {
    if (invoice) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          {invoice.status === 'pending' ? <Clock className="mx-auto text-yellow-500 mb-2 h-12 w-12" /> : <CheckCircle className="mx-auto text-green-500 mb-2 h-12 w-12" />}
          <h3 className="text-xl font-semibold">Invoice Sent</h3>
          <p className="text-gray-600">Amount: ₹{invoice.amount}</p>
          <p className="mt-2 font-semibold capitalize">Status: <span className={invoice.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}>{invoice.status}</span></p>
        </div>
      );
    }
    return (
      <form onSubmit={handleCreateInvoice} className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Generate Final Invoice</h3>
        <p className="text-sm text-gray-500 mb-4">The final amount should match the project budget unless agreed otherwise.</p>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Invoice Amount (in INR)</label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₹</span>
            <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-7 block w-full border-gray-300 rounded-md" required />
          </div>
        </div>
        <button type="submit" className="mt-4 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
          Send Invoice to Client
        </button>
      </form>
    );
  }

  if (user?._id === project.client?._id) {
    if (!invoice) {
      return <div className="bg-white p-6 rounded-lg shadow-md text-center"><p className="text-gray-500">The freelancer has not yet generated an invoice.</p></div>;
    }
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold">Invoice Received</h3>
        <div className="my-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Amount Due</p>
          <p className="text-3xl font-bold">₹{invoice.amount}</p>
        </div>

        {invoice.status === 'paid' && (
          <div className="text-center font-semibold text-green-600 p-4 bg-green-50 rounded-lg">
            <p>This invoice has been paid. Thank you!</p>
          </div>
        )}

        {invoice.status === 'pending' && !clientSecret && (
          <button onClick={handleInitiatePayment} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
            <DollarSign size={20} /> Proceed to Payment
          </button>
        )}

        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm project={project} />
          </Elements>
        )}
      </div>
    );
  }

  return null;
};

export default Billing;