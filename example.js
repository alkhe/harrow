const { arr, start, pairwise, pair } = require('./arrow')

const add = (x, y) => x + y
const plus_3 = start.map(x => x + 3) // or arr(x => x + 3)
const square = start.join((x, y) => x * y)

// point-free definition of hypot
const hypot = start.both(square).apply(add).map(Math.sqrt)

// regular definition of hypot
const hypot2 = (x, y) => Math.sqrt(x * x + y * y)

console.log(start.run(3))
console.log(plus_3.run(3))
console.log(square.run(4))
console.log(hypot.run(pair(3, 4)))
console.log(hypot2(3, 4))

