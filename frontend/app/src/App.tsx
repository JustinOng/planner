import React from 'react';
import { Layout, Select, Tag } from 'antd';
import 'antd/dist/antd.less';
import './App.css';

import { ICourse } from './logic/interface.d';

interface IAppState {
  courses: {
    [key: string]: ICourse;
  };
}

export default class App extends React.Component<{}, IAppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      courses: {}
    };
  }

  componentDidMount() {
    fetch('courses.json')
      .then((res) => res.json())
      .then((courses) => {
        this.setState({ courses: courses as any });
      });
  }

  onSelect = (value: any, option: any) => {
    console.log('+', value);
  };

  onDeselect = (value: any, option: any) => {
    console.log('-', value);
  };

  render() {
    return (
      <Layout>
        <Layout.Content>
          <Select
            mode="multiple"
            placeholder="Select Courses"
            style={{ width: '100%' }}
            onSelect={this.onSelect}
            onDeselect={this.onDeselect}
            optionLabelProp="value"
          >
            {Object.values(this.state.courses).map((course: ICourse) => (
              <Select.Option key={course.code} value={course.code}>
                {`${course.code} - ${course.name}`.replace(/\*?#?$/, '')}
              </Select.Option>
            ))}
          </Select>
          asdf
        </Layout.Content>
      </Layout>
    );
  }
}
