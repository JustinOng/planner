import React from 'react';
import { Table } from 'antd';
import { ColumnProps } from 'antd/es/table';

import { IIndexMap } from '../../logic/interface.d';
import WeekCls from '../../logic/Week';

interface IWeekProps {
  data: WeekCls;
  indexMap: IIndexMap;
}

interface IData {
  key: number;
  time: number;
}

export default class Week extends React.Component<IWeekProps, {}> {
  render() {
    const week = this.props.data;

    const data: IData[] = [
      {
        key: 800,
        time: 800
      }
    ];

    for (let i = 8; i <= 23; i++) {
      data.push({
        key: i * 100 + 30,
        time: i * 100 + 30
      });
    }

    const columns: ColumnProps<IData>[] = [
      {
        title: 'Time',
        dataIndex: 'time',
        align: 'center',
        render: (value: any, row: any, index: number) => ({
          children: value.toString(10).padStart(4, '0'),
          props: {}
        })
      }
    ];

    for (const day of ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']) {
      columns.push({
        title: day,
        dataIndex: day,
        align: 'center',
        render: (value: any, row: any, index: number) => {
          const lesson = week.lessons[day].get(data[index].time);

          if (!lesson || !lesson.length) {
            return {
              children: '',
              props: {}
            };
          }

          let children: React.ReactNode = '';
          if (lesson.length) {
            children = (
              <div>
                <div>{this.props.indexMap[lesson[0].index]}</div>
                <div>{lesson[0].type}</div>
                <div>{lesson[0].venue}</div>
              </div>
            );
          }

          let rowSpan = 1;
          const prevLesson = week.lessons[day].get(data[index - 1].time);
          if (
            index > 0 &&
            prevLesson &&
            prevLesson.length &&
            prevLesson[0].index === lesson[0].index
          ) {
            rowSpan = 0;
          } else {
            // count how many future adjacent timeslots have the same index
            for (let i = index + 1; i < data.length; i++) {
              const nextLesson = week.lessons[day].get(data[i].time);
              if (
                nextLesson &&
                nextLesson.length &&
                nextLesson[0].index === lesson[0].index
              ) {
                rowSpan++;
              } else {
                break;
              }
            }
          }

          return {
            children,
            props: {
              rowSpan
            }
          };
        }
      });
    }

    return (
      <Table
        columns={columns}
        dataSource={data}
        bordered
        size="small"
        pagination={false}
      />
    );
  }
}
