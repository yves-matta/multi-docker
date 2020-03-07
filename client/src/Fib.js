import axios from 'axios';
import React, { Component } from 'react';

function validateResponse({response}) {
  const { headers } = response || {}

  return headers['content-type'].includes('application/json')
}

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
    const response = await axios.get('/api/values/current') || {};
    const isValidateResponse = validateResponse({ response })
    console.log('Fib fetchValues isValidateResponse', isValidateResponse);
    console.log('Fib fetchValues response', response);
    this.setState({ values: isValidateResponse ? response.data : {} });
  }

  async fetchIndexes() {
    const response = await axios.get('/api/values/all') || {};
    const isValidateResponse = validateResponse({ response })
    console.log('Fib fetchIndexes isValidateResponse', isValidateResponse);
    console.log('Fib fetchIndexes response', response);
    this.setState({ seenIndexes: isValidateResponse ? response.data : [] });
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
    console.log('Fib renderSeenIndexes this.state', Object.freeze(this.state));
    console.log('Fib renderSeenIndexes seenIndexes', seenIndexes);
    if (Array.isArray(seenIndexes)) {
      return seenIndexes.map(({ number }) => number).join(', ');
    }

    return null
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
