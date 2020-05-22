import React from 'react';
import { Layout, Select, Button } from 'antd';
import { GlobalHotKeys } from 'react-hotkeys';

import 'antd/dist/antd.less';
import './App.less';

import Semester from './components/Semester';
import Scorer from './scorer';

import Processor from './logic/Processor';
import SemesterCls from './logic/Semester';

import { ICourse, ICourseMap } from './logic/interface.d';

interface IAppState {
  courses: ICourseMap;
  selectedCourses: string[];
  validSemesters: SemesterCls[];
  curSemester: number;
  showingRules: boolean;
}

export default class App extends React.Component<{}, IAppState> {
  scorerRef: any;

  constructor(props: {}) {
    super(props);

    this.state = {
      courses: {},
      selectedCourses: ['CE2001', 'CE2002', 'CE2004'], //, 'CE2005', 'CE2107'],
      validSemesters: [],
      curSemester: 0,
      showingRules: false
    };

    this.scorerRef = React.createRef();
  }

  componentDidMount() {
    fetch('courses.json')
      .then((res) => res.json())
      .then((courses) => {
        this.setState({ courses: courses as any });
      });
  }

  onChange = (courses: string[]) => {
    this.setState({ selectedCourses: courses });
  };

  onProcess = () => {
    if (!this.scorerRef) throw new Error('scorer ref not defined!');

    const p = new Processor(this.state.courses, this.state.selectedCourses);
    const rules = this.scorerRef.current.rules;
    const validSemesters = p
      .run(rules)
      .sort((semA, semB) => semB.totalScore - semA.totalScore);
    this.setState({ curSemester: 0, validSemesters });
  };

  decSemester = () =>
    this.setState({
      curSemester: this.state.curSemester ? this.state.curSemester - 1 : 0
    });

  incSemester = () =>
    this.setState({
      curSemester:
        this.state.curSemester < this.state.validSemesters.length - 1
          ? this.state.curSemester + 1
          : this.state.curSemester
    });

  render() {
    const keyMap = {
      DEC_SEMESTER: 's',
      INC_SEMESTER: 'w'
    };

    const handlers = {
      DEC_SEMESTER: this.decSemester,
      INC_SEMESTER: this.incSemester
    };

    return (
      <Layout>
        <Layout.Content>
          <div style={{ display: 'flex' }}>
            <Select
              mode="multiple"
              placeholder="Select Courses"
              style={{ width: '100%' }}
              onChange={this.onChange}
              optionLabelProp="value"
              defaultValue={this.state.selectedCourses}
            >
              {Object.values(this.state.courses).map((course: ICourse) => (
                <Select.Option key={course.code} value={course.code}>
                  {`${course.code} - ${course.name}`.replace(/\*?#?$/, '')}
                </Select.Option>
              ))}
            </Select>
            <Button
              type="primary"
              disabled={this.state.selectedCourses.length === 0}
              onClick={this.onProcess}
            >
              Process
            </Button>
            <Button onClick={() => this.setState({ showingRules: true })}>
              Rules
            </Button>
          </div>
          {!!this.state.validSemesters.length && (
            <div>
              <div className="semester-select">
                <Button onClick={this.decSemester}>Previous</Button>
                <div className="semester-select-text">
                  <span>
                    {`Displaying Timetable ${this.state.curSemester + 1}/${
                      this.state.validSemesters.length
                    }`}
                  </span>
                </div>
                <Button onClick={this.incSemester}>Next</Button>
              </div>
              <Semester
                data={this.state.validSemesters[this.state.curSemester]}
              />
            </div>
          )}
          <Scorer
            ref={this.scorerRef}
            visible={this.state.showingRules}
            onCancel={() => this.setState({ showingRules: false })}
          />
          <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
        </Layout.Content>
      </Layout>
    );
  }
}
