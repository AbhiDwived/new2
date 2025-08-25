"use client"

import { FaCamera } from 'react-icons/fa';
import { useGetVendorByIdQuery, useVendorservicesPackageListMutation } from '@/features/vendors/vendorAPI';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';

const PreviewProfileScreen = () => {
  const { vendorId } = useParams();
  const [packages, setPackages] = useState([]);
  const [getVendorPackages] = useVendorservicesPackageListMutation();

  const { data: vendor, isLoading: isVendorLoading, error: vendorError } = useGetVendorByIdQuery(vendorId, {
    skip: !vendorId || vendorId === 'undefined'
  });

  // Handle vendor error
  useEffect(() => {
    if (vendorError) {
      toast.error('Failed to load vendor information');
    }
  }, [vendorError]);

  //Fetch Packages 
  useEffect(() => {
    const fetchPackages = async () => {
      const actualVendorId = vendor?.vendor?._id;

      if (!actualVendorId) {
        return;
      }

      try {
        const response = await getVendorPackages({ vendorId: actualVendorId }).unwrap();

        if (response?.packages && Array.isArray(response.packages)) {
          setPackages(response.packages);
        } else {
          setPackages([]);
        }
      } catch (error) {
        toast.error('Failed to load vendor packages');
        setPackages([]);
      }
    };

    if (!isVendorLoading && vendor?.vendor?._id) {
      fetchPackages();
    }
  }, [vendor, isVendorLoading, getVendorPackages]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 ">
        {/* Left Section */}
        <div className="lg:col-span-4 space-y-6">
          {/* About */}
          <div>
            <h2 className="text-xl font-semibold mb-2">{vendor?.vendor?.businessName}</h2>
            <p className="text-gray-700 text-sm md:text-base">
             {vendor?.vendor?.description}
            </p>
          </div>

          {/* Services */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
              {vendor?.vendor?.services?.length > 0 &&
                typeof vendor.vendor.services[0] === "string" ? (
                vendor.vendor.services[0]
                  .split(",")
                  .map(service => service.trim())
                  .filter(service => service)
                  .map((service, index) => (
                    <span key={index} className="flex items-center">
                      <FaCamera className="inline mr-2 shrink-0" /> {service}
                    </span>
                  ))
              ) : (
                <span className="text-gray-500 col-span-2">No services available.</span>
              )}
            </div>
          </section>

          {/* Pricing */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Pricing</h2>
            <p className="text-gray-700 mb-4 text-sm md:text-base">We offer customized packages to suit your needs:</p>

            <div className="space-y-4 text-sm md:text-base">
              {packages.length > 0 ? (
                packages.map((pkg, index) => (
                  <div
                    key={pkg._id}
                    className={`p-4 rounded-md ${index % 2 === 1 ? 'bg-gray-50 border' : ''}`}
                  >
                    <h3 className="font-semibold">
                      {pkg.packageName}
                      {pkg.price > 0 && ` (₹${pkg.price.toLocaleString()})`}
                    </h3>

                    <ul className="list-disc list-inside text-gray-700 mt-2">
                      {pkg.description && <li>{pkg.description}</li>}

                      {pkg.services?.flatMap((s) =>
                        s.split('+').map((service, i) => (
                          <li key={`${service}-${i}`}>{service.trim()}</li>
                        ))
                      )}
                    </ul>

                    {/* {pkg.offerPrice > 0 && (
                      <div className="text-green-600 mt-2 text-sm">
                        Offer Price: ₹{pkg.offerPrice.toLocaleString()} ({pkg.offerPercentage}% OFF)
                      </div>
                    )} */}
                    {pkg.offerPrice > 0 && pkg.price > 0 && (
                      <div className="text-green-600 mt-2 text-sm">
                        Offer Price: ₹{pkg.offerPrice.toLocaleString()} (
                        {Math.round(((pkg.price - pkg.offerPrice) / pkg.price) * 100)}% OFF)
                      </div>
                    )}


                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No packages available.</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Section */}
        {/*  */}
      </div>

      {/* <SimilarVendors /> */}
    </>
  );
};

export default PreviewProfileScreen;
