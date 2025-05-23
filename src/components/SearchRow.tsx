import React from 'react';
import { SearchState } from '@/types';

interface SearchRowProps {
  searchTerms: SearchState;
  onSearchChange: (field: keyof SearchState, value: string) => void;
}

const SearchRow = ({ searchTerms, onSearchChange }: SearchRowProps) => {
  return (
    <div className="application-item search-row">
      <div className="col-date">
        <input
          type="text"
          placeholder="Search date..."
          value={searchTerms.date}
          onChange={(e) => onSearchChange('date', e.target.value)}
        />
      </div>
      <div className="col-company">
        <input
          type="text"
          placeholder="Search company..."
          value={searchTerms.company}
          onChange={(e) => onSearchChange('company', e.target.value)}
        />
      </div>
      <div className="col-position">
        <input
          type="text"
          placeholder="Search position..."
          value={searchTerms.position}
          onChange={(e) => onSearchChange('position', e.target.value)}
        />
      </div>
      <div className="col-status">
        <select
          value={searchTerms.status}
          onChange={(e) => onSearchChange('status', e.target.value)}
          className="status-select"
        >
          <option value="">All status</option>
          <option value="answered">Answered</option>
          <option value="no-answer">No Answer</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="col-remarks">
        <input
          type="text"
          placeholder="Search remarks..."
          value={searchTerms.remarks}
          onChange={(e) => onSearchChange('remarks', e.target.value)}
        />
      </div>
      <div className="col-actions">
        {/* Empty column for alignment */}
      </div>
    </div>
  );
};

export default SearchRow;