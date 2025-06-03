import React, { useState, useRef } from 'react';
import { ApplicationFormData } from '@/types';
import { formatDate } from '@/lib/utils';

interface ApplicationInputProps {
  onAddApplication: (application: ApplicationFormData) => void;
  companyCount?: Record<string, number>;
}

const ApplicationInput = ({ onAddApplication, companyCount }: ApplicationInputProps) => {
  const [newApplication, setNewApplication] = useState<ApplicationFormData>({
    date: '',
    company: '',
    position: '',
    status: 'no-answer',
    remarks: ''
  });
  
  const companyInputRef = useRef<HTMLInputElement>(null);
  const positionInputRef = useRef<HTMLInputElement>(null);
  const statusSelectRef = useRef<HTMLSelectElement>(null);
  const remarksInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for date formatting on the fly
    if (name === 'date' && value.match(/^\d{6,8}$/)) {
      const formattedDate = formatDate(value);
      setNewApplication(prev => ({
        ...prev,
        date: formattedDate
      }));
      
      // Move to next field
      if (companyInputRef.current) {
        companyInputRef.current.focus();
      }
      return;
    }
    
    setNewApplication(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.key === 'Enter') {
      const target = e.currentTarget;
      const name = target.name;
      
      // Format date if needed
      if (name === 'date' && newApplication.date) {
        const formattedDate = formatDate(newApplication.date);
        setNewApplication(prev => ({
          ...prev,
          date: formattedDate
        }));
        
        // Move to company field
        if (companyInputRef.current) {
          companyInputRef.current.focus();
        }
        return;
      }
      
      // Navigate to next field
      if (name === 'date' && companyInputRef.current) {
        companyInputRef.current.focus();
      } else if (name === 'company' && positionInputRef.current) {
        positionInputRef.current.focus();
      } else if (name === 'position' && statusSelectRef.current) {
        statusSelectRef.current.focus();
      } else if (name === 'status' && remarksInputRef.current) {
        remarksInputRef.current.focus();
      } else if (name === 'remarks') {
        // Save the application
        handleAddApplication();
      }
    }
  };

  const handleAddApplication = () => {
    // Only add application if there's any content
    if (newApplication.date || newApplication.company || newApplication.position || newApplication.remarks) {
      onAddApplication(newApplication);
      // Reset input fields
      setNewApplication({
        date: '',
        company: '',
        position: '',
        status: 'no-answer',
        remarks: ''
      });
    }
  };

  return (
    <div className="application-item">
      <div className="col-date">
        <input
          type="text"
          name="date"
          value={newApplication.date}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Date"
        />
      </div>
      <div className="col-company">
        <input
          type="text"
          name="company"
          value={newApplication.company}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Company"
          ref={companyInputRef}
        />
      </div>
      <div className="col-position">
        <input
          type="text"
          name="position"
          value={newApplication.position}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Position"
          ref={positionInputRef}
        />
      </div>
      <div className="col-status">
        <select
          name="status"
          value={newApplication.status}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          ref={statusSelectRef}
          className="status-select"
        >
          <option value="no-answer">No Answer</option>
          <option value="answered">Answered</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="col-remarks">
        <input
          type="text"
          name="remarks"
          value={newApplication.remarks}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Remarks"
          ref={remarksInputRef}
        />
      </div>
      <div className="col-actions">
        <button 
          onClick={handleAddApplication}
          className="btn btn-save"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ApplicationInput;