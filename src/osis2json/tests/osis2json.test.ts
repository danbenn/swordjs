const fs = require('fs');
const path = require('path');
import osis2json from '../src/osis2json';

test('JSON formatting is correct for Psalms', () => {
  console.log(osis2json);
  const xmlPath = path.resolve(__dirname, './psalmsTestXML.json');
  const jsonPath = path.resolve(__dirname, './psalmsTestJSON.json');
  const psalmsChapterXML = JSON.parse(fs.readFileSync(xmlPath));
  const psalmsExpectedJson = JSON.parse(fs.readFileSync(jsonPath));

  psalmsChapterXML.forEach((verseXML, index) => {
    const psalmsResultJson = osis2json(verseXML);
    expect(JSON.stringify(psalmsResultJson)).toEqual(JSON.stringify(psalmsExpectedJson[index]));
  });

});


