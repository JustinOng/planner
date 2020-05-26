import FreeDayRule from './FreeDayRule';

import Semester from '../logic/Semester';
import { ICourse } from '../logic/interface.d';

import { NUM_WEEKS } from '../config';

test('free day should result in +1 (exclude weekends)', () => {
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

  const rule = new FreeDayRule();
  const ruleResult = rule.score(s);

  const DAYS_FREE_PER_WEEK = 3;

  expect(ruleResult.score).toEqual(DAYS_FREE_PER_WEEK * NUM_WEEKS);
});

test('free day should result in +1 (include weekends)', () => {
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

  const rule = new FreeDayRule();
  rule.includeWeekends = true;

  const ruleResult = rule.score(s);

  const DAYS_FREE_PER_WEEK = 5;

  expect(ruleResult.score).toEqual(DAYS_FREE_PER_WEEK * NUM_WEEKS);
});
