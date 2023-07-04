import { Fragment } from "react";
import { EventSelector } from ".";
import Image from 'next/image'
import logo from "@/public/shs";




export default function Header({ events, selectedEvent, handleEventChange }) {
  return (
    <header className="bg-blue-900 px-6 py-4 text-white flex justify-between items-center mb-8">
      <div className="flex items-center">
      <Image
      src='https://economics.artba.org/img/artba-logo-white.png'
      width={250}
        height={200}
      alt="Picture of the author"
    />
      </div>
      <div>
        <EventSelector
          events={events}
          selectedEvent={selectedEvent}
          handleEventChange={handleEventChange}
        />
      </div>
    </header>
  );
}
