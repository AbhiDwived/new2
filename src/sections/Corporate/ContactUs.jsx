"use client"

import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';
import { useSubmitContactFormMutation } from '@/features/auth/authAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ContactUs() {
    // Scroll to top smoothly when component loads
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    const [submitContact, { isLoading }] = useSubmitContactFormMutation();

    const resetForm = () => {
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !phone || !message.trim()) {
            toast.error('Please fill in all fields.');
            return;
        }

        // console.log('Form submitted:', { name, email, phone, message });
        // Phone validation: must be exactly 10 digits, no country code, no spaces
        if (!/^[0-9]{10}$/.test(phone)) {
            toast.error('Phone number must be exactly 10 digits.');
            return;
        }

        try {
            await submitContact({ name, email, phone, message }).unwrap();
            toast.success('Your message has been sent successfully!');
            resetForm();
        } catch (err) {
            // console.error('Error submitting form:', err);
            // toast.error('Failed to send message. Please try again later.');

            const errorMessage =
    err?.data?.message ||
    err?.data?.error ||
    err?.error ||
    "Failed to send message. Please try again later.";

  toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900">Contact Us</h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Have questions or need help? We'd love to hear from you!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Get In Touch</h2>
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <FaMapMarkerAlt className="text-blue-600 mt-1 mr-4" size={20} />
                                <Link href='https://www.google.com/maps/dir/?api=1&destination=A-223%2C+Sector+151%2C+Noida%2C+Uttar+Pradesh+201310' target="_blank"
                                    rel="noopener noreferrer"
                                    style={{textDecoration:'none'}}
                                    className="inline-block transition text-black duration-300">
                                    A-223, Sector-151, Near-148 metro station, Greater Noida, India, <br /> Uttar Pradesh code - 201310
                                </Link>
                            </div>
                            <div className="flex items-center">
                                <FaPhone className="text-blue-600 mr-4" size={20} />
                                <Link href="tel:08130622279" style={{ textDecoration: 'none', color: 'black' }} className="text-gray-700">
                                  +91 9990555740
                                </Link>
                            </div>
                            <div className="flex items-center">
                                <FaEnvelope className="text-blue-600 mr-4" size={20} />
                                <Link href="mailto:info@mybestvenue.com" style={{ textDecoration: 'none', color: 'black' }} className="text-gray-700">
                                    info@mybestvenue.com
                                </Link>
                            </div>
                        </div>

                        <div className="mt-10">
                            {/* Embedded Google Map with Marker */}
                            <iframe
                                title="Office Location"
                                width="100%"
                                height="300"
                                className="border-0 rounded-lg shadow-md"
                                loading="lazy"
                                allowFullScreen=""
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.836795141024!2d77.40059297442846!3d28.526295175726024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5c2e1b7d28f%3A0x3d6e9afde7f65f18!2sA-223%2C+Sector+151%2C+Near+148+metro+station%2C+Greater+Noida%2C+Uttar+Pradesh+201310!5e0!3m2!1sen!2sin!4v1719785156611!5m2!1sen!2sin"
                            >
                            </iframe>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                                    placeholder="+91 9876543210"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="3"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Write your message..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{ borderRadius: '5px' }}
                                className={`w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0F4C81] hover:bg-[#0f4c81ee] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                aria-label="Send Message"
                            >
                                {isLoading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                pauseOnHover
                closeOnClick={true}
                draggable
                closeButton={true}
            />
        </div>

    );
}