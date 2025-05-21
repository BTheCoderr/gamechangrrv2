'use client';

import { useState } from 'react';
import { Lead } from '@/types';
import { CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// Mock available time slots
const generateTimeSlots = (date: Date) => {
  const slots = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      // Skip lunch hour (12-1 PM)
      if (hour === 12) continue;
      
      const time = new Date(date);
      time.setHours(hour, minute, 0, 0);
      
      // Only include future times
      if (time > new Date()) {
        slots.push(time);
      }
    }
  }
  
  return slots;
};

interface BookingCalendarProps {
  lead: Lead;
}

export default function BookingCalendar({ lead }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(!!lead.appointmentDate);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Generate next 7 available dates
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });
  
  // Generate time slots for selected date
  const timeSlots = generateTimeSlots(selectedDate);
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };
  
  const handleTimeSelect = (time: Date) => {
    setSelectedTime(time);
  };
  
  const handleBookAppointment = async () => {
    if (!selectedTime || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // In production, this would call your API
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'booked',
          appointmentDate: selectedTime.toISOString()
        })
      });
      
      if (response.ok) {
        setIsBooked(true);
        setShowConfirmation(true);
      } else {
        alert('Failed to book appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Error booking appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (showConfirmation) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Appointment Booked!</h3>
        <p className="mt-2 text-sm text-gray-500">
          {selectedTime?.toLocaleString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
          })}
        </p>
        <button 
          onClick={() => setShowConfirmation(false)}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Done
        </button>
      </div>
    );
  }
  
  if (isBooked && lead.appointmentDate) {
    return (
      <div>
        <div className="flex items-center text-green-600 mb-2">
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          <span className="font-medium">Appointment Scheduled</span>
        </div>
        <p className="text-gray-700">
          {new Date(lead.appointmentDate).toLocaleString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
          })}
        </p>
        <button
          onClick={() => setIsBooked(false)}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          Reschedule
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Select Date</h3>
        <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
          {availableDates.map((date) => (
            <button
              key={date.toISOString()}
              onClick={() => handleDateSelect(date)}
              className={`p-2 text-center rounded-md text-sm ${
                date.toDateString() === selectedDate.toDateString()
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <span className="block text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <span className="block font-medium">{date.getDate()}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Select Time</h3>
        {timeSlots.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time.toISOString()}
                onClick={() => handleTimeSelect(time)}
                className={`py-2 px-3 text-sm rounded-md ${
                  selectedTime?.toISOString() === time.toISOString()
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {time.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No available time slots for this date.</p>
        )}
      </div>
      
      <button
        onClick={handleBookAppointment}
        disabled={!selectedTime || isSubmitting}
        className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          !selectedTime || isSubmitting
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        <CalendarIcon className="mr-2 h-5 w-5" />
        {isSubmitting ? 'Booking...' : 'Schedule Appointment'}
      </button>
    </div>
  );
} 