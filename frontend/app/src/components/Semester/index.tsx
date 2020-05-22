import React from 'react';
import { Tabs, Tag } from 'antd';

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
        <div className="semester-header">
          <div>
            {Object.entries(this.props.data.added).map(
              ([indexId, courseCode]) => (
                <div
                  key={`${courseCode}:${indexId}`}
                  className="course-list-item"
                >
                  {courseCode}: <Tag>{indexId}</Tag>
                </div>
              )
            )}
          </div>
          <div>
            <div>Total Score: {this.props.data.totalScore + ' '}</div>
            <hr />
            <div>
              Score Breakdown:
              {this.props.data.scores.map((scoreResult) => (
                <div>
                  {scoreResult.rule}: {scoreResult.score}
                </div>
              ))}
            </div>
          </div>
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
