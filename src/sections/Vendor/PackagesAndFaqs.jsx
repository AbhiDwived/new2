"use client"

import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import {
  useAddservicesPackageMutation,
  useUpdateservicesPackageMutation,
  useVendorservicesPackageListMutation,
  useDeleteServicePackagesMutation,
  useAddFaqMutation,
  useGetVendorsFaqsMutation,
  useDeleteFaqsMutation

} from "@/features/vendors/vendorAPI.js";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function PackagesAndFaqs() {

  const [newPackage, setNewPackage] = useState({ packageName: "", description: "", services: "", price: "", offerPrice: "" });
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [packages, setPackages] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingPackage, setEditingPackage] = useState({
    packageId: '',
    packageName: '',
    services: '',
    description: '',
    price: '',
    offerPrice: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [faqs, setFaqs] = useState([]);
const [deletingFaqId, setDeletingFaqId] = useState(null);




  const vendor = useSelector((state) => state.vendor.vendor);
  const isAuthenticated = useSelector((state) => state.vendor.isAuthenticated);
  // const vendorId = vendor?._id || vendor?.id;
  const vendorId = vendor?.id;

  const [deleteFaqs, { isLoading: faqDelete, isSuccess: faqDeleteSuccess, isError: faqDeleteError, error: deleteFaqError }] = useDeleteFaqsMutation();

  const [addservicesPackage, { isLoading, isError, isSuccess, error: addPackageError }] = useAddservicesPackageMutation();

  const [updateservicesPackage] = useUpdateservicesPackageMutation();
  const [vendorservicesPackageList] = useVendorservicesPackageListMutation();
  const [deleteServicePackages] = useDeleteServicePackagesMutation();
  const [addFaqApi] = useAddFaqMutation();
  const [getVendorsFaqs] = useGetVendorsFaqsMutation();

  useEffect(() => {
    const fetchVendorPackages = async () => {
      if (!vendorId) return console.error("Vendor ID missing.");
      try {
        const res = await vendorservicesPackageList({ vendorId }).unwrap();

        setPackages(res.packages || []);
      } catch (err) {
        console.error("Error fetching vendor packages:", err);
      }
    };

    fetchVendorPackages();
  }, [vendorId]);

  const editPackage = (index) => {
    const pkg = packages[index];
    setEditingIndex(index);
    setEditingPackage({
      packageId: pkg._id,
      packageName: pkg.packageName,
      services: pkg.services,
      description: pkg.description,
      price: pkg.price,
      offerPrice: pkg.offerPrice,
    });
    setIsModalOpen(true);
  };


  const addPackage = async () => {
    if (newPackage.packageName && newPackage.price) {
      const payload = {
        vendorId,
        packageName: newPackage.packageName,
        services: newPackage.services,
        description: newPackage.description,
        price: Number(newPackage.price),
        offerPrice: Number(newPackage.offerPrice || 0)
      };

      try {
        await addservicesPackage(payload).unwrap();
        const updatedRes = await vendorservicesPackageList({ vendorId }).unwrap();
        setPackages(updatedRes.packages || []);
        setNewPackage({ packageName: "", description: "", services: "", price: "", offerPrice: "" });
      } catch (err) {
        console.error("Failed to add package:", err);
      }
    }
  };




  const updatePackageHandler = async () => {
    try {
      const payload = {
        packageId: editingPackage.packageId,
        vendorId,
        packageName: editingPackage.packageName,
        services: editingPackage.services,
        description: editingPackage.description,
        price: Number(editingPackage.price),
        offerPrice: Number(editingPackage.offerPrice),
      };

      await updateservicesPackage(payload).unwrap();
      alert("Package updated successfully!");

      const updatedRes = await vendorservicesPackageList({ vendorId }).unwrap();
      setPackages(updatedRes.packages || []);

      // Reset
      setEditingPackage({ packageId: '', packageName: '', services: '', description: '', price: '', offerPrice: '' });
      setEditingIndex(null);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update package.");
    }
  };

  const handleDeletePackage = async (packageId) => {



    if (!window.confirm('Are you sure you want to delete this package?')) return;

    try {
      await deleteServicePackages({ packageId }).unwrap();
      alert("Package deleted successfully!");

      // Optionally refetch or remove locally
      const res = await vendorservicesPackageList({ vendorId }).unwrap();
      setPackages(res.packages || []);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete package.");
    }
  };

  // const [faqs, setFaqs] = useState([
  //   {
  //     question: "How far in advance should I book?",
  //     answer: "We recommend booking at least 6 months in advance for peak wedding season (October-February) and 3-4 months for off-season dates."
  //   },
  //   {
  //     question: "Do you travel to other cities?",
  //     answer: "Yes, we do! We cover all major cities in India. Travel and accommodation charges may apply for destinations outside Delhi NCR."
  //   }
  // ]);

  const addFaq = async () => {
    if (!newFaq.question || !newFaq.answer) return;

    try {
      await addFaqApi({
        vendorId,
        question: newFaq.question,
        answer: newFaq.answer
      }).unwrap();

      // alert("FAQ added successfully!");
      toast.success("FAQ added successfully!");
      const faqRes = await getVendorsFaqs({ vendorId }).unwrap();
    setFaqs(faqRes.faqs || []);

      // Optionally update local state (if FAQs are stored)
      // setFaqs([...faqs, newFaq]);

      // Reset input
      setNewFaq({ question: "", answer: "" });
    } catch (error) {
      console.error("Failed to add FAQ:", error);
      alert("Failed to add FAQ");
    }
  };

  // const handleDelete = async (vendorId, faqId) => {
  //   console.log("vendorId", vendorId, "faqId", faqId)
  //   try {
  //     await deleteFaqs({ vendorId, faqId }).unwrap();
  //     console.log('FAQ deleted successfully');
  //     alert('FAQ deleted successfully');

  //     // Refetch FAQ list from backend
  //     const faqRes = await getVendorsFaqs({ vendorId }).unwrap();
  //     setFaqs(faqRes.faqs || []);
  //   } catch (err) {
  //     console.error('Failed to delete FAQ:', err);
  //   }
  // };


  const handleDelete = async (vendorId, faqId) => {
  setDeletingFaqId(faqId);
  try {
    await deleteFaqs({ vendorId, faqId }).unwrap();
    toast.success("FAQ deleted successfully");

    const faqRes = await getVendorsFaqs({ vendorId }).unwrap();
    setFaqs(faqRes.faqs || []);
  } catch (err) {
    console.error('Failed to delete FAQ:', err);
    toast.error("Failed to delete FAQ");
  } finally {
    setDeletingFaqId(null);
  }
};


  useEffect(() => {
    const fetchVendorData = async () => {
      if (!vendorId) return;

      try {
        // Fetch packages
        const packageRes = await vendorservicesPackageList({ vendorId }).unwrap();
        setPackages(packageRes.packages || []);

        // Fetch FAQs
        const faqRes = await getVendorsFaqs({ vendorId }).unwrap();
        setFaqs(faqRes.faqs || []);
      } catch (err) {
        console.error("Error fetching vendor data:", err);
      }
    };

    fetchVendorData();
  }, [vendorId]);



  if (!isAuthenticated) {
    return <h5 className='text-gray-600 font-bold'>You are not logged in.</h5>;
  }

  return (

    
    <div className="p-2 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

      
      <div className="border rounded-lg p-4 shadow-sm">
        <h2 className="text-[14px] font-semibold mb-1 font-serif">Service Packages</h2>
        <p className="text-[14px] text-gray-500 mb-4">Define your service offerings and pricing</p>

        {packages.map((pkg, idx) => (
          <div key={idx} className="flex justify-between items-center border p-3 mb-2 rounded-lg">
            <div>
              <h3 className="font-[8px] font-serif">{pkg.packageName}</h3>
              {/* <p className="text-sm text-gray-500">{pkg.description}</p> */}
              <p className="text-sm text-gray-500 break-words ">{pkg.description}</p>
              <p className="text-sm text-gray-500 break-words ">{pkg.services}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">₹{pkg.price.toLocaleString("en-IN")}</p>
              <div className="flex flex-wrap justify-end gap-2 mt-2">
                <button className="text-white bg-[#0f4c81] px-3 py-1 rounded" onClick={() => editPackage(idx)} >Edit</button>
                <button className="text-white bg-red-500 px-3 py-1 rounded" onClick={() => handleDeletePackage(pkg._id)}>Remove</button>
              </div>
            </div>
          </div>
        ))}

        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium mb-2 font-serif">Add New Package</h3>
          <input className="w-full mb-2 p-2 border rounded" placeholder="Package Name" value={newPackage.packageName} onChange={(e) => setNewPackage({ ...newPackage, packageName: e.target.value })} />
          <input className="w-full mb-2 p-2 border rounded" placeholder="Description" value={newPackage.description} onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })} />
          <input className="w-full mb-2 p-2 border rounded" placeholder="Service Type" value={newPackage.services} onChange={(e) => setNewPackage({ ...newPackage, services: e.target.value })} />
          <input className="w-full mb-2 p-2 border rounded" placeholder="Price" type="number" value={newPackage.price} onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })} />
          <input className="w-full mb-2 p-2 border rounded" placeholder="Offer Price (optional)" type="number" value={newPackage.offerPrice} onChange={(e) => setNewPackage({ ...newPackage, offerPrice: e.target.value })} />
          <button className="bg-[#0f4c81] text-white px-4 py-2 rounded" onClick={addPackage}>Add Package</button>
        </div>
      </div>

      <div className="border rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-1 font-serif">Frequently Asked Questions</h2>
        <p className="text-sm text-gray-500 mb-4">Answer common client questions</p>

        {faqs.map((faq, index) => (
          <details key={index} className="mb-3">
            <summary className="cursor-pointer font-medium text-[#0f4c81]">{faq.question}</summary>
            <p className="text-sm mt-1 text-gray-700">{faq.answer}</p>
            <button
              onClick={() => handleDelete(vendorId, faq._id)}
              className="bg-red-500 text-white px-3 py-1 rounded mt-2"
              // disabled={faqDelete}
               disabled={deletingFaqId === faq._id}
            >
              {/* {faqDelete ? 'Deleting...' : 'Delete'} */}
               {deletingFaqId === faq._id ? 'Deleting...' : 'Delete'}
            </button>

          </details>
        ))}

        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium mb-2 font-serif">Add New FAQ</h3>
          <input className="w-full mb-2 p-2 border rounded" placeholder="Question" value={newFaq.question} onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })} />
          <textarea className="w-full mb-2 p-2 border rounded" placeholder="Answer" rows={3} value={newFaq.answer} onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}></textarea>
          <button className="bg-[#0f4c81] text-white px-4 py-2 rounded" onClick={addFaq}>Add FAQ</button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Package</h2>

            <input
              className="w-full mb-2 p-2 border rounded"
              value={editingPackage.packageName}
              onChange={(e) => setEditingPackage({ ...editingPackage, packageName: e.target.value })}
              placeholder="Package Name"
            />
            <input
              className="w-full mb-2 p-2 border rounded"
              value={editingPackage.description}
              onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
              placeholder="Description"
            />
            <input
              className="w-full mb-2 p-2 border rounded"
              value={editingPackage.services}
              onChange={(e) => setEditingPackage({ ...editingPackage, services: e.target.value })}
              placeholder="Services"
            />
            <input
              className="w-full mb-2 p-2 border rounded"
              type="number"
              value={editingPackage.price}
              onChange={(e) => setEditingPackage({ ...editingPackage, price: e.target.value })}
              placeholder="Price"
            />
            <input
              className="w-full mb-4 p-2 border rounded"
              type="number"
              value={editingPackage.offerPrice}
              onChange={(e) => setEditingPackage({ ...editingPackage, offerPrice: e.target.value })}
              placeholder="Offer Price"
            />

            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={async () => {
                  await updatePackageHandler();
                  setIsModalOpen(false); // close modal after update
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ✅ Add ToastContainer here to enable toasts */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />

    </div>
  );
}



