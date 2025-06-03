'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ApplicationList from '@/components/ApplicationList';
import { IApplication } from '@/types';
import { sortApplications } from '@/lib/utils';

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<IApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Load applications from server
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const fetchApplications = async () => {
        try {
          setError(null);
          const response = await fetch('/api/applications');
          
          if (response.ok) {
            const data = await response.json();
            setApplications(data);
          } else if (response.status === 401) {
            router.push('/login');
          } else {
            const errorData = await response.json();
            setError(errorData.error || 'Failed to load applications');
          }
        } catch (error) {
          setError('Error connecting to the server');
          console.error('Error loading applications:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchApplications();
    }
  }, [status, session, router]);

  // API functions for application operations
  const applicationApi = {
    addApplication: async (newApplication: any) => {
      try {
        setError(null);
        const response = await fetch('/api/applications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newApplication),
        });

        if (response.ok) {
          const data = await response.json();
          setApplications(prevApps => sortApplications([data, ...prevApps]));
        } else if (response.status === 401) {
          router.push('/login');
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to add application');
        }
      } catch (error) {
        setError('Error connecting to the server');
        console.error('Error adding application:', error);
      }
    },

    updateApplication: async (updatedApplication: IApplication) => {
      try {
        setError(null);
        const response = await fetch(`/api/applications/${updatedApplication._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedApplication),
        });

        if (response.ok) {
          const data = await response.json();
          setApplications(prevApps => 
            sortApplications(prevApps.map(app => app._id === data._id ? data : app))
          );
        } else if (response.status === 401) {
          router.push('/login');
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to update application');
        }
      } catch (error) {
        setError('Error connecting to the server');
        console.error('Error updating application:', error);
      }
    },

    deleteApplication: async (applicationId: string) => {
      try {
        setError(null);
        const response = await fetch(`/api/applications/${applicationId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setApplications(prevApps => prevApps.filter(app => app._id !== applicationId));
        } else if (response.status === 401) {
          router.push('/login');
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to delete application');
        }
      } catch (error) {
        setError('Error connecting to the server');
        console.error('Error deleting application:', error);
      }
    },

    clearApplications: async () => {
      if (window.confirm('Are you sure you want to delete all applications?')) {
        try {
          setError(null);
          const response = await fetch('/api/applications', {
            method: 'DELETE',
          });

          if (response.ok) {
            setApplications([]);
          } else if (response.status === 401) {
            router.push('/login');
          } else {
            const errorData = await response.json();
            setError(errorData.error || 'Failed to clear applications');
          }
        } catch (error) {
          setError('Error connecting to the server');
          console.error('Error deleting all applications:', error);
        }
      }
    },
  };

  // Calculate statistics
  const totalApplications = applications.length;
  const answeredApplications = applications.filter(app => app.status === 'answered').length;
  const noAnswerApplications = applications.filter(app => app.status === 'no-answer').length;
  const rejectedApplications = applications.filter(app => app.status === 'rejected').length;

  // Show loading indicator
  if (status === 'loading' || status === 'unauthenticated') {
    return <div className="loading">Loading...</div>;
  }

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  return (
    <div className="app-container">
      <Header 
        totalApplications={totalApplications}
        answeredApplications={answeredApplications}
        noAnswerApplications={noAnswerApplications}
        rejectedApplications={rejectedApplications}
        userName={session?.user?.name || ''}
        onClear={applicationApi.clearApplications}
      />
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      <div className="container">
        <ApplicationList 
          applications={applications}
          onAddApplication={applicationApi.addApplication}
          onUpdateApplication={applicationApi.updateApplication}
          onDeleteApplication={applicationApi.deleteApplication}
        />
      </div>
    </div>
  );
};

export default Home;