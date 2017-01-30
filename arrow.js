// TODO
// consider using `id` for `start`

const { List } = require('immutable')

function Arrow(computation) {
	this.c = computation
}

const pair = (l, r) => ({ l, r })

function run(c, x) {
	return c.reduce((x, f) => f(x), x)
}

const to_c = fa => fa instanceof Arrow
	? fa.c
	: List([fa])

Arrow.prototype.enroll = function(c) {
	return new Arrow(this.c.concat(c))
}

Arrow.prototype.run = function(x) {
	return run(this.c, x)
}

const register = (name, f) => {
	Arrow.prototype[name] = function() {
		return this.enroll(f.apply(null, arguments))
	}
}

const register_static = (name, c) => {
	Arrow.prototype[name] = function() {
		return this.enroll(c)
	}
}

// seq, then
register('map', to_c)

const fork = x => pair(x, x)
register_static('fork', [fork])

register('first', a => {
	const c = to_c(a)
	return [
		({ l, r }) => pair(run(c, l), r)
	]
})

register('second', a => {
	const c = to_c(a)
	return [
		({ l, r }) => pair(l, run(c, r))
	]
})

register_static('swap', [({ l, r }) => pair(r, l)])

register_static('tap', [x => (console.log(x), x)])

const apply = a => {
	const c = to_c(a)
	const head = c.first()
	const rest = c.rest()
	return [
		({ l, r }) => run(rest, head(l, r))
	]
}

register('apply', apply)

register('join', a => [fork].concat(apply(a)))

const para = (a, b) => {
	const c = to_c(a)
	const d = to_c(b)
	return [
		({ l, r }) => pair(run(c, l), run(d, r))
	]
}
register('para', para)

register('both', a => para(a, a))

register_static('assoc', [
	({ l: { l: ll, r: lr }, r }) => pair(ll, pair(lr, r))
])

register('loop', a => {
	const c = to_c(a)
	return [
		x => {
			let end = false

			while (!end) {
				[x, end] = run(c, x)
			}

			return x
		}
	]
})

const arr = f => new Arrow(List([f]))

const start = new Arrow(List())

module.exports = {
	arr,
	start,
	pair
}
