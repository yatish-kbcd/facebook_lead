// ConnectFacebookTab.tsx
import React, { useEffect } from 'react';
import { ChevronRight, Facebook, Loader } from 'lucide-react';
import type { CRMFieldOption, FacebookApp, FacebookForm, FacebookPage } from './types';

interface ConnectFacebookTabProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
  selectedApp: FacebookApp | null;
  setSelectedApp: (app: FacebookApp | null) => void;
  pages: FacebookPage[];
  setPages: (pages: FacebookPage[]) => void;
  selectedPage: FacebookPage | null;
  setSelectedPage: (page: FacebookPage | null) => void;
  forms: FacebookForm[];
  setForms: (forms: FacebookForm[]) => void;
  selectedForm: FacebookForm | null;
  setSelectedForm: (form: FacebookForm | null) => void;
  setActiveTab: (tab: 'connect' | 'mapping' | 'leads' | 'failed') => void;
  crmFieldOptions: CRMFieldOption[];
}

const API_BASE = 'http://localhost:3000';

const ConnectFacebookTab: React.FC<ConnectFacebookTabProps> = ({
  loading,
  setLoading,
  setError,
  setSuccess,
  selectedApp,
  setSelectedApp,
  pages,
  setPages,
  selectedPage,
  setSelectedPage,
  forms,
  setForms,
  selectedForm,
  setSelectedForm,
  setActiveTab,
  crmFieldOptions
}) => {
  // Check if we're returning from Facebook auth
  useEffect(() => {
    const checkAuthStatus = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const authStatus = urlParams.get('auth');
      
      if (authStatus === 'success') {
        setSuccess('Successfully connected with Facebook!');
        // Remove the query params from URL
        window.history.replaceState({}, document.title, window.location.pathname);
        await initializeConnection();
      } else if (authStatus === 'error') {
        setError('Failed to authenticate with Facebook');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    checkAuthStatus();
  }, []);

  const initializeConnection = async () => {
    setLoading(true);
    try {
      // Check if we already have an app connected
      const appResponse = await fetch(`${API_BASE}/api/app-mst`);
      const appData = await appResponse.json();
      
      if (appData.success && appData.data.length > 0) {
        const app = appData.data[0];
        setSelectedApp({ id: app.app_id, name: app.app_name });
        await loadPages();
      } else {
        // No app connected yet, but we're authenticated
        setSelectedApp({ id: 'default', name: 'Facebook Lead Integration' });
      }
    } catch (err) {
      setError('Error initializing connection: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = () => {
    // Redirect to backend auth endpoint which will handle the OAuth flow
    window.location.href = `${API_BASE}/auth/facebook`;
  };

  const loadPages = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/pages`);
      const data = await response.json();
      if (data.success) {
        setPages(data.pages);
      } else {
        setError(data.error || 'Failed to load pages');
      }
    } catch (err) {
      setError('Error loading pages: ' + (err as Error).message);
    }
  };

  const handlePageSelect = async (page: FacebookPage) => {
    setSelectedPage(page);
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/api/forms/${page.id}/${page.access_token}`);
      const data = await response.json();
      if (data.success) {
        setForms(data.forms);
      } else {
        setError(data.error || 'Failed to load forms');
      }
    } catch (err) {
      setError('Error loading forms: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSelect = async (form: FacebookForm) => {
    setSelectedForm(form);
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/api/save-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: selectedApp?.id,
          pageId: selectedPage?.id,
          pageName: selectedPage?.name,
          formId: form.id,
          formName: form.name,
          pageAccessToken: selectedPage?.access_token
        })
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Form connected successfully! You can now set up field mapping.');
        setActiveTab('mapping');
      } else {
        setError(data.error || 'Failed to save form');
      }
    } catch (err) {
      setError('Error saving form: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Facebook className="mr-2 text-blue-600" />
          Connect Facebook Integration
        </h2>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Connect your Facebook account to access lead forms. You'll be redirected to Facebook to authorize access.
          </p>
          
          <button
            onClick={handleFacebookLogin}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <Loader className="animate-spin mr-2" size={20} />
                Connecting...
              </>
            ) : (
              <>
                <Facebook className="mr-2" size={20} />
                Connect with Facebook
              </>
            )}
          </button>
        </div>
      </div>

      {selectedApp && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Connected App</h3>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <Facebook className="text-blue-600 mr-3" size={24} />
              <div>
                <h4 className="font-medium">{selectedApp.name}</h4>
                <p className="text-sm text-gray-500">ID: {selectedApp.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedApp && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Select Facebook Page</h3>
          {pages.length === 0 ? (
            <button
              onClick={loadPages}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Load Pages
            </button>
          ) : (
            <div className="grid gap-3">
              {pages.map((page) => (
                <div
                  key={page.id}
                  onClick={() => handlePageSelect(page)}
                  className={`p-4 border rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 ${
                    selectedPage?.id === page.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{page.name}</h4>
                      <p className="text-sm text-gray-500">ID: {page.id}</p>
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedPage && forms.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Select Lead Form</h3>
          <div className="grid gap-3">
            {forms.map((form) => (
              <div
                key={form.id}
                onClick={() => handleFormSelect(form)}
                className={`p-4 border rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 ${
                  selectedForm?.id === form.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{form.name}</h4>
                    <p className="text-sm text-gray-500">Form ID: {form.id}</p>
                  </div>
                  <ChevronRight className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectFacebookTab;