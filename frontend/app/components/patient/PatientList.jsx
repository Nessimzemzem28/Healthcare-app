import React, { useState, useEffect } from 'react';
import { getAllPatients, createPatient, updatePatient, deletePatient, searchPatientsByFullName, searchPatientsByFirstName, searchPatientsByLastName } from '../../utils/api';
import dayjs from 'dayjs';
import Image from 'next/image';
import Avatar from '../../../public/patient.png';
import Modal from '../patient/Modal';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiUser, BiCalendar, BiMapPin, BiSearch, BiPlusCircle } from 'react-icons/bi';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PATIENTS_PER_PAGE = 8;

const PatientList = ({ onViewPatient }) => {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('fullName');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required('First Name is required')
      .matches(/^[a-zA-Z ]+$/, 'Only alphabetic characters are allowed'),
    lastName: Yup.string()
      .required('Last Name is required')
      .matches(/^[a-zA-Z ]+$/, 'Only alphabetic characters are allowed'),
    birthDate: Yup.date().required('Birth Date is required'),
    address: Yup.string()
      .required('Address is required')
      .matches(/^[a-zA-Z0-9\s,.'-]*$/, 'Invalid address format'),
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsData = await getAllPatients();
        setPatients(patientsData);
        setFilteredPatients(patientsData); 
      } catch (error) {
        console.error('Failed to fetch patients:', error);
        toast.error(error.message || 'Failed to fetch patients');
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchType]);

  const handleSearch = async () => {
    try {
      let data;
      if (searchType === 'fullName') {
        data = await searchPatientsByFullName(searchTerm);
      } else if (searchType === 'firstName') {
        data = await searchPatientsByFirstName(searchTerm);
      } else if (searchType === 'lastName') {
        data = await searchPatientsByLastName(searchTerm);
      }
      setFilteredPatients(data);
      setCurrentPage(1); // Reset to first page on search
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeletePatient = async (patientId) => {
    try {
      await deletePatient(patientId);
      toast.success('Patient deleted successfully');
      setPatients(patients.filter(patient => patient.id !== patientId));
      setFilteredPatients(filteredPatients.filter(patient => patient.id !== patientId));
    } catch (error) {
      console.error('Failed to delete patient:', error);
      toast.error(error.message || 'Failed to delete patient');
    }
  };

  const handleAddPatient = async (values, { setSubmitting }) => {
    try {
      const newPatient = await createPatient(values);
      toast.success('Patient added successfully');
      setPatients([...patients, newPatient]);
      setFilteredPatients([...filteredPatients, newPatient]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add patient:', error);
      toast.error(error.message || 'Failed to add patient');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPatient = async (values, { setSubmitting }) => {
    try {
      // Format birthDate to ISO-8601 DateTime
      values.birthDate = new Date(values.birthDate).toISOString();
      await updatePatient(selectedPatient.id, values);
      toast.success('Patient updated successfully');
      setPatients(patients.map(patient =>
        patient.id === selectedPatient.id ? { ...patient, ...values } : patient
      ));
      setFilteredPatients(filteredPatients.map(patient =>
        patient.id === selectedPatient.id ? { ...patient, ...values } : patient
      ));
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to update patient:', error);
      toast.error(error.message || 'Failed to update patient');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (patient) => {
    setSelectedPatient(patient);
    setShowDeleteModal(true);
  };

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const openEditModal = (patient) => {
    setSelectedPatient(patient);
    setShowEditModal(true);
  };

  const handleMedicalFolderClick = (patientId) => {
    router.push(`/medical-reports/${patientId}`);
  };

  const indexOfLastPatient = currentPage * PATIENTS_PER_PAGE;
  const indexOfFirstPatient = indexOfLastPatient - PATIENTS_PER_PAGE;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  const totalPages = Math.ceil(filteredPatients.length / PATIENTS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto mt-4">
      <div className="blur-container p-4 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-4xl font-extrabold mb-4 sm:mb-0 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-900 to-black">
              Patients List
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-bordered input-primary w-full pl-10"
                />
                <BiSearch className="h-6 w-6 absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-600" />
              </div>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="select select-bordered cursor-pointer"
              >
                <option value="fullName">Full Name</option>
                <option value="firstName">First Name</option>
                <option value="lastName">Last Name</option>
              </select>
              <button
                className="btn btn-primary cursor-pointer"
                onClick={openAddModal}
              >
                <BiPlusCircle className="h-6 w-6 mr-2 -mt-1" />
                Add Patient
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
              [...Array(PATIENTS_PER_PAGE)].map((_, index) => (
                <div key={index} className="card shadow-lg p-4 bg-zinc-200 rounded-lg overflow-hidden">
                  <div className="flex items-center mb-4">
                    <Skeleton circle={true} height={50} width={50} />
                    <div className="ml-4">
                      <Skeleton height={20} width={100} />
                      <Skeleton height={15} width={150} />
                    </div>
                  </div>
                  <Skeleton count={3} height={20} />
                </div>
              ))
            ) : (
            currentPatients.map((patient) => (
              <div key={patient.id} className="card shadow-lg p-4 bg-zinc-200 rounded-lg overflow-hidden">
                <div className="flex items-center mb-4">
                  <Image
                    src={Avatar}
                    alt="Patient Avatar"
                    width={50}
                    height={50}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h2 className="card-title text-lg font-bold text-gray-900">
                      {patient.firstName} {patient.lastName}
                    </h2>
                    <p className="text-gray-600">Birth Date: {dayjs(patient.birthDate).format('DD/MM/YYYY')}</p>
                  </div>
                </div>
                {patient.address && (
                  <p className="text-gray-600 mb-4">Address: {patient.address}</p>
                )}
                <div className="flex justify-between space-x-1">
                  <button
                    className="btn btn-outline btn-info w-1/3 cursor-pointer"
                    onClick={() => handleMedicalFolderClick(patient.id)}
                  >
                    Medical Folder
                  </button>
                  <button
                    className="btn btn-outline btn-primary w-1/3 cursor-pointer"
                    onClick={() => openEditModal(patient)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline btn-primary w-1/3 cursor-pointer"
                    onClick={() => openDeleteModal(patient)}
                  >
                    Delete
                  </button>
                </div>
              </div>
             ))
            )}
          </div>

          <div className="flex justify-center mt-4">
            <div className="btn-group">
              <button
                className="btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                « Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`btn ${currentPage === index + 1 ? 'btn-active' : ''}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next »
              </button>
            </div>
          </div>
        </div>

        {/* Modals */}
        {/* Delete Modal */}
        {showDeleteModal && (
          <Modal
            title="Delete Patient"
            actionType="delete"
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => {
              handleDeletePatient(selectedPatient.id);
              setShowDeleteModal(false);
            }}
          >
            Are you sure you want to delete {selectedPatient?.firstName} {selectedPatient?.lastName}?
          </Modal>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <Modal
            title="Add Patient"
            actionType="add"
            onClose={() => setShowAddModal(false)}
          >
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                birthDate: '',
                address: '',
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                handleAddPatient(values, { setSubmitting });
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="max-w-lg mx-auto space-y-4">
                  <div className="relative w-full">
                    <BiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Field
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      className={`input input-bordered w-full pl-10 ${errors.firstName && touched.firstName ? 'input-error' : ''}`}
                    />
                  </div>
                  <ErrorMessage name="firstName" component="div" className="text-red-500" />

                  <div className="relative w-full">
                    <BiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Field
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      className={`input input-bordered w-full pl-10 ${errors.lastName && touched.lastName ? 'input-error' : ''}`}
                    />
                  </div>
                  <ErrorMessage name="lastName" component="div" className="text-red-500" />

                  <div className="relative w-full">
                    <BiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Field
                      type="date"
                      name="birthDate"
                      placeholder="Birth Date"
                      className={`input input-bordered w-full pl-10 ${errors.birthDate && touched.birthDate ? 'input-error' : ''}`}
                    />
                  </div>
                  <ErrorMessage name="birthDate" component="div" className="text-red-500 mt-1" />

                  <div className="relative w-full">
                    <BiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Field
                      type="text"
                      name="address"
                      placeholder="Address"
                      className={`input input-bordered w-full pl-10 ${errors.address && touched.address ? 'input-error' : ''}`}
                    />
                  </div>
                  <ErrorMessage name="address" component="div" className="text-red-500" />

                  <div className="flex justify-between items-center mt-4">
                    <button
                      type="submit"
                      className="btn btn-outline btn-success cursor-pointer"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Adding...' : 'Add Patient'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </Modal>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedPatient && (
          <Modal
            title="Edit Patient"
            actionType="edit"
            onClose={() => setShowEditModal(false)}
          >
            <Formik
              initialValues={{
                firstName: selectedPatient.firstName,
                lastName: selectedPatient.lastName,
                birthDate: dayjs(selectedPatient.birthDate).format('YYYY-MM-DD'),
                address: selectedPatient.address || '',
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                handleEditPatient(values, { setSubmitting });
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="max-w-lg mx-auto space-y-4">
                  <div className="relative w-full">
                    <BiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Field
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      className={`input input-bordered w-full pl-10 ${errors.firstName && touched.firstName ? 'input-error' : ''}`}
                    />
                  </div>
                  <ErrorMessage name="firstName" component="div" className="text-red-500" />

                  <div className="relative w-full">
                    <BiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Field
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      className={`input input-bordered w-full pl-10 ${errors.lastName && touched.lastName ? 'input-error' : ''}`}
                    />
                  </div>
                  <ErrorMessage name="lastName" component="div" className="text-red-500" />

                  <div className="relative w-full">
                    <BiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Field
                      type="date"
                      name="birthDate"
                      placeholder="Birth Date"
                      className={`input input-bordered w-full pl-10 ${errors.birthDate && touched.birthDate ? 'input-error' : ''}`}
                    />
                  </div>
                  <ErrorMessage name="birthDate" component="div" className="text-red-500 mt-1" />

                  <div className="relative w-full">
                    <BiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Field
                      type="text"
                      name="address"
                      placeholder="Address"
                      className={`input input-bordered w-full pl-10 ${errors.address && touched.address ? 'input-error' : ''}`}
                    />
                  </div>
                  <ErrorMessage name="address" component="div" className="text-red-500" />

                  <button
                    type="submit"
                    className="btn btn-outline btn-success cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </Form>
              )}
            </Formik>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default PatientList;
