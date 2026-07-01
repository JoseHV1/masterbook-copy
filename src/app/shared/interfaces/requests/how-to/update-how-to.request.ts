export interface UpdateHowToRequest {
  title: string;
  description?: string;
  video?: string;
  tenant_ids?: string[];
  order?: number;
}

export interface MoveHowToOrder {
  order: number;
}
