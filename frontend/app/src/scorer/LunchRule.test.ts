import LunchRule from './LunchRule';

import Semester from '../logic/Semester';
import { ICourse } from '../logic/interface.d';

import { NUM_WEEKS } from '../config';

test('no lessons should result in no penalisation', () => {
  const s = new Semester();
  const course: ICourse = {
    code: 'TEST0001',
    name: 'Name Test',
    au: '1.0 AU',
    indexes: {
      '10000': {
        id: '10000',
        lessons: []
      }
    }
  };

  s.add(course.code, course.indexes['10000']);

  const rule = new LunchRule();
  const ruleResult = rule.score(s);

  expect(ruleResult.score).toEqual(0);
});

test('full schedule should be penalised', () => {
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
            time: '0930-1730',
            venue: 'LT0A',
            remark: ''
          }
        ]
      }
    }
  };

  s.add(course.code, course.indexes['10000']);

  const rule = new LunchRule();

  const ruleResult = rule.score(s);

  const DAYS_WITH_NO_LUNCH = 1;

  expect(ruleResult.score).toEqual(-DAYS_WITH_NO_LUNCH * NUM_WEEKS);
});
