# react-map-chart

[![Greenkeeper badge](https://badges.greenkeeper.io/theKashey/react-map-chart.svg)](https://greenkeeper.io/)

----

Simple component to display SVG based World Map. Uses [react-spring](https://github.com/drcmda/react-spring) to make stuff nicer.

World geometry data was extracted from [osme-geometry](https://github.com/esosedi/osme-geometry), and 
has origins in openstreetmap. 

```js
 <Chart
    className="outerClassName"
    
    // styler make things looks as YOU want
    styler={
      (x, isoCode, feature) => ({
          className: 'paths-classname',
          style: {
            fill: feature.code === 'CN' ? '#F00' : '#44F',
            opacity: x
          },
          onClick: () => onClick(code),
          // "code" is available in dataset
          onMouseOver: event => over(event.target.dataset.code)
      })
    }

    // provide data for interpolation
    data={{
      CN: 1,
      US: 1,
      AU: 0.5
    }}

  />)
```

# Licence
MIT