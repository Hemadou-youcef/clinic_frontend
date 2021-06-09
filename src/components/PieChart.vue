<script>
import { Pie, mixins } from "vue-chartjs";
const { reactiveProp } = mixins

export default {
  extends: Pie,
  mixins: [reactiveProp],
  props:[
    'chartData','option'
  ],
  mounted() {
    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false
    });
  }
};
</script>