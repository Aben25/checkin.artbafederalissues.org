"use client";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useMemo } from 'react';
import {
  AttendeeModal,
  AttendeesList,
  EventSelector,
  SearchField
} from "./components";
import Header from "./components/Header";
import { Fragment } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MaterialReactTable } from 'material-react-table';
import Metrix from "./components/Metrix";
import { ExportToCsv } from 'export-to-csv'; //or use your library of choice here
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

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

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name', //simple recommended way to define a column
        header: 'Name',
        muiTableHeadCellProps: { sx: { color: 'green' } }, //custom props
      },
      {
        accessorFn: (originalRow) => originalRow.email, //alternate way
        id: 'Email', //id required if you use accessorFn instead of accessorKey
        header: 'Eamil',
        Header: <i style={{ color: 'red' }}>Email</i>, //optional custom markup
      },
      {
        id: 'attendeeded',
        accessorKey: 'attendeeded',
        header: 'Attended',
        muiTableHeadCellProps: { sx: { color: 'green' } }, //custom props
      }
    ],
    [],
  );

  const [data, setData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [response, setResponse] = useState(null);
  const [qrlink, setQrlink] = useState(null);

  useEffect(() => {
    const fetchAndUpdateEvents = async () => {
      try {
        const data = await fetchEventData();
        setData(data);

        // Get selected event from local storage
        const storedEvent = localStorage.getItem("selectedEvent");
        if (storedEvent) {
          const parsedEvent = JSON.parse(storedEvent);

          // Find this event in the newly fetched data
          const updatedEvent = data.find(event => event.EventUniqueId === parsedEvent.EventUniqueId);
          if (updatedEvent) {
            // If found, update local storage and state
            setSelectedEvent(updatedEvent);
            setQrlink(updatedEvent.Summary);
            localStorage.setItem("selectedEvent", JSON.stringify(updatedEvent));

            const attendeesData = await fetchEventAttendees(updatedEvent.EventUniqueId);
            setAttendees(attendeesData);
            localStorage.setItem("attendees", JSON.stringify(attendeesData));
          } else {
            // If not found, clear local storage and state
            setAttendees([]);
            setSelectedEvent(null);
            setQrlink(null);
            localStorage.removeItem("selectedEvent");
            localStorage.removeItem("attendees");
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAndUpdateEvents();
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

  const handleRefresh = async () => {
    setLoading(true);
    if (selectedEvent) {
      const attendeesData = await fetchEventAttendees(selectedEvent.EventUniqueId);
      setAttendees(attendeesData);
      setQrlink(selectedEvent.Summary); // Set qrlink

      localStorage.setItem("attendees", JSON.stringify(attendeesData));
    }
    setLoading(false);
  };


  const handleCloseModal = () => {
    setModalOpen(false);
    // Clear the response state variable
    setResponse(null);
  };



  // ... other code ...

  const csvExporter = new ExportToCsv({
    filename: 'Attendees',
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: true,
    title: selectedEvent ? selectedEvent.Name : "...",
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
    headers: ['Name', 'Email', 'Attended'],
    // headers: ["Column 1", "Column 2", etc...] <-- Won't work with useKeysAsHeaders present!
  });

  const handleExportData = () => {
    csvExporter.generateCsv(attendees);
  }




  return (
    <Fragment>
      <Header
        events={data}
        selectedEvent={selectedEvent}
        handleEventChange={handleEventChange}
      />
      <main>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-0">
          <h2 className="font-bold text-xl mb-2">
            {selectedEvent ? selectedEvent.Name : "..."} Attendees
          </h2>

          <Metrix
            selectedEvent={selectedEvent}
            attendees={attendees}

          />


          <MaterialReactTable
            columns={columns}
            data={attendees.
              map((attendee) => {
                return {
                  name: attendee.FirstName + " " + attendee.LastName,
                  email: attendee.Email,
                  attendeeded: attendee.Attended ? "Yes" : "No"
                };
              })}
            enableRowSelection
            enableColumnOrdering
            enableGlobalFilter={true}
            enableColumnFilter={true}
            positionToolbarAlertBanner="bottom"
            renderTopToolbarCustomActions={({ table }) => (
              <Box
                sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
              >
                <Button
                  style={{
                    backgroundColor: "black",
                  }}                  //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                  onClick={handleExportData}
                  startIcon={<FileDownloadIcon />}
                  variant="contained"
                >
                  Export All Data
                </Button>
                <Button
                 style={{
                  backgroundColor: "black",
                }}    
                  disabled={table.getPrePaginationRowModel().rows.length === 0}
                  //export all rows, including from the next page, (still respects filtering and sorting)
                  onClick={() =>
                    handleExportRows(table.getPrePaginationRowModel().rows)
                  }
                  startIcon={<FileDownloadIcon />}
                  variant="contained"
                >
                  Export All Rows
                </Button>
                <Button
                 style={{
                  backgroundColor: "black",
                }}    
                  disabled={table.getRowModel().rows.length === 0}
                  //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                  onClick={() => handleExportRows(table.getRowModel().rows)}
                  startIcon={<FileDownloadIcon />}
                  variant="contained"
                >
                  Export Page Rows
                </Button>
                <Button
                 style={{
                  backgroundColor: "gray",
                }}    
                  disabled={
                    !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                  }
                  //only export selected rows
                  onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                  startIcon={<FileDownloadIcon />}
                  variant="contained"
                >
                  Export Selected Rows
                </Button>
              </Box>
            )}
          />

        </div>
      </main>
      <ToastContainer />
    </Fragment>
  );
}
