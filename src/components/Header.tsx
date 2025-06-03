import React from 'react';
import { signOut } from 'next-auth/react';

interface HeaderProps {
  totalApplications: number;
  answeredApplications: number;
  noAnswerApplications: number;
  rejectedApplications: number;
  userName: string;
  onClear: () => void;
}

const Header = ({ totalApplications, answeredApplications, noAnswerApplications, rejectedApplications, userName, onClear }: HeaderProps) => {
  return (
    <header className="header">
      <div className="container header-content">
        <div className="header-stats">
          <span>Total: <strong>{totalApplications}</strong></span>
          <span style={{ color: '#16a34a' }}>Answered: <strong>{answeredApplications}</strong></span>
          <span style={{ color: '#f59e0b' }}>No Answer: <strong>{noAnswerApplications}</strong></span>
          <span style={{ color: '#dc2626' }}>Rejected: <strong>{rejectedApplications}</strong></span>
          <button 
            onClick={() => window.print()}
            className="btn btn-print"
          >
            Print
          </button>
          <button 
            onClick={onClear}
            className="btn btn-delete"
          >
            Clear All
          </button>
        </div>
        <div className="header-right">
          <span>{userName}</span>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="btn btn-logout"
            title="Sign Out"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;