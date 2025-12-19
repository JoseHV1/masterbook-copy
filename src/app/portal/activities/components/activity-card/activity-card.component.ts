import {
  Component,
  Input,
  OnInit,
  Renderer2,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';
import { LogsService } from 'src/app/shared/services/logs.service';

@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        // each time the binding changes
        query(
          'li',
          [
            style({ opacity: 0, transform: 'translateY(30px)' }),
            stagger(200, [
              animate(
                '1000ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class ActivityCardComponent implements OnInit, AfterViewInit {
  @Input() agencyId!: string;
  activitiesResponse: any[] = [];
  activities: any[] = [];

  isVisible = false;

  constructor(
    private _logs: LogsService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // this._logs.getLogs(this.agencyId).subscribe(data => {
    //   this.activitiesResponse = data.data;
    //   this.formatData(this.activitiesResponse);
    // });

    this.formatData(this.activitiesResponse);
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.isVisible = true;
            observer.disconnect(); // Remove observer once visible
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(this.el.nativeElement);
  }

  formatData(data: any) {
    data.forEach((item: any) => {
      const activity = {
        user: item.user_id.name,
        action: item.action,
        type: item.type_log,
        time: this.timeSince(item.created_at),
      };
      this.activities.push(activity);
    });
  }

  timeSince(date: string | Date): string {
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const intervals: { [key: string]: number } = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    for (const [key, value] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / value);
      if (interval >= 1) {
        return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  }
}
