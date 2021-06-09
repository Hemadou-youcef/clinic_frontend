<script>
import { Line, mixins } from 'vue-chartjs'
// import Chart from 'chart.js';
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

    // new Chart(document.getElementById('line-chart'), {
    //       type: "line",
    //       data: this.chartData,
    //       options: {
    //         responsive: true,
    //         lineTension: 1,
    //         scales: {
    //           x: {
    //             title: {
    //               color: 'red',
    //               display: true,
    //               text: 'Month'
    //             }
    //           }
    //         }
    //       }
    //     });

    this.renderChart(this.chartData, this.option);
  }
};
</script>
