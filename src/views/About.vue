<template>
  <div class='about'>
    <h1>ok</h1>
    <svg id='visualisation' width='1000' height='500' class='chart'></svg>
  </div>
</template>
<script>
import * as d3 from 'd3';

export default {
  data() {
    return {
      lineDataActual: [
        { x: 0, y: 200 },
        { x: 10, y: 50 },
        { x: 20, y: 180 },
        { x: 30, y: 60 },
        { x: 40, y: 120 },
        { x: 50, y: 30 },
      ],
      svg: d3.select('#visualisation'),
      width: 1000,
      height: 500,
      margins: {
        top: 80,
        right: 50,
        bottom: 80,
        left: 80,
      },
      xMin: 0,
      xMax: 0,
      yMin: 0,
      yMax: 0,
      xRange: 0,
      yRange: 0,
      xAxis: 0,
      yAxis: 0,
      lineFunc: 0,
      lineDataIdeal: [],
    };
  },
  methods: {
    init() {
      this.xMin = d3.min(this.lineDataActual, d => d.x);
      this.xMin = d3.max(this.lineDataActual, d => d.x);
      this.yMin = d3.min(this.lineDataActual, d => d.y);
      this.yMin = d3.max(this.lineDataActual, d => d.y);
      this.xRange = d3
        .scaleLinear()
        .range([this.margins.left, this.width - this.margins.right])
        .domain([this.xMin, this.xMax]);

      this.yRange = d3
        .scaleLinear()
        .range([this.height - this.margins.top, this.margins.bottom])
        .domain([this.yMin, this.yMax]);
      this.xAxis = d3.svg
        .axisBottom()
        .scale(this.xRange)
        .tickSubdivide(true);
      this.yAxis = d3.svg
        .axis()
        .scale(this.yRange)
        .orient('left')
        .tickSubdivide(true);
      this.fetchData();
      this.lineFunc = d3.svg
        .line()
        .x(d => this.xRange(d.x))
        .y(d => this.yRange(d.y))
        .interpolate('basis');
      this.lineDataIdeal = [
        { x: this.xMin, y: this.yMax },
        { x: this.xMax, y: this.yMin },
      ];

      this.svg
        .append('svg:path')
        .attr('d', this.lineFunc(this.lineDataIdeal))
        .attr('class', 'ideal');
      this.svg
        .append('svg:path')
        .attr('d', this.lineFunc(this.lineDataActual))
        .attr('class', 'actual');
      this.svg
        .append('text')
        .attr('class', 'x label')
        .attr('text-anchor', 'end')
        .attr('x', this.width)
        .attr('y', this.height - 6)
        .text('Days');

      this.svg
        .append('text')
        .attr('class', 'y label')
        .attr('text-anchor', 'end')
        .attr('y', 6)
        .attr('dy', '.75em')
        .attr('transform', 'rotate(-90)')
        .text('Hours remaining');
    },
    async fetchData() {
      this.svg
        .append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0, ${this.height - this.margins.top})`)
        .call(
          this.make_x_axis()
            .tickSize(-this.height + (this.margins.top + this.margins.bottom), 0, 0)
            .tickFormat(''),
        );

      this.svg
        .append('g')
        .attr('class', 'grid')
        .attr('transform', `translate( ${this.margins.left},0)`)
        .call(
          this.make_y_axis()
            .tickSize(-this.width + (this.margins.right + this.margins.left), 0, 0)
            .tickFormat(''),
        );

      this.svg
        .append('svg:g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, (${this.height} - ${this.margins.bottom} ))`)
        .call(this.xAxis);

      this.svg
        .append('svg:g')
        .attr('class', 'y axis')
        .attr('transform', `translate( ${this.margins.left} , 0)`)
        .call(this.yAxis);
    },
    make_x_axis() {
      return d3.svg
        .axisBottom(this.xRange)
        .orient('bottom')
        .tickSubdivide(true);
    },
    make_y_axis() {
      return d3.svg
        .axis()
        .scale(this.yRange)
        .orient('left')
        .tickSubdivide(true);
    },
  },
};
</script>
<style lang='css'>
.chart {
  font-family: 'Arial';
  font-size: 13px;
  color: #000;
}
.chart > .axis path,
.chart > .axis line {
  fill: none;
  stroke: #eee;
  stroke-width: 2;
  shape-rendering: crispEdges;
}
.chart > .axis .tick line {
  fill: none;
  stroke: #999;
  stroke-width: 2;
}
.chart > path.ideal {
  stroke: #eee;
  stroke-width: 5;
  stroke-linecap: round;
}
.chart > path.actual {
  stroke: #91e500;
  stroke-width: 2;
  stroke-linecap: round;
  fill: none;
  /*fill: rgba(0,0,0,0.1);*/
}
.chart > .grid .tick {
  stroke: #eee;
  opacity: 0.5;
}

/* For aesthetics only ------------------------------------------------------------------*/
body {
  margin: 0;
  font-family: Segoe, 'Segoe UI', 'DejaVu Sans', 'Trebuchet MS', Verdana, sans-serif;
}
h1 {
  font: 200 1.2em 'Segoe UI Light', 'DejaVu Sans', 'Trebuchet MS', Verdana, sans-serif;
  font-weight: 200;
  color: #fff;
  background: #039be4;
  padding: 20px;
  margin: 0;
  border-bottom: 10px solid #ccc;
  strong {
    font-family: 'Segoe UI Black';
    font-weight: normal;
  }
}
.explanation {
  padding: 20px;

  p {
    max-width: 600px;
    color: #fff;
    font-size: 0.8rem;
  }
}
</style>
