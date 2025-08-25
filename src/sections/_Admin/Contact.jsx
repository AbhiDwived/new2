"use client"

import React, { useEffect, useState } from 'react';
import { useGetAllMessageQuery } from '@/features/admin/adminAPI';
import Loader from '@/components/shared/Loader';

export default function Contact() {
    // All hooks at the top!
    const {
        data,
        isLoading,
        isError,
        error,
    } = useGetAllMessageQuery({ page: 1, limit: 50 });

    // State for filters
    const [filterType, setFilterType] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [pendingSearchTerm, setPendingSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
    }, [data, error]);

    if (isLoading) return <Loader fullScreen />;
    if (isError) {
        console.error("Error fetching messages:", error);
        return <div className="text-red-600">Error loading messages.</div>;
    }

    const contacts = data?.message || [];
    const pageSize = 10;
    const totalPages = Math.ceil(contacts.length / pageSize);
    const paginatedContacts = contacts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    function getPaginationPages(current, total) {
      if (total <= 1) return [1];
      if (current === 1) return [1, '...', total];
      if (current === total) return [1, '...', total];
      if (current !== 1 && current !== total) return [1, '...', current, '...', total];
    }
    const paginationPages = getPaginationPages(currentPage, totalPages);

    // Helper functions
    const isToday = (date) => {
        const inputDate = new Date(date).toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        return inputDate === today;
    };

    const isYesterday = (date) => {
        const inputDate = new Date(date).toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return inputDate === yesterday.toISOString().split('T')[0];
    };

    const isThisWeek = (date) => {
        const today = new Date();
        const msgDate = new Date(date);
        const diffTime = Math.abs(today - msgDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    };

    const isInRange = (date) => {
        if (!startDate || !endDate) return true;
        const msgDate = new Date(date);
        return msgDate >= new Date(startDate) && msgDate <= new Date(endDate);
    };

    const applySearchFilter = (list) => {
        if (!searchTerm) return list;
        return list.filter(contact =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Apply all filters
    let filteredContacts = contacts;

    if (filterType === 'today') {
        filteredContacts = filteredContacts.filter(contact => isToday(contact.createdAt));
    } else if (filterType === 'yesterday') {
        filteredContacts = filteredContacts.filter(contact => isYesterday(contact.createdAt));
    } else if (filterType === 'this_week') {
        filteredContacts = filteredContacts.filter(contact => isThisWeek(contact.createdAt));
    } else if (filterType === 'custom_range') {
        filteredContacts = filteredContacts.filter(contact => isInRange(contact.createdAt));
    }

    filteredContacts = applySearchFilter(filteredContacts);

   

    return (
        <div className="px-4 py-6">
            <h2 className="text-xl font-semibold mb-4">Contact Submissions</h2>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3 items-end mb-6">
                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                    {['all', 'today', 'yesterday', 'this_week', 'custom_range'].map(type => (
                        <button
                            key={type}
                            className={`px-3 py-2 rounded border text-sm ${filterType === type
                                ? 'bg-gray-800 text-white'
                                : 'border-gray-400 text-gray-600 hover:bg-gray-100'
                                }`}
                            onClick={() => setFilterType(type)}
                        >
                            {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </button>
                    ))}
                </div>

                {/* Custom Date Range Inputs */}
                {filterType === 'custom_range' && (
                    <>
                        <div>
                            <label className="block text-sm mb-1">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border rounded px-3 py-2 text-sm w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border rounded px-3 py-2 text-sm w-full"
                            />
                        </div>
                    </>
                )}

                {/* Search Input */}
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={pendingSearchTerm}
                        onChange={(e) => setPendingSearchTerm(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-sm"
                    />
                </div>

                {/* Search and Reset Buttons */}
                <div className="flex gap-2">
                    <button
                        className="bg-[#0f4c81] text-white text-sm px-4 py-2 rounded"
                        onClick={() => setSearchTerm(pendingSearchTerm)}
                    >
                        Search
                    </button>
                    
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">No</th>
                            <th className="p-2 border hidden lg:table-cell">Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Phone</th>
                            <th className="p-2 border hidden md:table-cell">Message</th>
                            <th className="p-2 border">Submitted At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredContacts.length > 0 ? (
                            paginatedContacts.map((contact, index) => (
                                <tr key={contact._id} className="hover:bg-gray-50">
                                    <td className="p-2 border">{index + 1}</td>

                                    {/* Name (visible only on large screens) */}
                                    <td className="p-2 border hidden lg:table-cell">{contact.name}</td>

                                    {/* Name + Email stacked (for smaller screens) */}
                                    <td className="p-2 border lg:hidden text-gray-700 font-medium">
                                        <div className="truncate max-w-[150px]">{contact.name}</div>
                                        <div className="text-xs text-gray-500">{contact.email}</div>
                                    </td>

                                    {/* Email (large screens only) */}
                                    <td className="p-2 border hidden lg:table-cell">{contact.email}</td>

                                    <td className="p-2 border">{contact.phone}</td>

                                    {/* Message full (medium and up) */}
                                    <td className="p-2 border hidden md:table-cell">{contact.message}</td>

                                    {/* Message truncated (small screens) */}
                                    <td className="p-2 border md:hidden truncate max-w-[180px] text-gray-600">
                                        {contact.message}
                                    </td>

                                    <td className="p-2 border">{new Date(contact.createdAt).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center p-4 text-gray-500">
                                    No messages found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1 mt-6 bg-gray-50 px-3 py-2 rounded-lg shadow border">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded border transition ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                  aria-label="Previous page"
                >
                  Prev
                </button>
                {paginationPages.map((page, idx) =>
                  page === '...'
                    ? <span key={idx} className="px-2 text-gray-400">...</span>
                    : <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded border transition ${currentPage === page ? 'bg-blue-100 border-blue-400 text-blue-700 font-bold' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                      >
                        {page}
                      </button>
                )}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded border transition ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            )}
        </div>
    );
}
