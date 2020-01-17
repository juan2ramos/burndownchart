<template>
  <div class='small'>
    <line-chart :chart-data='datacollection'></line-chart>
  </div>
</template>

<script>
import { add, format } from 'date-fns';
import LineChart from '@/views/LineChart';
import { getSprint } from '@/services/airtable';
import { getTask } from '@/services/trello';

export default {
  components: { LineChart },
  data() {
    return {
      datacollection: null,
    };
  },
  mounted() {
    this.fillData();
  },
  methods: {
    async fillData() {
      const sprint = await getSprint();
      const sd = sprint['Start date'].split('-');
      const startDay = new Date(new Date(sd[0], sd[1] - 1, sd[2]));
      const dd = sprint['Due Date'].split('-');
      const endDay = new Date(new Date(dd[0], dd[1] - 1, dd[2]));
      const oneDay = 24 * 60 * 60 * 1000;
      const totalDays = Math.round(Math.abs((startDay - endDay) / oneDay));
      const totalDaysToday = Math.round(Math.abs((startDay - new Date()) / oneDay));
      const labels = [];
      const pointsTotal = sprint.Points;
      const ideal = [];
      const pointDay = pointsTotal / totalDays;
      const tasks = await getTask(this.$route.query.url || 'https://trello.com/b/aCyRc11q/poetri-dev');
      const burndown = [];
      let acum = pointsTotal;
      for (let i = 0; i <= totalDays; i += 1) {
        const dayCurrent = add(startDay, { days: i });
        labels.push(format(dayCurrent, 'dd/MM/yyyy'));
      }
      for (let i = 0; i <= totalDaysToday - 1; i += 1) {
        const dayCurrent = format(add(startDay, { days: i }), 'dd/MM/yyyy');
        const r = tasks.find(task => task.date === dayCurrent);
        if (r !== undefined) {
          acum -= r.points;
        }
        burndown.push(acum);
      }

      for (let j = pointsTotal; j >= 0; j -= pointDay) {
        ideal.push(j);
      }
      ideal.push(0);
      this.datacollection = {
        labels,
        datasets: [
          {
            label: 'Ideal',
            fill: false,
            data: ideal,
          },
          {
            label: 'Current',
            borderColor: 'green',
            fill: false,
            data: burndown,
          },
        ],
      };
    },
  },
};
</script>

<style>
.small {
  max-width: 600px;
  margin: 150px auto;
}
</style>
