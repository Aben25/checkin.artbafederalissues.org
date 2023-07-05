import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useQRCode } from 'next-qrcode';

export function AgendaModal({ modalOpen, handleCloseModal, selectedEvent }) {

  const { Canvas } = useQRCode();


  // print out  selected event details to console but find the <agenda> tag from the html and print that out


  return (
    <Transition appear show={modalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={handleCloseModal}
      >
        <div className="min-h-screen px-4 text-center ">
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
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 text-center">
                Scan here to see the Agenda
              </Dialog.Title>
              <div className="flex justify-center mt-4"> {/* Added a flex container */}
                <Canvas
                  text={selectedEvent ? selectedEvent.Summary : "http://localhost:3000/"}
                  options={{
                    level: 'M',
                    margin: 3,
                    scale: 4,
                    width: 300,
                    color: {
                      dark: '#132864',
                      light: '#ffffff',
                    },
                  }}
                />
              </div>

              <div className="mt-4 space-y-2">
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
  );
}