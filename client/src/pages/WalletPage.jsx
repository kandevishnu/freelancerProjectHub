import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyEarnings } from '../services/api';
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Search, 
  ExternalLink, 
  Calendar,
  AlertCircle,
  ArrowDownLeft
} from 'lucide-react';

const WalletPage = () => {
  const [data, setData] = useState({
    invoices: [],
    totalEarned: 0,
    pendingAmount: 0,
    totalInvoices: 0,
    paidInvoicesCount: 0,
    pendingInvoicesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'paid' | 'pending'
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const res = await getMyEarnings();
        if (res) {
          setData(res);
        }
      } catch (err) {
        console.error("Failed to fetch wallet earnings:", err);
        setError("Failed to load earnings information. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  const filteredInvoices = (data.invoices || []).filter((inv) => {
    if (filter === 'paid' && inv.status !== 'paid') return false;
    if (filter === 'pending' && inv.status !== 'pending') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const projectTitle = inv.project?.title?.toLowerCase() || '';
      const clientName = inv.client?.name?.toLowerCase() || '';
      return projectTitle.includes(q) || clientName.includes(q);
    }
    return true;
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="font-medium text-lg">Loading your wallet & earnings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto my-8 p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
        <AlertCircle size={24} className="flex-shrink-0" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <span className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <Wallet size={28} />
            </span>
            Freelancer Wallet & Income
          </h1>
          <p className="text-gray-500 mt-1 text-base">
            Track all payments received from clients, pending payouts, and overall income in one place.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Total Earned */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-lg shadow-emerald-500/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-15">
            <TrendingUp size={90} />
          </div>
          <div className="flex items-center gap-2 text-emerald-100 text-sm font-semibold uppercase tracking-wider mb-2">
            <ArrowDownLeft size={18} />
            Total Income Received
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {formatCurrency(data.totalEarned)}
          </div>
          <p className="text-emerald-100/80 text-xs mt-3 flex items-center gap-1.5">
            <CheckCircle2 size={14} /> From {data.paidInvoicesCount} paid {data.paidInvoicesCount === 1 ? 'project' : 'projects'}
          </p>
        </div>

        {/* Pending Clearance */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg shadow-amber-500/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-15">
            <Clock size={90} />
          </div>
          <div className="flex items-center gap-2 text-amber-100 text-sm font-semibold uppercase tracking-wider mb-2">
            <Clock size={18} />
            Pending Invoices
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {formatCurrency(data.pendingAmount)}
          </div>
          <p className="text-amber-100/80 text-xs mt-3">
            Awaiting client payment for {data.pendingInvoicesCount} {data.pendingInvoicesCount === 1 ? 'invoice' : 'invoices'}
          </p>
        </div>

        {/* Paid Invoices Count */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">
            <span>Completed Payouts</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 mt-2">
            {data.paidInvoicesCount}
          </div>
          <p className="text-gray-500 text-xs mt-3">
            Successfully cleared to your wallet
          </p>
        </div>

        {/* Overall Invoices Issued */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">
            <span>Total Invoices</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 mt-2">
            {data.totalInvoices}
          </div>
          <p className="text-gray-500 text-xs mt-3">
            All generated project invoices
          </p>
        </div>
      </div>

      {/* Transactions Table & Filters Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Filter bar */}
        <div className="p-5 sm:p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Payment History & Transactions</h2>
            <p className="text-sm text-gray-500 mt-0.5">Detailed log of all invoice transfers and payment records.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search project or client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-60"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex bg-gray-200 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All ({data.totalInvoices})
              </button>
              <button
                onClick={() => setFilter('paid')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  filter === 'paid' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Received ({data.paidInvoicesCount})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  filter === 'pending' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pending ({data.pendingInvoicesCount})
              </button>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">No Transactions Found</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mt-1">
              {data.totalInvoices === 0
                ? "You haven't generated any invoices yet. Invoices created in project workspaces will appear here once submitted."
                : "No transactions match your current search or status filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Date & Time</th>
                  <th className="py-3.5 px-6">Project Title</th>
                  <th className="py-3.5 px-6">Client</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredInvoices.map((inv) => {
                  const createdAtDate = new Date(inv.createdAt);
                  const formattedDate = createdAtDate.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });
                  const formattedTime = createdAtDate.toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  });

                  const isPaid = inv.status === 'paid';

                  return (
                    <tr key={inv._id} className="hover:bg-blue-50/40 transition-colors">
                      {/* Date & Time */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-lg ${isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            <Calendar size={16} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{formattedDate}</p>
                            <p className="text-xs text-gray-500">{formattedTime}</p>
                          </div>
                        </div>
                      </td>

                      {/* Project Title */}
                      <td className="py-4 px-6">
                        {inv.project ? (
                          <Link
                            to={`/project/${inv.project._id}`}
                            className="font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1.5 max-w-xs truncate"
                            title={inv.project.title}
                          >
                            <span>{inv.project.title}</span>
                            <ExternalLink size={13} className="flex-shrink-0" />
                          </Link>
                        ) : (
                          <span className="text-gray-400 italic">Project Not Available</span>
                        )}
                        <span className="text-xs text-gray-400 font-mono">Invoice #{inv._id.slice(-6)}</span>
                      </td>

                      {/* Client */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {inv.client ? (
                          <Link
                            to={`/profile/${inv.client._id}`}
                            className="flex items-center gap-2 hover:opacity-80"
                          >
                            {inv.client.profilePictureUrl ? (
                              <img
                                src={inv.client.profilePictureUrl}
                                alt={inv.client.name}
                                className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                                {inv.client.name?.charAt(0) || 'C'}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-800 text-sm hover:underline">
                                {inv.client.name}
                              </p>
                              <p className="text-xs text-gray-400">{inv.client.email}</p>
                            </div>
                          </Link>
                        ) : (
                          <span className="text-gray-400">Client</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 size={13} />
                            Payment Received
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock size={13} />
                            Pending Payment
                          </span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <span
                          className={`text-base font-extrabold ${
                            isPaid ? 'text-emerald-600' : 'text-gray-700'
                          }`}
                        >
                          {isPaid ? `+ ` : ''}
                          ₹{Number(inv.amount || 0).toLocaleString('en-IN')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;

