import SemesterCls from '../logic/Semester';

export interface IScoreResult {
  weight: number;
  score: number;
}

export interface IRule {
  score(semester: SemesterCls): IScoreResult;
  render(): React.ReactElement;
}
