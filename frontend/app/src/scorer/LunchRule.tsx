import React from 'react';
import moment from 'moment';

import { TimePicker, Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';

import BaseRule from './BaseRule';

import { IScoreResult, IRule } from './interface.d';
import SemesterCls from '../logic/Semester';

export default class LunchRule extends BaseRule implements IRule {
  lunchtime: moment.Moment[];

  constructor() {
    super();

    this.lunchtime = [moment('11:30', 'HH:mm'), moment('13:30', 'HH:mm')];
    this.description = 'Penalises the lack of empty slots for lunch';
  }

  score(semester: SemesterCls): IScoreResult {
    let score = 0;

    if (!this.enabled) {
      return {
        weight: 0,
        score: 0
      };
    }

    for (const week of semester.weeks) {
      for (const dayLessons of Object.values(week.lessons)) {
        let hasLunch = false;

        for (const [time, lessons] of dayLessons.entries()) {
          if (
            time >= parseInt(this.lunchtime[0].format('Hmm'), 10) &&
            time <= parseInt(this.lunchtime[1].format('Hmm'), 10)
          ) {
            if (lessons.length === 0) hasLunch = true;
          }
        }

        if (!hasLunch) score--;
      }
    }

    return {
      weight: this.weight,
      score
    };
  }

  private LunchRule: React.FC<{}> = (props) => {
    return (
      <span className="param">
        <span className="param-label">
          <Tooltip title="At least one empty time slot in this range">
            <span>
              <span className="param-label">Lunch Time</span>
              <InfoCircleFilled />
            </span>
          </Tooltip>
          :
        </span>
        <TimePicker.RangePicker
          picker="time"
          format="HH:mm"
          minuteStep={30}
          onChange={(time) => {
            if (time) this.lunchtime = time as moment.Moment[];
          }}
          defaultValue={[this.lunchtime[0], this.lunchtime[1]]}
        />
      </span>
    );
  };

  render(): React.ReactElement {
    return React.createElement(
      this.BaseRule,
      { key: this.constructor.name },
      React.createElement(this.LunchRule)
    );
  }
}
