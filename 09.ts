
const testInput = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`.trim().split('\n').map((line) => line.split(' ').map(a => parseInt(a)))

import * as fs from 'fs';
const realInput: number[][] = fs.readFileSync('09.in','utf8').trim().split('\n').map((line) => line.split(' ').map(a => parseInt(a)))

const part1 = (input: number[][]): number => 
	input.map((line: number[]): number => {
		let last: number[] = line.slice(-1)

		let current = line
		while (current.filter(value => value == 0).length != current.length && current.length) {
			current = current.slice(0, -1).reduce((arr: number[], a: number, index: number): number[] => {
				return arr.concat([current[index + 1] - a])
			}, [])
			last.push(current.slice(-1)[0])
		}
		return last.reduce((a, b) => a + b)
	})
	.reduce((a, b) => a + b)

console.log(part1(realInput))

const part2 = (input: number[][]): number => 
	input.map((line: number[]): number => {
		let first: number[] = line.slice(0, 1)

		let current = line
		let sign = -1
		while (current.filter(value => value == 0).length != current.length && current.length) {
			current = current.slice(0, -1).reduce((arr: number[], a: number, index: number): number[] => {
				return arr.concat([current[index + 1] - a])
			}, [])
			first.push(sign * current[0])
			sign *= -1
		}
		return first.reduce((a, b) => a + b)
	})
	.reduce((a, b) => a + b)

console.log(part2(realInput))