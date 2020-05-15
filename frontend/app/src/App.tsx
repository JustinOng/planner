import React from 'react';
import './App.css';

import { ICourse } from './logic/interface.d';

interface IAppState {
  courses: ICourse[];
}

export default class App extends React.Component<{}, IAppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      courses: []
    };
  }

  componentDidMount() {
    fetch('courses.json').then((courses) => {
      this.setState({ courses: courses as any });
    });
  }

  render() {
    return <div></div>;
  }
}
