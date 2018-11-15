const wordGen = require('random-words');

import { SqlBible } from './SqlBible';
import { BiblePhrase, BibleCrossReference, BibleNote } from './models';
import { getOsisIdFromBookId } from './data/bibleMeta';

// function getRandomChar() {
//     var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; //abcdefghijklmnopqrstuvwxyz0123456789

//     return possible.charAt(Math.floor(Math.random() * possible.length));
// }
const sqlBible = new SqlBible({
    type: 'sqlite',
    database: 'bible.db'
});

export const genDb = async () => {
    for (let book = 1; book <= 66; book++) {
        for (let chapter = 1; chapter <= 15; chapter++) {
            for (let paragraph = 0; paragraph < 5; paragraph++) {
                console.log(
                    'adding book ' +
                        book +
                        ' and chapter ' +
                        chapter +
                        ' and paragraph ' +
                        (paragraph + 1)
                );

                let phrases = [];
                for (let verse = paragraph * 5 + 1; verse <= (paragraph + 1) * 5; verse++) {
                    for (let phraseIdx = 1; phraseIdx <= 22; phraseIdx++) {
                        let notes;
                        if (verse % 7 === 0 && phraseIdx === 1) {
                            const note = new BibleNote();
                            note.setPhrases([
                                {
                                    text: wordGen({ min: 1, max: 30, join: ' ' })
                                }
                            ]);
                            notes = [note];
                        }
                        const phrase = new BiblePhrase({
                            osisBookId: getOsisIdFromBookId(book),
                            versionChapterNum: chapter,
                            versionVerseNum: verse,
                            versionId: 1,
                            text: wordGen({ min: 1, max: 2, join: ' ' }),
                            notes,
                            bold: true,
                            italic: false,
                            indentLevel: 0,
                            quoteLevel: 0,
                            strong: 'G' + phraseIdx * verse,
                            crossReferences:
                                verse % 5 === 0 && phraseIdx === 1
                                    ? [
                                          new BibleCrossReference({
                                              bookOsisId: 'GEN',
                                              chapterNum: 3,
                                              verseNum: verse
                                          })
                                      ]
                                    : undefined
                        });
                        phrases.push(phrase);
                    }
                }
                await sqlBible.addParagraph(phrases);
            }
        }
    }
};

const getData = async () => {
    const section = await sqlBible.getVerses({
        bookOsisId: 'Gen',
        chapterNum: 1,
        verseNum: 3,
        verseEndNum: 5,
        versionId: 1
    });
    console.log(section);
};

const run = async () => {
    await genDb();
    getData();
};

run();