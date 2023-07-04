import { useState, useEffect } from "react";
import { toast } from 'react-toastify';

async function fetchEventData() {
  // Implementation
}

async function fetchEventAttendees(id) {
  // Implementation
}

async function markAttendeeAsAttended(AttendeeUniqueID) {
  // Implementation
}

export default function useFetchData() {
  const [data, setData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchEventData().then(setData).catch(console.error);

    const storedEvent = localStorage.getItem("selectedEvent");
    if (storedEvent) {
      const parsedEvent = JSON.parse(storedEvent);
      setSelectedEvent(parsedEvent);
      fetchEventAttendees(parsedEvent.EventUniqueId)
        .then(setAttendees)
        .catch(console.error);
    }
  }, []);
  
  const handleEventChange = async (selected) => {
    setLoading(true);
    setSelectedEvent(selected);
    if (selected) {
      const attendeesData = await fetchEventAttendees(selected.EventUniqueId);
      setAttendees(attendeesData);
      localStorage.setItem("selectedEvent", JSON.stringify(selected));
      localStorage.setItem("attendees", JSON.stringify(attendeesData));
    } else {
      setAttendees([]);
      localStorage.removeItem("selectedEvent");
      localStorage.removeItem("attendees");
    }
    setLoading(false);
  };
  
  const handleCheckIn = async (selectedAttendee) => {
    if (!selectedAttendee) return;
    try {
      const result = await markAttendeeAsAttended(selectedAttendee.AttendeeUniqueID);
      if (result.success) {
        const attendeesData = await fetchEventAttendees(selectedEvent.EventUniqueId);
        setAttendees(attendeesData);
        toast.success("Attendee checked in successfully");
      }
    } catch (error) {
      console.error("Failed to check in the attendee", error);
      toast.error("Failed to check in the attendee");
    }
  };

  return {
    data,
    selectedEvent,
    attendees,
    loading,
    handleEventChange,
    handleCheckIn,
  };
}
