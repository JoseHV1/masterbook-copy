export interface InsurerModel {
  _id: string;
  name: string;
  logo_url: string;
  website: string;
  phone_number: string;
  email: string;
  fax: string;
  address: string;
  status: string;
  business_lines: string[];
  createdAt: Date;
  updatedAt: Date;
}

// export interface InsurerCommissionsPercentModel {
//   name: string;
//   values: Record<string, number>;
// }
