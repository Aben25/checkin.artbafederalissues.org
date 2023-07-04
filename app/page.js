"use client";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  AttendeeModal,
  AttendeesList,
  EventSelector,
  SearchField
} from "./components";
import Header from "./components/Header";
import { Fragment } from "react";


// Initialize react-toastify

async function fetchEventData() {
  const today = new Date().toISOString().split("T")[0]; // Get current date
  const url = `https://connect.artba.org/api/events?eventDate=${today}`;
  const headers = {
    Authorization: "Basic d2SuLwamTRQfEWqAuwBQ4zSTiSlq34mrICTaMeAIPS4=",
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const res = await fetch(url, { headers });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function fetchEventAttendees(id) {
  const url = `https://connect.artba.org/api/attendees?eventId=${id}`;
  const headers = {
    Authorization: "Basic d2SuLwamTRQfEWqAuwBQ4zSTiSlq34mrICTaMeAIPS4=",
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const res = await fetch(url, { headers });

  if (!res.ok) {
    throw new Error("Failed to fetch attendees");
  }

  return res.json();
}

const markAttendeeAsAttended = async (AttendeeUniqueID) => {
  const url = `https://connect.artba.org/api/attendees/${AttendeeUniqueID}/mark-attended`;
  const headers = {
    Authorization: "Basic d2SuLwamTRQfEWqAuwBQ4zSTiSlq34mrICTaMeAIPS4=",
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const response = await fetch(url, { method: "POST", headers });
  if (!response.ok) {
    throw new Error(
      `Failed to mark attendee as attended. Status: ${response.status}`
    );
  }

  // only parse response body if it's not empty
  const responseBody = await response.text(); // get response body as text
  if (responseBody) {
    // if response body is not empty
    const data = JSON.parse(responseBody); // parse response body
    return data;
  }

  // if response body is empty, return a default value or just return
  return { success: true };
};

export default function Page() {
  const [data, setData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [response, setResponse] = useState(null);
  const notify = () => toast("Wow so easy!");

  useEffect(() => {
    fetchEventData().then(setData).catch(console.error);

    // Check if there is any selected event stored in the localStorage
    const storedEvent = localStorage.getItem("selectedEvent");
    if (storedEvent) {
      const parsedEvent = JSON.parse(storedEvent);
      setSelectedEvent(parsedEvent);
      // Fetch the attendees for the selected event
      fetchEventAttendees(parsedEvent.EventUniqueId)
        .then(setAttendees)
        .catch(console.error);
    }
    else {
      // Clear the attendees list
      setAttendees([]);
      // Clear the selected event
      setSelectedEvent(null);
      // Clear the selected attendee
      setSelectedAttendee(null);
    }
  }, []);

  const handleEventChange = async (selected) => {
    setLoading(true);
    setSelectedEvent(selected);
    if (selected) {
      const attendeesData = await fetchEventAttendees(selected.EventUniqueId);
      setAttendees(attendeesData);

      // Store the selected event and its attendees in the localStorage
      localStorage.setItem("selectedEvent", JSON.stringify(selected));
      localStorage.setItem("attendees", JSON.stringify(attendeesData));
    } else {
      setAttendees([]);

      // Clear the selected event and its attendees from the localStorage
      localStorage.removeItem("selectedEvent");
      localStorage.removeItem("attendees");
    }
    setLoading(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAttendeeClick = (attendee) => {
    console.log('handleAttendeeClick triggered', attendee);
    setSelectedAttendee(attendee);
    setModalOpen(true);
  };

  const handleCheckIn = async () => {
    console.log("Checking in attendee:", selectedAttendee); // Log the attendee being checked in
    if (!selectedAttendee) return;
    try {
      const result = await markAttendeeAsAttended(
        selectedAttendee.AttendeeUniqueID
      );
      if (result.success) {
        // Fetch the attendees list again after a successful check-in
        const attendeesData = await fetchEventAttendees(
          selectedEvent.EventUniqueId
        );
        setAttendees(attendeesData);

        // Show a toast notification
        toast.success("Attendee checked in successfully");
        // Clear the search term
        setSearchTerm("");

        // Close the modal right away
        handleCloseModal();
      }
    } catch (error) {
      console.error("Failed to check in the attendee", error);
      toast.error("Failed to check in the attendee");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Clear the response state variable
    setResponse(null);
  };

  const filteredAttendees = attendees.filter(
    (attendee) =>
      !attendee.Attended &&
      [attendee.FirstName, attendee.LastName, attendee.Email].some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <Fragment>
      <Header 
        events={data}
        selectedEvent={selectedEvent}
        handleEventChange={handleEventChange}
      />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <h2 className="font-bold text-xl mb-2">Event Attendees</h2>
          <SearchField searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
          <AttendeesList attendees={filteredAttendees} handleAttendeeClick={handleAttendeeClick} />
          <AttendeeModal
            modalOpen={modalOpen}
            handleCloseModal={handleCloseModal}
            selectedAttendee={selectedAttendee}
            handleCheckIn={handleCheckIn}
          />
        </div>
      </main>
      <ToastContainer />
    </Fragment>
  );
}
