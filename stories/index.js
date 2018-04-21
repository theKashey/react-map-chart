import React from 'react';
import {storiesOf} from '@storybook/react';
import Chart, {codes} from '../src';
import './story.css';

const randomize = () => codes.reduce( (acc, code) => {acc[code]=Math.random(); return acc}, {});

class Interactive extends React.Component {
  state = {
    codes: randomize(),
    hidden: {}
  };

  hidden = event => {
    const code = event.target.dataset.code;
    this.setState(state => ({
      hidden: {
        ...state.hidden,
        [code]: !state.hidden[code],
      }
    }))
  };

  render(){
    return (
      <div>
        <button onClick={() => this.setState({codes: randomize()})}>random</button>

        <Chart
          className="test-story"
          styler={(x, code) => ({
            className: 'path',
            style: {
              fill: x.interpolate(t => `rgba(100, 100, 200, ${t})`),
              opacity: this.state.hidden[code] ? 1: 0.5,
              stroke: '#000',
              strokeWidth:0.5
            },
            onClick:this.hidden
          })
          }

          data={this.state.codes}
        />)
      </div>

    )
  }
}

storiesOf('Map Chart', module)
  .add('smoke', () => <Chart
    className="test"
    styler={(x, code, feature) => ({
      className: 'path',
      style: {
        fill: feature.code === 'RU' ? '#F00' : '#44F',
        opacity: x
      }
    })
    }

    data={{
      RU: 1,
      UA: 1,
      US: 1,
    }}

  />)

  .add('interactive', () => <Interactive />)
;
