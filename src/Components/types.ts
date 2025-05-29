// types.ts
export interface FacebookApp {
  id: string;
  name: string;
}

export interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
}

export interface FacebookForm {
  id: string;
  name: string;
}

export interface FormField {
  key: string;
  label: string;
  type?: string;
}

export interface FieldMapping {
  fbField: string;
  fbLabel: string;
  crmField: string;
}

export interface CRMLead {
  srl_no: number;
  cust_name?: string;
  cust_email?: string;
  phone_no?: string;
  mobile_no?: string;
  city_name?: string;
  form_name?: string;
  page_name?: string;
  enter_on: string;
  remarks: string | Record<string, unknown>;
}

export interface FailedLead {
  srl_no: number;
  lead_id: string;
  form_name?: string;
  page_name?: string;
  error_message: string;
  enter_on: string;
  lead_data: string;
}

export interface CRMFieldOption {
  value: string;
  label: string;
}

export interface AlertMessageProps {
  type: 'error' | 'success';
  message: string;
  onClose: () => void;
}

export interface Tab {
  id: 'connect' | 'mapping' | 'leads' | 'failed';
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}