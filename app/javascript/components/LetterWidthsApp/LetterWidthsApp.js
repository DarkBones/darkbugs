import Letter from './Letter';
import React  from 'react';

export default class LetterWidthsApp extends React.Component {
  constructor(props) {
    super(props);

    this.chars = "ABCDEFGHIJKLMNOPQRSTOVWQRSTUVWabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+/*\\|{}[];:'\"<>?-.".split('');
    // this.chars = "ABC".split('');

    this.widths = {};
    this.values = [];

    this.state = {
      widths: {},
      values: [],
      average: 0
    };
  }

  addWidth = (letter, width) => {
    if (letter === '. .') {
      const dotWidth = this.widths['.'] * 2;
      width -= dotWidth;
    }

    this.widths[letter] = width;
    this.values.push(width);
    const average = this.averageValue(this.values);
    this.widths['average'] = average;

    this.setState({
      widths:   this.widths,
      values:   this.values,
      average:  average
    });
  }

  averageValue(values) {
    values.sort((a, b) => { return a - b; });
    values = values.slice(Math.max(Math.round(values.length / 4), 0));

    const average = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

    if (!Number.isNaN(average)) {
      return average;
    }

    return 0;
  }

  render() {
    return (
      <div style={{marginTop: '100px'}}>
        {this.chars.map((c, index) =>
          <Letter
            addWidth={this.addWidth}
            key={`${c}-${index}`}
            letter={c}
          />
        )}
        <Letter
          addWidth={this.addWidth}
          key={'. .'}
          letter={'. .'}
        />
        <div style={{width: '100%'}} />
        {JSON.stringify(this.state.widths, null, 2)}
      </div>
    );
  }
}