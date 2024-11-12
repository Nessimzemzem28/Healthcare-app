"use client"

import { useParams } from 'next/navigation';
import MedicalReports from '../../components/medical-report/MedicalRecord';
import { useState } from 'react';
import Header from '@/app/components/Header';

const MedicalReportsPage = () => {
  const params = useParams();
  const [ready, setReady] = useState(false);

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <MedicalReports patientId={params.patientId} />
      </div>
    </>
  );
};

export default MedicalReportsPage;
