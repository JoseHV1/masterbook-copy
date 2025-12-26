import { StatisticsCardModel } from '../../shared/components/dashboard-statistics-card/dashboard-statistics-card-models';

export const STATISTICS_CARD: StatisticsCardModel[] = [
  {
    title: 'Invoices Awaiting Payment',
    icon: 'attach_money',
    quantity: 45,
    quantityTotal: 76,
    isTransaction: true,
    information: {
      description: '',
      value: 5569,
    },
  },
  {
    title: 'Converted Leads',
    icon: 'cast',
    quantity: 52,
    quantityTotal: 86,
    information: {
      description: 'Completed',
      value: 52,
    },
  },
  {
    title: 'Projects In Progress',
    icon: 'cases',
    quantity: 16,
    quantityTotal: 20,
    information: {
      description: 'Completed',
      value: 16,
    },
  },
  {
    title: 'Conversion Rate',
    icon: 'show_chart',
    quantity: 0,
    quantityTotal: 46.59,
    showPercent: true,
    isTransaction: true,
    information: {
      description: '',
      value: 2254,
    },
  },
];
