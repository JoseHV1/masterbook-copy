export interface InsuranceCompanyModel {
  id: string;
  name: string;
  phones: Phone[];
  email: string;
  direction: string;
  website: string;
  secondEmail?: string;
  contacts?: ContactModel[];
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
