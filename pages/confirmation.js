import React from 'react';
import Link from 'next/link';

const ConfirmationPage = () => {
  return (
    <div className="container mx-auto text-center mt-10">
      <h1 className="text-3xl font-bold mb-5">Check-in Successful!</h1>
     
      <p className="text-xl mb-5">Thank you for checking in.</p>
      <Link href="/">
        <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Check-in Next Person
        </a>
      </Link>
    </div>
  );
};

export default ConfirmationPage;
