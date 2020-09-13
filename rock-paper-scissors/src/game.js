const GAME_OPTIONS = ['rock', 'paper', 'scissors']
const WINNING_CHANCE = {
  'rock': 'scissors',
  'paper': 'rock',
  'scissors': 'paper'
}
function validateInput(input) {
  if (GAME_OPTIONS.indexOf(input) < 0) {
    throw Error(`invalid input option: ${input}`)
  }
}
module.exports = function evaluate(input) {
  validateInput(input)
  const chance = GAME_OPTIONS[Math.floor(Math.random() * 10) % 3]
  if (input === chance) {
    return 0
  }
  if(WINNING_CHANCE[input] === chance) {
    return 1
  }
  return -1
}
