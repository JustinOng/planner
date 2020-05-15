import { ICourse, IIndex, ILesson } from './interface.d';

import { NUM_WEEKS } from '../config';

import Week from './Week';

export default class Semester {
  weeks: Week[];

  constructor() {
    this.weeks = [];
    for (let i = 0; i < NUM_WEEKS; i++) this.weeks.push(new Week());
  }

  add(course: ICourse, indexId: string): boolean {
    const index = course.indexes[indexId];

    if (!index) throw new Error(`Index ${index} not found`);

    for (const lesson of index.lessons) {
      for (let week = 0; week < NUM_WEEKS; week++) {
        if (!lesson.remark) this.weeks[week].add(lesson);
      }
    }
    return false;
  }
}
