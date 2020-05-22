import React from 'react';
import { Modal } from 'antd';

import NoEarly from './NoEarlyRule';

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

    this.rules = [new NoEarly()];
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
