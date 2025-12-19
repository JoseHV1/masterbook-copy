export interface InsurerBackEntity {
  insurer_custom_name: string;
  name: string;
  email: string;
  phones: string;
  fax: string;
  direction: string;
  status: string;
  business_line: string[];
  commissions_percent: InsurerCommissionsPercentBackEntity;
  created_at: string;
  updated_at: string;
  id: string;
}

export interface InsurerCommissionsPercentBackEntity {
  [name: string]: {
    [name: string]: number;
  };
}
