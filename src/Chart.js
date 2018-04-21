import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Spring, animated } from 'react-spring';
import osme from 'osme';

import { getShortestContour } from './shortestPath';
import { mercator } from './mercator';

import world from './data/world.json';

const toPath = path => `M${path
  .map(mercator)
  .map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10])
  .map(([x, y]) => `${x},${y}`)
  .join(' L')
}`;
const toPaths = paths => getShortestContour(paths).map(toPath).join(' z ');

export const codes = Object.keys(world.regions).reduce((acc, region) => [...acc, world.regions[region].property.iso3166], []);

const convert = features => (
  features
    .map(feature => ({
      geometry: toPaths(feature.geometry.coordinates),
      properties: feature.properties,
      code: feature.properties.properties.iso3166,
    }))
);

let vector = 0;

class WorldChart extends Component {
  static propTypes = {
    data: PropTypes.objectOf(PropTypes.number),
    className: PropTypes.string,
    styler: PropTypes.func.isRequired,
    native: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    native: false,
  };

  state = {
    vector: vector || (vector = convert(osme.parseData(world).features)),
  };

  renderData() {
    const { vector } = this.state;
    const { styler, data, native } = this.props;

    if (native) {
      return (vector && vector
        .map(feature => (
          <animated.path
            key={feature.code}
            d={feature.geometry}
            data-code={feature.code}
            {...styler(data[feature.code], feature.code, feature.properties)}
          />
        ))
      );
    }

    return (vector && vector
      .map(feature => (
        <Spring key={feature.code} native from={{ x: 0 }} to={{ x: data[feature.code] || 0 }}>
          {styles => (<animated.path
            d={feature.geometry}
            data-code={feature.code}
            {...styler(styles.x, feature.code, feature.properties)}
          />)}
        </Spring>
      ))
    );
  }

  render() {
    const { className } = this.props;
    return (
      <svg viewBox="0 0 256 256" className={className}>
        {this.renderData()}
      </svg>
    );
  }
}

export default WorldChart;
