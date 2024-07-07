import { Frequencies } from "./frequencies.js";
import { Tone } from "./tone.js";

export class LoudnessChart {
  constructor(perceivedArray) {
    console.log({perceivedArray})
    this.chart = this.draw(perceivedArray);
  }

  draw(perceivedArray) {
    const ctx = document.querySelector('#chart');
    
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Frequencies.freqTable.map((e) => e.toString()),
        datasets: [
          {
            label: 'Your perceived loudness',
            data: perceivedArray,
            borderColor: '#33C3F0',
            fill: false,
            cubicInterpolationMode: 'monotone',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Equal loudness chart'
          },
        },
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Frequency (Hz)'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Perceived loudness (dB)'
            },
            suggestedMin: -Tone.maxDbGain,
            suggestedMax: -Tone.minDbGain
          }
        }
      }
    });

    console.log({chart})
  
    return chart;
  }
  
  update(perceivedArray) {
    console.log({updatedPerceivedArray: perceivedArray, chart: this.chart})
    if (this.chart != null) {
      this.chart.data.datasets[0].data = perceivedArray;
      this.chart.update();
    }
  };
}
