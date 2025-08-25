"use client"

import { useRef, useState } from 'react';
import { Calendar, Star, MapPin, Users } from 'lucide-react';
import { IoArrowBackOutline, IoArrowForwardSharp } from "react-icons/io5";

const events = [
    {
        id: '1',
        title: 'Corporate Annual Conference',
        date: '2024-09-12',
        location: 'Taj Palace, Delhi',
        attendees: 300,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04',
        description: 'A formal corporate event focusing on annual performance, goals, and networking.',
        venue: 'Taj Palace',
        organizer: 'XYZ Corp',
        budget: '₹20 Lakhs',
        highlights: ['Keynote speeches', 'Workshops', 'Networking'],
    },
    {
        id: '2',
        title: 'Tech Leadership Summit',
        date: '2024-10-05',
        location: 'JW Marriott, Bangalore',
        attendees: 450,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df',
        description: 'Summit for tech leaders to share industry trends and innovations.',
        venue: 'JW Marriott',
        organizer: 'TechNext',
        budget: '₹30 Lakhs',
        highlights: ['Tech talks', 'Leadership panels', 'Networking dinner'],
    },
    {
        id: '3',
        title: 'Finance Growth Conclave',
        date: '2024-08-20',
        location: 'ITC Grand Chola, Chennai',
        attendees: 220,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9',
        description: 'A conference on financial strategies and growth planning.',
        venue: 'ITC Grand Chola',
        organizer: 'Finverse Group',
        budget: '₹18 Lakhs',
        highlights: ['Financial planning', 'Investor meetups', 'Workshops'],
    },
    {
        id: '4',
        title: 'Women in Business Forum',
        date: '2024-11-15',
        location: 'Hyatt Regency, Mumbai',
        attendees: 280,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1603201667442-07f6d2c9c78e',
        description: 'Empowering women leaders through networking and learning.',
        venue: 'Hyatt Regency',
        organizer: 'SheLeads India',
        budget: '₹25 Lakhs',
        highlights: ['Panel discussions', 'Mentorship', 'Startup showcase'],
    },
    {
        id: '5',
        title: 'Green Business Expo',
        date: '2024-12-01',
        location: 'Eco Convention Centre, Hyderabad',
        attendees: 400,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4',
        description: 'Promoting sustainable business practices and green technologies.',
        venue: 'Eco Convention Centre',
        organizer: 'GreenIndia Org',
        budget: '₹22 Lakhs',
        highlights: ['Eco booths', 'Product demos', 'CSR Talks'],
    },
    {
        id: '6',
        title: 'Retail Innovation Meet',
        date: '2025-01-18',
        location: 'The Leela, Gurgaon',
        attendees: 320,
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1559027615-1ecc6a834ad0',
        description: 'A gathering of retail experts and innovators discussing the future of retail.',
        venue: 'The Leela',
        organizer: 'RetailX India',
        budget: '₹28 Lakhs',
        highlights: ['Retail tech', 'Product demos', 'Expert panels'],
    },
    {
        id: '7',
        title: 'Startup Pitch & Connect',
        date: '2024-07-25',
        location: 'WeWork, Pune',
        attendees: 180,
        rating: 4.2,
        image: 'https://images.unsplash.com/photo-1573166364302-5b4b42e525e6',
        description: 'Early-stage startups pitch ideas to investors and mentors.',
        venue: 'WeWork',
        organizer: 'Startup Ignite',
        budget: '₹10 Lakhs',
        highlights: ['Live pitching', 'Investor Q&A', 'Funding advice'],
    },
    {
        id: '8',
        title: 'Marketing Leaders Meetup',
        date: '2024-08-10',
        location: 'Ritz Carlton, Bangalore',
        attendees: 260,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
        description: 'Sharing strategies, tools, and trends for modern marketing.',
        venue: 'Ritz Carlton',
        organizer: 'Brand360',
        budget: '₹24 Lakhs',
        highlights: ['Workshops', 'Roundtables', 'Tech showcases'],
    },
    {
        id: '9',
        title: 'Annual HR Excellence Awards',
        date: '2025-02-22',
        location: 'Grand Hyatt, Goa',
        attendees: 500,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1573496529574-be85d6a60704',
        description: 'Celebrating top-performing HR teams and individuals.',
        venue: 'Grand Hyatt',
        organizer: 'HR World',
        budget: '₹35 Lakhs',
        highlights: ['Award ceremony', 'Gala dinner', 'Live performances'],
    },
    {
        id: '10',
        title: 'Logistics & Supply Chain Forum',
        date: '2025-03-05',
        location: 'Vivanta, Ahmedabad',
        attendees: 310,
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde16',
        description: 'Focused on innovation and efficiency in logistics and supply chain.',
        venue: 'Vivanta',
        organizer: 'ChainLink India',
        budget: '₹20 Lakhs',
        highlights: ['Case studies', 'Product demos', 'Vendor networking'],
    },
];

const SuccessfullEvents = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const carouselRef = useRef(null);


    const scrollLeft = () => {
        carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    };

    const scrollRight = () => {
        carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    };

    return (
        <>
            <div className="py-16 ">
                <div className="sm:mx-5">
                    {/* Heading */}
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-corporate-dark mb-4 font-playfair">
                            Previous Successful Events
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                            Take a look at some of our most successful events that we've helped organize at our partnered venues.
                        </p>
                    </div>

                    {/* Carousel Wrapper */}
                    <div className="relative lg:mx-16 p-2">
                        {/* Left Scroll Button */}
                        <button
                            onClick={scrollLeft}
                            style={{ borderRadius: '25px' }}
                            className="flex absolute  left-2 top-1/3 transform -translate-y-1/2 z-10 bg-white hover:bg-yellow-100 p-2  "
                        >
                            <IoArrowBackOutline />
                        </button>

                        {/* Carousel */}
                        <div
                            ref={carouselRef}
                            className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4
        [&::-webkit-scrollbar]:hidden /* Hide scrollbar for Chrome, Safari */
        [-ms-overflow-style: none] /* Hide scrollbar for Internet Explorer and Edge */
        [scrollbar-width: none] /* Hide scrollbar for Firefox */
    "
                        >
                            {events.map((event) => (
                                <div
                                    key={event.id}
                                    className=" min-w-[360px] sm:min-w-[362px] mx-2 lg:min-w-[443px] grid grid-cols-1 snap-start bg-white border rounded-lg  hover:shadow-lg transition cursor-pointer"
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    {/* Event Image */}
                                    <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-t-lg">
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                        <div className="absolute bottom-0 bg-gradient-to-t from-black/80 to-transparent w-full p-4">
                                            <h3 className="text-base sm:text-lg font-semibold text-white">{event.title}</h3>
                                            <p className="text-xs sm:text-sm text-white">{event.venue}</p>
                                        </div>
                                    </div>

                                    {/* Event Info */}
                                    <div className="p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center text-corporate-primary text-xs sm:text-sm">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {event.date}
                                            </div>
                                            <div className="flex items-center text-xs sm:text-sm">
                                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                                <span className="font-semibold">{event.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-600">Attended by {event.attendees} people</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right Scroll Button */}
                        <button
                            onClick={scrollRight}
                            style={{ borderRadius: '25px' }}
                            className="flex absolute right-2 top-1/3 transform -translate-y-1/2 z-10 bg-white hover:bg-yellow-100 p-2  "
                        >
                            <IoArrowForwardSharp className="text-black" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
                    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
                        >
                            ✕
                        </button>
                        <h4 className="text-xl sm:text-2xl font-bold text-corporate-dark mb-4">{selectedEvent.title}</h4>
                        <div className="h-48 sm:h-64 mb-4">
                            <img
                                src={selectedEvent.image}
                                alt={selectedEvent.title}
                                className="w-full h-full object-cover rounded"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center space-x-2 text-sm">
                                <Calendar className="h-5 w-5 text-corporate-primary" />
                                <span>{selectedEvent.date}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <MapPin className="h-5 w-5 text-corporate-primary" />
                                <span>{selectedEvent.location}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <Users className="h-5 w-5 text-corporate-primary" />
                                <span>{selectedEvent.attendees} attendees</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <Star className="h-5 w-5 text-yellow-500" />
                                <span>{selectedEvent.rating}/5</span>
                            </div>
                        </div>
                        <p className="mb-4 text-sm sm:text-base">{selectedEvent.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2  gap-x-10 mb-4 text-gray-800">
                            <div>
                                <h5 className="font-semibold text-base mb-1">Venue</h5>
                                <p className="text-sm">{selectedEvent.venue}</p>
                            </div>
                            <div>
                                <h5 className="font-semibold text-base mb-1">Organizer</h5>
                                <p className="text-sm">{selectedEvent.organizer}</p>
                            </div>
                            <div>
                                <h5 className="font-semibold text-base mb-1">Budget</h5>
                                <p className="text-sm">{selectedEvent.budget}</p>
                            </div>
                        </div>


                        {selectedEvent.highlights?.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-base sm:text-lg mb-2">Event Highlights</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                                    {selectedEvent.highlights.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default SuccessfullEvents;
