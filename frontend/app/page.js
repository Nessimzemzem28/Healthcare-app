"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PatientList from '../app/components/patient/PatientList';
import Header from './components/Header';
import { getAllPatients } from './utils/api';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PatientIndexPage = () => {
  
  const router = useRouter();
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await getAllPatients();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleViewPatient = (id) => {
    router.push(`/patients/${id}`);
  };


  return (
   <>
      <ToastContainer 
        position='bottom-center'
        theme='colored'
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        progressClassName="toastProgress"
        bodyClassName="toastBody"
        />
      <Header />
      <div className="container mx-auto mt-4">
        <PatientList
          patients={patients}
          onViewPatient={handleViewPatient}
        />
      </div>
   </>
    
  );
};

export default PatientIndexPage;
