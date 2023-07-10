import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { AgendaModal } from "./AgendaModal";

export default function AttendeeModal({ modalOpen, handleCloseModal, selectedAttendee, handleCheckIn, selectedEvent }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAgendaModalOpen, setAgendaModalOpen] = useState(false);


  const handleClick = async () => {
    setIsLoading(true);
    await handleCheckIn();
    setIsLoading(false);
    selectedEvent.Summary? setAgendaModalOpen(true): setAgendaModalOpen(false);
  };

  const handleCloseAgendaModal = () => {
    setAgendaModalOpen(false);
  };

  return (
    <div>


      <Transition appear show={modalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={handleCloseModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

            <span className="inline-block h-screen align-middle" aria-hidden="true">
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
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Attendee Details
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Name: {selectedAttendee?.FirstName} {selectedAttendee?.LastName}
                  </p>
                  <p className="text-sm text-gray-500">Email: {selectedAttendee?.Email}</p>
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={handleClick}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Check In"}
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-blue-900 bg-red-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
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
      <AgendaModal modalOpen={isAgendaModalOpen} handleCloseModal={handleCloseAgendaModal} selectedEvent={selectedEvent} />

    </div>
  );
}
