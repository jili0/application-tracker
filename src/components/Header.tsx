import React from 'react';
import { signOut } from 'next-auth/react';

interface HeaderProps {
  totalApplications: number;
  answeredApplications: number;
  userName: string;
  onClear: () => void;
}

const Header = ({ totalApplications, answeredApplications, userName, onClear }: HeaderProps) => {
  return (
    <header className="header">
      <div className="container header-content">
        <div className="header-stats">
          <span>Total: <strong>{totalApplications}</strong></span>
          <span>Answered: <strong>{answeredApplications}</strong></span>
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