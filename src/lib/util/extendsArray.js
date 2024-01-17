Array.prototype.add = function (item) {
	if (this.includes(item)) return
	this.push(item)
}

Array.prototype.delete = function (item) {
	const i = this.indexOf(item)
	if (i === -1) return false
	this.splice(i, 1)
	return true
}

Array.prototype.clear = function () {
	this.length = 0
}

Array.prototype.has = function (item) {
	return this.includes(item)
}

Object.defineProperty(Array.prototype, 'size', {
	get() {
		return this.length
	}
})

// let arr = [0, 1, 2, 3, 4, 5]

// console.log(arr.length)
// console.log(arr.size)

// arr.clear()

// console.log('cleared array:', arr)
