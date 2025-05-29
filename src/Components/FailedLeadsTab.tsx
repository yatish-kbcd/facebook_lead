// FailedLeadsTab.tsx
import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle, Loader } from 'lucide-react';
import type { FailedLead } from './types';

interface FailedLeadsTabProps {
  failedLeads: FailedLead[];
  setFailedLeads: (data: FailedLead[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
}

const API_BASE = 'http://localhost:3000/api';

const FailedLeadsTab: React.FC<FailedLeadsTabProps> = ({
  failedLeads,
  setFailedLeads,
  loading,
  setLoading,
  setError
}) => {
  useEffect(() => {
    loadFailedLeads();
  }, []);

  const loadFailedLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/failed-leads`);
      const data = await response.json();
      if (data.success) {
        setFailedLeads(data.data);
      }
    } catch (err) {
      setError('Error loading failed leads: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <AlertTriangle className="mr-2 text-red-600" />
            Failed Leads ({failedLeads.length} failed)
          </h2>
          <button
            onClick={loadFailedLeads}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
          >
            <AlertTriangle className="mr-2" size={16} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="animate-spin mr-2" />
            Loading failed leads...
          </div>
        ) : failedLeads.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No Failed Leads</h3>
            <p className="mt-2 text-gray-500">All leads are being processed successfully!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Data</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {failedLeads.map((lead) => (
                  <tr key={lead.srl_no} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lead.lead_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div className="font-medium">{lead.form_name || 'Unknown Form'}</div>
                        <div className="text-xs text-gray-400">{lead.page_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-red-600">
                      <div className="max-w-xs break-words">
                        {lead.error_message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(lead.enter_on)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {lead.lead_data && (
                        <div className="max-w-xs">
                          <details className="cursor-pointer">
                            <summary className="text-blue-600 hover:text-blue-800">View Data</summary>
                            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                              {JSON.stringify(JSON.parse(lead.lead_data), null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FailedLeadsTab;