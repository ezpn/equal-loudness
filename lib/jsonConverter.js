export class JsonConverter {
  constructor(freqTable) {
    this.freqTable = freqTable;
  }

  exportToJson(perceivedArray) {
    const exportObj = [];
    this.freqTable.forEach((freq, idx) => exportObj.push([freq, perceivedArray[idx]]));

    return JSON.stringify(exportObj);
  }

  importFromJson(jsonString) {
    const data = JSON.parse(jsonString);
    const result = this.validateData(data);

    if (!result) {
      console.error('Validation failed');
      return false;
    }
    
    console.log({result});

    const orderedValues = result
      .toSorted((a, b) => a[0] - b[0])
      .map((elem) => elem[1]);

    console.log({orderedValues});

    return orderedValues;
  }

  validateData(data) {
    if (data.length !== this.freqTable.length) {
      console.error(`Incorrect number of frequencies. Got ${data.length}, expected ${this.freqTable.length}`);
      return false;
    }

    data.forEach((elem) => {
      if (elem.length !== 2) {
        console.error('Frequency or dbGain is missing in one of the elements');
        return false;
      }

      if (typeof(elem[0]) !== 'number') {
        console.error('Each first element must be a number');
        return false;
      }

      if (typeof(elem[1]) !== 'number') {
        console.error('Each second element must be a number');
        return false;
      }
    });

    const importedFreq = data.map((elem) => elem[0]);
    if (importedFreq.toSorted().join(',') !== this.freqTable.toSorted().join(',')) {
      console.error('Incorrect frequencies');
      return false;
    }

    return data;
  }
}

export const exportToJson = ({ freqTable, perceivedArray }) => {
  const exportObj = {};
  freqTable.forEach((freq, idx) => {
    exportObj[freq] = perceivedArray[idx];
  });

  return JSON.stringify(exportObj);
}

export const importFromJson = (jsonString) => {
  const data = JSON.parse(jsonString);

  return Object.values(data);
}