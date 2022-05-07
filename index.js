const keys = document.querySelectorAll('.key');


const regulars = document.querySelectorAll('.key.white');
const sharps = document.querySelectorAll('.key.black');

const whites = ['a', 's', 'd', 'f', 'g', 'h', 'j'];
const blacks = ['w', 'e', 'r', 't', 'y'];
const all_notes = whites.concat(blacks);

const user_score = document.getElementById('user-score')

let user_interact = false;
let current_note_counter = 0;
let notes_to_play = 0;// = level
let sequence = [];
let score = 0
let game_status = 'notstarted'
let note_validity = false

const button = document.querySelector('#btn');

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

      return true

    } else { // GAME OVER
      button.style.backgroundColor = '#4CAF50'
      button.innerText = "Play Again"
      button.disabled = false
      game_status = 'lost'
      //notes_to_play = 0
      return false
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
  if (all_notes.includes(key)) {
    const whiteKeyIndex = whites.indexOf(key);
    const blackKeyIndex = blacks.indexOf(key);

    if (game_status == 'started')
      note_validity = check_correct_note(key, sequence)
    else
      note_validity = false

    if (whiteKeyIndex > -1) playNote(regulars[whiteKeyIndex], note_validity);
    if (blackKeyIndex > -1) playNote(sharps[blackKeyIndex], note_validity);

    
  }
});



button.addEventListener('click', () => {
  if (button.innerText == 'Play Again') {
    score = 0
    user_score.textContent = score
    notes_to_play = 0
    sequence = []
  }

  note_validity = false
  game_status = 'started'
  button.style.left = '73%';
  button.style.backgroundColor = 'transparent'
  button.innerText = ''
  button.setAttribute('disabled', "")
  user_interact = true;
  current_note_counter = 0;
  add_note(sequence)
  play_demo_level(sequence);
});


let playNote = (key, correctness) => {
  const noteSound = document.getElementById(key.dataset.note);
  noteSound.currentTime = 0;
  noteSound.play();
  key.classList.add('active');

    if (correctness)
      key.classList.add('correct')
    else if (!correctness && game_status == 'lost') {
      key.classList.add('wrong')
    }

  noteSound.addEventListener('ended', () => {
    key.classList.remove('active');
    key.classList.remove('correct');
    key.classList.remove('wrong')

    if (game_status == 'lost')
      game_status = 'notstarted'
  });
};






