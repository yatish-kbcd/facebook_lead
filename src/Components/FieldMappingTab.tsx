// FieldMappingTab.tsx
import React, { useEffect, useState } from 'react';
import { Settings, CheckCircle, Loader, MapPin } from 'lucide-react';
import type { CRMFieldOption, FacebookForm, FacebookPage, FieldMapping, FormField } from './types';

interface FieldMappingTabProps {
  selectedForm: FacebookForm | null;
  selectedPage: FacebookPage | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
  crmFieldOptions: CRMFieldOption[];
}

const API_BASE = 'http://localhost:3000/api';

const FieldMappingTab: React.FC<FieldMappingTabProps> = ({
  selectedForm,
  selectedPage,
  loading,
  setLoading,
  setError,
  setSuccess,
  crmFieldOptions
}) => {
  const [currentFormFields, setCurrentFormFields] = useState<FormField[]>([]);
  const [mappings, setMappings] = useState<FieldMapping[]>([]);

  useEffect(() => {
    if (selectedForm && selectedPage) {
      loadFormFields();
      loadExistingMappings();
    }
  }, [selectedForm, selectedPage]);

  const loadFormFields = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/form-fields/${selectedForm?.id}/${selectedPage?.access_token}`);
      const data = await response.json();
      if (data.success) {
        setCurrentFormFields(data.fields);
        // Initialize mappings
        const initialMappings = data.fields.map((field: FormField) => ({
          fbField: field.key,
          fbLabel: field.label,
          crmField: 'unmapped'
        }));
        setMappings(initialMappings);
      }
    } catch (err) {
      setError('Error loading form fields: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const loadExistingMappings = async () => {
    try {
      const response = await fetch(`${API_BASE}/field-mappings/${selectedForm?.id}`);
      const data = await response.json();
      if (data.success && data.mappings.length > 0) {
        // Update mappings with existing data
        setMappings(prev => prev.map(mapping => {
          const existing = data.mappings.find((m: any) => m.fb_fields === mapping.fbField);
          return existing ? { ...mapping, crmField: existing.crm_fields } : mapping;
        }));
      }
    } catch (err) {
      console.error('Error loading existing mappings:', err);
    }
  };

  const handleMappingChange = (index: number, crmField: string) => {
    setMappings(prev => prev.map((mapping, i) => 
      i === index ? { ...mapping, crmField } : mapping
    ));
  };

  const saveMappings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/save-field-mapping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: selectedForm?.id,
          mappings: mappings
        })
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Field mappings saved successfully!');
      } else {
        setError(data.error || 'Failed to save mappings');
      }
    } catch (err) {
      setError('Error saving mappings: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedForm) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <Settings className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Form Selected</h3>
          <p className="mt-2 text-gray-500">Please connect a Facebook form first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <MapPin className="mr-2 text-green-600" />
          Field Mapping - {selectedForm.name}
        </h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="animate-spin mr-2" />
            Loading form fields...
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-medium text-gray-700 border-b pb-2">
              <div>Facebook Field</div>
              <div>CRM Field</div>
            </div>
            
            {mappings.map((mapping, index) => (
              <div key={mapping.fbField} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{mapping.fbLabel}</div>
                  <div className="text-sm text-gray-500">{mapping.fbField}</div>
                </div>
                <div>
                  <select
                    value={mapping.crmField}
                    onChange={(e) => handleMappingChange(index, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {crmFieldOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            
            <div className="pt-4">
              <button
                onClick={saveMappings}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin mr-2" size={20} />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2" size={20} />
                    Save Mappings
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldMappingTab;