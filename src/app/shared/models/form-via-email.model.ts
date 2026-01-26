export interface SelectedAccount {
  email: string;
  name: string;
}

export interface FormViaEmailModel {
  id: string;
  selected_accounts: SelectedAccount[];
}
