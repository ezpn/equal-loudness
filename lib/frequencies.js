import { Tone } from "./tone.js";

export class Frequencies {
  static unit = 'Hz';
  static freqTable = [
    20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500
  ];

  constructor(comparandFreq = 40, comparatorFreq = 1000) {
    this.tones = Frequencies.freqTable.map((freq) => new Tone(freq));
    this.comparandIdxCallback = () => {};
    this.setComparatorIdx(Frequencies.freqTable.indexOf(comparatorFreq));
    this.setComparandIdx(Frequencies.freqTable.indexOf(comparandFreq));
    this.maxComparandIdx = Frequencies.freqTable.length - 1;
    this.minComparandIdx = 0;
    this.render();
  }

  getComparandIdx() {
    return this.comparandIdx;
  }

  setComparandIdx(comparandIdx) {
    this.comparandIdx = comparandIdx;
    this.comparand = this.tones[comparandIdx];
    this.comparandIdxCallback(this.comparandIdx);
    this.refresh();
  }

  setComparatorIdx(comparatorIdx) {
    this.comparatorIdx = comparatorIdx;
    this.comparator = this.tones[comparatorIdx];
  }

  getComparator() {
    return this.comparator;
  }

  getComparand() {
    return this.comparand;
  }

  getEqualizerContour() {
    return this.tones.map((tone) => -tone.getDbGain());
  }

  importEqualizerContour(equalizerContour) {
    console.log({ equalizerContour })
    this.tones.forEach((tone, idx) => tone.setDbGain(-equalizerContour[idx]));
    this.comparandIdxCallback(this.comparandIdx);
  }

  setComparandIdxCallback(callback) {
    this.comparandIdxCallback = callback;
  }

  setNextFreq() {
    if (this.comparandIdx >= this.maxComparandIdx) {
      console.error('Cannot move comparand outside maximum array range');
      return Frequencies.freqTable[this.comparandIdx];
    }
    
    const nextFreq = Frequencies.freqTable[this.comparandIdx + 1];

    this.moveComparandToFreq(nextFreq);
  }

  setPrevFreq() {
    if (this.comparandIdx <= this.minComparandIdx) {
      console.error('Cannot move comparand outside minimum array range');
      return Frequencies.freqTable[this.comparandIdx];
    }
    
    const prevFreq = Frequencies.freqTable[this.comparandIdx - 1];
    this.moveComparandToFreq(prevFreq);
  }

  getComparandIdxByFreq(freq) {
    return Frequencies.freqTable.indexOf(freq)
  }

  moveComparandToFreq(freq) {
    const newComparandIdx = this.getComparandIdxByFreq(freq)
    if (newComparandIdx !== -1) {
      this.setComparandIdx(newComparandIdx);
    } else {
      console.error('Cannot move comparand to non-existent frequency');
    }
  }

  render() {
    const frequenciesDiv = document.querySelector('#frequencies');

    Frequencies.freqTable.forEach((freq) => {
      frequenciesDiv.appendChild(this.createFrequency(freq));  
    });
  }

  createFrequency(freq) {
    const button = document.createElement('button');
    const content = document.createTextNode(freq);
    button.classList.add('button');
    button.addEventListener('click', () => this.moveComparandToFreq(freq));
    if (Frequencies.freqTable[this.comparandIdx] === freq) {
      button.classList.add('button-primary');
    }
    if (freq === this.comparator.getFrequency()) {
      button.classList.add('button-primary');
      button.disabled = true;
    }
    button.appendChild(content);
    
    return button;
  }

  refresh() {
    document.querySelectorAll('#frequencies button.button-primary:not(.button-disabled)').forEach((button) => {
      button.classList.remove('button-primary');
    });
    document.querySelectorAll('#frequencies button').forEach((button) => {
      if (Number.parseFloat(button.textContent, 10) === this.comparand.getFrequency()) {
        button.classList.add('button-primary');
      }

      if (Number.parseFloat(button.textContent, 10) === this.comparator.getFrequency()) {
        button.classList.add('button-primary');
        button.disabled = true;
      }
    });
  }
}