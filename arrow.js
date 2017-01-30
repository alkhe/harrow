// TODO
// trampoline composition/run to prevent stack overflow
// skip recognized `id`s in eval stage

function Arrow(f) {
	this.run = f
}

function Pair(a, b) {
	this.l = a
	this.r = b
}

const to_f = f_or_a => f_or_a instanceof Arrow
	? f_or_a.run
	: f_or_a

const id = x => x

Arrow.prototype.map = function(a) {
	const pre = this.run
	const f = to_f(a)

	return new Arrow(x => f(pre(x)))
}

Arrow.prototype.fork = function() {
	const pre = this.run

	return new Arrow(x => {
		const r = pre(x)
		return new Pair(r, r)
	})
}

Arrow.prototype.first = function(a) {
	const pre = this.run
	const f = to_f(a)

	return new Arrow(x => {
		const { l, r } = pre(x)
		return new Pair(f(l), r)
	})
}

Arrow.prototype.second = function(a) {
	const pre = this.run
	const f = to_f(a)

	return new Arrow(x => {
		const { l, r } = pre(x)
		return new Pair(l, f(r))
	})
}

Arrow.prototype.swap = function() {
	const pre = this.run

	return new Arrow(x => {
		const { l, r } = pre(x)
		return new Pair(r, l)
	})
}

Arrow.prototype.tap = function() {
	const pre = this.run

	return new Arrow(x => {
		const r = pre(x)
		console.log(r)
		return r
	})
}

Arrow.prototype.apply = function(a) {
	const pre = this.run
	const f = to_f(a)

	return new Arrow(x => {
		const { l, r } = pre(x)
		return f(l, r)
	})
}

Arrow.prototype.join = function(a) {
	return this.fork().apply(a)
}

Arrow.prototype.para = function(a, b) {
	const pre = this.run
	const f = to_f(a)
	const g = to_f(b)

	return new Arrow(x => {
		const { l, r } = pre(x)
		return new Pair(f(l), g(r))
	})
}

Arrow.prototype.assoc = function() {
	const pre = this.run

	return new Arrow(x => {
		const { l: { l: ll, r: lr }, r } = pre(x)
		return new Pair(ll, new Pair(lr, r))
	})
}

Arrow.prototype.loop = function(a) {
	const pre = this.run
	const f = to_f(a)

	return new Arrow(x => {
		let r = pre(x)
		let end = false

		while (!end) {
			[r, end] = f(r)
		}

		return r
	})
}

const arr = f => new Arrow(f)

const start = arr(id)

module.exports = {
	arr,
	start
}
