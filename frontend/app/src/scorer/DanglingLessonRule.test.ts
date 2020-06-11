import DanglingLessonRule from './DanglingLessonRule';

import Semester from '../logic/Semester';
import { ICourse } from '../logic/interface.d';

import { NUM_WEEKS } from '../config';

test('lessons below threshold should result in penalty', () => {
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
            type: 'LAB',
            group: 'TEST1',
            day: 'MON',
            time: '0930-1130',
            venue: 'LT0A',
            remark: ''
          },
          {
            index: '10000',
            type: 'LEC',
            group: 'TEST1',
            day: 'MON',
            time: '1330-1430',
            venue: 'LT0A',
            remark: ''
          }
        ]
      }
    }
  };

  s.add(course.code, course.indexes['10000']);

  const rule = new DanglingLessonRule();
  const ruleResult = rule.score(s);

  expect(ruleResult.score).toEqual(-1 * NUM_WEEKS);
});

test('multiple lessons should not result in penalty', () => {
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
            type: 'LAB',
            group: 'TEST1',
            day: 'MON',
            time: '0930-1030',
            venue: 'LT0A',
            remark: ''
          },
          {
            index: '10000',
            type: 'LAB',
            group: 'TEST1',
            day: 'MON',
            time: '1030-1230',
            venue: 'LT0A',
            remark: ''
          }
        ]
      }
    }
  };

  s.add(course.code, course.indexes['10000']);

  const rule = new DanglingLessonRule();
  const ruleResult = rule.score(s);

  expect(ruleResult.score).toEqual(0);
});
