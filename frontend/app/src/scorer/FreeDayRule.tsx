import React from 'react';

import { Tooltip, Checkbox } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';

import BaseRule from './BaseRule';

import { IScoreResult, IRule } from './interface';
import SemesterCls from '../logic/Semester';

export default class FreeDayRule extends BaseRule implements IRule {
  includeWeekends: boolean;

  constructor() {
    super();

    this.weight = 100;
    this.name = 'Free Day';
    this.description = 'Prioritises completely free days';
    this.includeWeekends = false;
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
      for (const [day, dayLessons] of Object.entries(week.lessons)) {
        if (!this.includeWeekends) {
          if (day === 'SAT' || day === 'SUN') continue;
        }

        let hasLesson = false;

        for (const lessons of dayLessons.values()) {
          if (lessons.length > 0) hasLesson = true;
        }

        if (!hasLesson) score++;
      }
    }

    return {
      weight: this.weight,
      score
    };
  }

  private FreeDayRule: React.FC<{}> = (props) => {
    return (
      <span className="param">
        <span className="param-label">
          <Tooltip title="Whether to reward for free weekends">
            <span>
              <span className="param-label">Include Weekends</span>
              <InfoCircleFilled />
            </span>
          </Tooltip>
          :
        </span>
        <Checkbox
          defaultChecked={this.includeWeekends}
          onChange={(evt) => {
            this.includeWeekends = evt.target.checked;
          }}
        />
      </span>
    );
  };

  render(): React.ReactElement {
    return React.createElement(
      this.BaseRule,
      { key: this.name },
      React.createElement(this.FreeDayRule)
    );
  }
}
