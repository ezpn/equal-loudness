export class HowToUse {
  constructor() {
    this.render();
    document.querySelector('.how-to-use .expander').addEventListener('click', () => {
      this.toggle();
    });
  }

  render() {
    const howToUse = document.querySelector('.how-to-use');
    console.log({ howToUse});
    howToUse.innerHTML = `
      <a href="#" class="expander"><i class="bx"></i> How to use</a>
      <p class="expandant">Purpose of this tool is to observe how you perceive loudness of each frequency. Select one of the frequencies you\'d like to listen to on frequency tiles. Click <i class="bx bx-play-circle bx-sm"></i> button below 1000 Hz frequency and listen to its loudness. Select <i class="bx bx-play-circle bx-sm"></i> below your chosen frequency and adjust Db Gain so that it matches loudness of 1000 Hz sound. Do that for each frequency. Baseline db gain is set to -35 dB, so be careful with your audio volume!</p>`;

    const expandant = document.querySelector('.how-to-use .expandant');
    this.isExpanded = getComputedStyle(expandant).display === 'block';
    
    document.querySelector('.how-to-use .expander i').classList.add(this.isExpanded ? 'bxs-chevron-down' : 'bxs-chevron-right');
  }

  toggle() {
    this.isExpanded ? this.collapse() : this.expand();
    this.isExpanded = !this.isExpanded;
  }

  expand() {
    document.querySelector('.how-to-use .expandant').style.display = 'block';
    document.querySelector('.how-to-use .expander i').classList.remove('bxs-chevron-right');
    document.querySelector('.how-to-use .expander i').classList.add('bxs-chevron-down');
  }

  collapse() {
    document.querySelector('.how-to-use .expandant').style.display = 'none';
    document.querySelector('.how-to-use .expander i').classList.remove('bxs-chevron-down');
    document.querySelector('.how-to-use .expander i').classList.add('bxs-chevron-right');
  }
}