import React from 'react';

import { Checkbox, InputNumber } from 'antd';

import { IScoreResult } from './interface.d';
import SemesterCls from '../logic/Semester';

/* rules are wrapped with a standard class because refs to React
   components are not available before the component mounts
   ie the rules (and .score) cannot be called if the rules
   modal has never been loaded */

export default abstract class BaseRule {
  name: string;
  description: string;
  enabled: boolean;
  weight: number;

  constructor() {
    this.name = 'Base Rule';
    this.description = 'Base Rule';
    this.enabled = true;
    this.weight = 10;
  }

  score(semester: SemesterCls): IScoreResult {
    throw new Error('Not implemented!');
  }

  protected BaseRule: React.FC<{}> = (props) => {
    return (
      <div className="rule">
        {this.description}
        <div>
          <span className="param">
            <span className="param-label">Enabled:</span>
            <Checkbox
              defaultChecked={this.enabled}
              onChange={(evt) => {
                this.enabled = evt.target.checked;
              }}
            />
          </span>
          <span className="param">
            <span className="param-label">Weight:</span>
            <InputNumber
              defaultValue={this.weight}
              onChange={(weight: any) => {
                this.weight = weight;
              }}
              min={1}
              className="weight"
            />
          </span>
          {props.children}
        </div>
      </div>
    );
  };
}
