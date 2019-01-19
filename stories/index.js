import React from 'react';
import {storiesOf} from '@storybook/react';
import Chart, {extractCodes} from '../src';
import world from '../data/world';
import russia from '../data/russia';
import './story.css';

const randomize = () => extractCodes(world).reduce((acc, code) => {
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
          geometry={world}
          data={this.state.codes}
          styler={() => ({style: {fill: '#EEE', stroke: '#444', strokeWidth: 0.3}})}
        />

        <Chart
          className="test-story"
          hovered={this.state.hovered}
          geometry={world}
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
    geometry={world}
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
  .add('russia', () => <Chart
    className="test"
    geometry={russia}
    styler={(x, code, feature) => ({
      className: 'path',
    })}
  />)
  .add('russia - albers', () => <Chart
    className="test"
    geometry={russia}
    projection="albers"
    projectionOptions={{
      latLng: [50, -40],
      phi: [50, 50]
    }}
    viewBox="50 0 600 500"
    styler={(x, code, feature) => ({
      className: 'path',
      style: {
        opacity: 0.5
      }
    })}
  />)
  .add('world - albers', () => <Chart
    className="test"
    geometry={world}
    projection="albers"
    projectionOptions={{
      latLng: [0, -40],
      phi: [50, 50]
    }}
    viewbox="-100 -100 2000 2000"
    styler={(x, code, feature) => ({
      className: 'path',
      style: {
        opacity: 0.5
      }
    })}
  />)

  .add('interactive', () => <Interactive/>)
;
