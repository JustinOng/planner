import React from 'react';
import { Tabs } from 'antd';

import Week from '../Week';
import SemesterCls from '../../logic/Semester';

import './semester.less';

interface ISemesterProps {
  data: SemesterCls;
}

export default class Semester extends React.Component<ISemesterProps, {}> {
  render() {
    return (
      <div>
        <div>
          {Object.entries(this.props.data.added).map(
            ([indexId, courseCode]) => (
              <span
                key={`${courseCode}:${indexId}`}
                className="course-list-item"
              >
                {courseCode}: {indexId}
              </span>
            )
          )}
        </div>
        <Tabs defaultActiveKey="0">
          {this.props.data.weeks.map((week, i) => (
            <Tabs.TabPane key={i.toString()} tab={`Week ${i + 1}`}>
              <Week data={week} indexMap={this.props.data.added} />
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}
