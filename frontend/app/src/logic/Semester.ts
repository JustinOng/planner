import { IIndex, IIndexMap } from './interface.d';

import { NUM_WEEKS } from '../config';

import Week from './Week';

export default class Semester {
  weeks: Week[];
  added: IIndexMap;

  constructor() {
    this.weeks = [];
    for (let i = 0; i < NUM_WEEKS; i++) this.weeks.push(new Week());

    this.added = {};
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
}
