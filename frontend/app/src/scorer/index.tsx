import React from 'react';
import { Modal } from 'antd';

import NoEarly from './NoEarlyRule';

import { IRule } from './interface.d';
import SemesterCls from '../logic/Semester';

import './index.less';

interface IScorerProps {
  visible: boolean;
  onCancel: () => void;
}

export default class Scorer extends React.Component<IScorerProps, {}> {
  rules: IRule[];

  constructor(props: IScorerProps) {
    super(props);

    this.rules = [new NoEarly()];
  }

  score(semester: SemesterCls): number {
    for (const rule of this.rules) {
      console.log(rule.score(semester));
    }
    return 0;
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        footer={null}
        title="Rules"
      >
        {this.rules.map((rule) => rule.render())}
      </Modal>
    );
  }
}
