import React, { useState, useEffect, useRef } from 'react';
import { IApplication, SearchState } from '@/types';
import { formatDate } from '@/lib/utils';

interface ApplicationItemProps {
  application: IApplication;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (application: IApplication) => void;
  onDelete: () => void;
  searchTerms: SearchState;
  companyCount: Record<string, number>;
}

const ApplicationItem = ({ 
  application, 
  isEditing, 
  onEdit, 
  onSave, 
  onDelete,
  searchTerms,
  companyCount 
}: ApplicationItemProps) => {
  const [editedApplication, setEditedApplication] = useState<IApplication>({
    ...application
  });
  
  const companyInputRef = useRef<HTMLInputElement>(null);
  const positionInputRef = useRef<HTMLInputElement>(null);
  const statusSelectRef = useRef<HTMLSelectElement>(null);
  const remarksInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedApplication({
      ...application
    });
  }, [application]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for date formatting on the fly
    if (name === 'date' && value.match(/^\d{6,8}$/)) {
      const formattedDate = formatDate(value);
      setEditedApplication(prev => ({
        ...prev,
        date: formattedDate
      }));
      
      // Move to next field
      if (companyInputRef.current) {
        companyInputRef.current.focus();
      }
      return;
    }
    
    setEditedApplication(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.key === 'Enter') {
      const target = e.currentTarget;
      const name = target.name;
      
      // Format date if needed
      if (name === 'date' && editedApplication.date) {
        const formattedDate = formatDate(editedApplication.date);
        setEditedApplication(prev => ({
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
        saveApplication();
      }
    }
    
    if (e.key === 'Escape') {
      onSave(application);
    }
  };

  const saveApplication = () => {
    onSave(editedApplication);
  };

  // Function to highlight search terms
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? <mark key={index} className="bg-yellow-300">{part}</mark> : part
    );
  };

  const statusClass = `status-${application.status}`;

  if (isEditing) {
    return (
      <div className={`application-item ${statusClass}`}>
        <div className="col-date">
          <input
            type="text"
            name="date"
            value={editedApplication.date}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Date"
            autoFocus
          />
        </div>
        <div className="col-company">
          <input
            type="text"
            name="company"
            value={editedApplication.company}
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
            value={editedApplication.position}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Position"
            ref={positionInputRef}
          />
        </div>
        <div className="col-status">
          <select
            name="status"
            value={editedApplication.status}
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
            value={editedApplication.remarks}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Remarks"
            ref={remarksInputRef}
          />
        </div>
        <div className="col-actions">
          <button 
            onClick={saveApplication}
            className="btn btn-save"
          >
            Save
          </button>
          <button 
            onClick={() => onSave(application)}
            className="btn btn-cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`application-item ${statusClass}`}
      onClick={onEdit}
    >
      <div className="col-date">
        {highlightText(application.date || '', searchTerms.date)}
      </div>
      <div className="col-company">
        {(() => {
          const companyKey = application.company.toLowerCase().trim();
          const count = companyCount[companyKey] || 0;
          const displayText = count > 1 ? `${application.company} (${count})` : application.company;
          
          if (count > 1) {
            return (
              <span title={`You have applied to ${application.company} ${count} times`}>
                {highlightText(displayText, searchTerms.company)}
              </span>
            );
          }
          return highlightText(displayText || '', searchTerms.company);
        })()}
      </div>
      <div className="col-position">
        {highlightText(application.position || '', searchTerms.position)}
      </div>
      <div className="col-status">
        {application.status === 'no-answer' ? 'No Answer' : 
         application.status === 'answered' ? 'Answered' : 'Rejected'}
      </div>
      <div className="col-remarks">
        {highlightText(application.remarks || '', searchTerms.remarks)}
      </div>
      <div className="col-actions">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="btn btn-edit"
        >
          Edit
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="btn btn-delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ApplicationItem;