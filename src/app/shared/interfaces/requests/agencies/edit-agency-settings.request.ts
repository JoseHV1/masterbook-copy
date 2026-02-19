export interface EditAgencySettingsRequest {
  retentions: number;
  taxes: number;
  logo_image?: string;
  business_lines: string[];
  check_branding: boolean;
}
