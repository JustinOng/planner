export interface ILesson {
  index: string;
  type: string;
  group: string;
  day: string;
  time: string;
  venue: string;
  remark: string;
}

export interface IIndex {
  id: string;
  lessons: ILesson[];
}

export interface ICourse {
  code: string;
  name: string;
  au: string;
  indexes: {
    [key: string]: IIndex;
  };
}
