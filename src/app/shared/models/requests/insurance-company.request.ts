export interface InsuranceCompanyRequest {
  name: string;
  direction: string; // Assuming this is equivalent to address
  website: string;
  email: string;
  secondEmail?: string;
  contacts?: ContactModel[];
  phones: Phone[];
}

export interface ContactModel {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactPosition: string;
}

export interface Phone {
  phoneNumber: string;
}
