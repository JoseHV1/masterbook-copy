import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InsurerModel } from '@app/shared/interfaces/models/insurer.model';
import { finalize, map, tap } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { ClientPin } from 'src/app/shared/services/dashboard.service';
import { StackedAreaChartData } from 'src/core/charts/stacked-area-chart/stacked-area-chart.component';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export type ChartKey =
  | 'summaryCards'
  | 'accounts'
  | 'requests'
  | 'quotes'
  | 'policies'
  | 'clientPins'
  | 'payments'
  | 'commissions';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent implements OnInit {
  @ViewChild('dashboardPdfRoot', { static: false })
  dashboardPdfRoot!: ElementRef<HTMLElement>;
  isExporting = false;

  // Define the expected argument lengths for each chart type
  private argumentsLength: { [key in ChartKey]: number } = {
    accounts: 3,
    quotes: 4,
    requests: 4,
    policies: 4,
    clientPins: 3,
    payments: 4,
    commissions: 4,
    summaryCards: 0,
  };

  //summaryCards Data
  dashboardTotals: any;

  //initial values for date and agent for filters of each chart
  selectedDateRange: {
    accounts: string;
    requests: string;
    quotes: string;
    policies: string;
    clientPins: string;
    payments: string;
    commissions: string;
    summaryCards?: string;
  } = {
    accounts: 'seven%20days',
    requests: 'seven%20days',
    quotes: 'seven%20days',
    policies: 'seven%20days',
    clientPins: 'seven%20days',
    payments: 'seven%20days',
    commissions: 'seven%20days',
    summaryCards: 'seven%20days',
  };

  selectedAgent: {
    accounts: any;
    requests: any;
    quotes: any;
    policies: any;
    clientPins: any;
    payments: any;
    commissions: any;
    summaryCards?: any;
  } = {
    accounts: '',
    requests: '',
    quotes: '',
    policies: '',
    clientPins: '',
    payments: '',
    commissions: '',
    summaryCards: '',
  };

  selectedCompany: {
    accounts: any;
    requests: any;
    quotes: any;
    policies: any;
    clientPins: any;
    payments: any;
    commissions: any;
    summaryCards?: any;
  } = {
    accounts: '',
    requests: '',
    quotes: '',
    policies: '',
    clientPins: '',
    payments: '',
    commissions: '',
    summaryCards: '',
  };

  //user Data
  loggedInUserId!: string;
  userIsAgent: boolean = false;
  agencyId: any = '';

  //summary cards data
  totalAccounts!: number;
  animatedNumber: number = 0;

  //charts Data
  accountsDataResponse!: any;
  requestsDataResponse!: any;
  quotesDataResponse!: any;
  policiesDataResponse!: any;

  //dropdowns options
  insuranceCompanies: any[] = [];
  agentsList: any[] = [];

  accountsChartOptions: any;
  accountsBarChartOptions: any;
  clientPinsResponse: ClientPin[] = [];

  startDate!: any;
  endDate!: any;

  constructor(
    private _ui: UiService,
    private _dashboard: DashboardService,
    private _auth: AuthService
  ) {}

  dateRanges = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1year', label: 'Year to Date' },
  ];

  commissionsStackedData: StackedAreaChartData = {
    buckets: ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05'],
    series: [
      {
        brokerId: 'b1',
        brokerName: 'Alice Johnson',
        totals: [1200, 1800, 1500, 2100, 2400],
      },
      {
        brokerId: 'b2',
        brokerName: 'Michael Chen',
        totals: [900, 1400, 1700, 1600, 2200],
      },
      {
        brokerId: 'b3',
        brokerName: 'Sofia Martinez',
        totals: [600, 1100, 1300, 1800, 2000],
      },
    ],
  };

  ngOnInit(): void {
    this.setUserData();

    //fetching dropdown options
    this.fetchInsuranceCompanies();
    if (this.agencyId) {
      this.fetchAgents();
    } else {
      console.error('Agency ID is not available at this point!');
    }

    //fetching initial chart data
    this.fetchChartData('summaryCards', 'all');
    this.fetchChartData('accounts', '7d');
    this.fetchChartData('requests', '7d');
    this.fetchChartData('quotes', '7d');
    this.fetchChartData('clientPins', 'all');
    this.fetchChartData('commissions', '7d', [], []);
  }

  setUserData(): void {
    const { loggedInUserId, userIsAgent, agencyId } =
      this._auth.getLoggedInUserData();
    this.loggedInUserId = loggedInUserId;
    this.userIsAgent = userIsAgent;
    this.agencyId = agencyId;
  }

  fetchChartData(
    chart: ChartKey,
    dateRange: string,
    agentIds: string[] = [],
    companyIds: string[] = []
  ) {
    // clientPins supports only one broker for now (pick first)
    if (chart === 'clientPins') {
      this._ui.showLoader();

      const brokerId = agentIds?.[0] ?? null;

      this._dashboard
        .getClientPins(brokerId)
        .pipe(finalize(() => this._ui.hideLoader()))
        .subscribe(pins => (this.clientPinsResponse = pins));

      return;
    }

    // date label
    this.selectedDateRange[chart] =
      this.dateRanges.find(r => r.value === dateRange)?.label ?? dateRange;

    // show “Multiple” or first selected (optional)
    const firstAgent = agentIds?.[0];
    this.selectedAgent[chart] = firstAgent
      ? this.agentsList.find(a => a.code === firstAgent) ?? ''
      : '';

    const firstCompany = companyIds?.[0];
    this.selectedCompany[chart] = firstCompany
      ? this.insuranceCompanies.find(c => c.code === firstCompany) ?? ''
      : '';

    this._ui.showLoader();

    switch (chart) {
      case 'summaryCards':
        return this._dashboard
          .getSummaryCards()
          .pipe(finalize(() => this._ui.hideLoader()))
          .subscribe((resp: any) => {
            this.dashboardTotals = resp.data;
            console.log('[summaryCards] totals:', this.dashboardTotals);
          });

      case 'accounts':
        return this._dashboard
          .getTotalAccounts(dateRange, agentIds, null, null)
          .pipe(finalize(() => this._ui.hideLoader()))
          .subscribe((resp: any) => (this.accountsDataResponse = resp.data));

      case 'quotes':
        return this._dashboard
          .getTotalQuotes(dateRange, agentIds, companyIds, null, null)
          .pipe(finalize(() => this._ui.hideLoader()))
          .subscribe((resp: any) => (this.quotesDataResponse = resp.data));

      case 'requests':
        return this._dashboard
          .getTotalRequests(dateRange, agentIds, companyIds, null, null)
          .pipe(finalize(() => this._ui.hideLoader()))
          .subscribe((resp: any) => (this.requestsDataResponse = resp.data));

      case 'commissions':
        return this._dashboard
          .getCommissionsTrend(dateRange, agentIds)
          .pipe(finalize(() => this._ui.hideLoader()))
          .subscribe((resp: any) => {
            console.log(resp);
            this.commissionsStackedData = resp.data;
          });

      default:
        this._ui.hideLoader();
        console.error(`No fetch function found for chart: ${chart}`);
        return;
    }
  }

  fetchInsuranceCompanies(): void {
    this._dashboard
      .getInsuranceCompanies()
      .pipe(
        map((response: any) => {
          return response.data.map((company: InsurerModel) => ({
            code: company._id,
            name: company.name,
          }));
        })
      )
      .subscribe(
        formattedCompanies => {
          this.insuranceCompanies = formattedCompanies;
        },
        error => {
          console.error('Error fetching insurance companies:', error);
        }
      );
  }

  fetchAgents(): void {
    this._dashboard
      .getEmployees(1, 10)
      .pipe(
        tap((response: any) => {}),
        map((response: any) => {
          const records = response?.data?.records ?? [];

          return records.map((employee: any) => ({
            code: employee._id ?? '',
            name:
              employee.full_name ??
              (employee.user
                ? `${employee.user.first_name} ${employee.user.last_name}`
                : ''),
          }));
        })
      )
      .subscribe(
        formattedAgents => {
          this.agentsList = formattedAgents;
        },
        error => {
          console.error('Error fetching agents:', error);
        }
      );
  }

  onFiltersApplied(filters: {
    dateRange: string;
    agents: string[];
    companies: string[];
    chart: ChartKey;
  }) {
    const { dateRange, agents, companies, chart } = filters;

    this.fetchChartData(
      chart,
      dateRange || '7d',
      agents || [],
      companies || []
    );
  }

  async downloadDashboardPdf(): Promise<void> {
    if (this.isExporting) return;
    if (!this.dashboardPdfRoot?.nativeElement) return;

    try {
      this.isExporting = true;
      this._ui.showLoader();

      // Let UI update before heavy work starts
      await new Promise(res => setTimeout(res, 100));

      const rootEl = this.dashboardPdfRoot.nativeElement;

      const canvas = await html2canvas(rootEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: rootEl.scrollWidth,
        windowHeight: rootEl.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let remainingHeight = imgHeight;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      remainingHeight -= pageHeight;

      while (remainingHeight > 0) {
        pdf.addPage();
        const yOffset = remainingHeight - imgHeight;
        pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight);
        remainingHeight -= pageHeight;
      }

      pdf.save(`dashboard-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      this._ui.hideLoader();
      this.isExporting = false;
    }
  }
}
