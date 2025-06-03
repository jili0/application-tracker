import React, { useState } from 'react';
import ApplicationItem from './ApplicationItem';
import ApplicationInput from './ApplicationInput';
import SearchRow from './SearchRow';
import { IApplication, SearchState } from '@/types';

interface ApplicationListProps {
  applications: IApplication[];
  onAddApplication: (application: Omit<IApplication, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateApplication: (application: IApplication) => void;
  onDeleteApplication: (applicationId: string) => void;
}

const ApplicationList = ({ 
  applications, 
  onAddApplication, 
  onUpdateApplication, 
  onDeleteApplication 
}: ApplicationListProps) => {
  const [editingApplicationId, setEditingApplicationId] = useState<string | null>(null);
  const [searchTerms, setSearchTerms] = useState<SearchState>({
    date: '',
    company: '',
    position: '',
    status: '',
    remarks: ''
  });

  // Calculate company counts
  const companyCount = applications.reduce((acc, app) => {
    const company = app.company.toLowerCase().trim();
    if (company) {
      acc[company] = (acc[company] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const handleEditApplication = (applicationId: string) => {
    setEditingApplicationId(applicationId);
  };

  const handleSaveApplication = (updatedApplication: IApplication) => {
    onUpdateApplication(updatedApplication);
    setEditingApplicationId(null);
  };

  const handleSearchChange = (field: keyof SearchState, value: string) => {
    setSearchTerms(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Filter applications based on search terms
  const filteredApplications = applications.filter(app => {
    return (
      (!searchTerms.date || app.date.toLowerCase().includes(searchTerms.date.toLowerCase())) &&
      (!searchTerms.company || app.company.toLowerCase().includes(searchTerms.company.toLowerCase())) &&
      (!searchTerms.position || app.position.toLowerCase().includes(searchTerms.position.toLowerCase())) &&
      (!searchTerms.status || app.status.includes(searchTerms.status)) &&
      (!searchTerms.remarks || app.remarks.toLowerCase().includes(searchTerms.remarks.toLowerCase()))
    );
  });

  return (
    <div className="application-list">
      <SearchRow 
        searchTerms={searchTerms}
        onSearchChange={handleSearchChange}
      />
      <ApplicationInput 
        onAddApplication={onAddApplication} 
        companyCount={companyCount}
      />
      {filteredApplications.map((application) => (
        <ApplicationItem
          key={application._id}
          application={application}
          isEditing={application._id === editingApplicationId}
          onEdit={() => handleEditApplication(application._id as string)}
          onSave={handleSaveApplication}
          onDelete={() => onDeleteApplication(application._id as string)}
          searchTerms={searchTerms}
          companyCount={companyCount}
        />
      ))}
    </div>
  );
};

export default ApplicationList;