<template>
  <div>
    <h1>Chart</h1>
    <h2>{{msg}}</h2>
  </div>
</template>
<script>
import * as d3 from 'd3';

export default {
  name: 'PackChart',
  props: ['data'],
  data() {
    return {
      msg: 'ok',
      width: 200,
      height: 200,
      ok: 12,
    };
  },
  created() {
    this.colorScale = d3.scaleOrdinal().range(['#dddd1d', '#2ddddd', '#dddd77', '#ddddff', '#dd44dd']);
  },
};
</script>
