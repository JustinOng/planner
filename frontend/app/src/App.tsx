import React from 'react';
import { Layout, Select, Button } from 'antd';
import 'antd/dist/antd.less';
import './App.css';

import Processor from './logic/Processor';

import { ICourse, ICourseMap } from './logic/interface.d';

interface IAppState {
  courses: ICourseMap;
  selectedCourses: string[];
}

export default class App extends React.Component<{}, IAppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      courses: {},
      selectedCourses: ['CE2001', 'CE2002', 'CE2004', 'CE2005', 'CE2107']
    };
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
    const p = new Processor(this.state.courses, this.state.selectedCourses);
    p.run();
  };

  render() {
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
          </div>
        </Layout.Content>
      </Layout>
    );
  }
}
