import React from 'react';

import { TimePicker } from 'antd';

import BaseRule from './BaseRule';

import { IScoreResult, IRule } from './interface';
import SemesterCls from '../logic/Semester';

export default class FreeDayRule extends BaseRule implements IRule {
  constructor() {
    super();

    this.weight = 100;
    this.description = 'Prioritises completely free days';
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
        let hasLesson = false;

        for (const [time, lessons] of dayLessons.entries()) {
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

  render(): React.ReactElement {
    return React.createElement(this.BaseRule, { key: this.constructor.name });
  }
}
