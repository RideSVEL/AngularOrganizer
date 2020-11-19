import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {DateService} from '../shared/date.service';
import {now} from 'moment';

interface Day {
  value: moment.Moment;
  active: boolean;
  disabled: boolean;
  selected: boolean;
}

interface Week {
  days: Day[];
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  calendar: Week[] | undefined;

  constructor(private dateService: DateService) {
  }

  ngOnInit(): void {
    this.dateService.date.subscribe(this.generate.bind(this));
  }

  private generate(nowMoment: moment.Moment): void {
    const startDay = nowMoment.clone().startOf('month').startOf('week');
    const endDay = nowMoment.clone().endOf('month').endOf('week');

    const date = startDay.clone().subtract(1, 'day');

    const calendar = [];

    while (date.isBefore(endDay, 'day')) {
      calendar.push({
        days: Array(7)
          .fill(0)
          .map(() => {
            const value = date.add(1, 'day').clone();
            const active = moment().isSame(value, 'date');
            const disabled = !nowMoment.isSame(value, 'month');
            const selected = nowMoment.isSame(value, 'date');

            return {
              value, active, disabled, selected
            };
          })
      });
    }
    this.calendar = calendar;
  }

  select(day: moment.Moment): void {
    this.dateService.changeDate(day);
  }
}
