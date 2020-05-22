import { IIndex, IIndexMap } from './interface.d';
import { IRule, IScoreResultLabelled } from '../scorer/interface.d';

import { NUM_WEEKS } from '../config';

import Week from './Week';

export default class Semester {
  weeks: Week[];
  added: IIndexMap;
  totalScore: number;
  scores: IScoreResultLabelled[];

  constructor() {
    this.weeks = [];
    for (let i = 0; i < NUM_WEEKS; i++) this.weeks.push(new Week());

    this.added = {};

    this.totalScore = 0;
    this.scores = [];
  }

  add(courseCode: string, index: IIndex) {
    if (Object.values(this.added).includes(courseCode)) {
      throw new Error(`${courseCode} has already been added!`);
    }

    for (const lesson of index.lessons) {
      let match;

      if (!lesson.remark) {
        for (let week = 0; week < NUM_WEEKS; week++) {
          this.weeks[week].add(lesson);
        }
      } else if ((match = lesson.remark.match(/^Teaching Wk(\d+)-(\d+)$/))) {
        const startWeek = parseInt(match[1], 10) - 1;
        const endWeek = parseInt(match[2], 10) - 1;

        for (let week = startWeek; week <= endWeek; week++) {
          this.weeks[week].add(lesson);
        }
      } else if ((match = lesson.remark.match(/^Teaching Wk((?:\d+,?)+)$/))) {
        const weeks = match[1].split(',').map((week) => parseInt(week, 10) - 1);

        weeks.forEach((week: number) => this.weeks[week].add(lesson));
      } else {
        throw new Error(`Unknown remarks format ${lesson.remark}`);
      }
    }

    this.added[index.id] = courseCode;
  }

  hasConflict(): boolean {
    for (const week of this.weeks) {
      if (week.hasConflict()) return true;
    }

    return false;
  }

  score(rules: IRule[]) {
    this.scores = [];

    let scoreSum = 0;
    let weightSum = 0;
    for (const rule of rules) {
      const score = rule.score(this);

      scoreSum += score.score * score.weight;
      weightSum += score.weight;

      this.scores.push({
        ...score,
        rule: rule.constructor.name,
        description: rule.description
      });
    }

    if (weightSum === 0) {
      this.totalScore = 0;
    } else {
      this.totalScore = Math.floor(scoreSum / weightSum);
    }
  }
}
