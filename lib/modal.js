export class Modal {
  constructor(onImport = () => {}, isVisible = false) {
    this.onImport = onImport;
    this.isVisible = isVisible;
    this.isImportLocked = true;
    this.elem = null;
    this.json = null;
    this.render();
  } 

  setOnImport(onImport) {
    this.onImport = onImport;
  }

  show() {
    this.isVisible = true;
    this.elem.classList.add('visible');
  }

  hide() {
    this.isVisible = false;
    this.elem.classList.remove('visible');
  }

  lockImport() {
    this.isImportLocked = true;
    document.querySelector('#modal .import').setAttribute('disabled', true);
  }

  unlockImport() {
    this.isImportLocked = false;
    document.querySelector('#modal .import').removeAttribute('disabled');
  }

  render() {
    const self = this;
    const elem = document.querySelector('#modal');
    if (elem == null) {
      console.error('Cannot render modal, missing #modal selector');
      return;
    }
    
    elem.innerHTML =`
      <div class="modal-content">
        <div class="modal-close"><i class="bx bx-x"></i></div>
        <h5 class="modal-header">Import loudness contour</h5>
        <div class="modal-body">
          Choose local JSON file to import
          <p class="text-center">
            <input class="file-upload" type="file" />
            <button class="import button-primary" disabled>Import</button>
          </p>
        </div>
      </div>`;

    document.querySelector('#modal .modal-close').addEventListener('click', () => {
      self.hide();
    });

    document.querySelector('#modal .file-upload').addEventListener('change', async (event) => {
      console.log('File loaded')
      this.lockImport();
      const file = event.target.files.item(0);
      if (file == null) {
        console.warn('File not loaded');
        return;
      }
      this.json = await file.text();
      this.unlockImport();
    });

    document.querySelector('#modal .import').addEventListener('click', () => {
      if (this.isImportLocked) {
        console.error('Import is locked');
        return;
      }

      if (this.json == null) {
        console.error('JSON is empty')
      }

      this.onImport(this.json);
      this.reset();
    });

    this.elem = elem;
  }

  reset() {
    this.hide();
    this.json = null;
    document.querySelector('#modal .file-upload').value = '';
  }
}
