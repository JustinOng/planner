import React from 'react';

import { Checkbox, Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';

import BaseRule from './BaseRule';

import { IScoreResult, IRule } from './interface.d';
import SemesterCls from '../logic/Semester';

export default class MinimalBreaksRule extends BaseRule implements IRule {
  penaliseOnLectures: boolean;

  constructor() {
    super();

    this.penaliseOnLectures = true;
    this.description = 'Penalises breaks between lessons';
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
        let hadLesson = false;
        // track how many slots away from last lesson
        let distanceFromLesson = 0;
        // accumulates penalty, applied only if there is
        // an occupied timeslot.
        // this prevents applying the penalty
        // if there are no more lessons that day
        let penalty = 0;

        for (const [time, lessons] of dayLessons.entries()) {
          if (
            lessons.length === 0 ||
            (!this.penaliseOnLectures &&
              lessons.length &&
              lessons[0].type.includes('LEC'))
          ) {
            distanceFromLesson++;
            if (hadLesson) {
              penalty += distanceFromLesson;
            }
          } else {
            hadLesson = true;
            score -= penalty;
            distanceFromLesson = 0;
          }
        }
      }
    }

    return {
      weight: this.weight,
      score
    };
  }

  private MinimalBreaksRule: React.FC<{}> = (props) => {
    return (
      <span className="param">
        <span className="param-label">
          <Tooltip title="Treat Lectures as 'breaks' (because lectures can be watched online)">
            <span>
              <span className="param-label">Treat Lectures as breaks</span>
              <InfoCircleFilled />
            </span>
          </Tooltip>
          :
        </span>
        <Checkbox
          defaultChecked={this.penaliseOnLectures}
          onChange={(evt) => {
            this.penaliseOnLectures = evt.target.checked;
          }}
        />
      </span>
    );
  };

  render(): React.ReactElement {
    return React.createElement(
      this.BaseRule,
      { key: this.constructor.name },
      React.createElement(this.MinimalBreaksRule)
    );
  }
}
