import SemesterCls from '../logic/Semester';

export interface IScoreResult {
  weight: number;
  score: number;
}

export interface IScoreResultLabelled extends IScoreResult {
  rule: string;
  description: string;
}

export interface IRule {
  description: string;
  score(semester: SemesterCls): IScoreResult;
  render(): React.ReactElement;
}
