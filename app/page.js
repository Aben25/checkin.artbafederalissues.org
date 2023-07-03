"use client";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Attendee from './Attendee';
import EventSelector from './EventSelector';
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
    <main>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Listbox value={selectedEvent} onChange={handleEventChange}>
          <Listbox.Button>{selectedEvent?.Name}</Listbox.Button>
          <Listbox.Options>
            {data.map((item, index) => (
              <Listbox.Option key={index} value={item}>
                {item.Name}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>

        <h2>Attendees:</h2>
        {loading ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            Loading...
          </motion.div>
        ) : (
          <>
         <input
  type="search"
  placeholder="Search attendees"
  value={searchTerm}
  onChange={handleSearchChange}
/>
            {filteredAttendees.map((attendee, index) => (
              <div
                key={index}
                className="max-w-sm rounded overflow-hidden shadow-lg cursor-pointer"
                onClick={() => handleAttendeeClick(attendee)}
              >
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{attendee.Email}</div>
                  <p className="text-gray-700 text-base">
                    {attendee.FirstName} {attendee.LastName}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <Transition appear show={modalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={handleCloseModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Attendee Details
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Name: {selectedAttendee?.FirstName}{" "}
                    {selectedAttendee?.LastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Email: {selectedAttendee?.Email}
                  </p>
                </div>

                {/* Display the response */}
                {response && (
                  <div className="mt-4 text-sm text-gray-500">{response}</div>
                )}

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={handleCheckIn}
                  >
                    Check In
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
              <ToastContainer />

    </main>
  );
}
