"use client"

import React, { useState, useEffect } from 'react';
import moment from "moment";
import { useReplyToInquiryMutation } from "@/features/inquiries/inquiryAPI";
import { useUserInquiryReplyMutation, useUserInquiryListQuery } from "@/features/vendors/vendorAPI";

import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaUser, FaUserSecret } from 'react-icons/fa';

const InquiryReply = ({ inquiry, onBack, refetch }) => {
  const [replyToInquiry, { isLoading }] = useReplyToInquiryMutation();
  const vendor = useSelector((state) => state.vendor.vendor);
  const vendorId = vendor.id;
  const [replyText, setReplyText] = useState("");
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [replyTouserInquiry, { isLoading: replyinquiryLoading }] = useUserInquiryReplyMutation();
  const [localInquiry, setLocalInquiry] = useState(inquiry);

  const {
    data: inquiryResponse,
    isLoading: inquiryLoading,
    isError,
    error,
    refetch: refetchInquiries, // get refetch function

  } = useUserInquiryListQuery(vendorId, {
    skip: !vendorId,
  });

  const inquiries = inquiryResponse?.data || [];
  useEffect(() => {
    const interval = setInterval(() => {
      refetchInquiries(); // pull new data
    }, 5000);
    return () => clearInterval(interval);
  }, [refetchInquiries]);

  useEffect(() => {
    const latest = inquiries.find((i) => i._id === inquiry._id);
    if (latest) {
      setLocalInquiry(latest);
    }
  }, [inquiries, inquiry._id]);


  // console.log("vendor", vendor.id);
  // Determine if inquiry is anonymous (no userId)
  const isAnonymous = !inquiry.userId;

  // Format date safely
  const formatDate = (date) => {
    return date ? moment(date).format("DD/MM/YYYY hh:mm") : "N/A";
  };

  // For threaded reply (logged-in user)
  const handleSendReply = async (msg) => {
    if (!replyText.trim()) {
      toast.error("Please type a reply before sending.");
      return;
    }

    const userId = inquiry?.userId?._id || inquiry?.userId;
    const vendorId = vendor?.id || vendor?._id;
    const inquiryId = inquiry?._id;

    const payload = {
      inquiryId,
      userId,
      vendorId,
      replyMessage: replyText,
    };

    try {
      const response = await replyTouserInquiry(payload).unwrap();

      const updatedUserMessage = localInquiry.userMessage.map((m) =>
        m._id === msg._id
          ? {
            ...m,
            vendorReply: [
              ...(m.vendorReply || []),
              {
                message: replyText,
                createdAt: new Date().toISOString(),
              },
            ],
          }
          : m
      );

      setLocalInquiry((prev) => ({
        ...prev,
        userMessage: updatedUserMessage,
        replyStatus: 'Replied',
      }));

      toast.success("Reply sent successfully!");
      setReplyText("");
      setActiveMessageId(null);
      refetchInquiries(); // ensure background list also updates
      refetch();          // optional parent refresh
    } catch (error) {
      console.error("Reply Error:", error);
      toast.error(error?.data?.message || "Failed to send reply");
    }
  };



  const handleUseTemplate = () => {
    const template = `Thank you for your interest in our services! We would love to be a part of your special day.\n\nFor the date you mentioned, we are available and offer several packages:\n\n- Basic: ₹10,000 (4 hours coverage)\n- Standard: ₹25,000 (Full day)\n- Premium: ₹50,000 (Full day + Pre-wedding)\n\nPlease let me know if you'd like to schedule a call to discuss further details or have any questions.\n\nBest regards,\n${vendor?.businessName || 'Your Business Name'}`;
    setReplyText(template);
  };

  // Get inquiry details based on type


  const getInquiryDetails = () => {
    if (isAnonymous) {
      return {
        name: localInquiry.name,
        email: localInquiry.email,
        phone: localInquiry.phone,
        weddingDate: localInquiry.weddingDate,
        message: localInquiry.message,
        status: localInquiry.status,
        vendorReply: localInquiry.vendorReply,
        createdAt: localInquiry.createdAt
      };
    } else {
      return {
        name: localInquiry.userId?.name,
        email: localInquiry.userId?.email,
        phone: localInquiry.userId?.phone,
        weddingDate: localInquiry.weddingDate,
        message: localInquiry.userMessage?.[localInquiry.userMessage.length - 1]?.message,
        status: localInquiry.replyStatus,
        vendorReply: localInquiry.userMessage?.[localInquiry.userMessage.length - 1]?.vendorReply,
        createdAt: localInquiry.createdAt
      };
    }
  };


  const details = getInquiryDetails();

  return (
    <div className="max-w-4xl mx-auto p-3 bg-white rounded-md shadow border font-serif">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {isAnonymous ? (
              <FaUserSecret className="text-orange-500" />
            ) : (
              <FaUser className="text-blue-500" />
            )}
            <h2 className="text-xl font-semibold">
              {isAnonymous ? 'Inquiry Details' : 'Reply to Inquiry'}
            </h2>
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${isAnonymous
              ? 'bg-orange-100 text-orange-700'
              : 'bg-blue-100 text-blue-700'
              }`}>
              {isAnonymous ? 'Anonymous User' : 'Logged-in User'}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            From: <span className="font-medium">{details.name || "Unknown User"}</span>
          </p>
        </div>
        <button
          className="text-sm border px-3 py-1 rounded hover:bg-[#DEBF78]"
          onClick={onBack}
        >
          Back to List
        </button>
      </div>

      {/* Inquiry Details */}
      <div className="bg-gray-50 p-2 rounded-lg mb-4">
        <h3 className="font-semibold text-lg mb-3">Inquiry Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">Name:</span> {details.name}
          </div>
          <div>
            <span className="font-medium">Email:</span> {details.email}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {details.phone}
          </div>
          {details.weddingDate && (
            <div>
              <span className="font-medium">Wedding Date:</span> {details.weddingDate}
            </div>
          )}
          <div className="md:col-span-2">
            <span className="font-medium">Status:</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${details.status === 'Replied'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
              }`}>
              {details.status}
            </span>
          </div>
        </div>
      </div>

      {/* Message Thread for logged-in user inquiries */}
      {!isAnonymous ? (

        <div className="space-y-2">
          {localInquiry?.userMessage?.map((msg, i) => (
            <div key={i} className=" pb-2 last:border-b-0">

              {/* Clickable message to toggle reply */}
              <div
                className="bg-gray-100 p-2 rounded-lg max-w-[50%] cursor-pointer"
                onClick={() =>
                  setActiveMessageId((prev) => (prev === msg._id ? null : msg._id))
                }
              >
                <p className="text-gray-800">{msg?.message}</p>
                <span className="text-xs text-gray-500 block mt-1 text-right">
                  {formatDate(msg?.createdAt)}
                </span>
              </div>

              {/* Show vendor replies if available */}
              {Array.isArray(msg?.vendorReply) && msg.vendorReply.length > 0 && (
                <div className="space-y-2 mt-1">
                  {msg.vendorReply.map((reply, index) => (
                    <div key={index} className="flex justify-end">
                      <div className="bg-sky-100 p-3 rounded-lg w-full max-w-[50%] text-sm shadow">
                        <p className="text-gray-800">{reply.message}</p>
                        <span className="text-xs text-gray-500 block mt-1 text-right">
                          {formatDate(reply.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Box - shown only when clicked */}
              {!msg?.vendorReply?.message && activeMessageId === msg._id && (
                <div className="mt-2">
                  <textarea
                    className="w-full border rounded p-2 text-sm min-h-[80px] focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Type your response here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      className={`text-white px-3 py-1 rounded bg-[#0f4c81] text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => handleSendReply(msg)}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending...' : 'Send Reply'}
                    </button>
                    <button
                      className="border px-3 py-1 rounded text-sm hover:bg-[#DEBF78]"
                      onClick={handleUseTemplate}
                      disabled={isLoading}
                    >
                      Use Template
                    </button>
                    <button
                      className="border px-3 py-1 rounded text-sm hover:bg-gray-100"
                      onClick={() => {
                        setActiveMessageId(null);
                        setReplyText("");
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>



      ) : (
        // Anonymous inquiry: show only details and original message
        <div className="space-y-2">
          {/* Original Message */}
          <div className="border-b pb-2">
            <div className="bg-gray-100 p-2 rounded-lg max-w-[80%]">
              <p className="text-gray-800">{details.message}</p>
              <span className="text-xs text-gray-500 block mt-1">
                {formatDate(details.createdAt)}
              </span>
            </div>
          </div>
          {/* Vendor Reply (if exists) */}
          {details.vendorReply?.message && (
            <div className="flex justify-end">
              <div className="bg-sky-100 p-2 rounded-lg max-w-[80%]">
                <p className="text-gray-800">{details.vendorReply.message}</p>
                <span className="text-xs text-gray-500 block mt-1">
                  {formatDate(details.vendorReply.createdAt)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Global Reply Box for latest user message */}
      {localInquiry?.userMessage?.length > 0 && (
        <div className="mt-6  pt-4">
          {/* <h3 className="font-semibold text-md mb-2 text-gray-700">Reply to Latest Message</h3> */}
          <textarea
            className="w-full border rounded p-2 text-sm min-h-[80px] focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Type your response here..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              className={`text-white px-3 py-1 rounded bg-[#0f4c81] text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              // onClick={() => handleSendReply(inquiry.userMessage[inquiry.userMessage.length - 1])} 
              onClick={() => handleSendReply(localInquiry.userMessage[localInquiry.userMessage.length - 1])}

              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reply'}
            </button>
            <button
              className="border px-3 py-1 rounded text-sm hover:bg-[#DEBF78]"
              onClick={handleUseTemplate}
              disabled={isLoading}
            >
              Use Template
            </button>
            <button
              className="border px-3 py-1 rounded text-sm hover:bg-gray-100"
              onClick={() => setReplyText("")}
              disabled={isLoading}
            >
              Clear
            </button>
          </div>
        </div>
      )}




    </div>
  );
};

export default InquiryReply;