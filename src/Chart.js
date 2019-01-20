import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Spring, animated } from 'react-spring';
import osme from 'osme';

import { getShortestContour } from './shortestPath';
import { mercator } from './projections/mercator';
import { gall } from './projections/gall';
import { geo } from './projections/geo';
import {albers} from './projections/albers';

const projections = {
  mercator,
  gall,
  geo,
  albers,
};

const toPath = (path, projector, projectionOptions) => `M${path
  .map(x => projector.projection(x, projectionOptions))
  .map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10])
  .map(([x, y]) => `${x},${y}`)
  .join(' L')
}`;
const toPaths = (paths, projection, projectionOptions) => getShortestContour(paths).map(x => toPath(x, projection, projectionOptions)).join(' z ');

export const extractCodes = geometry => Object.keys(geometry.regions).reduce((acc, region) => [...acc, geometry.regions[region].property.iso3166], []);

const convert = (features, projection, projectionOptions) => (
  features
    .map((feature, index) => ({
      index,
      geometry: toPaths(feature.geometry.coordinates, projection, projectionOptions),
      properties: feature.properties,
      code: feature.properties.properties.iso3166,
    }))
);

const defaultSorter = ({ data = {}, hovered }) => (a, b) => {
  if (hovered === a.code) {
    return 1;
  }
  if (hovered === b.code) {
    return -1;
  }
  if ((data[a.code] && data[b.code]) || (!data[a.code] && !data[b.code])) {
    return a.index - b.index;
  }
  if (data[a.code]) {
    return 1;
  }
  return -1;
};

class WorldChart extends Component {
  static propTypes = {
    data: PropTypes.objectOf(PropTypes.number).isRequired,
    className: PropTypes.string,
    styler: PropTypes.func.isRequired,
    sorter: PropTypes.func,
    native: PropTypes.bool,
    hovered: PropTypes.string,
    geometry: PropTypes.any.isRequired,

    projection: PropTypes.oneOf(['mercator', 'gall', 'albers']),
    projectionOptions: PropTypes.any,
    viewBox: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    native: false,
    hovered: null,
    projection: 'mercator',
  };

  rawVector = convert(osme.parseData(this.props.geometry).features, projections[this.props.projection], this.props.projectionOptions);
  vector = null;

  renderData() {
    const { vector } = this;
    const { styler, data = {}, native } = this.props;

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
    const { className, sorter, projection, viewBox } = this.props;

    this.vector = this.rawVector.slice().sort((sorter || defaultSorter)(this.props));
    return (
      <svg viewBox={viewBox || projections[projection].viewBox} className={className}>
        {this.renderData()}
      </svg>
    );
  }
}

export default WorldChart;
