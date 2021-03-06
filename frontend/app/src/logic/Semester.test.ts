import React from 'react';
import Semester from './Semester';
import { ICourse } from './interface.d';
import { IRule, IScoreResult } from '../scorer/interface.d';

import { NUM_WEEKS } from '../config';

test('add 1 block lesson to all weeks', () => {
  const s = new Semester();

  const course: ICourse = {
    code: 'TEST0001',
    name: 'Name Test',
    au: '1.0 AU',
    indexes: {
      '10000': {
        id: '10000',
        lessons: [
          {
            index: '10000',
            type: 'LEC/STUDIO',
            group: 'TEST1',
            day: 'MON',
            time: '0930-1030',
            venue: 'LT0A',
            remark: ''
          },
          {
            index: '10000',
            type: 'LEC/STUDIO',
            group: 'TEST1',
            day: 'FRI',
            time: '1130-1230',
            venue: 'LT0A',
            remark: ''
          }
        ]
      }
    }
  };

  s.add(course.code, course.indexes['10000']);

  for (let week = 0; week < NUM_WEEKS; week++) {
    expect(s.weeks[week].lessons['MON'].get(930)!.length).toEqual(1);
    expect(s.weeks[week].lessons['MON'].get(930)![0].index).toEqual('10000');
    expect(s.weeks[week].lessons['FRI'].get(1130)!.length).toEqual(1);
    expect(s.weeks[week].lessons['FRI'].get(1130)![0].index).toEqual('10000');
  }
});

test('add 2 block lesson', () => {
  const s = new Semester();

  const course: ICourse = {
    code: 'TEST0001',
    name: 'Name Test',
    au: '1.0 AU',
    indexes: {
      '10000': {
        id: '10000',
        lessons: [
          {
            index: '10000',
            type: 'LEC/STUDIO',
            group: 'TEST1',
            day: 'MON',
            time: '0930-1130',
            venue: 'LT0A',
            remark: ''
          }
        ]
      }
    }
  };

  s.add(course.code, course.indexes['10000']);

  expect(s.weeks[0].lessons['MON'].get(930)!.length).toEqual(1);
  expect(s.weeks[0].lessons['MON'].get(930)![0].index).toEqual('10000');

  expect(s.weeks[0].lessons['MON'].get(1030)!.length).toEqual(1);
  expect(s.weeks[0].lessons['MON'].get(1030)![0].index).toEqual('10000');
});

test('add 2 block lesson at 8am', () => {
  const s = new Semester();

  const course: ICourse = {
    code: 'TEST0001',
    name: 'Name Test',
    au: '1.0 AU',
    indexes: {
      '10000': {
        id: '10000',
        lessons: [
          {
            index: '10000',
            type: 'LEC/STUDIO',
            group: 'TEST1',
            day: 'MON',
            time: '0800-0930',
            venue: 'LT0A',
            remark: ''
          }
        ]
      }
    }
  };

  s.add(course.code, course.indexes['10000']);

  expect(s.weeks[0].lessons['MON'].get(800)!.length).toEqual(1);
  expect(s.weeks[0].lessons['MON'].get(800)![0].index).toEqual('10000');

  expect(s.weeks[0].lessons['MON'].get(830)!.length).toEqual(1);
  expect(s.weeks[0].lessons['MON'].get(830)![0].index).toEqual('10000');
});

test('adding course twice should error', () => {
  const s = new Semester();

  const course: ICourse = {
    code: 'TEST0001',
    name: 'Name Test',
    au: '1.0 AU',
    indexes: {
      '10000': {
        id: '10000',
        lessons: [
          {
            index: '10000',
            type: 'LEC/STUDIO',
            group: 'TEST1',
            day: 'MON',
            time: '0930-1030',
            venue: 'LT0A',
            remark: ''
          }
        ]
      }
    }
  };

  s.add(course.code, course.indexes['10000']);
  expect(s.added['10000']).toContain(course.code);

  expect(() => s.add(course.code, course.indexes['10000'])).toThrow();
});

test('course overlap should conflict', () => {
  const s = new Semester();

  const courses: ICourse[] = [
    {
      code: 'TEST0001',
      name: 'Name Test1',
      au: '1.0 AU',
      indexes: {
        '10000': {
          id: '10000',
          lessons: [
            {
              index: '10000',
              type: 'LEC/STUDIO',
              group: 'TEST1',
              day: 'MON',
              time: '0930-1130',
              venue: 'LT0A',
              remark: ''
            }
          ]
        }
      }
    },
    {
      code: 'TEST0002',
      name: 'Name Test2',
      au: '1.0 AU',
      indexes: {
        '10001': {
          id: '10001',
          lessons: [
            {
              index: '10001',
              type: 'LEC/STUDIO',
              group: 'TEST1',
              day: 'MON',
              time: '1030-1230',
              venue: 'LT0A',
              remark: ''
            }
          ]
        }
      }
    }
  ];

  expect(s.hasConflict()).toEqual(false);

  s.add(courses[0].code, courses[0].indexes['10000']);
  expect(s.hasConflict()).toEqual(false);

  s.add(courses[1].code, courses[1].indexes['10001']);
  expect(s.hasConflict()).toEqual(true);
});

test('course remarks describing teaching weeks (range)', () => {
  const s = new Semester();

  const course: ICourse = {
    code: 'TEST0001',
    name: 'Name Test',
    au: '1.0 AU',
    indexes: {
      '10000': {
        id: '10000',
        lessons: [
          {
            index: '10000',
            type: 'LEC/STUDIO',
            group: 'TEST1',
            day: 'MON',
            time: '0930-1130',
            venue: 'LT0A',
            remark: 'Teaching Wk2-13'
          }
        ]
      }
    }
  };

  s.add(course.code, course.indexes['10000']);

  for (let week = 0; week < NUM_WEEKS; week++) {
    if (week === 0) {
      expect(s.weeks[week].lessons['MON'].get(930)!.length).toEqual(0);
    } else {
      expect(s.weeks[week].lessons['MON'].get(930)!.length).toEqual(1);
      expect(s.weeks[week].lessons['MON'].get(930)![0].index).toEqual('10000');
    }
  }
});

test('course remarks describing teaching weeks (exact)', () => {
  const s = new Semester();

  const course: ICourse = {
    code: 'TEST0001',
    name: 'Name Test',
    au: '1.0 AU',
    indexes: {
      '10000': {
        id: '10000',
        lessons: [
          {
            index: '10000',
            type: 'LEC/STUDIO',
            group: 'TEST1',
            day: 'MON',
            time: '0930-1130',
            venue: 'LT0A',
            remark: 'Teaching Wk5'
          }
        ]
      }
    }
  };

  s.add(course.code, course.indexes['10000']);

  for (let week = 0; week < NUM_WEEKS; week++) {
    if (week === 4) {
      expect(s.weeks[week].lessons['MON'].get(930)!.length).toEqual(1);
      expect(s.weeks[week].lessons['MON'].get(930)![0].index).toEqual('10000');
    } else {
      expect(s.weeks[week].lessons['MON'].get(930)!.length).toEqual(0);
    }
  }
});

test('course remarks describing teaching weeks (multiple exact)', () => {
  const s = new Semester();

  const course: ICourse = {
    code: 'TEST0001',
    name: 'Name Test',
    au: '1.0 AU',
    indexes: {
      '10000': {
        id: '10000',
        lessons: [
          {
            index: '10000',
            type: 'LEC/STUDIO',
            group: 'TEST1',
            day: 'MON',
            time: '0930-1130',
            venue: 'LT0A',
            remark: 'Teaching Wk2,5,7'
          }
        ]
      }
    }
  };

  s.add(course.code, course.indexes['10000']);

  for (let week = 0; week < NUM_WEEKS; week++) {
    if ([1, 4, 6].includes(week)) {
      expect(s.weeks[week].lessons['MON'].get(930)!.length).toEqual(1);
      expect(s.weeks[week].lessons['MON'].get(930)![0].index).toEqual('10000');
    } else {
      expect(s.weeks[week].lessons['MON'].get(930)!.length).toEqual(0);
    }
  }
});

test('scoring should return 0 if all rules return 0', () => {
  const s = new Semester();
  const rules: IRule[] = [
    {
      description: '',
      score: (semester: Semester) => ({ score: 0, weight: 0 }),
      render: () => React.createElement('div')
    }
  ];

  s.score(rules);

  expect(s.totalScore).toEqual(0);
});

test('scoring should compute correctly', () => {
  const s = new Semester();
  const results: IScoreResult[] = [
    {
      score: 10,
      weight: 10
    },
    {
      score: 20,
      weight: 5
    }
  ];

  const rules: IRule[] = [
    {
      description: '',
      score: (semester: Semester) => results[0],
      render: () => React.createElement('div')
    },
    {
      description: '',
      score: (semester: Semester) => results[1],
      render: () => React.createElement('div')
    }
  ];

  s.score(rules);

  expect(s.totalScore).toEqual(
    Math.floor(
      (results[0].score * results[0].weight +
        results[1].score * results[1].weight) /
        (results[0].weight + results[1].weight)
    )
  );
});
