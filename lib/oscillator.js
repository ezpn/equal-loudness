export class Oscillator {
  static minHumanHearingRange = 20;
  static maxHumanHearingRange = 20000;
  static defaultFrequency = 1000;
  static defaultVolume = -35

  constructor(frequency = Oscillator.defaultFrequency, volume = Oscillator.defaultVolume) {
    const limitedFrequency = this.limitFrequency(frequency);
    const limitedVolume = this.limitVolume(volume);
    
    this.settings = {
      type: 'sine',
      frequency: limitedFrequency,
      volume: limitedVolume,
    }

    this.osc = new Tone.Oscillator(this.settings).toDestination();
    console.log('Initialized oscillator');
  }

  stop() {
    this.osc.stop();

    return this;
  };

  start() {
    this.osc.start();

    return this;
  };

  setFrequency(frequency = Oscillator.defaultFrequency) {
    const limitedFrequency = this.limitFrequency(frequency);
    this.settings.frequency = limitedFrequency;

    return this;
  }

  setVolume(volume = Oscillator.defaultVolume) {
    const limitedVolume = this.limitVolume(volume);
    this.settings.volume = limitedVolume;

    return this;
  }

  updateSettings() {
    this.osc.set(this.settings);
    
    return this;
  }

  limitFrequency(frequency) {
    if (frequency > this.maxHumanHearingRange) {
      console.error('Frequency is above human hearing range');
      frequency = this.maxHumanHearingRange;
    }
  
    if (frequency < this.minHumanHearingRange) {
      console.error('Frequency is below human hearing range');
      frequency = this.minHumanHearingRange;
    }
  
    return frequency;
  }

  limitVolume(volume) {
    if (volume > 0) {
      console.error('To protect your hearing volume will not go above 0 level');
      volume = 0;
    }

    return volume;
  }
}