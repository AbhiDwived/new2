"use client"

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetVendorsFaqsMutation } from '@/features/vendors/vendorAPI';
import { useParams } from 'next/navigation';
import { BsFillPatchQuestionFill } from "react-icons/bs";

const FaqQuestions = () => {
  // const vendor = useSelector((state) => state.vendor.vendor);
  // const vendorId = vendor?.id;
  const { vendorId } = useParams();
  // console.log("vendorId", vendorId);

  const [getVendorsFaqs, { data, isLoading, isError, error }] = useGetVendorsFaqsMutation();
  //  console.log("datafaqqqq", data);

  useEffect(() => {
    if (vendorId) {
      getVendorsFaqs({ vendorId });
    }
  }, [vendorId, getVendorsFaqs]);

  if (isLoading) return <div>Loading FAQs...</div>;
  if (isError) return <div>Error loading FAQs: {error?.data?.message || 'Something went wrong'}</div>;

  return (
    <div className="bg-white p-2 md:p-10 rounded-lg shadow-sm text-gray-800 font-serif">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">Frequently Asked Questions</h2>
      <div className="space-y-6 text-base leading-relaxed ml-5">
        {data?.faqs && data.faqs.length > 0 ? (
          data.faqs.map((faq, index) => (
            <div  key={index}
            className=""
            >
              <span className="inline-flex items-center text-xl text-gray-800">
  {/* <BsFillPatchQuestionFill className="mr-2 text-[#0f4c81]" /> */}
  <span>{faq.question}?</span>
</span>
              <p className="text-gray-600 ">{faq.answer}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No FAQs available for this vendor.</p>
        )}
      </div>
    </div>
  );
};

export default FaqQuestions;
