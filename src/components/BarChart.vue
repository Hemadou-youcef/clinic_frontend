<script>
import {Bar, mixins} from "vue-chartjs";
const { reactiveProp } = mixins

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props:[
    'chartData','option'
  ],
  mounted() {
    this.renderChart(this.chartData, this.option);
  }
};
</script>
