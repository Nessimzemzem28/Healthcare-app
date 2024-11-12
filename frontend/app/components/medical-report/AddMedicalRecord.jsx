import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation'; 
import { FaCalendarAlt, FaNotesMedical, FaHeartbeat, FaTemperatureHigh, FaWeight, FaRuler, FaClipboardList } from 'react-icons/fa';
import { MdOutlineMedication } from 'react-icons/md';
import { GiMedicalThermometer } from 'react-icons/gi';
import { AiOutlineFileText } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import { createMedicalRecord } from '../../utils/api'; 

const validationSchema = Yup.object({
  date: Yup.date().required('Date is required'),
  diagnosis: Yup.mixed().oneOf([
    'Hypertension', 'Diabetes', 'Asthma', 'Flu', 'Covid19', 'HeartDisease', 'Headache', 'Allergy', 'Gastroenteritis', 'Migraine', 'Other'
  ]).required('Diagnosis is required'),
  treatment: Yup.mixed().oneOf([
    'Medication', 'Surgery', 'Therapy', 'LifestyleChange', 'FollowUp', 'Counseling', 'Rehabilitation', 'Other'
  ]).required('Treatment is required'),
  medication: Yup.mixed().oneOf([
    'Antibiotics', 'Painkillers', 'Insulin', 'Inhalers', 'Antihypertensives', 'Antivirals', 'Corticosteroids', 'Other'
  ]).nullable(),
  visitType: Yup.mixed().oneOf([
    'RoutineCheckUp', 'Consultation', 'BloodTest', 'Vaccination', 'Emergency', 'Specialist'
  ]).required('Visit type is required'),
  notes: Yup.string().required('Notes are required'),
  heartRate: Yup.number().nullable().min(40, 'Heart rate must be at least 40').max(200, 'Heart rate must be less than 200'),
  temperature: Yup.number().nullable().min(35, 'Temperature must be at least 35°C').max(42, 'Temperature must be less than 42°C'),
  weight: Yup.number().positive('Weight must be a positive number').nullable(),
  height: Yup.number().positive('Height must be a positive number').nullable(),
});

const AddMedicalRecord = ({ patientId, onClose, onRecordAdded }) => {
  const router = useRouter(); 

  const handleSubmit = async (values, { resetForm }) => {
    try {
      
      console.log("Form Values: ", values);

      if (values.date) {
        values.date = dayjs(values.date).format('YYYY-MM-DD'); 
        console.log("Formatted Date Value: ", values.date);
      } else {
        console.error("Date is undefined");
      }

      values.patientId = patientId || '';
  
      await createMedicalRecord(values);
      toast.success('Medical record created successfully!');
      resetForm(); 

      if (onClose) {
        onClose();
      }

      if (onRecordAdded) {
        onRecordAdded();
      }

      console.log("Redirecting to: ", `/medical-reports/${patientId}`);
      router.push(`/medical-reports/${patientId}`); 
    } catch (error) {
      console.error("Error creating medical record: ", error);
      toast.error('Failed to create medical record: ' + error.message);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          date: '',
          diagnosis: '',
          treatment: '',
          medication: '',
          visitType: '',
          bloodPressure: '',
          heartRate: '',
          temperature: '',
          weight: '',
          height: '',
          notes: '',
          patientId: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-screen overflow-y-auto">
            <div>
              <label className="block text-sm mb-1 font-bold pl-2">Date</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-2/4 transform -translate-y-2/4 text-gray-400" />
                <Field
                  type="date"
                  name="date"
                  className={`input input-bordered pl-10 w-full ${errors.date && touched.date ? 'input-error' : ''}`}
                />
              </div>
              <ErrorMessage name="date" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block text-sm mb-1 font-bold pl-2">Diagnosis</label>
              <div className="relative">
                <FaNotesMedical className="absolute left-3 top-2/4 transform -translate-y-2/4 text-gray-400" />
                <Field
                  as="select"
                  name="diagnosis"
                  className={`select select-bordered pl-10 w-full h-12 ${errors.diagnosis && touched.diagnosis ? 'select-error' : ''}`}
                >
                  <option value="" label="Select diagnosis" />
                  <option value="Hypertension" label="Hypertension" />
                  <option value="Diabetes" label="Diabetes" />
                  <option value="Asthma" label="Asthma" />
                  <option value="Flu" label="Flu" />
                  <option value="Covid19" label="Covid19" />
                  <option value="HeartDisease" label="Heart Disease" />
                  <option value="Headache" label="Headache" />
                  <option value="Allergy" label="Allergy" />
                  <option value="Gastroenteritis" label="Gastroenteritis" />
                  <option value="Migraine" label="Migraine" />
                  <option value="Other" label="Other" />
                </Field>
              </div>
              <ErrorMessage name="diagnosis" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block text-sm mb-1 font-bold pl-2">Treatment</label>
              <div className="relative">
                <GiMedicalThermometer className="absolute left-3 top-2/4 transform -translate-y-2/4 text-gray-400" />
                <Field
                  as="select"
                  name="treatment"
                  className={`select select-bordered pl-10 w-full h-12 ${errors.treatment && touched.treatment ? 'select-error' : ''}`}
                >
                  <option value="" label="Select treatment" />
                  <option value="Medication" label="Medication" />
                  <option value="Surgery" label="Surgery" />
                  <option value="Therapy" label="Therapy" />
                  <option value="LifestyleChange" label="Lifestyle Change" />
                  <option value="FollowUp" label="Follow-Up" />
                  <option value="Counseling" label="Counseling" />
                  <option value="Rehabilitation" label="Rehabilitation" />
                  <option value="Other" label="Other" />
                </Field>
              </div>
              <ErrorMessage name="treatment" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block text-sm mb-1 font-bold pl-2">Medication (Optional)</label>
              <div className="relative">
                <MdOutlineMedication className="absolute left-3 top-2/4 transform -translate-y-2/4 text-gray-400" />
                <Field
                  as="select"
                  name="medication"
                  className={`select select-bordered pl-10 w-full h-12 ${errors.medication && touched.medication ? 'select-error' : ''}`}
                >
                  <option value="" label="Select medication" />
                  <option value="Antibiotics" label="Antibiotics" />
                  <option value="Painkillers" label="Painkillers" />
                  <option value="Insulin" label="Insulin" />
                  <option value="Inhalers" label="Inhalers" />
                  <option value="Antihypertensives" label="Antihypertensives" />
                  <option value="Antivirals" label="Antivirals" />
                  <option value="Corticosteroids" label="Corticosteroids" />
                  <option value="Other" label="Other" />
                </Field>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 font-bold pl-2">Visit Type</label>
              <div className="relative">
                <FaClipboardList className="absolute left-3 top-2/4 transform -translate-y-2/4 text-gray-400" />
                <Field
                  as="select"
                  name="visitType"
                  className={`select select-bordered pl-10 w-full h-12 ${errors.visitType && touched.visitType ? 'select-error' : ''}`}
                >
                  <option value="" label="Select visit type" />
                  <option value="RoutineCheckUp" label="Routine Check-Up" />
                  <option value="Consultation" label="Consultation" />
                  <option value="BloodTest" label="Blood Test" />
                  <option value="Vaccination" label="Vaccination" />
                  <option value="Emergency" label="Emergency" />
                  <option value="Specialist" label="Specialist" />
                </Field>
              </div>
              <ErrorMessage name="visitType" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block text-sm mb-1 font-bold pl-2">Blood Pressure (Optional)</label>
              <div className="relative">
                <FaHeartbeat className="absolute left-3 top-2/4 transform -translate-y-2/4 text-gray-400" />
                <Field
                  type="text"
                  name="bloodPressure"
                  placeholder="Blood Pressure (Optional)"
                  className="input input-bordered pl-10 w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 font-bold pl-2">Heart Rate (Optional)</label>
              <div className="relative">
                <FaHeartbeat className="absolute left-3 top-2/4 transform -translate-y-2/4 text-gray-400" />
                <Field
                  type="number"
                  name="heartRate"
                  placeholder="Heart Rate (Optional)"
                  className="input input-bordered pl-10 w-full"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 font-bold pl-2">Temperature (Optional)</label>
              <div className="relative">
                <FaTemperatureHigh className="absolute left-3 top-2/4 transform -translate-y-2/4 text-gray-400" />
                <Field
                  type="number"
                  name="temperature"
                  placeholder="Temperature (Optional)"
                  className="input input-bordered pl-10 w-full"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 font-bold pl-2">Weight (Optional)</label>
              <div className="relative">
                <FaWeight className="absolute left-3 top-2/4 transform -translate-y-2/4 text-gray-400" />
                <Field
                  type="number"
                  name="weight"
                  placeholder="Weight (Optional)"
                  className="input input-bordered pl-10 w-full"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 font-bold pl-2">Height (Optional)</label>
              <div className="relative">
                <FaRuler className="absolute left-3 top-2/4 transform -translate-y-2/4 text-gray-400" />
                <Field
                  type="number"
                  name="height"
                  placeholder="Height (Optional)"
                  className="input input-bordered pl-10 w-full"
                  min="0"
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm mb-1 font-bold pl-2">Notes</label>
              <div className="relative">
                <AiOutlineFileText className="absolute left-3 top-2/4 transform -translate-y-2/4 text-gray-400" />
                <Field
                  type="text"
                  name="notes"
                  placeholder="Notes"
                  className={`input input-bordered pl-10 w-full ${errors.notes && touched.notes ? 'input-error' : ''}`}
                />
              </div>
              <ErrorMessage name="notes" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="col-span-2 text-center mt-4">
              <button
                type="submit"
                className="btn btn-outline btn-success"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Record'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
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

export default AddMedicalRecord;
