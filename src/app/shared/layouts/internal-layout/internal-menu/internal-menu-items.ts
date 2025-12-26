import { iternalMenuModel } from './internal-menu-item-model';

export const MENU_ITEMS: iternalMenuModel = {
  agent: [
    {
      icon: 'home',
      title: 'Dashboard',
      url: 'dashboard',
    },
    {
      icon: 'wallet',
      title: 'Accounts',
      url: 'accounts',
    },
    {
      icon: 'settings',
      title: 'Operations',
      options: [
        {
          name: 'Requests',
          url: 'requests',
        },
        {
          name: 'Policies',
          url: 'policies',
        },
        {
          name: 'Claims',
          url: 'claims',
        },
      ],
    },
    {
      icon: 'trending_up',
      title: 'Financials',
      options: [
        {
          name: 'Invoices',
          url: 'invoices',
        },
        {
          name: 'Payments',
          url: 'payments',
        },
        {
          name: 'Commissions',
          url: 'commissions',
        },
      ],
    },
    {
      icon: 'article',
      title: 'Forms',
      url: 'request-forms',
    },
    {
      icon: 'group',
      title: 'Users',
      url: 'users',
    },
    {
      icon: 'shield',
      title: 'Insurers',
      url: 'insurer',
    },
    {
      icon: 'bar_chart',
      title: 'Reports',
      url: 'reports',
    },
    {
      icon: 'calendar_month',
      title: 'Calendar',
      url: 'calendar',
    },
    {
      icon: 'mail',
      title: 'Email',
      url: 'email',
    },
  ],
  client: [
    {
      icon: 'home',
      title: 'Dashboard',
      url: '/portal-client',
    },
    {
      icon: 'settings',
      title: 'Operations',
      options: [
        {
          name: 'Requests',
          url: 'requests',
        },
        {
          name: 'Policies',
          url: 'policies',
        },
        /*
        {
          name: 'Claims',
          url: 'claims',
        },
        {
          name: 'Communications',
          url: 'communications',
        },*/
      ],
    },
    {
      icon: 'trending_up',
      title: 'Financials',
      options: [
        {
          name: 'Invoices',
          url: 'invoices',
        },
      ],
    },
    {
      icon: 'person',
      title: 'My Broker',
      url: 'my-broker',
    },
  ],
  admin: [
    {
      icon: 'space_dashboard',
      title: 'Dashboard',
      url: 'dashboard',
    },
    {
      icon: 'business',
      title: 'Agencies',
      url: 'agencies',
    },
    {
      icon: 'analytics',
      title: 'Reports',
      url: 'reports',
    },
    {
      icon: 'calendar_today',
      title: 'Calendar',
      url: 'calendar',
    },
    {
      icon: 'mail',
      title: 'Email',
      url: 'communication',
    },
  ],
};
