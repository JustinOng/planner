import React from 'react';

import { Tooltip, InputNumber } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';

import BaseRule from './BaseRule';

import { IScoreResult, IRule } from './interface';
import SemesterCls from '../logic/Semester';

export default class DanglingLessonRule extends BaseRule implements IRule {
  threshold: number;

  constructor() {
    super();

    this.weight = 100;
    this.name = 'Dangling Lesson';
    this.description =
      'Penalises days with lessons but less than certain hours';
    this.threshold = 2;
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
        let lessonCount = 0;

        for (const lessons of dayLessons.values()) {
          if (lessons.length === 0) continue;

          if (lessons[0].type.includes('LEC')) continue;

          if (lessons.length > 0) lessonCount++;
        }

        if (lessonCount > 0 && lessonCount <= this.threshold) {
          score--;
        }
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
          <Tooltip title="Maximum threshold below which a day is counted as having a dangling lesson">
            <span>
              <span className="param-label">Threshold</span>
              <InfoCircleFilled />
            </span>
          </Tooltip>
          :
        </span>
        <InputNumber
          min={1}
          defaultValue={this.threshold}
          onChange={(val: any) => {
            this.threshold = val;
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
