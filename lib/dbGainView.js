import { Tone } from "./tone.js";

export class DbGainView {
  static unit = 'dB';

  constructor({ tone, onDbChange = () => {}, isActive = false }) {
    this.tone = tone;
    this.isActive = isActive;
    this.onDbChange = onDbChange;
    this.render();
  }

  setTone(tone) {
    this.tone = tone;
    this.refresh(false);
  }
  
  setDbChangeCallback(onDbChange) {
    this.onDbChange = onDbChange;
  }

  setDbGain(dbGain) {
    this.tone.setDbGain(dbGain);
    this.refresh();
  }

  activate() {
    this.isActive = true;
    this.renderActiveState();
  }

  deactivate() {
    this.isActive = false;
    this.renderActiveState();
  }

  refresh(isCallingOnDbChange = true) {
    console.log('refreshing dbGainView')
    this.updateValue();
    this.renderLabel();
    this.renderActiveState();
    
    if (isCallingOnDbChange) {
      this.onDbChange();
    }
  }

  render() {
    const self = this;
    const dbGainNode = document.querySelector('#dbGain');
    dbGainNode.addEventListener('change', function() {
      const dbGain = Number.parseFloat(this.value);
      self.tone.setDbGain(dbGain);
      self.refresh();
    })
    dbGainNode.addEventListener('input', function() {
      const dbGain = Number.parseFloat(this.value);
      self.tone.setDbGain(dbGain);
      self.refresh();
    })
    dbGainNode.setAttribute('min', Tone.minDbGain);
    dbGainNode.setAttribute('max', Tone.maxDbGain);
    dbGainNode.setAttribute('step', Tone.dbGainStep);

    this.renderActiveState();
    this.renderLabel();
    this.updateValue();
  }

  renderActiveState() {
    if (this.isActive) {
      document.querySelector('#dbGain').removeAttribute('disabled');
    } else {
      document.querySelector('#dbGain').setAttribute('disabled', true);
    }
  }

  renderLabel() {
    document.querySelector('label[for=dbGain] span').textContent = `(${this.tone.getDbGain()} ${DbGainView.unit})`;
  }
  
  updateValue() {
    document.querySelector('#dbGain').value = this.tone.getDbGain();
  }
}