import { ILesson } from './interface.d';

export default class Week {
  lessons: {
    [key: string]: Map<number, ILesson[]>;
  };

  constructor() {
    this.lessons = {};
    for (const day of ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']) {
      this.lessons[day] = new Map([
        [800, []],
        [830, []],
        [930, []],
        [1030, []],
        [1130, []],
        [1230, []],
        [1330, []],
        [1430, []],
        [1530, []],
        [1630, []],
        [1730, []],
        [1830, []],
        [1930, []],
        [2030, []],
        [2130, []],
        [2230, []],
        [2330, []]
      ]);
    }
  }

  add(lesson: ILesson) {
    const [startTime, endTime] = lesson.time
      .split('-')
      .map((time) => parseInt(time, 10));

    let time = startTime;
    while (time < endTime) {
      this.lessons[lesson.day].get(time)!.push(lesson);

      // 8am timeslot is 30 mins long
      if (time === 800) {
        time += 30;
      } else {
        time += 100;
      }
    }
  }
}
