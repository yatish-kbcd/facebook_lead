// LeadViewerTab.tsx
import React, { useEffect } from 'react';
import { Users, CheckCircle, Loader } from 'lucide-react';
import type { CRMLead } from './types';

interface LeadViewerTabProps {
  crmData: CRMLead[];
  setCrmData: (data: CRMLead[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
}

const API_BASE = 'http://localhost:3000/api';

const LeadViewerTab: React.FC<LeadViewerTabProps> = ({
  crmData,
  setCrmData,
  loading,
  setLoading,
  setError
}) => {
  useEffect(() => {
    loadCrmData();
  }, []);

  const loadCrmData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/crm-data`);
      const data = await response.json();
      if (data.success) {
        setCrmData(data.data);
      }
    } catch (err) {
      setError('Error loading CRM data: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const parseRemarks = (remarks: string | Record<string, unknown>) => {
    if (typeof remarks === 'string') {
      try {
        return JSON.parse(remarks);
      } catch {
        return remarks;
      }
    }
    return remarks;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Users className="mr-2 text-blue-600" />
            Lead Viewer ({crmData.length} leads)
          </h2>
          <button
            onClick={loadCrmData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <CheckCircle className="mr-2" size={16} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="animate-spin mr-2" />
            Loading leads...
          </div>
        ) : crmData.length === 0 ? (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No Leads Found</h3>
            <p className="mt-2 text-gray-500">Leads will appear here once they are captured from Facebook.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Additional Data</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {crmData.map((lead) => (
                  <tr key={lead.srl_no} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lead.cust_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.cust_email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.phone_no || lead.mobile_no || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.city_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div className="font-medium">{lead.form_name || 'Unknown Form'}</div>
                        <div className="text-xs text-gray-400">{lead.page_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(lead.enter_on)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {lead.remarks && (
                        <div className="max-w-xs">
                          {typeof parseRemarks(lead.remarks) === 'object' ? (
                            <div className="space-y-1">
                              {Object.entries(parseRemarks(lead.remarks)).map(([key, value]) => (
                                <div key={key} className="text-xs">
                                  <span className="font-medium">{key}:</span> {String(value)}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs">{String(lead.remarks)}</span>
                          )}
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

export default LeadViewerTab;