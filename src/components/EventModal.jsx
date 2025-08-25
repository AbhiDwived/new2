"use client"

import React, { useState, useEffect } from 'react';
import { useCreateEventMutation, useUpdateEventMutation } from '@/features/events/eventAPI';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';

const EventModal = ({ 
  show, 
  onClose, 
  event = null, 
  vendorId, 
  selectedDate = null 
}) => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    eventType: 'Other',
    description: '',
    status: 'Scheduled',
    guestCount: '',
    venue: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    budget: '',
    notes: ''
  });

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

  useEffect(() => {
    if (event) {
      setFormData({
        eventName: event.eventName || '',
        eventDate: event.eventDate ? (() => {
          const date = new Date(event.eventDate);
          const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
          return localDate.toISOString().split('T')[0];
        })() : '',
        eventType: event.eventType || 'Other',
        description: event.description || '',
        status: event.status || 'Scheduled',
        guestCount: event.guestCount || '',
        venue: event.venue || '',
        clientName: event.clientName || '',
        clientPhone: event.clientPhone || '',
        clientEmail: event.clientEmail || '',
        budget: event.budget || '',
        notes: event.notes || ''
      });
    } else if (selectedDate) {
      // Fix: Set date using local date string to avoid timezone offset
      const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
      setFormData(prev => ({
        ...prev,
        eventDate: localDate.toISOString().split('T')[0]
      }));
    } else {
      setFormData({
        eventName: '',
        eventDate: '',
        eventType: 'Other',
        description: '',
        status: 'Scheduled',
        guestCount: '',
        venue: '',
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        budget: '',
        notes: ''
      });
    }
  }, [event, selectedDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.eventName || !formData.eventDate) {
      toast.error('Event name and date are required');
      return;
    }

    try {
      const eventData = {
        ...formData,
        eventDate: new Date(formData.eventDate).toISOString(),
        guestCount: formData.guestCount ? parseInt(formData.guestCount) : undefined,
        budget: formData.budget ? parseFloat(formData.budget) : undefined
      };

      if (event) {
        // Update existing event
        await updateEvent({
          vendorId,
          eventId: event._id,
          eventData
        }).unwrap();
        toast.success('Event updated successfully');
      } else {
        // Create new event
        await createEvent({
          vendorId,
          eventData
        }).unwrap();
        toast.success('Event created successfully');
      }

      onClose();
    } catch (error) {
      toast.error(error.data?.message || 'Failed to save event');
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Event Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name *
              </label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter event name"
                required
              />
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Date *
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formData.status === 'Completed' ? 'bg-green-100' :
                  formData.status === 'In Progress' ? 'bg-yellow-100' :
                  formData.status === 'Cancelled' ? 'bg-red-100' :
                  'bg-white'
                }`}
                required
              />
            </div>

            {/* Event Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Wedding">Wedding</option>
                <option value="Christmas Party">Christmas Party</option>
                <option value="New Year Party">New Year Party</option>
                <option value="Lohri Party">Lohri Party</option>
                <option value="Valentine's Day">Valentine's Day</option>
                <option value="Holi Party">Holi Party</option>
                <option value="Diwali Party">Diwali Party</option>
                <option value="Sangeet Ceremony">Sangeet Ceremony</option>
                <option value="Ring Ceremony">Ring Ceremony</option>
                <option value="Pre Wedding Mehendi Party">Pre Wedding Mehendi Party</option>
                <option value="Baby Shower">Baby Shower</option>
                <option value="Birthday Party">Birthday Party</option>
                <option value="First Birthday Party">First Birthday Party</option>
                <option value="Bachelor Party">Bachelor Party</option>
                <option value="Bridal Shower">Bridal Shower</option>
                <option value="Brand Promotion">Brand Promotion</option>
                <option value="Kids Birthday Party">Kids Birthday Party</option>
                <option value="Childrens Party">Childrens Party</option>
                <option value="Christian Communion">Christian Communion</option>
                <option value="Class Reunion">Class Reunion</option>
                <option value="Business Dinner">Business Dinner</option>
                <option value="Conference">Conference</option>
                <option value="Corporate Offsite">Corporate Offsite</option>
                <option value="Corporate Party">Corporate Party</option>
                <option value="Cocktail Dinner">Cocktail Dinner</option>
                <option value="Dealers Meet">Dealers Meet</option>
                <option value="Engagement">Engagement</option>
                <option value="Exhibition">Exhibition</option>
                <option value="Corporate Training">Corporate Training</option>
                <option value="Family Get together">Family Get together</option>
                <option value="Farewell">Farewell</option>
                <option value="Fashion Show">Fashion Show</option>
                <option value="Family Function">Family Function</option>
                <option value="Game Watch">Game Watch</option>
                <option value="Get Together">Get Together</option>
                <option value="Group Dining">Group Dining</option>
                <option value="Freshers Party">Freshers Party</option>
                <option value="Meeting">Meeting</option>
                <option value="Musical Concert">Musical Concert</option>
                <option value="Naming Ceremony">Naming Ceremony</option>
                <option value="Kitty Party">Kitty Party</option>
                <option value="Pool Party">Pool Party</option>
                <option value="House Party">House Party</option>
                <option value="Residential Conference">Residential Conference</option>
                <option value="Photo Shoots">Photo Shoots</option>
                <option value="Stage Event">Stage Event</option>
                <option value="Team Building">Team Building</option>
                <option value="Team Outing">Team Outing</option>
                <option value="Social Mixer">Social Mixer</option>
                <option value="Video Shoots">Video Shoots</option>
                <option value="Walk-in Interview">Walk-in Interview</option>
                <option value="Wedding Anniversary">Wedding Anniversary</option>
                <option value="Training">Training</option>
                <option value="Adventure Party">Adventure Party</option>
                <option value="Annual Fest">Annual Fest</option>
                <option value="Aqueeqa ceremony">Aqueeqa ceremony</option>
                <option value="Wedding Reception">Wedding Reception</option>
                <option value="Nightlife">Nightlife</option>
                <option value="Live Sports Screening">Live Sports Screening</option>
                <option value="MICE">MICE</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Guest Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guest Count
              </label>
              <input
                type="number"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Number of guests"
                min="0"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget (₹)
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Budget amount"
                min="0"
                step="0.01"
              />
            </div>

            {/* Venue */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Venue
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Event venue"
              />
            </div>

            {/* Client Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Client Information</h3>
            </div>

            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Client name"
              />
            </div>

            {/* Client Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Phone
              </label>
              <input
                type="tel"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Client phone number"
              />
            </div>

            {/* Client Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Email
              </label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Client email"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Event description"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isCreating || isUpdating ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;