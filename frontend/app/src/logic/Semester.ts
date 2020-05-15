import { ICourse, IIndex, ILesson } from './interface.d';

import { NUM_WEEKS } from '../config';

import Week from './Week';

export default class Semester {
  weeks: Week[];
  indexes: string[];

  constructor() {
    this.weeks = [];
    for (let i = 0; i < NUM_WEEKS; i++) this.weeks.push(new Week());

    this.indexes = [];
  }

  add(index: IIndex) {
    if (this.indexes.includes(index.id)) {
      throw new Error(`${index.id} has already been added!`);
    }

    for (const lesson of index.lessons) {
      for (let week = 0; week < NUM_WEEKS; week++) {
        if (!lesson.remark) this.weeks[week].add(lesson);
      }
    }

    this.indexes.push(index.id);
  }

  hasConflict(): boolean {
    for (const week of this.weeks) {
      if (week.hasConflict()) return true;
    }

    return false;
  }
}
