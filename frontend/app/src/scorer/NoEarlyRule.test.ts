import NoEarlyRule from './NoEarlyRule';

import Semester from '../logic/Semester';
import { ICourse } from '../logic/interface.d';

import { NUM_WEEKS } from '../config';

test('early lessons should be penalised', () => {
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

  const rule = new NoEarlyRule();
  const ruleResult = rule.score(s);

  const EARLY_PENALTY = 1;

  expect(ruleResult.score).toEqual(-EARLY_PENALTY * NUM_WEEKS);
});

test('normal lessons should not be penalised', () => {
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
            time: '1030-1130',
            venue: 'LT0A',
            remark: ''
          }
        ]
      }
    }
  };

  s.add(course.code, course.indexes['10000']);

  const rule = new NoEarlyRule();
  const ruleResult = rule.score(s);

  expect(ruleResult.score).toEqual(0);
});
