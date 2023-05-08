import { useState } from 'react';
import { Hits } from 'react-instantsearch-dom';
import Link from 'next/link';

const Hit = ({ hit }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleCheckIn = () => {
    setShowPopup(true);
  };

  const handleConfirm = async () => {
    const response = await fetch(
      `https://connect.artba.org/api/attendees/${hit.AttendeeUniqueID}/mark-attended`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Basic d2SuLwamTRQfEWqAuwBQ4zSTiSlq34mrICTaMeAIPS4=',
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      alert('Successfully checked in.');
    } else {
      alert('Error checking in. Please try again.');
    }
    setShowPopup(false);
  };


  const handleCancel = () => {
    setShowPopup(false);
  };

  const productURL = `/attendee?AttendeeUniqueID=${hit.AttendeeUniqueID}&FullName=${hit.FullName}&CompanyName=${hit.CompanyName}&Attended=${hit.Attended}&Email=${hit.Email}`;

  return (
    <>
      <div className='w-full'>
        <div className="text-lg font-semibold ">{hit.FullName}</div>
        <hr className="my-4" />
        <div className="text-gray-500 mb-2">{hit.CompanyName}</div>
        <p className="text-sm text-blue-600 break-all">{hit.Email}</p>
        <button
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mt-2"
          onClick={handleCheckIn}
        >
          Check-in
        </button>
      </div>

      {showPopup && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Confirm Check-in
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to check in {hit.FullName}?
                  </p>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  onClick={handleConfirm}
                >
                  Check-in
                </button>
              </div>
              <div className="mt-3 sm:mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-                focus:ring-gray-500 sm:text-sm"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const CustomHits = () => {
  return <Hits hitComponent={Hit} />;
};

export default CustomHits;

