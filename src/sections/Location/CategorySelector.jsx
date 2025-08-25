"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { useGetVendorCountsByLocationQuery } from '@/features/admin/adminAPI';

const CategorySelector = ({ categories, formattedCity }) => {
    const router = useRouter();
    const city = formattedCity?.toLowerCase().replace(/\s+/g, '-') || 'all-india';
    const { data: vendorCounts, isLoading } = useGetVendorCountsByLocationQuery(city);

    const handleCategoryClick = (categoryId) => {
        const citySlug = formattedCity?.toLowerCase().replace(/\s+/g, '-') || 'all-india';
        router.push(`/vendors/${citySlug}/${categoryId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-5 sm:px-6 lg:px-8">
            <div className="max-w-8xl lg:mx-14">
                <div className="text-center mb-5">
                    <h2 className="text-4xl font-serif text-gray-800 ">
                        Choose Your Category
                    </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
                    {categories.map(({ id, title, subtitle, icon: Icon }) => {
                        // Get the count for this category
                        const count = vendorCounts?.categoryCounts[title] || 0;
                        
                        return (
                            <div
                                key={id}
                                onClick={() => handleCategoryClick(id)}
                                className="border rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group hover:border-gray-200"
                            >
                                <div className="py-3 text-center">
                                    <div className="flex justify-center mb-6">
                                        <div style={{borderRadius:"25px"}} className="w-12 h-12 bg-gray-200 flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
                                            <Icon
                                                size={20}
                                                className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300"
                                            />
                                        </div>
                                    </div>
                                    <h6 className="text-lg font-serif text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                                        {title}
                                    </h6>
                                    <p className="text-sm text-gray-500 font-medium tracking-wide">
                                        {subtitle} {!isLoading && `(${count})`}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CategorySelector;
