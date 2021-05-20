<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  name:'areachart',
  extends: Line,
  mixins: [reactiveProp],

  data() {
    return {
      gradient: null,
      gradient2: null,
    };
  },
  props:[
      'chartData','option'
  ],
  mounted() {

    this.renderChart(this.chartData, this.option);
  }
};
</script>
