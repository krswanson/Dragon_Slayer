// Any hex colors must be in lowercase, such as #aabbcc
const levels = {}
levels['fire_1'] = {
  'rows': 3,
  'cols': 3,
  'baseColor': 'green',
  'goalColor': 'orange',
  'type': 'fire',
  'mapping': {
    'green': 'orange',
    'orange': 'green'
  }
}
let ice = '#aaccff'
levels['ice_1'] = {
  'rows': 3,
  'cols': 3,
  'baseColor': 'green',
  'goalColor': ice,
  'type': 'ice',
  'mapping': {
    'green': ice,
    '#aaccff': 'green'
  }
}
levels['fire_2'] = {
  'rows': 4,
  'cols': 4,
  'baseColor': 'green',
  'goalColor': 'orange',
  'type': 'fire',
  'mapping': {
    'green': 'brown',
    'brown': 'orange',
    'orange': 'brown'
  }
}

levels['fire_3'] = {
  'rows': 4,
  'cols': 4,
  'baseColor': 'green',
  'goalColor': 'orange',
  'type': 'fire',
  'mapping': {
    'green': 'brown',
    'brown': 'red',
    'red': 'orange',
    'orange': 'brown'
  }
}

module.exports = levels