import React from 'react';
import {storiesOf} from '@storybook/react';
import Chart, {codes} from '../src';
import './story.css';

const randomize = () => codes.reduce((acc, code) => {
  acc[code] = Math.random();
  return acc
}, {});

class Interactive extends React.Component {
  state = {
    codes: randomize(),
    selected: {},
    hovered: null,
  };

  hidden = event => {
    const code = event.target.dataset.code;
    this.setState(state => ({
      selected: {
        ...state.selected,
        [code]: !state.selected[code],
      }
    }))
  };

  render() {
    return (
      <div>
        <button onClick={() => this.setState({codes: randomize()})}>random</button>

        <Chart
          className="test-story"
          hovered={this.state.hovered}
          projection="mercator"
          data={this.state.codes}
          styler={ () => ({ style:{fill:'#EEE', stroke:'#444', strokeWidth:0.3}})}
         />

        <Chart
          className="test-story"
          hovered={this.state.hovered}
          projection="gall"
          styler={(x, code) => ({
            className: 'path',
            style: {
              fill: this.state.hovered === code
                ? x.interpolate(t => `rgba(${Math.round(t * 211)}, 100, 200, 1)`)
                : x.interpolate(t => `rgba(${Math.round(t * 100)}, 100, ${Math.round(t * 200)}, 1)`),
              opacity: 1,

              stroke: x.interpolate(t =>
                this.state.hovered === code
                  ? '#FF0'
                  : (t < 0.5 ? '#F00' : '#00F')
              ),
              strokeWidth: x.interpolate(t =>
                this.state.hovered === code
                  ? 2
                  : (t < 0.5 ? 0.5 : 0.25)
              )
            },

            onMouseEnter: () => this.setState({hovered: code}),
            onMouseLeave: () => this.setState({hovered: null}),
            onClick: this.hidden
          })
          }

          data={Object.keys(this.state.codes).reduce((acc, key) => {
            const value = this.state.codes[key];
            acc[key] = value < 0.5 ? 0 : value;
            return acc;
          }, {})}
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

  .add('interactive', () => <Interactive/>)
;
