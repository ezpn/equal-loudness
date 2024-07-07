import { DbGainView } from "./dbGainView.js";
import { Frequencies } from "./frequencies.js";
import { Oscillator } from "./oscillator.js";

export class TonePlayer {
  static playingStates = ['mute', 'comparator', 'comparand'];
  
  constructor(onDbChange = () => {}) {
    this.onDbChange = onDbChange;
    this.oscillator = new Oscillator();
    this.playingState = 0;
    this.previousPlayingState = null;
    this.frequencies = new Frequencies();
    this.render();
    this.frequencies.setComparandIdxCallback(this.update.bind(this));
    this.dbGainView = new DbGainView({ 
      tone: this.frequencies.getComparand(),
    });
    this.dbGainView.setDbChangeCallback(this.update.bind(this));
  }

  setOnDbChange(onDbChange) {
    this.onDbChange = onDbChange;
  }

  isComparandActive() {
    return this.playingState === TonePlayer.playingStates.indexOf('comparand');
  }

  isComparatorActive() {
    return this.playingState === TonePlayer.playingStates.indexOf('comparator');
  }

  isMuteActive() {
    return this.playingState === TonePlayer.playingStates.indexOf('mute');
  }

  isPreviousStateComparator() {
    return this.previousPlayingState === this.playingState.indexOf('comparator');
  }

  playComparator() {
    this.setPlayingState('comparator');
    this.oscillator.setFrequency(this.frequencies.getComparator().getFrequency())
      .setVolume(this.frequencies.getComparator().getVolume())
      .updateSettings()
      .start();
    this.renderButtonState();
    this.dbGainView.deactivate();
  }

  playComparand() {
    console.log('comparand')
    this.setPlayingState('comparand');
    this.oscillator.setFrequency(this.frequencies.getComparand().getFrequency())
      .setVolume(this.frequencies.getComparand().getVolume())
      .updateSettings()
      .start();
    this.renderButtonState();
    this.dbGainView.activate();
  }

  mute() {
    this.setPlayingState('mute');
    this.oscillator.stop();
    this.renderButtonState();
    this.dbGainView.deactivate();
  }

  setPlayingState(playingStateName) {
    const newPlayingState = TonePlayer.playingStates.indexOf(playingStateName);

    if (newPlayingState === -1) {
      console.error('Playing state does not exist');
      return;
    }

    this.previousPlayingState = this.playingState;
    this.playingState = newPlayingState;
  }

  dbGainIncrease() {
    if (!this.isComparandActive()) {
      console.error('Cannot change gain when comparand is inactive');
      return;
    }
    this.frequencies.getComparand().increase();
    this.update();
  }

  dbGainDecrease() {
    if (!this.isComparandActive()) {
      console.error('Cannot change gain when comparand is inactive');
      return;
    }
    this.frequencies.getComparand().decrease();
    this.update();
  }

  setFrequency(freq) {
    console.log('Setting freq', freq)
    this.frequencies.getComparand().setFrequency(freq);
    this.update();
  }

  nextFrequency() {
    this.frequencies.setNextFreq();
    this.update();
  }

  prevFrequency() {
    this.frequencies.setPrevFreq();
    this.update();
  }

  update() {
    console.log('update tonePlayer', this)
    this.renderComparand();
    this.frequencies.refresh();
    this.dbGainView.setTone(this.frequencies.comparand);
    if (this.isComparandActive()) {
      this.oscillator.setFrequency(this.frequencies.getComparand().getFrequency())
        .setVolume(this.frequencies.getComparand().getVolume())
        .updateSettings();
    }
    this.onDbChange(this.frequencies.getEqualizerContour());
  }

  render() {
    this.renderComparator();
    this.renderComparand();
    this.renderMute();
    this.renderButtonState();
  }

  renderComparator() {
    document.querySelector('#comparator .header').textContent = `${this.frequencies.getComparator().getFrequency()} ${Frequencies.unit}`;
    document.querySelector('#comparator .sound-control').addEventListener('click', () => this.playComparator());
  }

  renderComparand() {
    document.querySelector('#comparand .header').textContent = `${this.frequencies.getComparand().getFrequency()} ${Frequencies.unit}`;
    document.querySelector('#comparand .sound-control').addEventListener('click', () => this.playComparand());
  }

  renderMute() {
    document.querySelector('#mute .sound-control').addEventListener('click', () => this.mute())
  }

  renderButtonState() {
    document.querySelectorAll('button.sound-control').forEach((button) => {
      if (button.getAttribute('data-value') === TonePlayer.playingStates[this.playingState]) {
        button.classList.add('button-primary');
      } else {
        button.classList.remove('button-primary');
      }
    });
  }
}