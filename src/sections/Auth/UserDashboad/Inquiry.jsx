"use client"

import React, { useEffect, useState } from 'react';
import { Mail } from "lucide-react";
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FiMessageSquare } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { useGetUserInquiriesMutation, useAddUserInquiryMessageMutation, } from "@/features/auth/authAPI";
import moment from 'moment';
import { toast } from 'react-toastify';

export default function Inquiry() {
    const [openInquiryId, setOpenInquiryId] = useState(null);
    const [localInquiries, setLocalInquiries] = useState([]);


    const { data: session } = useSession();
    const user = session?.user;
    const userId = user?.id;
    // console.log("userId", userId);

    const [getInquiries, { data, isLoading, isError }] = useGetUserInquiriesMutation();
    // console.log("getInquiries", data);
    // const [sendUserReply] = useSendUserReplyMutation();
    // const inquiries = data?.modifiedList || [];
    const inquiries = localInquiries;

    // console.log("inquiries", inquiries)
    const [addUserInquiryMessage] = useAddUserInquiryMessageMutation();

    const [activeReplyId, setActiveReplyId] = useState(null);
    const [messages, setMessages] = useState({});

    useEffect(() => {
        if (userId) {
            const fetchInquiries = async () => {
                try {
                    const res = await getInquiries(userId).unwrap();
                    if (res?.modifiedList) {
                        setLocalInquiries(res.modifiedList);
                    }
                } catch (err) {
                    console.error("Polling error:", err);
                }
            };

            fetchInquiries(); // initial load
            const interval = setInterval(fetchInquiries, 5000);
            return () => clearInterval(interval);
        }
    }, [userId, getInquiries]);



    useEffect(() => {
        if (data?.modifiedList) {
            setLocalInquiries(data.modifiedList);
        }
    }, [data]);





    const handleSend = async (inquiry) => {
        const message = messages[inquiry._id];
        if (!message?.trim()) {
            toast.warning("Message cannot be empty");
            return;
        }

        const payload = {
            userId,
            vendorId: inquiry?.vendorId,
            message,
            name: user?.name,
            email: user?.email,
            phone: user?.phone,
            weddingDate: user?.weddingDate,
        };

        try {
            const res = await addUserInquiryMessage(payload).unwrap();

            // ✅ Update localInquiries with new message
            setLocalInquiries((prev) =>
                prev.map((inq) =>
                    inq._id === inquiry._id
                        ? {
                            ...inq,
                            userMessage: [
                                ...inq.userMessage,
                                {
                                    message,
                                    createdAt: new Date().toISOString(),
                                    sender: "user",
                                },
                            ],
                        }
                        : inq
                )
            );

            setMessages((prev) => ({ ...prev, [inquiry._id]: "" }));
            setActiveReplyId(null);
            toast.success("Message sent successfully");
        } catch (error) {
            console.error("Send error:", error);
            toast.error(error?.data?.message || "Failed to send message");
        }
    };



    return (
        <main className="flex min-h-screen">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 w-full">
                <h2 className="text-xl font-bold mb-6">My Inquiries</h2>

                {inquiries.length > 0 ? (
                    <div className="space-y-6 ">
                        {inquiries.map((inquiry) => {
                            const inquiryId = inquiry._id;
                            const isOpen = openInquiryId === inquiryId;

                            return (
                                <div key={inquiryId} className="rounded-lg overflow-hidden border border-gray-200">
                                    {/* ✅ Always Visible Header */}
                                    <div
                                        onClick={() => setOpenInquiryId(isOpen ? null : inquiryId)}
                                        className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] p-4 flex justify-between items-center cursor-pointer"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-white">{inquiry.business || 'Dream Wedding Photographer'}</h3>
                                            <p className="text-sm text-white">Sent on {moment(inquiry.createdAt).format("DD MMM YYYY")}</p>
                                        </div>
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${inquiry.replyStatus === "Replied" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                                }`}
                                        >
                                            {inquiry.replyStatus === "Replied" ? "Replied" : "Pending"}
                                        </span>
                                    </div>

                                    {/* ✅ Collapsible Content */}
                                    {isOpen && (
                                        <>
                                            <div className="m-2 space-y-2">
                                                <div className="flex justify-start w-full">
                                                    <div className="p-2 border rounded border-gray-600 bg-gray-200 w-full">
                                                        {inquiry?.userMessage?.map((msg, i) => (
                                                            <div key={i}>
                                                                {/* User Message */}
                                                                <div className="m-2 rounded p-2 bg-white max-w-[50%]">
                                                                    <p className="text-gray-400 font-bold">Your Message:</p>
                                                                    <div className="my-2 flex justify-between items-end">
                                                                        <p className="text-gray-800">{msg?.message || "No message found."}</p>
                                                                        <span className="text-[12px] text-gray-500 text-end">
                                                                            {moment(msg?.createdAt).format("DD/MM/YYYY hh:mm")}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Vendor Reply */}
                                                                {/* Vendor Reply - Multiple Messages */}
                                                                {Array.isArray(msg?.vendorReply) && msg.vendorReply.length > 0 && (
                                                                    <div className="space-y-2 my-2">
                                                                        {msg.vendorReply.map((reply, index) => (
                                                                            <div key={index} className="flex justify-end">
                                                                                <div className="bg-sky-200 rounded p-3 w-[75%] max-w-[500px]">
                                                                                    <p className="text-gray-700 font-bold">
                                                                                        Reply from {inquiry?.business ?? 'Dream Wedding Photographer'}
                                                                                    </p>
                                                                                    <div className="flex justify-between items-end">
                                                                                        <p className="text-gray-800">{reply.message}</p>
                                                                                        <span className="text-[12px] text-gray-500 text-end">
                                                                                            {moment(reply.createdAt).format("DD/MM/YYYY hh:mm")}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 space-y-4">
                                                {inquiry.status === "replied" && (
                                                    <div className="bg-gray-50 p-3 rounded">
                                                        <p><strong>Reply from {inquiry.business || 'Dream Wedding Photographer'}:</strong></p>
                                                        {inquiry.vendorMessage?.length > 0 ? (
                                                            inquiry.vendorMessage.map((message, index) => (
                                                                <p key={index} className="text-sm p-2">
                                                                    {message.message}
                                                                </p>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-gray-500">No messages found.</p>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            setActiveReplyId(activeReplyId === inquiryId ? null : inquiryId)
                                                        }
                                                        className="border px-3 py-1 rounded text-sm flex items-center space-x-1"
                                                    >
                                                        <FiMessageSquare className="text-lg" /> <span>Reply</span>
                                                    </button>

                                                    <Link
                                                        href={`/preview-profile/${inquiry.vendorId}`}
                                                        className="flex items-center space-x-1 bg-wedding-blush border border-gray-300 text-sm px-3 py-1 rounded"
                                                    >
                                                        <IoEyeOutline size={20} className="text-lg text-gray-800 hover:underline" /> <span>View Vendor</span>
                                                    </Link>
                                                </div>

                                                {activeReplyId === inquiryId && (
                                                    <div className="border p-3 rounded bg-gray-50">
                                                        <div className="max-h-60 overflow-y-auto mb-4 space-y-2">
                                                            {inquiry.chatHistory?.map((chat, index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
                                                                >
                                                                    <div
                                                                        className={`max-w-xs p-2 rounded-lg text-sm ${chat.sender === "user"
                                                                            ? "bg-blue-100 text-right"
                                                                            : "bg-gray-200 text-left"
                                                                            }`}
                                                                    >
                                                                        <p>{chat.message}</p>
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            {new Date(chat.timestamp).toLocaleString()}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <textarea
                                                            className="w-full p-2 border rounded"
                                                            rows="3"
                                                            placeholder="Write your reply..."
                                                            value={messages[inquiryId] || ''}
                                                            onChange={(e) =>
                                                                setMessages((prev) => ({ ...prev, [inquiryId]: e.target.value }))
                                                            }
                                                        />
                                                        <div className="flex justify-end gap-2 mt-2">
                                                            <button onClick={() => setActiveReplyId(null)} className="border px-3 py-1 rounded">
                                                                Cancel
                                                            </button>
                                                            <button onClick={() => handleSend(inquiry)} className="bg-blue-600 text-white px-3 py-1 rounded">
                                                                Send
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}

                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Mail size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Inquiries Yet</h3>
                        <p className="text-gray-600 mb-4">
                            You haven't sent any inquiries to vendors. Browse vendors and contact them to start planning your wedding.
                        </p>
                        <button>
                            <Link href="/vendor">Browse Vendors</Link>
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}

