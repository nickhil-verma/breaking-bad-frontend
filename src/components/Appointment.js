import React from 'react'
import { useNavigate } from 'react-router-dom';

const Appointment = () => {
    const navigate = useNavigate();
  return (
   <>
         <button
      onClick={() => navigate('/emergency')}
      className="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-red-700 transition"
    >
      Urgent Appointment
    </button>
   </>
  )
}

export default Appointment