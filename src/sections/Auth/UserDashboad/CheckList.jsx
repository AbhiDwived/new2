"use client"

import React, { useState, useEffect } from "react";
import { Calendar, Trash2 } from "lucide-react";
import {
    useGetUserChecklistQuery,
    useAddChecklistTaskMutation,
    useToggleTaskCompletionMutation,
    useDeleteChecklistTaskMutation,
} from "@/features/checklist/checklistAPI";
import { useSelector } from "react-redux";
<<<<<<< HEAD
import { useSession } from "next-auth/react";
=======
>>>>>>> fb8619432720a33f4703fdcb2af061b010ca0f90
import Loader from "@/components/shared/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CheckList() {
    /* ─────────── Local state ─────────── */
    const [newTask, setNewTask] = useState("");
    const { data: session } = useSession();
    const isAuthenticated = !!session;

    /* ─────────── RTK Query hooks ─────────── */
    const {
        data: checklistData,
        isLoading,
        isError,
        error,
    } = useGetUserChecklistQuery(undefined, { skip: !isAuthenticated });

    const [addTask, { isLoading: isAdding }] = useAddChecklistTaskMutation();
    const [toggleTask, { isLoading: isToggling }] = useToggleTaskCompletionMutation();
    const [deleteTask, { isLoading: isDeleting }] = useDeleteChecklistTaskMutation();

    /* ─────────── Derived data ─────────── */
    const tasks = checklistData?.data?.items ?? [];
    const completedTasks = checklistData?.data?.completedCount ?? 0;
    const totalTasks = checklistData?.data?.totalCount ?? 0;
    const completionPct = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    /* ─────────── Global load / error ─────────── */
    useEffect(() => {
        if (isError) {
            toast.error(`❌ Error loading checklist: ${error?.data?.message || "Unknown error"}`);
        }
    }, [isError, error]);

    /* ─────────── Handlers ─────────── */
    const handleAddTask = async (e) => {
        e.preventDefault(); // ✅ important: only works inside a real form
        const trimmed = newTask.trim();
        if (!trimmed) return;

        try {
            await addTask(trimmed).unwrap();
            setNewTask("");
            toast.success("✅ Task added successfully!");
        } catch (err) {
            toast.error(`❌ Error adding task: ${err.data?.message || "Unknown error"}`);
        }
    };

    const handleToggleTaskCompletion = async (id) => {
        try {
            await toggleTask(id).unwrap();
        } catch (err) {
            toast.error(`❌ Error updating task: ${err.data?.message || "Unknown error"}`);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await deleteTask(id).unwrap();
            toast.error("🗑️ Task deleted successfully!");
        } catch (err) {
            toast.error(`❌ Error deleting task: ${err.data?.message || "Unknown error"}`);
        }
    };

    /* ─────────── UI ─────────── */
    return (
        <>
            {(isLoading || isAdding || isToggling || isDeleting) && <Loader fullScreen />}

            {!isLoading && (
                <div className="flex min-h-screen">
                    <div className="flex-grow">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Checklist Section */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-lg p-6 mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold text-wedding-dark">Wedding Checklist</h2>
                                        <span className="text-sm text-gray-600">
                                            {completedTasks} of {totalTasks} tasks completed
                                        </span>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="w-full bg-gray-200 h-3 rounded-full mb-6">
                                        <div
                                            className="bg-[#0F4C81] h-3 rounded-full transition-all duration-300"
                                            style={{ width: `${completionPct}%` }}
                                        />
                                    </div>

                                    {/* Task list */}
                                    <div className="space-y-4">
                                        {tasks.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                No tasks added yet. Add your first task!
                                            </div>
                                        ) : (
                                            tasks.map((task) => (
                                                <div
                                                    key={task._id}
                                                    className={`flex justify-between items-start p-2 rounded-md border bg-[#f0f2f5] hover:shadow-sm transition ${task.completed ? "opacity-90" : ""
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={task.completed}
                                                            onChange={() => handleToggleTaskCompletion(task._id)}
                                                            disabled={isToggling}
                                                            className="mt-1 w-4 h-4 accent-[#0F4C81]"
                                                        />
                                                        <div>
                                                            <p
                                                                className={`text-md font-medium ${task.completed ? "line-through text-gray-800" : "text-gray-800"
                                                                    }`}
                                                            >
                                                                {task.task}
                                                            </p>
                                                            <div className="text-md text-gray-500 mt-1 flex items-center gap-2">
                                                                <Calendar size={12} />
                                                                Added: {new Date(task.createdAt).toLocaleDateString("en-US")}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => handleDeleteTask(task._id)}
                                                        disabled={isDeleting}
                                                        className="text-gray-400 hover:text-red-500 mt-4"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ✅ Add Task Form */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg shadow p-6">
                                    <h3 className="text-lg font-semibold mb-4 text-wedding-dark">Add New Task</h3>

                                    {/* ✅ FORM starts here */}
                                    <form onSubmit={handleAddTask} className="space-y-4">
                                        <div>
                                            <label
                                                htmlFor="task"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Task Description
                                            </label>
                                            <input
                                                id="task"
                                                placeholder="Enter a new task..."
                                                value={newTask}
                                                onChange={(e) => setNewTask(e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f304d]"
                                            />
                                        </div>

                                        {/* ✅ Submit button inside form */}
                                        <button
                                            type="submit"
                                            disabled={!newTask.trim() || isAdding}
                                            className={`w-full text-sm font-medium px-4 py-2 rounded-md transition ${newTask.trim() && !isAdding
                                                ? "bg-[#0F4C81] text-white hover:bg-[#0f304de2]"
                                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                }`}
                                        >
                                            {isAdding ? "Adding..." : "Add Task"}
                                        </button>
                                    </form>
                                    {/* ✅ FORM ends here */}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* Toast container (always mounted) */}
            <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                closeOnClick
                pauseOnFocusLoss
                pauseOnHover
                draggable
                theme="light"
            />
        </>
    );
}
