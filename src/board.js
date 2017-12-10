/* global $ */

require('arrowkeys')
const rgbHex = require('rgb-hex')

function Board () {
  let self = this
  self.rows = null
  self.cols = null
  self.characters = {}
  self.baseColors = null
  self.goalColors = null

  function hexColor (color) {
    return color.includes('rgb') ? '#' + rgbHex(color) : color
  }

  this.startBadGuys = function () {
    Object.keys(self.characters).forEach(function (key) {
      let c = self.characters[key]
      if (!c.id.includes('dragon')) {
        c.startMoving(function () {
          let freq = c.baseFreq
          c.setFrequency(Math.random() * freq + freq / 2)
          let dirs = ['up', 'down', 'left', 'right']
          let direction = dirs[Math.floor(Math.random() * 4)]
          self.move(c.id, direction)
        })
      }
    })
  }

  this.stopBadGuys = function () {
    Object.keys(self.characters).forEach(function (key) {
      let c = self.characters[key]
      if (!c.id.includes('dragon')) c.stopMoving()
    })
  }

  this.hasWon = function () {
    for (let i = 0; i < self.rows; i++) {
      for (let j = 0; j < self.cols; j++) {
        let color = hexColor($('#' + i + '_' + j)[0].style.background)
        if (color !== self.goalColors[i][j]) return false
      }
    }
    return true
  }

  this.endGame = function (message) {
    self.stopBadGuys()
    $(document).arrowkeysUnbind()
    $('.animate').removeClass('animate')
    let wonDiv = $('#endgame-message')[0]
    wonDiv.innerHTML = message
    wonDiv.style.display = 'block'
  }

  this.win = function () {
    this.endGame('<p style="color: #11ff11">You win!</p>')
    for (let i = 0; i < self.rows; i++) {
      for (let j = 0; j < self.cols; j++) {
        $('#' + i + '_' + j).addClass('flash')
      }
    }
  }

  this.lose = function (byChar) {
    let name = byChar.id.split('_')[0]
    this.endGame('<p style="color: #ff2222">The ' + name + ' killed you. You lose!</p>')
  }

  this.add = function (character, element) {
    let td = $(element)[0] // Get element by selector or responseds with element if it is an element
    if (!td) return false
    td.innerHTML = '<img src="' + character.image[1] + '"/><img src="' + character.image[0] + '"/>'
    td.style.padding = '6px 6px 6px 6px'
    td.style.background = character.transformColor(hexColor(td.style.background))
    $(element).addClass(character.id).addClass('animate')
    return true
  }

  this.remove = function (character, element) {
    let td = $(element)[0]
    if (!td) return false
    td.innerHTML = ''
    td.style.padding = '40px 40px 40px 40px'
    $(element).removeClass(character.id).removeClass('animate')
    return true
  }

  this.getCharacter = function (td) {
    let charId = td.className.split(/\s+/).find(function (cl) {
      return self.characters[cl]
    })
    return self.characters[charId]
  }

  this.move = function (id, direction) {
    // Give characters locations?
    let character = this.characters[id]
    let currentId = $('.' + character.id)[0].id
    let rowCol = currentId.split('_')
    let newId = null
    switch (direction) {
      case 'up':
        newId = '#' + (parseInt(rowCol[0]) - 1) + '_' + rowCol[1]
        break
      case 'down':
        newId = '#' + (parseInt(rowCol[0]) + 1) + '_' + rowCol[1]
        break
      case 'left':
        newId = '#' + rowCol[0] + '_' + (parseInt(rowCol[1]) - 1)
        break
      case 'right':
        newId = '#' + rowCol[0] + '_' + (parseInt(rowCol[1]) + 1)
        break
      default:
        throw new Error('Bad direction keyword:', direction)
    }
    let dest = $(newId)[0]
    // Edge of board
    // Another character
    // Terrain this character can't cross
    if (dest) { // Not off the board
      let destChar = this.getCharacter(dest)
      if (destChar) { // If another character is on the space
        if (destChar.isPlayer === character.isPlayer) {
          // Do nothing if both bad guys or both player-characters
        } else {
          if (destChar.isPlayer) { // Bad guy lands on player
            this.lose(character)
            this.remove(destChar, dest)
            this.remove(character, '#' + currentId)
            this.add(character, dest)
          } else { // Player landed on bad guy
            this.lose(destChar)
            this.remove(character, '#' + currentId)
          }
        }
      } else if (character.validSpace(dest)) {
        this.add(character, dest)
        this.remove(character, '#' + currentId)
        if (this.hasWon()) this.win()
      }
    }
  }

  this.setup = function (levelData, characters) {
    $(document).arrowkeys()
    self.rows = levelData.baseColors.length
    self.cols = levelData.baseColors[0].length
    self.characters = levelData.characters
    self.goalColors = levelData.goalColors
    self.baseColors = levelData.baseColors

    $('#level-description')[0].innerHTML = levelData.description
    let table = document.createElement('TABLE')
    table.id = 'dragon_board'
    let tr = null
    let td = null
    for (let i = 0; i < self.rows; i++) {
      tr = document.createElement('TR')
      for (let j = 0; j < self.cols; j++) {
        td = document.createElement('TD')
        td.id = i + '_' + j
        Object.keys(self.characters).forEach(function (key) {
          let c = self.characters[key]
          if (c.startIndex === td.id) self.add(c, td)
        })
        td.style.background = self.baseColors[i][j]
        tr.appendChild(td)
      }
      tr.appendChild(td)
      table.appendChild(tr)
    }
    document.getElementById('board').appendChild(table)
    self.startBadGuys()
  }

  this.delete = function () {
    $('#dragon_board').remove()
    $('#endgame-message')[0].style.display = 'none'
    $(document).arrowkeysUnbind()
    self.stopBadGuys()
  }
}

const board = new Board()

$(document)
  .on('upkey', function () {
    board.move('dragon_1', 'up')
  })
  .on('downkey', function () {
    board.move('dragon_1', 'down')
  })
  .on('leftkey', function () {
    board.move('dragon_1', 'left')
  })
  .on('rightkey', function () {
    board.move('dragon_1', 'right')
  })

module.exports = board
