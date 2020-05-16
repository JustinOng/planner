import Semester from './Semester';

import { ICourseMap, ICourse } from './interface';

// https://gist.github.com/ssippe/1f92625532eef28be6974f898efb23ef#gistcomment-3274652
function cartesianProduct<T>(...allEntries: T[][]): T[][] {
  return allEntries.reduce<T[][]>(
    (results, entries) =>
      results
        .map((result) => entries.map((entry) => result.concat([entry])))
        .reduce((subResults, result) => subResults.concat(result), []),
    [[]]
  );
}

export default class Processor {
  courses: ICourse[];
  stats: {
    total: number;
    conflicts: number;
  };

  constructor(courses: ICourseMap, selectedCoursesIds: string[]) {
    this.courses = selectedCoursesIds.map((courseId) => {
      if (!Object.keys(courses).includes(courseId))
        throw new Error(`Unknown course id ${courseId} provided`);

      return courses[courseId];
    });

    this.stats = {
      total: 0,
      conflicts: 0
    };
  }

  run() {
    const product = cartesianProduct(
      ...this.courses.map((course) => Object.values(course.indexes))
    );

    this.stats.total = product.length;

    for (const courses of product) {
      const s = new Semester();

      for (const course of courses) s.add(course);

      if (s.hasConflict()) {
        this.stats.conflicts++;
        continue;
      }
    }

    console.log(this.stats);
  }
}
