// FacebookLeadCRM.tsx
import React, { useState, useEffect } from 'react';
import { ChevronRight, Facebook, Settings, Users, AlertTriangle, CheckCircle, Loader, MapPin } from 'lucide-react';
import AlertMessage from './AlertMessage';
import ConnectFacebookTab from './ConnectFacebookTab';
import FieldMappingTab from './FieldMappingTab';
import LeadViewerTab from './LeadViewerTab';
import FailedLeadsTab from './FailedLeadsTab';
import type { CRMFieldOption, CRMLead, FacebookApp, FacebookForm, FacebookPage, FailedLead, FieldMapping, FormField, Tab } from './types';

const API_BASE = 'http://localhost:3000/api';

const FacebookLeadCRM: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'connect' | 'mapping' | 'leads' | 'failed'>('connect');
  const [fbAccessToken, setFbAccessToken] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<FacebookApp | null>(null);
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<FacebookPage | null>(null);
  const [forms, setForms] = useState<FacebookForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<FacebookForm | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [crmData, setCrmData] = useState<CRMLead[]>([]);
  const [failedLeads, setFailedLeads] = useState<FailedLead[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const crmFieldOptions: CRMFieldOption[] = [
    { value: 'cust_name', label: 'Customer Name' },
    { value: 'cust_email', label: 'Customer Email' },
    { value: 'phone_no', label: 'Phone Number' },
    { value: 'mobile_no', label: 'Mobile Number' },
    { value: 'city_name', label: 'City Name' },
    { value: 'unmapped', label: 'Do not map' }
  ];

  const tabs: Tab[] = [
    { id: 'connect', label: 'Connect Facebook', icon: Facebook },
    { id: 'mapping', label: 'Field Mapping', icon: MapPin },
    { id: 'leads', label: 'Lead Viewer', icon: Users },
    { id: 'failed', label: 'Failed Leads', icon: AlertTriangle }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'connect':
        return (
          <ConnectFacebookTab
            fbAccessToken={fbAccessToken}
            setFbAccessToken={setFbAccessToken}
            loading={loading}
            setLoading={setLoading}
            setError={setError}
            setSuccess={setSuccess}
            selectedApp={selectedApp}
            setSelectedApp={setSelectedApp}
            pages={pages}
            setPages={setPages}
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
            forms={forms}
            setForms={setForms}
            selectedForm={selectedForm}
            setSelectedForm={setSelectedForm}
            setActiveTab={setActiveTab}
            crmFieldOptions={crmFieldOptions}
          />
        );
      case 'mapping':
        return (
          <FieldMappingTab
            selectedForm={selectedForm}
            selectedPage={selectedPage}
            loading={loading}
            setLoading={setLoading}
            setError={setError}
            setSuccess={setSuccess}
            crmFieldOptions={crmFieldOptions}
          />
        );
      case 'leads':
        return (
          <LeadViewerTab
            crmData={crmData}
            setCrmData={setCrmData}
            loading={loading}
            setLoading={setLoading}
            setError={setError}
          />
        );
      case 'failed':
        return (
          <FailedLeadsTab
            failedLeads={failedLeads}
            setFailedLeads={setFailedLeads}
            loading={loading}
            setLoading={setLoading}
            setError={setError}
          />
        );
      default:
        return (
          <ConnectFacebookTab
            fbAccessToken={fbAccessToken}
            setFbAccessToken={setFbAccessToken}
            loading={loading}
            setLoading={setLoading}
            setError={setError}
            setSuccess={setSuccess}
            selectedApp={selectedApp}
            setSelectedApp={setSelectedApp}
            pages={pages}
            setPages={setPages}
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
            forms={forms}
            setForms={setForms}
            selectedForm={selectedForm}
            setSelectedForm={setSelectedForm}
            setActiveTab={setActiveTab}
            crmFieldOptions={crmFieldOptions}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Facebook Lead Generation CRM</h1>
            <p className="mt-2 text-gray-600">Manage your Facebook leads with intelligent field mapping</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <Icon className="mr-2" size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Messages */}
        {error && (
          <AlertMessage
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}
        
        {success && (
          <AlertMessage
            type="success"
            message={success}
            onClose={() => setSuccess('')}
          />
        )}

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default FacebookLeadCRM;