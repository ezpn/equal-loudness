import { LoudnessChart } from "./loudnessChart.js";
import { JsonConverter } from "./jsonConverter.js";
import { Frequencies } from "./frequencies.js";
import { TonePlayer } from "./tonePlayer.js";
import { Modal } from "./modal.js";
import { HowToUse } from "./howToUse.js";

export class App {
  constructor() {
    this.jsonConverter = new JsonConverter(Frequencies.freqTable);
    this.tonePlayer = new TonePlayer();
    this.loudnessChart = new LoudnessChart(this.tonePlayer.frequencies.getEqualizerContour());
    this.tonePlayer.setOnDbChange(this.loudnessChart.update.bind(this.loudnessChart));
    this.modal = new Modal(
      (json) => {
        const perceivedArray = this.jsonConverter.importFromJson(json);
        this.loudnessChart.update(perceivedArray);
        this.tonePlayer.frequencies.importEqualizerContour(perceivedArray);
      }
    );
    this.howToUse = new HowToUse();
    this.setupKeyListeners();
  }

  actionPlayComparator() {
    this.tonePlayer.playComparator();
  }

  actionPlayComparand() {
    this.tonePlayer.playComparand();
  }

  actionMute() {
    this.tonePlayer.mute();
  }

  actionUpdateDbGain(dbGain) {
    this.tonePlayer.frequencies.getComparand().setDbGain(dbGain);
  }

  actionFrequency(freq) {
    this.tonePlayer.setFrequency(freq);
  }

  actionPrev(){
    this.tonePlayer.prevFrequency();
  }

  actionNext(){
    this.tonePlayer.nextFrequency();
  }

  actionDbGainIncrease(){
    this.tonePlayer.dbGainIncrease();
  }

  actionDbGainDecrease(){
    this.tonePlayer.dbGainDecrease();
  }

  actionExport(event) {
    event.preventDefault();
    
    const exportedJson = this.jsonConverter.exportToJson(this.tonePlayer.frequencies.getEqualizerContour());
    const exportData = `data:application/octet-stream,${encodeURIComponent(exportedJson)}`;
    
    const downloadElem = document.createElement('a');
    downloadElem.setAttribute('href', exportData);
    downloadElem.setAttribute('download', 'equalizerContour.json');
    document.body.appendChild(downloadElem);
    downloadElem.click();
    document.body.removeChild(downloadElem);
  }

  actionImport(event) {
    event.preventDefault();

    this.modal.show();
  }

  setupKeyListeners() {
    addEventListener('keyup', (event) => {
      event.preventDefault();
      switch (event.key) {
        case 'a':
          this.actionPlayComparator();
          break;
        case 'd':
          this.actionPlayComparand();
          break;
        case 's':
          if (!this.tonePlayer.isMuteActive()) {
            this.actionMute();
          } else {
            if (this.tonePlayer.isPreviousStateComparator()) {
              this.actionPlayComparator();
            } else {
              this.actionPlayComparand();
            }
          }
          break;
      }
    });
  
    addEventListener('keydown', (event) => {
      event.preventDefault();
      switch (event.key) {
        case 'ArrowLeft':
          this.actionDbGainDecrease();
          break;
        case 'ArrowRight':
          this.actionDbGainIncrease();
          break;
        case 'q':
          this.actionPrev();
          break;
        case 'e':
          this.actionNext();
          break;
      }
    });
  }
}