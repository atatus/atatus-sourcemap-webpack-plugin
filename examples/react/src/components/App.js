import React, { Component } from 'react';

class App extends Component {
  render() {
    try {
      throw new Error('Something went wrong');
    } catch (e) {
      window.atatus.error(e);
    }

    return (
      <div>AtatusSourceMapPlugin - React example</div>
    );
  }
}

export default App;
