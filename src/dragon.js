// A dragon of a certain color with color mappings
const Character = require('./character.js')

function Dragon (mapping, color, type, startIndex, name) {
  Character.apply(this, ['dragon', ['images/dragon_64px.png', 'images/dragon_64px_white.png'], startIndex, true])
  let self = this
  this.mapping = mapping
  this.color = color
  this.startIndexColor = color
  this.type = type
  this.name = name

  this.transformColor = function (color) {
    return this.mapping[color] || color
  }

  this.colorRelativeSquares = function (landingOnColor) {
    return { squares: [[0, 0]], transformColor: function () { return self.transformColor(landingOnColor) } }
  }
}
Dragon.prototype = new Character()

module.exports = Dragon
