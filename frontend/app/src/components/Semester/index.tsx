import React from 'react';
import { Tabs, Tag } from 'antd';
import { GlobalHotKeys } from 'react-hotkeys';

import Week from '../Week';
import SemesterCls from '../../logic/Semester';

import { NUM_WEEKS } from '../../config';

import './semester.less';

interface ISemesterProps {
  data: SemesterCls;
}

interface ISemesterState {
  activeKey: number;
}

export default class Semester extends React.Component<
  ISemesterProps,
  ISemesterState
> {
  constructor(props: ISemesterProps) {
    super(props);

    this.state = {
      activeKey: 0
    };
  }

  incWeek = () => {
    if (this.state.activeKey < NUM_WEEKS - 1)
      this.setState({ activeKey: this.state.activeKey + 1 });
  };

  decWeek = () => {
    if (this.state.activeKey > 0)
      this.setState({ activeKey: this.state.activeKey - 1 });
  };

  render() {
    const keyMap = {
      DEC_WEEK: 'a',
      INC_WEEK: 'd'
    };

    const handlers = {
      INC_WEEK: this.incWeek,
      DEC_WEEK: this.decWeek
    };

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
                <div key={scoreResult.rule}>
                  {scoreResult.rule}: {scoreResult.score}
                </div>
              ))}
            </div>
          </div>
        </div>
        <Tabs
          activeKey={this.state.activeKey.toString()}
          onTabClick={(key: string) =>
            this.setState({ activeKey: parseInt(key, 10) })
          }
        >
          {this.props.data.weeks.map((week, i) => (
            <Tabs.TabPane key={i.toString()} tab={`Week ${i + 1}`}>
              <Week data={week} indexMap={this.props.data.added} />
            </Tabs.TabPane>
          ))}
        </Tabs>
        <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
      </div>
    );
  }
}
