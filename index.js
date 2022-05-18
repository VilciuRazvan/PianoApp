const keys = document.querySelectorAll('.key');


const regulars = document.querySelectorAll('.key.white');
const sharps = document.querySelectorAll('.key.black');

const whites = ['a', 's', 'd', 'f', 'g', 'h', 'j'];
const blacks = ['w', 'e', 'r', 't', 'y'];
const all_notes = whites.concat(blacks);

const user_score = document.getElementById('user-score')

const songs = [
  ['f', 'f', 'f', 'a', 's', 's', 'a', 'h', 'h', 'g', 'g', 'f'], // Old MacDonald Had a Farm

  ['a', 'a', 'g', 'g', 'h', 'h', 'g', 'f', 'f', 'd', 'd', 's', 's', 'a'], // twinkle twinkle little star

  ['h', 'g', 'f', 'd', 's', 'd', 'f', 'h', 't', 'f', 'd', 's', 'a', 'w', 's', 'h', 'j'], // fly me to the moon

  ['j', 'd', 'g', 'r', 'd', 'j', 'r',
    'd', 'g', 'r', 'e', 'f', 'j', 'j',
    'd', 'g', 'r', 'd', 'j', 's', 'w', 'a',
    't', 'a', 'j', 'y', 'y', 'g', 'd'
  ], // harry potter - hedwig's theme (bad)

  [
    'e', 'd', 'r', 'g', 'e', 'd', 'r', 'g', 'a', 'j', 
    'd', 'g', 'j', 'y', 'h', 'g', 'd', 's', 'd'
  ], // pink panther

  [
    'e', 'f', 'r', 'y', 't', 'r', 't', 'r', 'f', 'r', 
    'f', 'f', 'f', 'f', 'r', 'f', 'e'
  ], // industry baby

  [
    'h', 'a', 's', 's', 's', 'd', 'f', 'f', 
    's', 'g', 'd', 'd', 's', 'a', 'a', 's', 
    'h', 'a', 's', 's', 's', 'd', 'f', 'f', 
    'f', 'g', 'd', 'd', 's', 'a', 's',
    'h', 'a', 's', 's', 's', 'f', 'g', 'g',
    'g', 'h', 'y', 'y',
    'h', 'g', 'h', 'g', 's',
    's', 'd', 'f', 'f', 'g', 'h', 's',
    'f', 'g', 'd', 'd', 's', 'a'
  ], // pirates of the caribbean

  [
    's', 'f', 'd', 's', 'f', 's', 'd', 's', 'a', 'h', 'y', 'h'
  ] // the godfather

];

let user_interact = false;
let current_note_counter = 0;
let notes_to_play = 0;// = level
let sequence = [];
let score = 0
let game_status = 'notstarted'
let note_validity = false
let mode = 'random'

const button = document.querySelector('#btn');
const mode_button = document.querySelector('#btn-mode');

user_score.textContent = score


let add_note = (sequence) => {
  sequence.push(all_notes[(Math.random() * all_notes.length) | 0])
  notes_to_play++
}

let choose_random_song = (songs) => {
  return songs[ (Math.random() * songs.length) | 0 ]
}


// Returns a Promise that resolves after "ms" Milliseconds
const timer = ms => new Promise(res => setTimeout(res, ms))

async function play_demo_notes(sequence) {
  //sequence = songs[0]
  console.log(sequence)
  for (let i = 0; i < sequence.length; i++) {
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
  console.log(notes_to_play, sequence.length)
  if (game_status == 'lost' || game_status == 'won')
    return;

    
    if (sequence[current_note_counter] == key) {
      current_note_counter++
      score++
      user_score.textContent = score

      if (current_note_counter == notes_to_play) {
        button.style.backgroundColor = '#4CAF50'
        button.innerText = "Next Level"
        button.disabled = false
        game_status = 'won'

        if (mode == 'song')
        notes_to_play++
      }

      if (notes_to_play > sequence.length) {
        button.style.backgroundColor = '#4CAF50'
        button.innerText = "Play Again"
        button.disabled = false
        game_status = 'won'

        mode_button.style.backgroundColor = '#4CAF50'
        if (mode == 'random')
          mode_button.innerText = "Random Mode"
        else
          mode_button.innerText = "Song Mode"
        mode_button.disabled = false
      }

      return true

    } else { // GAME OVER

      button.style.backgroundColor = '#4CAF50'
      button.innerText = "Play Again"
      button.disabled = false
      game_status = 'lost'

      mode_button.style.backgroundColor = '#4CAF50'
      if (mode == 'random')
        mode_button.innerText = "Random Mode"
      else
        mode_button.innerText = "Song Mode"
      mode_button.disabled = false

      sequence = []
      return false
    }
  
}

let play_demo_level = (sequence) => {

  if (user_interact == true)
    play_demo_notes(sequence)
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

mode_button.addEventListener('click', () => {
  if (mode_button.textContent == 'Random Mode') {
    mode_button.textContent = 'Song Mode';
    mode = 'song'
    sequence = choose_random_song(songs)
  }
  else if (mode_button.textContent == 'Song Mode') {
    mode_button.textContent = 'Random Mode';
    mode = 'random'
    sequence = []
  }
});

button.addEventListener('click', () => {
  if (button.innerText == 'Play Again' || button.innerText == 'Start') {
    score = 0
    user_score.textContent = score

    if (mode == 'random')
      notes_to_play = 0
    else
      notes_to_play = 1

    if (mode == 'song')
      sequence = choose_random_song(songs)

    mode_button.style.backgroundColor = 'transparent'
    mode_button.innerText = ''
    mode_button.setAttribute('disabled', "")
  }

  note_validity = false
  game_status = 'started'
  button.style.left = '73%';
  button.style.backgroundColor = 'transparent'
  button.innerText = ''
  button.setAttribute('disabled', "")
  user_interact = true;
  current_note_counter = 0;

  if (mode == 'random')
    add_note(sequence)

  if (mode == 'random')
    play_demo_level(sequence);
  else if (mode == 'song')
    play_demo_level(sequence.slice(0,notes_to_play))
});


let playNote = (key, correctness) => {
  const noteSound = document.getElementById(key.dataset.note);
  noteSound.currentTime = 0;
  noteSound.play();
  key.classList.add('active');

    if (correctness)
      key.classList.add('correct')
    else if (game_status == 'lost') {
      key.classList.add('wrong')
    }

  noteSound.addEventListener('ended', () => {
    key.classList.remove('active', 'correct', 'wrong');

    if (game_status == 'lost')
      game_status = 'notstarted'
  });
};






