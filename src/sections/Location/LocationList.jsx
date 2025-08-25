"use client"

import React, { useState, useEffect } from 'react';
import { Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { VscCircleFilled } from "react-icons/vsc";

// Slugify helper function
const slugify = (text) =>
    text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const baseCategories = {
    "Wedding Venues & Halls": [
        'best hotels near me', 'wedding halls near me', 'wedding reception venues near me', 'wedding places near me',
       ],
    "Hotels & Resorts": [
        'hotels and resorts', 'hotels near me', 'rooms near me', 'hotel rooms near me', 'resorts near me',
    
    ],
    "Banquet Halls & Reception Venues": [
        'banquet banquet hall', 'banquet hall banquet hall', 'banquet halls near me', 'marriage hall near me',
        
    ],
    "Wedding Planning & Event Management": [
        'event planners near me', 'wedding planner', 'wedding event management', 'personalized wedding planner',
        ],
    "Wedding Photography & Videography": [
        'wedding studio photoshoot', 'wedding photo shoot', 'bridal photography near me', 'wedding photoshoot near me',
        ],
    "Bridal Makeup & Beauty Services": [
        'makeup artist', 'makeup artist near me', 'wedding makeup', 'affordable makeup artist near me',
        ],
    "Wedding Decorations & Event Decor": [
        'wedding decor', 'bridal shower decorations', 'wedding decorators near me', 'simple wedding decorations',
       ],
    "Wedding Services & Catering": [
        'wedding bouquets', 'wedding catering', 'beach wedding'
    ]
};

const categories = Object.entries(baseCategories).map(([category, items]) => ({
    category,
    items: items
}));



const WeddingServices = () => {
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="px-4 md:px-10 lg:mx-10 py-8">
            <h2 className="lg:text-3xl md:text-3xl text-2xl mb-6 lg:mx-7 md:mx-7 text-gray-800">
                Wedding Services
            </h2>

            {isSmallScreen ? (
                // Small Screens - Accordion Layout
                <div className="mt-5">
                    <Accordion defaultActiveKey="0" alwaysOpen>
                        {categories.map((cat, catIdx) => {
                            const categorySlug = slugify(cat.category);
                            return (
                                <Accordion.Item eventKey={String(catIdx)} key={catIdx}>
                                    <Accordion.Header>{cat.category}</Accordion.Header>
                                    <Accordion.Body>
                                        <ul className="space-y-1 text-sm">
                                            {cat.items.map((item, itemIdx) => (
                                                <li
                                                    key={itemIdx}
                                                    style={{ marginLeft: '-30px' }}
                                                    className="cursor-pointer flex items-start"
                                                >
                                                    <VscCircleFilled className="mt-1 mr-1 text-gray-700" />
                                                    <span className="text-black">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            );
                        })}
                    </Accordion>
                </div>
            ) : (
                // Desktop View - Grid
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:mt-4">
                    {categories.map((cat, catIdx) => {
                        return (
                            <div key={catIdx} className="mb-4 lg:mt-5">
                                <p className="font-semibold text-gray-700 mb-1 text-sm lg:mx-8 md:mx-8 mt-3">
                                    {cat.category}
                                </p>
                                <ul className="space-y-1 text-sm">
                                    {cat.items.map((item, itemIdx) => (
                                        <li key={itemIdx} className="cursor-pointer">
                                            <span className="text-black hover:text-blue-700">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default WeddingServices;
