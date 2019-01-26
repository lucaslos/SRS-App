const fs = require('fs');
const path = require('path');

const data = require('./srs-db-1b23d-export.json');

const outputFile = '../db.json';

const englishGroups = data.group
  .filter(group => group.section_id === '57522bf113391')
  .map(group => group.id);

let id = 0;

const difficulty = {
  0.25: 3,
  0.5: 2,
  0.75: 1,
  1: 0,
};

function getRepetitions(diff, groupId) {
  if (diff > 0) {
    return difficulty[diff];
  }

  return data.group.find(group => group.id === groupId).repetitions;
}

const output = {
  cards: data.card
    .filter(card => card && englishGroups.includes(card.group_id))
    .map(card => ({
      id: id++,
      front: card.front,
      back: card.back,
      ...(card.tags && { tags: card.tags }),
      ...(card.notes && { notes: card.notes }),
      lastReview: card.lastView,
      wrongReviews: card.wrongViews,
      repetitions: getRepetitions(card.difficulty, card.group_id),
      lang: 'en',
    })),
};

console.log(output.cards.length);

fs.writeFile(path.join(__dirname, outputFile), JSON.stringify(output, null, 2), (err) => {
  if (err) throw err;

  console.log('File converted!');
});
