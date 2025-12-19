import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent {
  @Input() totalAccounts = 1100;
  @Input() agentId: string | null = null;
  @Input() chartOptions!: any;

  animatedNumber = 0;

  selectedAgent: string | null = null;

  // ✅ Define the agents list
  agents = [
    { code: 'agent-1', name: 'Agent 1' },
    { code: 'agent-2', name: 'Agent 2' },
  ];

  onAgentChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.agentId = target.value; // Update selected agent
    this.loadData(this.agentId); // Reload data for the selected agent
  }

  loadData(selectedAgentId?: string | null) {
    this.agentId = selectedAgentId ?? this.agentId; // Ensure it's set even if null is passed
    const { total, history } = this.getDataForAgent(this.agentId);
    this.totalAccounts = total;
    this.animateNumber();
    this.initChart(history);
  }

  animateNumber() {
    this.animatedNumber = 0;
    const steps = 50;
    const increment = Math.ceil(this.totalAccounts / steps);

    // Add the blur class to start the blurring effect
    const numberElement = document.querySelector(
      '.animated-number'
    ) as HTMLElement;
    numberElement?.classList.add('blurring');
    numberElement?.classList.add('scaling');

    interval(20)
      .pipe(take(steps))
      .subscribe({
        next: () => {
          this.animatedNumber = Math.min(
            this.animatedNumber + increment,
            this.totalAccounts
          );
        },
        complete: () => {
          this.animatedNumber = this.totalAccounts;
          // Remove the blur effect when the animation completes
          numberElement?.classList.remove('blurring');
          numberElement?.classList.remove('scaling');
        },
      });
  }

  initChart(history: number[]) {
    this.chartOptions = {
      title: { text: 'Total Accounts', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] },
      yAxis: { type: 'value' },
      series: [
        {
          name: 'Accounts',
          type: 'bar', // ✅ Changed to bar chart
          data: history,
          barWidth: '50%',
          itemStyle: { color: '#42A5F5' }, // Customize bar color
        },
      ],
    };
  }

  getDataForAgent(agentId: string | null) {
    const agentData: Record<string, { total: number; history: number[] }> = {
      'agent-1': { total: 400, history: [100, 200, 250, 350, 400] },
      'agent-2': { total: 600, history: [200, 300, 450, 550, 600] },
    };

    return agentId && agentData[agentId]
      ? agentData[agentId]
      : { total: 1100, history: [500, 700, 900, 1200, 1100] };
  }
}
