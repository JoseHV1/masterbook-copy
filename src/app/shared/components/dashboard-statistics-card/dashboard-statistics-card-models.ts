export interface StatisticsCardModel {
  title: string;
  icon: string;
  quantity: number;
  quantityTotal: number;
  showPercent?: boolean;
  isTransaction?: boolean;
  information: DescriptionModel;
}

export interface DescriptionModel {
  description: string;
  value: number;
}
