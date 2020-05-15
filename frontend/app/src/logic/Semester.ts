import { ICourse, IIndex, ILesson } from './interface.d';

import { NUM_WEEKS } from '../config';

import Week from './Week';

export default class Semester {
  weeks: Week[];
  courses: string[];

  constructor() {
    this.weeks = [];
    for (let i = 0; i < NUM_WEEKS; i++) this.weeks.push(new Week());

    this.courses = [];
  }

  add(course: ICourse, indexId: string) {
    if (this.courses.includes(indexId)) {
      throw new Error(`${indexId} has already been added!`);
    }

    const index = course.indexes[indexId];

    if (!index) throw new Error(`Tried to add non existent index ${index}`);

    for (const lesson of index.lessons) {
      for (let week = 0; week < NUM_WEEKS; week++) {
        if (!lesson.remark) this.weeks[week].add(lesson);
      }
    }

    this.courses.push(indexId);
  }

  hasConflict(): boolean {
    for (const week of this.weeks) {
      if (week.hasConflict()) return true;
    }

    return false;
  }
}
