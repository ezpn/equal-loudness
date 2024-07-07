export class Tone {
  static dbBaseline = -35;
  static initDbGainVal = 0;
  static dbGainStep = 0.5
  static minDbGain = -5;
  static maxDbGain = 35;

  constructor(frequency) {
    this.frequency = frequency;
    this.dbGain = Tone.initDbGainVal;
    this.onDbGainChange = () => {};
  }

  setOnDbGainChange(onDbGainChange) {
    this.onDbGainChange = onDbGainChange;
  }
  
  increase() {
    const nextValue = this.dbGain + Tone.dbGainStep;
    if (nextValue > Tone.maxDbGain) {
      console.error('Maximum db gain reached');
      return;
    }

    this.updateDbGain(nextValue);
  }

  decrease() {    
    const nextValue = this.dbGain - Tone.dbGainStep;
    if (nextValue < Tone.minDbGain) {
      console.error('Minimum db gain reached');
      return;
    }
  
    this.updateDbGain(nextValue);
  }

  getDbGain() {
    return this.dbGain;
  }

  setDbGain(dbGain) {
    if (typeof dbGain !== 'float') {
      dbGain = Number.parseFloat(dbGain);
    }

    if (dbGain > Tone.maxDbGain) {
      console.error('Maximum db gain reached');
      return;
    }

    if (dbGain < Tone.minDbGain) {
      console.error('Minimum db gain reached');
      return;
    }

    this.updateDbGain(dbGain);
  }

  setComparandIdx(comparandIdx) {
    this.comparandIdx = comparandIdx;
  }

  updateDbGain(dbGain) {
    console.log('Updating dbGain', dbGain)
    document.querySelector('#dbGain').value = -dbGain;
    document.querySelector('.sound-level label > span').textContent = `(${-dbGain} dB)`;
    this.dbGain = dbGain;
    console.log({volume: this.getVolume()});
    // this.onDbGainChange(dbGain);
  }

  setFrequency(frequency) {
    this.frequency = frequency;
  }

  getFrequency() {
    return this.frequency;
  }

  getVolume() {
    const volume = Tone.dbBaseline + this.dbGain;
    console.log({ volume: Tone.dbBaseline + this.dbGain, dbGain: this.dbGain })
    return volume;
  }
}