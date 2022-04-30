const keys = document.querySelectorAll('.key');


const regulars = document.querySelectorAll('.key.white');
const sharps = document.querySelectorAll('.key.black');

const whites = ['a', 's', 'd', 'f', 'g', 'h', 'j'];
const blacks = ['w', 'e', 'r', 't', 'y'];
const all_notes = whites.concat(blacks);

const notes_hint = document.getElementById('hint')
const user_score = document.getElementById('user-score')

let user_interact = false;
let current_note_counter = 0;
let notes_to_play = 0;// = level
let sequence = [];
let hint = 'WASD' // to be randomized
let score = 0
let game_status = 'notstarted'
const button = document.querySelector('#btn');

notes_hint.textContent = sequence
user_score.textContent = score


let add_note = (sequence) => {
  sequence.push(all_notes[(Math.random() * all_notes.length) | 0])
  notes_to_play++
}


// Returns a Promise that resolves after "ms" Milliseconds
const timer = ms => new Promise(res => setTimeout(res, ms))

async function play_demo_notes() {
  for (let i = 0; i < notes_to_play; i++) {
    const key = sequence[i];
    const whiteKeyIndex = whites.indexOf(key);
    const blackKeyIndex = blacks.indexOf(key)

    if (whiteKeyIndex > -1) playNote(regulars[whiteKeyIndex]);
    if (blackKeyIndex > -1) playNote(sharps[blackKeyIndex]);

    await timer(1000)
    // put below when completing a level

  }
}

let check_correct_note = (key) => {
  console.log(game_status)
  if (game_status != 'lost' && game_status != 'won') {
    if (sequence[current_note_counter] == key) {
      current_note_counter++
      score++
      user_score.textContent = score
      if (current_note_counter == notes_to_play) {
        button.style.backgroundColor = '#4CAF50'
        button.innerText = "Next Level"
        button.disabled = false
        game_status = 'won'
      }
    } else { // GAME OVER
      button.style.backgroundColor = '#4CAF50'
      button.innerText = "Play Again"
      button.disabled = false
      game_status = 'lost'
    }
  }
}

let play_demo_level = (sequence) => {
  console.log(sequence)

  if (user_interact == true)
    play_demo_notes()
}



keys.forEach((key) => {
  key.addEventListener('click', () => playNote(key));
});

document.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  const key = e.key;
  const whiteKeyIndex = whites.indexOf(key);
  const blackKeyIndex = blacks.indexOf(key);

  if (whiteKeyIndex > -1) playNote(regulars[whiteKeyIndex]);
  if (blackKeyIndex > -1) playNote(sharps[blackKeyIndex]);

  check_correct_note(key, sequence)
});



button.addEventListener('click', () => {
  if (button.innerText == 'Play Again') {
    score = 0
    user_score.textContent = score
    notes_to_play = 0
    sequence = []
  }
  game_status = 'started'
  button.style.backgroundColor = 'transparent'
  button.innerText = ''
  button.setAttribute('disabled', "")
  user_interact = true;
  current_note_counter = 0;
  add_note(sequence)
  play_demo_level(sequence);
});

let playNote = (key) => {
  const noteSound = document.getElementById(key.dataset.note);
  noteSound.currentTime = 0;
  noteSound.play();
  key.classList.add('active');
  noteSound.addEventListener('ended', () => {
    key.classList.remove('active');
  });
};






