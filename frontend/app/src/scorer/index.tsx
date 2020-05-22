import React from 'react';
import { Modal } from 'antd';

import NoEarly from './NoEarlyRule';
import LunchRule from './LunchRule';
import FreeDayRule from './FreeDayRule';
import MinimalBreaksRule from './MinimalBreaksRule';

import { IRule } from './interface.d';

import './index.less';

interface IScorerProps {
  visible: boolean;
  onCancel: () => void;
}

export default class Scorer extends React.Component<IScorerProps, {}> {
  rules: IRule[];

  constructor(props: IScorerProps) {
    super(props);

    this.rules = [
      new NoEarly(),
      new LunchRule(),
      new FreeDayRule(),
      new MinimalBreaksRule()
    ];
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        footer={null}
        title="Rules"
        style={{ minWidth: '800px' }}
      >
        {this.rules.map((rule) => rule.render())}
      </Modal>
    );
  }
}
