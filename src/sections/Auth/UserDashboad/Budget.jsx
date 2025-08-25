"use client"

// src/pages/dashboard/Budget.jsx
import React, { useState, useEffect } from 'react';
import {
  useGetUserBudgetQuery,
  useAddBudgetItemMutation,
  useUpdateBudgetItemMutation,
  useDeleteBudgetItemMutation,
} from '@/features/budget/budgetAPI';
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdDelete } from 'react-icons/md';
import Loader from '@/components/shared/Loader';

const BudgetItemRow = ({ item, onUpdate, onDelete, isDeleting }) => {
  const [actual, setActual] = useState(item.actual ?? '');

  const diff = actual ? item.planned - actual : null;

  const handleActualChange = (e) => {
    setActual(e.target.value);
  };

  const handleBlur = () => {
    if (actual !== (item.actual ?? '')) {
      onUpdate(item._id, actual);
    }
  };

  return (
    <tr className="border-b last:border-none">
      <td className="py-3 px-4">{item.category}</td>
      <td className="py-3 px-4">{item.planned.toLocaleString()}</td>
      <td className="py-3 px-4">
        <input
          type="number"
          value={actual}
          min={0}
          onChange={handleActualChange}
          onBlur={handleBlur}
          className="w-24 border rounded px-2 py-1"
        />
      </td>
      <td
        className={`py-3 px-4 font-medium ${
          diff !== null && diff < 0 ? 'text-red-500' : 'text-green-600'
        }`}
      >
        {diff !== null ? diff.toLocaleString() : '-'}
      </td>
      <td className="py-3 px-4">
        <button
          onClick={() => onDelete(item._id)}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-800"
        >
          <MdDelete size={22} />
        </button>
      </td>
    </tr>
  );
};

export default function Budget() {
  /* ───────────── local state ───────────── */
  const [newItem, setNewItem] = useState({ category: '', planned: 0 });
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  /* ───────────── RTK Query hooks ───────────── */
  const {
    data: budgetData = {},
    isLoading,
    isError,
    error,
  } = useGetUserBudgetQuery(undefined, { skip: !isAuthenticated });

  const [addItem, { isLoading: adding }] = useAddBudgetItemMutation();
  const [updateItem, { isLoading: updating }] = useUpdateBudgetItemMutation();
  const [deleteItem, { isLoading: deleting }] = useDeleteBudgetItemMutation();

  /* ───────────── derived values ───────────── */
  const items = budgetData.data?.items ?? [];
  const totalPlanned = budgetData.data?.totalPlanned ?? 0;
  const totalActual = budgetData.data?.totalActual ?? 0;
  const remaining = totalPlanned - totalActual;

  /* ───────────── global error toast ───────────── */
  useEffect(() => {
    if (isError) toast.error(` ${error?.data?.message || 'Failed to load budget'}`);
  }, [isError, error]);

  /* ───────────── handlers ───────────── */
  const onAddItem = async () => {
    if (!newItem.category.trim() || newItem.planned <= 0) return;
    try {
      await addItem({
        category: newItem.category.trim(),
        planned: Number(newItem.planned),
      }).unwrap();
      setNewItem({ category: '', planned: 0 });
      toast.success(' Budget item added');
    } catch (err) {
      toast.error(` ${err.data?.message || 'Add failed'}`);
    }
  };

  const onUpdateActual = async (id, actual) => {
    try {
      await updateItem({ itemId: id, itemData: { actual: Number(actual) } }).unwrap();
      toast.success('Actual updated');
    } catch (err) {
      toast.error(`${err.data?.message || 'Update failed'}`);
    }
  };

  const onDeleteItem = async (id) => {
    try {
      await deleteItem(id).unwrap();
      toast.error(' Item deleted');        // red style
    } catch (err) {
      toast.error(` ${err.data?.message || 'Delete failed'}`);
    }
  };

  /* ───────────── UI ───────────── */
  return (
    <>
      {/* toast system (always mounted) */}
      <ToastContainer position="top-right" autoClose={1000} theme="light" />

      {/* optional overlay loader */}
      {(isLoading || adding || updating || deleting) && <Loader fullScreen />}

      <div className="flex min-h-screen bg-gray-50 p-4">
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ───────── left: table ───────── */}
          <section className="lg:col-span-2 bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold mb-4">Wedding Budget</h2>

            <p className="text-sm mb-4">
              <span className="font-medium text-gray-700">Total Budget:&nbsp;</span>
              <span className="font-bold">₹{totalPlanned.toLocaleString()}</span>
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Category</th>
                    <th className=" py-3 px-4">Planned (₹)</th>
                    <th className=" py-3 px-4">Actual (₹)</th>
                    <th className=" py-3 px-4">Difference</th>
                    <th className=" py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-500">
                        No items yet – add your first one!
                      </td>
                    </tr>
                  )}

                  {items.map((item) => (
                    <BudgetItemRow
                      key={item._id}
                      item={item}
                      onUpdate={onUpdateActual}
                      onDelete={onDeleteItem}
                      isDeleting={deleting}
                    />
                  ))}
                </tbody>

                <tfoot>
                  <tr className="border-t font-bold">
                    <td className="py-3 px-4">Total</td>
                    <td className="py-3 px-4 ">{totalPlanned.toLocaleString()}</td>
                    <td className="py-3 px-4 ">{totalActual.toLocaleString()}</td>
                    <td
                      className={`py-3 px-4  ${remaining < 0 ? 'text-red-500' : 'text-green-600'
                        }`}
                    >
                      {remaining.toLocaleString()}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* ───────── right: add form ───────── */}
          <aside className="bg-white rounded-lg p-6 shadow space-y-6">
            <h3 className="text-lg font-semibold">Add Budget Item</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="cat" className="block text-sm font-medium mb-1">
                  Category
                </label>
                <input
                  id="cat"
                  placeholder="e.g. Flowers"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label htmlFor="plan" className="block text-sm font-medium mb-1">
                  Planned Amount (₹)
                </label>
                <input
                  id="plan"
                  type="number"
                  min={0}
                  value={newItem.planned || ''}
                  onChange={(e) => setNewItem({ ...newItem, planned: Number(e.target.value) })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <button
                onClick={onAddItem}
                disabled={!newItem.category.trim() || newItem.planned <= 0 || adding}
                className="w-full bg-[#0D3F6A] text-white py-2 rounded disabled:bg-gray-300"
              >
                {adding ? 'Adding...' : 'Add Item'}
              </button>
            </div>

            <div className="pt-4 border-t space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Planned:</span>
                <span className="font-semibold">₹{totalPlanned.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Spent:</span>
                <span className="font-semibold">₹{totalActual.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining:</span>
                <span
                  className={`font-semibold ${remaining < 0 ? 'text-red-500' : 'text-green-600'
                    }`}
                >
                  ₹{remaining.toLocaleString()}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
