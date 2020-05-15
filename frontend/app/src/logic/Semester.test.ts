import Semester from './Semester';
import { ICourse } from './interface.d';

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
          }
        ]
      }
    }
  };

  s.add(course, '10000');

  for (let week = 0; week < NUM_WEEKS; week++) {
    expect(s.weeks[week].lessons.get(930)!.length).toEqual(1);
    expect(s.weeks[week].lessons.get(930)![0].index).toEqual('10000');
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

  s.add(course, '10000');

  expect(s.weeks[0].lessons.get(930)!.length).toEqual(1);
  expect(s.weeks[0].lessons.get(930)![0].index).toEqual('10000');

  expect(s.weeks[0].lessons.get(1030)!.length).toEqual(1);
  expect(s.weeks[0].lessons.get(1030)![0].index).toEqual('10000');
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

  s.add(course, '10000');

  expect(s.weeks[0].lessons.get(800)!.length).toEqual(1);
  expect(s.weeks[0].lessons.get(800)![0].index).toEqual('10000');

  expect(s.weeks[0].lessons.get(830)!.length).toEqual(1);
  expect(s.weeks[0].lessons.get(830)![0].index).toEqual('10000');
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

  s.add(course, '10000');
  expect(s.courses).toContain('10000');

  expect(() => s.add(course, '10000')).toThrow();
});
