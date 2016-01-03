import React from 'react';

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: 'test'
    };
  }
  render() {
    return (
      <div>
        This is about! 
      </div>
    );
  }
}

export default About;
