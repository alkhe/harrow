const { arr, start, pair } = require('./arrow')

const log = console.log.bind(console)

const add = (x, y) => x + y
const plus_3 = start.map(x => x + 3) // or arr(x => x + 3)
const square = start.join((x, y) => x * y)

// point-free definition of hypot
const hypot = start.both(square).apply(add).map(Math.sqrt)

// regular definition of hypot
const hypot2 = (x, y) => Math.sqrt(x * x + y * y)

log(start.run(3)) // 3
log(plus_3.run(3)) // 6
log(square.run(4)) // 16
log(hypot.run(pair(3, 4))) // 5
