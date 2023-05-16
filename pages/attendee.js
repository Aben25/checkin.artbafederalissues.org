import { useRouter } from 'next/router';
import { useState } from 'react';

const AttendeePage = () => {
  const router = useRouter();
  const { FullName, Email, CompanyName, AttendeeUniqueID } = router.query;
  const [showPopup, setShowPopup] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const send = async () => {
    const response = await fetch(
      `https://connect.artba.org/api/attendees/${AttendeeUniqueID}/mark-attended`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Basic d2SuLwamTRQfEWqAuwBQ4zSTiSlq34mrICTaMeAIPS4=',
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      setShowConfirmation(true);
      setShowPopup(false);
    } else {
      alert('Error checking in. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-lg p-8 rounded-md">
          <h2 className="text-2xl font-bold mb-6">{FullName}</h2>
          <p className="mb-4">
            <strong>Email: </strong>
            {Email}
          </p>
          <p className="mb-6">
            <strong>Company: </strong>
            {CompanyName}
          </p>
          <button
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={togglePopup}
          >
            Check-in
          </button>
          {showPopup && (
            <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-md">
                <h3 className="text-xl font-bold mb-4">Confirm Check-in</h3>
                <p>Do you want to check in {FullName}?</p>
                <div className="mt-4">
                  <button
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={send}
                  >
                    Check-in
                  </button>
                  <button
                    className="bg-gray-300 text-black font-bold py-2 px-4 rounded"
                    onClick={togglePopup}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {showConfirmation && (
            <div className="fixed inset-0 z-10 flex items-center justify-center bg-green-500 bg-opacity-50">
              <div className="bg-white p-6 rounded-md">
                <h3 className="text-xl font-bold mb-4">Confirmation</h3>
                <p>{FullName} has been successfully checked in.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendeePage;


