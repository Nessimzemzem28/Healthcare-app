import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllPatients, createAppointment } from '../../utils/api'; 
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaClock, FaUserMd, FaNotesMedical, FaUser } from 'react-icons/fa';

const AppointmentForm = ({ onClose }) => {
  const [patients, setPatients] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const fetchedPatients = await getAllPatients();
        setPatients(fetchedPatients);
        console.log(patients);
      } catch (error) {
        console.error('Failed to fetch patients:', error);
      }
    };

    fetchPatients();
  }, []);

  const initialValues = {
    date: '',
    startTime: '',
    doctor: '',
    reason: '',
    patientId: '',
  };

  const validationSchema = Yup.object({
    date: Yup.date()
              .required('Date is required')
              .min(new Date(), 'Date cannot be in the past')
              .typeError('Invalid date format'),
    startTime: Yup.string()
                  .required('Start time is required')
                  .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format, must be HH:mm')
                  .test('is-valid-time', 'Start time must be between 08:00 and 20:00', value => {
                    const [hours, minutes] = value.split(':').map(Number);
                    return (hours >= 8 && hours < 20) || (hours === 20 && minutes === 0);
                  }),
    doctor: Yup.string()
               .required('Doctor is required')
               .min(2, 'Doctor name must be at least 2 characters'),
               reason: Yup.string()
               .required('Reason is required')
               .oneOf([
                 'Routine check-up',
                 'Consultation',
                 'Follow-up Blood-test',
                 'Vaccination'
               ], 'Invalid reason'),
    patientId: Yup.number()
                  .required('Patient is required')
                  .positive('Patient ID must be a positive number')
                  .integer('Patient ID must be an integer')
                  .typeError('Invalid Patient ID'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const dateTime = new Date(`${values.date}T${values.startTime}`);

      const appointmentData = {
        ...values,
        startTime: dateTime.toISOString(),
        patientId: parseInt(values.patientId, 10),
      };

      console.log('Submitting values: ', appointmentData);
      await createAppointment(appointmentData);
      toast.success('Appointment created successfully!');
      onClose();
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 relative transform transition-transform duration-300 scale-105">
      <h2 className="text-2xl font-bold mb-4 text-center">Create New Appointment</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-bold text-gray-700">
                  Date
                </label>
                <div className="relative">
                  <Field
                    type="date"
                    id="date"
                    name="date"
                    className={`mt-1 block w-full pl-10 pr-3 py-2 border ${
                      errors.date && touched.date ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                  />
                  <FaCalendarAlt className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                <ErrorMessage name="date" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="startTime" className="block text-sm font-bold text-gray-700">
                  Start Time
                </label>
                <div className="relative">
                  <Field
                    type="time"
                    id="startTime"
                    name="startTime"
                    min="08:00"
                    max="20:00"
                    className={`mt-1 block w-full pl-10 pr-3 py-2 border ${
                      errors.startTime && touched.startTime ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                  />
                  <FaClock className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                <ErrorMessage name="startTime" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="doctor" className="block text-sm font-bold text-gray-700">
                  Doctor
                </label>
                <div className="relative">
                  <Field
                    type="text"
                    id="doctor"
                    name="doctor"
                    className={`mt-1 block w-full pl-10 pr-3 py-2 border ${
                      errors.doctor && touched.doctor ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                  />
                  <FaUserMd className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                <ErrorMessage name="doctor" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="reason" className="block text-sm font-bold text-gray-700">
                  Reason
                </label>
                <div className="relative">
                  <Field
                    as="select"
                    id="reason"
                    name="reason"
                    className={`mt-1 block w-full pl-10 pr-3 py-2 border ${
                      errors.reason && touched.reason ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                  >
                    <option value="" disabled>Select reason</option>
                    <option value="Routine check-up">Routine check-up</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up Blood-test">Follow-up Blood-test</option>
                    <option value="Vaccination">Vaccination</option>
                  </Field>
                  <FaNotesMedical className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                <ErrorMessage name="reason" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="patientId" className="block text-sm font-bold text-gray-700">
                  Patient
                </label>
                <div className="relative">
                  <Field
                    as="select"
                    id="patientId"
                    name="patientId"
                    className={`mt-1 block w-full pl-10 pr-3 py-2 border ${
                      errors.patientId && touched.patientId ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                  >
                    <option value="" disabled>Select patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName}
                      </option>
                    ))}
                  </Field>
                  <FaUser className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                <ErrorMessage name="patientId" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-outline btn-info"
                >
                  {isSubmitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

    </>
  );
};

export default AppointmentForm;
