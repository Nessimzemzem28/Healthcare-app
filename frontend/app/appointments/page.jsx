"use client"

import React from 'react';
import AppointmentCalendar from '../components/appointment/AppointmentCalendar';
import Header from '../components/Header';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const Appointments = () => {
  return (
    <>
        <Header />
        <AppointmentCalendar />
    </>
  )
}

export default Appointments