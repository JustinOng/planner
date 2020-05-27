import React from 'react';
import moment from 'moment';

import { TimePicker, Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';

import BaseRule from './BaseRule';

import { IScoreResult, IRule } from './interface.d';
import SemesterCls from '../logic/Semester';

export default class NoEarlyRule extends BaseRule implements IRule {
  threshold: moment.Moment;

  constructor() {
    super();

    this.threshold = moment('10:30', 'HH:mm');
    this.description = 'Penalises early lessons';
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
        for (const [time, lessons] of dayLessons.entries()) {
          if (time < parseInt(this.threshold.format('Hmm'), 10)) {
            if (lessons.length) score--;
          }
        }
      }
    }

    return {
      weight: this.weight,
      score
    };
  }

  private NoEarlyRule: React.FC<{}> = (props) => {
    return (
      <span className="param">
        <span className="param-label">
          <Tooltip title="Time threshold before which the lesson is scored as too early (-1)">
            <span>
              <span className="param-label">Threshold</span>
              <InfoCircleFilled />
            </span>
          </Tooltip>
          :
        </span>
        <TimePicker
          format="HH:mm"
          minuteStep={30}
          onChange={(time) => {
            if (time) this.threshold = time;
          }}
          defaultValue={this.threshold}
        />
      </span>
    );
  };

  render(): React.ReactElement {
    return React.createElement(
      this.BaseRule,
      { key: this.constructor.name },
      React.createElement(this.NoEarlyRule)
    );
  }
}
