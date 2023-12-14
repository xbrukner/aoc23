
const testInput = `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`.trim().split('\n')

import * as fs from 'fs';
const realInput: string[] = fs.readFileSync('14.in','utf8').trim().split('\n')

const slideUp = (map: string[]): string[] =>
	map.reduce((result: string[], line, row) => result.concat([line.split('').map((c, col) => {
		if (row == 0) {
			if (c == 'O' || c == '#') return c
			else return map[row + 1][col] == 'O' ? '0' : '.'
		}
		else if (row < map.length - 1) {
			if (c == '#') return c
			if (result[row - 1][col] == '0' /* moved O */ || c == '.') return map[row + 1][col] == 'O' ? '0' : '.' 
			return c /* unmoved O */
		}
		else {
			if (c == '.' || c == '#') return c
			else return result[row - 1][col] == '0' ? '.' : 'O'
		}
	}).join('')]), [])
	.map(line => line.replace(/0/g, 'O'))

const slideAllUp = (map: string[]): string[] => {
	while (true) {
		const current = slideUp(map)
		if (map.every((l, i) => current[i] == map[i])) return current
		map = current
	}
}

const calculateWeight = (map: string[]): number => 
	map.map((line, index) => line.split('').filter(c => c == 'O').length * (map.length - index))
		.reduce((a, b) => a + b)

const part1 = (map: string[]): number => 
	calculateWeight(slideAllUp(map))

console.log(part1(realInput))

const rotateRight = (map: string[]): string[] => {
	const reversed = map.reverse()
	return Array(map.length).fill(0).map((_, column) => reversed.map(l => l[column]).join(''))
}

const part2 = (map: string[]): number => {
	const rotation = (m: string[]) => rotateRight(slideAllUp(m))

	const rotate4 = (m: string[]) => rotation(rotation(rotation(rotation(m))))

	const toKey = (m: string[]): string => m.join('\n')
	const fromKey = (key: string): string[] => key.split('\n')

	const memory = new Map<string, number>()

	const iterations = 1_000_000_000

	for (let i = 1; i < iterations; i ++) {
		map = rotate4(map)

		const key = toKey(map)		

		if (!memory.has(key)) {
			memory.set(key, i)
		}
		else {
			const cycleStart = (memory.get(key) as number)
			const cycleLenth = i - cycleStart

			const trueIteration = cycleStart + ((iterations - cycleStart) % cycleLenth)

			for (const [key, value] of memory.entries()) {
				if (value == trueIteration) return calculateWeight(fromKey(key))
			}
		}
	}

	return calculateWeight(map) 
}

console.log(part2(realInput))