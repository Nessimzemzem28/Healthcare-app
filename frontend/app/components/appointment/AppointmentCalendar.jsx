import React, { useState, useEffect } from 'react';
import { getAppointmentsWithDetails, rescheduleAppointment, deleteAppointment } from '../../utils/api';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import dayjs from 'dayjs';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserMd, FaCalendarAlt, FaClock, FaNotesMedical, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import '../../globals.css';
import AppointmentForm from './AppointmentForm'; 

const localizer = momentLocalizer(moment);

const AppointmentCalendar = (props) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false); 
  const [newDateTime, setNewDateTime] = useState(dayjs());
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const fetchedAppointments = await getAppointmentsWithDetails();
      console.log(fetchedAppointments);
      setAppointments(fetchedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to fetch appointments.');
    }
  };

  const events = appointments.map(appointment => ({
    title: `${appointment.patient.firstName} ${appointment.patient.lastName} - ${appointment.doctor}`,
    start: new Date(appointment.date),
    end: new Date(new Date(appointment.date).getTime() + 30 * 60 * 1000),
    resource: appointment,
    style: {
      backgroundColor: new Date(appointment.date) < new Date() ? '#ff6347' : '#4682b4',
      color: 'white',
      cursor: 'pointer',
    },
  }));

  const handleSelectEvent = event => {
    if (new Date(event.start) < new Date()) {
      toast.warning('This appointment has ended.');
    }
    setSelectedAppointment(event.resource);
    setShowRescheduleModal(true);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setShowRescheduleModal(false);
    setShowCreateModal(false); 
  };

  const handleDateTimeChange = (dateTime) => {
    setNewDateTime(dateTime);
  };

  const validateTimeRange = (dateTime) => {
    const hours = dateTime.hour();
    return hours >= 8 && hours < 18; 
  };

  const handleReschedule = async () => {
    try {
      if (!validateTimeRange(newDateTime)) {
        toast.error('Start time must be between 08:00 and 18:00');
        return;
      }
      await rescheduleAppointment(selectedAppointment.id, newDateTime.toISOString(), newDateTime.toISOString()); 
      toast.success('Appointment rescheduled successfully.');
      fetchAppointments(); 
      closeModal(); 
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAppointment(selectedAppointment.id);
      toast.success('Appointment deleted successfully.');
      fetchAppointments();
      closeModal();
    } catch (error) {
      toast.error('Failed to delete appointment.');
    }
  };

  const disableSunday = (date) => {
    return date.day() === 0;
  };

  const isPastAppointment = selectedAppointment && new Date(selectedAppointment.date) < new Date();

  const modalBgColor = isPastAppointment ? 'bg-red-500' : 'bg-white';
  const buttonColor = isPastAppointment ? 'text-white' : 'text-black';
  const buttonHoverColor = isPastAppointment ? 'hover:text-black' : 'hover:text-gray-600';

  const CustomToolbar = ({ label, onNavigate, onView, views, view }) => {
    return (
      <div className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-100 p-3 flex justify-between items-center shadow-md rounded-t-lg">
        <button
          onClick={() => onNavigate('PREV')}
          className="btn btn-outline btn-info rounded-lg px-4 py-2 bg-white hover:bg-gray-100 transition-colors cursor-pointer"
        >
          Previous
        </button>
        <span className="text-lg font-bold">{label}</span>
        <button
          onClick={() => onNavigate('NEXT')}
          className="btn btn-outline btn-info rounded-lg px-4 py-2 bg-white hover:bg-gray-100 transition-colors cursor-pointer"
        >
          Next
        </button>
        <div>
          {views.map(v => (
            <button
              key={v}
              onClick={() => onView(v)}
              className={`mr-2 px-4 py-2 rounded-lg ${view === v ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} transition-colors cursor-pointer`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const dayPropGetter = (date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return {
        className: 'bg-blue-200',
      };
    }
    return {};
  };

  return (
    <>
      <div className="mt-6 container mx-auto">
        <h1 className="text-4xl font-extrabold mb-4 sm:mb-0 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-900 to-black">
          Appointments Calendar
        </h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <BigCalendar
            {...props}
            localizer={localizer}
            views={[Views.DAY, Views.WEEK, Views.MONTH]}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, border: '1px solid #d1d5db' }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={(event) => ({
              style: event.style,
            })}
            components={{ toolbar: CustomToolbar }}
            view={view}
            onView={setView}
            date={date}
            onNavigate={(newDate) => setDate(newDate)}
            dayPropGetter={dayPropGetter} 
          />
        
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer"
          >
            <FaPlus className="mr-2" /> Add New Appointment
          </button>
        </div>
      </div>

      {selectedAppointment && showRescheduleModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className={`${modalBgColor} rounded-lg shadow-lg p-6 w-1/3 relative`}>
            <button
              onClick={closeModal}
              className={`absolute top-4 right-4 text-xl ${buttonColor} ${buttonHoverColor} transition-colors cursor-pointer`}
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Appointment Details</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FaUserMd className="text-lg" />
                <p><strong>Patient:</strong> {selectedAppointment.patient.firstName} {selectedAppointment.patient.lastName}</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaUserMd className="text-lg" />
                <p><strong>Doctor:</strong> {selectedAppointment.doctor}</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="text-lg" />
                <p><strong>Date:</strong> {dayjs(selectedAppointment.date).format('MMMM D, YYYY')}</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaClock className="text-lg" />
                <p><strong>Time:</strong> {dayjs(selectedAppointment.startTime).format('HH:mm')}</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaNotesMedical className="text-lg" />
                <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
              </div>
            </div>
            {(new Date(selectedAppointment.date) >= new Date() && new Date(selectedAppointment.date) > new Date()) && (
              <div className="mt-4 flex flex-col space-y-4">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Select new date and time"
                    value={newDateTime}
                    onChange={handleDateTimeChange}
                    renderInput={(params) => <input {...params} className="p-2 border rounded-lg w-full" />}
                    shouldDisableTime={(time) => {
                      const hour = time.hour();
                      const minute = time.minute();
                      return hour < 8 || hour >= 18 || (hour === 18 && minute > 0);
                    }}
                    shouldDisableDate={(date) => disableSunday(date)}
                    ampm={false}
                  />
                </LocalizationProvider>
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={handleReschedule}
                    className="btn btn-outline btn-info px-4 py-2 cursor-pointer"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn btn-outline btn-error px-4 py-2 cursor-pointer flex items-center"
                  >
                    <FaTrash className="mr-2" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-xl text-black hover:text-gray-600 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <AppointmentForm onClose={closeModal} /> 
          </div>
        </div>
      )}

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
    </>
  );
};

export default AppointmentCalendar;
