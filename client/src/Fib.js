import axios from 'axios';
import React, { Component } from 'react';

class Fib extends Component {
  state = {
    index: '',
    seenIndexes: [],
    values: {}
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    const values = await axios.get('/api/values/current');
    this.setState({ values: values.data || {} });
  }

  async fetchIndexes() {
    const seenIndexes = await axios.get('/api/values/all');
    this.setState({ seenIndexes: seenIndexes.data || [] });
  }

  handleChangeIndex = event => {
    const { value } = event.target || {};

    this.setState({ index: value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { index } = this.state;

    await axios.post('/api/values', {
      index
    });

    this.setState({ index: '' });
  };

  renderSeenIndexes() {
    const { seenIndexes } = this.state;

    return seenIndexes.map(({ number }) => number).join(', ');
  }

  renderValues() {
    const { values } = this.state;

    const entries = [];

    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }

    return entries;
  }

  render() {
    const { index } = this.state;

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input onChange={this.handleChangeIndex} value={index} />
          <button type="submit">Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        {this.renderSeenIndexes()}

        <h3>Calculated Values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Fib;
