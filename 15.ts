
const testInput = `
rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7
`.trim().split(',')

import * as fs from 'fs';
const realInput: string[] = fs.readFileSync('15.in','utf8').trim().split(',')

const calculateHash = (str: string): number => 
	str.split('').map(c => c.charCodeAt(0)).reduce((res, v) => ((res + v) * 17) % 256, 0)

const part1 = (input: string[]): number =>
	input.map(calculateHash).reduce((a, b) => a + b)

console.log(part1(realInput))

const part2 = (input: string[]): number => {
	type Lens = {
		key: string,
		value: number
	}
	const boxes: Lens[][] = Array(256).fill([])

	const removeLens = (box: Lens[], key: string): Lens[] =>
		box.filter(lens => lens.key != key)
	
	const addLens = (box: Lens[], add: Lens): Lens[] =>
		box.some((lens) => lens.key == add.key) ? 
			box.map((lens) => lens.key == add.key ? add : lens) :
			box.concat(add)
	
	input.forEach((cmd: string) => {
		if (cmd.slice(-1) == '-') {
			const key = cmd.slice(0, -1)
			const hash = calculateHash(key)
			boxes[hash] = removeLens(boxes[hash], key)
		}
		else {
			const key = cmd.slice(0, -2)
			const hash = calculateHash(key)
			const value = parseInt(cmd.slice(-1))
			boxes[hash] = addLens(boxes[hash], {key, value})
		}
	})

	return boxes.flatMap((slots, box) => slots.map((lens, slot) => lens.value * (slot + 1) * (box + 1)))
			.reduce((a, b) => a + b)
}

console.log(part2(realInput))
