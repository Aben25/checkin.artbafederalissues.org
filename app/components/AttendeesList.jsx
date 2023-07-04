import { AiOutlineMail, AiOutlineHome } from "react-icons/ai";

export default function AttendeesList({ attendees, handleAttendeeClick }) {
  return (
    <>
      {attendees.map((attendee, index) => (
        <div
          key={index}
          className="w-full mb-4 bg-white rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300 ease-in-out"
          onClick={() => handleAttendeeClick(attendee)}
        >
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2 text-blue-700">{attendee.FullName}</div>
            <p className="text-gray-700 text-base flex items-center">
              <AiOutlineMail className="mr-2" /> {attendee.Email}
            </p>
            <p className="text-gray-700 text-base flex items-center">
              <AiOutlineHome className="mr-2" /> {attendee.CompanyName}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
