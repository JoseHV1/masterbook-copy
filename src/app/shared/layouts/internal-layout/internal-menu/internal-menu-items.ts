import { iternalMenuModel } from './internal-menu-item-model';

const T = 'SHARED.SIDEBAR_MENU.';

export const MENU_ITEMS: iternalMenuModel = {
  agent: [
    {
      icon: 'home',
      title: T + 'DASHBOARD',
      url: 'dashboard',
    },
    {
      icon: 'person_search',
      title: T + 'LEADS',
      url: 'leads',
    },
    {
      icon: 'wallet',
      title: T + 'ACCOUNTS',
      url: 'accounts',
    },
    {
      icon: 'settings',
      title: T + 'OPERATIONS',
      options: [
        {
          name: T + 'REQUESTS',
          url: 'requests',
        },
        {
          name: T + 'POLICIES',
          url: 'policies',
        },
        {
          name: T + 'CLAIMS',
          url: 'claims',
        },
      ],
    },
    {
      icon: 'trending_up',
      title: T + 'FINANCIALS',
      options: [
        {
          name: T + 'INVOICES',
          url: 'invoices',
        },
        {
          name: T + 'PAYMENTS',
          url: 'payments',
        },
        {
          name: T + 'COMMISSIONS',
          url: 'commissions',
        },
      ],
    },
    {
      icon: 'article',
      title: T + 'FORMS',
      url: 'request-forms',
    },
    {
      icon: 'group',
      title: T + 'USERS',
      url: 'users',
    },
    {
      icon: 'shield',
      title: T + 'INSURERS',
      url: 'insurer',
    },
    {
      icon: 'bar_chart',
      title: T + 'REPORTS',
      url: 'reports',
    },
    {
      icon: 'calendar_month',
      title: T + 'CALENDAR',
      url: 'calendar',
    },
    {
      icon: 'mail',
      title: T + 'EMAIL',
      url: 'email',
    },
    {
      icon: 'help',
      title: T + 'HOW_TO',
      url: 'how-to/help',
    },
  ],
  client: [
    {
      icon: 'home',
      title: T + 'DASHBOARD',
      url: '/portal-client',
    },
    {
      icon: 'settings',
      title: T + 'OPERATIONS',
      options: [
        {
          name: T + 'REQUESTS',
          url: 'requests',
        },
        {
          name: T + 'POLICIES',
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
      title: T + 'FINANCIALS',
      options: [
        {
          name: T + 'INVOICES',
          url: 'invoices',
        },
      ],
    },
    {
      icon: 'person',
      title: T + 'MY_BROKER',
      url: 'my-broker',
    },
  ],
  admin: [
    {
      icon: 'space_dashboard',
      title: T + 'DASHBOARD',
      url: 'dashboard',
    },
    {
      icon: 'person_search',
      title: T + 'LEADS',
      options: [
        {
          name: T + 'ACCOUNT',
          url: 'leads/account',
        },
        {
          name: T + 'AGENCIES',
          url: 'leads/agencies',
        },
      ],
    },
    {
      icon: 'business',
      title: T + 'AGENCIES',
      url: 'agencies',
    },
    {
      icon: 'article',
      title: T + 'FORMS',
      url: 'request-forms',
    },
    {
      icon: 'shield',
      title: T + 'INSURERS',
      url: 'insurers/list',
    },
    {
      icon: 'help',
      title: T + 'HOW_TO',
      url: 'how-to',
    },
    {
      icon: 'policy',
      title: T + 'POLICY_SETTINGS',
      options: [
        {
          name: T + 'BUSINESS_LINES',
          url: 'policy-settings/business-lines',
        },
        {
          name: T + 'POLICY_CATEGORIES',
          url: 'policy-settings/policy-categories',
        },
        {
          name: T + 'POLICY_TYPES',
          url: 'policy-settings/policy-types',
        },
      ],
    },
    {
      icon: 'calendar_today',
      title: T + 'CALENDAR',
      url: 'calendar',
    },
    {
      icon: 'mail',
      title: T + 'EMAIL',
      url: 'communication',
    },
    {
      icon: 'language',
      title: T + 'TENANTS',
      url: 'tenants/list',
    },
    {
      icon: 'receipt_long',
      title: T + 'SUBSCRIPTION_PAYMENTS',
      url: 'stripe-billing/list',
    },
  ],
};
