import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import {
  DataItem,
  Timeline,
  TimelineOptions,
  TimelineTimeAxisScaleType,
} from 'vis-timeline/standalone';
import { DataSet } from 'vis-timeline/standalone';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';

interface PolicyTimelineItem extends DataItem {
  policyType: string;
  account: string;
  insurance_company: string;
}

@Component({
  selector: 'app-policy-timeline',
  templateUrl: './policy-timeline.component.html',
  styleUrls: ['./policy-timeline.component.scss'],
})
export class PolicyTimelineComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input() chartOptionsData: any;
  @Input() zoom$!: Observable<'week' | 'month' | 'year' | 'today'>;
  @ViewChild('timelineContainer', { static: true })
  timelineContainer!: ElementRef;
  @ViewChild('tooltip') tooltipRef!: ElementRef;

  timeline!: Timeline;
  private zoomSub?: Subscription;

  activeView: 'week' | 'month' | 'year' = 'week'; // Default view

  constructor() {}

  //TODO: what to render if there isnt any policies to show
  //TODO: try creating the timeline on an empty page to see if the items are shifted as well

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['zoom$'] && this.zoom$) {
      this.zoomSub?.unsubscribe();
      this.zoomSub = this.zoom$.subscribe(command => {
        if (!this.timeline) return;
        switch (command) {
          case 'week':
            this.zoomToWeek();
            this.activeView = 'week';
            break;
          case 'month':
            this.zoomToMonth();
            this.activeView = 'month';
            break;
          case 'year':
            this.zoomToYear();
            this.activeView = 'year';
            break;
          case 'today':
            this.goToToday();
            break;
        }
      });
    }

    if (changes['chartOptionsData'] && this.chartOptionsData?.length > 0) {
      this.createTimeline(this.chartOptionsData);
    }
  }

  ngAfterViewInit(): void {
    if (this.chartOptionsData?.length > 0) {
      this.createTimeline(this.chartOptionsData);
    }
  }

  ngOnDestroy(): void {
    this.zoomSub?.unsubscribe();
  }

  getIconForType(type: string): string {
    switch (type) {
      case 'Personal':
        return 'assets/icons/timeline/people.svg';
      case 'Auto':
        return 'assets/icons/portal-client-car.svg';
      case 'Home':
        return 'assets/icons/portal-client-property.svg';
      default:
        return 'assets/icons/default.png';
    }
  }

  createTimeline(data: any): void {
    if (!data || !this.timelineContainer) return;
    // Convert policies into timeline items with icons.

    const items: PolicyTimelineItem[] = data.map((policy: any) => {
      const iconPath = this.getIconForType(policy.type);
      const publicIconPath = '/' + iconPath.replace(/^.*?assets\//, 'assets/');
      //publicIcon Path is needed becuse of the way vis library injects html
      return {
        id: policy.id,
        content: `
        <span class="policy-icon" style="display: inline-flex; align-items: center;">
          <img src="${publicIconPath}" alt="${policy.type} icon" height="16" style="vertical-align: middle; margin-right: 4px;" />
          ${policy.type} Policy
        </span>
      `,
        start: moment.utc(policy.expiration_date + 'T00:00:00Z').toDate(),
        className: 'policy-expiry',
        policyType: policy.type,
        account: policy.account,
        insurance_company: policy.insurance_company,
      };
    });
    const dataSet = new DataSet<PolicyTimelineItem>(items);

    const options: TimelineOptions = {
      showCurrentTime: true,
      selectable: true,
      zoomable: true,
      moment: (date: moment.MomentInput) => moment.utc(date),
      locale: 'en',
      // start: new Date(),
      // end: new Date(),
      // timeAxis: {
      //   scale: 'day',
      //   step: 1,
      // },
    };

    const testData = new DataSet([
      {
        id: 'fixed-test-item',
        content: '✅ Pure ISO Test',
        start: '2025-04-08T00:00:00Z',
        type: 'point',
      },
    ]);

    this.timeline = new Timeline(
      this.timelineContainer.nativeElement,
      dataSet,
      options
    );

    // this.timeline = new Timeline(
    //   this.timelineContainer.nativeElement,
    //   testData,
    //   options
    // );

    // data.forEach((policy: any, index: number) => {
    //   const date = moment.utc(policy.expiration_date).toDate();
    //   const markerId = `policy-marker-${policy.id || index}`;

    //   this.timeline.addCustomTime(date, markerId);
    //   this.timeline.setCustomTimeTitle(
    //     `${policy.type} Policy: ${policy.expiration_date}`,
    //     markerId
    //   );
    // });

    this.zoomToWeek();

    // Open policy on selection
    this.timeline.on('select', props => {
      const selectedId = props.items[0];
      if (selectedId) {
        window.open(`/portal/policies/${selectedId}`, '_blank');
      }
    });

    // Custom tooltip logic
    this.timeline.on('itemover', (props: any) => {
      const tooltipEl = this.tooltipRef?.nativeElement;
      if (!tooltipEl) return; //Prevents crash if tooltipRef isn't ready
      const itemId = props.item || props.items?.[0];
      if (!itemId) return;

      tooltipEl.style.display = 'inline-block'; // restore display
      tooltipEl.style.opacity = '1';
      tooltipEl.style.visibility = 'visible';

      const item = dataSet.get(itemId);

      // Check if it's an array (and extract first item)
      const singleItem = Array.isArray(item) ? item[0] : item;
      if (!singleItem) return;

      const iconSrc = this.getIconForType(singleItem.policyType);

      tooltipEl.innerHTML = `
        <div>
          <img src="${iconSrc}" alt="${singleItem.policyType}" />
          <strong>${singleItem.policyType} Policy</strong>
        </div>
        <div style="text-align: left;">Account: ${singleItem.account}</div>
        <div style="text-align: left;">Company: ${
          singleItem.insurance_company
        }</div>
        <div style="text-align: left;"> Expires: ${moment(
          singleItem.start
        ).format('LL')}</div>
      `;
    });

    this.timeline.on('itemout', () => {
      const tooltipEl = this.tooltipRef?.nativeElement;
      tooltipEl.style.opacity = '0';
      tooltipEl.style.visibility = 'hidden';
    });

    this.timeline.on('mouseMove', (event: any) => {
      const tooltipEl = this.tooltipRef.nativeElement;
      const containerRect =
        this.timelineContainer.nativeElement.getBoundingClientRect();

      const offsetX = event.event.clientX - containerRect.left;
      const offsetY = event.event.clientY - containerRect.top;

      tooltipEl.style.left = `${offsetX + 10}px`;
      tooltipEl.style.top = `${offsetY + 10}px`;
    });
  }

  setActiveView(view: 'week' | 'month' | 'year'): void {
    this.activeView = view;

    let start: Date, end: Date, scale: TimelineTimeAxisScaleType;

    switch (view) {
      case 'week':
        start = moment.utc().startOf('week').toDate();
        end = moment.utc().endOf('week').toDate();
        scale = 'day' as TimelineTimeAxisScaleType;
        break;
      case 'month':
        start = moment.utc().startOf('month').toDate();
        end = moment.utc().endOf('month').toDate();
        scale = 'day' as TimelineTimeAxisScaleType;
        break;
      case 'year':
        start = moment.utc().startOf('year').toDate();
        end = moment.utc().endOf('year').toDate();
        scale = 'month' as TimelineTimeAxisScaleType;
        break;
    }

    this.timeline.setWindow(start, end);
    this.timeline.setOptions({
      timeAxis: { scale, step: 1 },
    });
  }

  zoomToWeek(): void {
    const start = moment.utc().startOf('isoWeek').startOf('day').toDate();
    const end = moment.utc(start).add(6, 'days').endOf('day').toDate();
    this.timeline.setWindow(start, end);
    this.timeline.setOptions({
      timeAxis: { scale: 'day', step: 1 },
      zoomMin: end.getTime() - start.getTime(),
      zoomMax: end.getTime() - start.getTime(),
    });
  }

  zoomToMonth(): void {
    const start = moment.utc().startOf('month').startOf('day').toDate();
    const end = moment
      .utc(start)
      .add(1, 'month')
      .subtract(1, 'day')
      .endOf('day')
      .toDate();
    this.timeline.setWindow(start, end);
    this.timeline.setOptions({
      timeAxis: { scale: 'day', step: 1 },
      zoomMin: end.getTime() - start.getTime(),
      zoomMax: end.getTime() - start.getTime(),
    });
  }

  zoomToYear(): void {
    const start = moment.utc().startOf('month').toDate();
    const end = moment
      .utc(start)
      .add(8, 'months')
      .subtract(1, 'day')
      .endOf('day')
      .toDate();
    this.timeline.setWindow(start, end);
    this.timeline.setOptions({
      timeAxis: { scale: 'month', step: 1 },
      zoomMin: end.getTime() - start.getTime(),
      zoomMax: end.getTime() - start.getTime(),
    });
  }

  goToToday(): void {
    const today = moment.utc().toDate();
    this.timeline.moveTo(today);
  }
}
