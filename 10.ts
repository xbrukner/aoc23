type PipeMap = string[]

const testInput1: PipeMap = `
-L|F7
7S-7|
L|7||
-L-J|
L|-JF
`.trim().split('\n')

const testInput2: PipeMap = `
..F7.
.FJ|.
SJ.L7
|F--J
LJ...
`.trim().split('\n')

import * as fs from 'fs';
const realInput: PipeMap = fs.readFileSync('10.in','utf8').trim().split('\n')

type Position = [number, number]

const movements: Array<Position> = [[-1, 0], [0, 1], [1, 0], [0, -1]]

const pipes: Record<string, [boolean, boolean, boolean, boolean]> = {
	'|': [true, false, true, false],
	'-': [false, true, false, true],
	'L': [true, true, false, false],
	'J': [true, false, false, true],
	'7': [false, false, true, true],
	'F': [false, true, true, false],
	'.': [false, false, false, false],
}

const move = (position: Position, movement: Position, map: PipeMap): Position | undefined => {
	const newPosition: Position = [position[0] + movement[0], position[1] + movement[1]]
	if (newPosition[0] < 0 || newPosition[0] >= map.length || newPosition[1] < 0 || newPosition[1] >= map[0].length) return undefined
	return newPosition
}

const findStart = (map: PipeMap): Position => 
	[map.findIndex(line => line.indexOf('S') > -1), map.map(line => line.split('').findIndex(c => c == 'S')).filter(i => i > -1)[0]]



const part1 = (map: PipeMap): number => {
	const start: Position = findStart(map)

	const posToSet = (pos: Position): string => `${pos[0]},${pos[1]}`
	const setToPos = (str: string): Position => str.split(',').map(n => parseInt(n)) as Position

	let visited: Set<string> = new Set<string>([posToSet(start)])
	let next: Set<string> = new Set<string>((movements.map((movement: Position, index: number): Position | undefined => {
		const around = move(start, movement, map)
		if (around === undefined) return undefined
		if (!pipes[map[around[0]][around[1]]][(index + 2) % 4]) return undefined
		return around
	}).filter(pos => pos !== undefined) as Position[]).map(posToSet))

	let distance = 0
	while (next.size) {
		next.forEach(pos => visited.add(pos))
		next = new Set<string>(
			Array.from(next.values()).map(setToPos).flatMap((position) => 
				pipes[map[position[0]][position[1]]].map(
					(valid, index) => valid ? move(position, movements[index], map) : undefined
				).filter(pos => pos !== undefined) as Position[]
			).map(posToSet).filter(pos => !visited.has(pos))
		)
		distance += 1
	}

	return distance
}

console.log(part1(realInput))

const part2 = (map: PipeMap): number => {
	const start: Position = findStart(map)

	const posToSet = (pos: Position): string => `${pos[0]},${pos[1]}`
	const setToPos = (str: string): Position => str.split(',').map(n => parseInt(n)) as Position

	let visited: Set<string> = new Set<string>([posToSet(start)])
	let next: Set<string> = new Set<string>((movements.map((movement: Position, index: number): Position | undefined => {
		const around = move(start, movement, map)
		if (around === undefined) return undefined
		if (!pipes[map[around[0]][around[1]]][(index + 2) % 4]) return undefined
		return around
	}).filter(pos => pos !== undefined) as Position[]).map(posToSet))

	while (next.size) {
		next.forEach(pos => visited.add(pos))
		next = new Set<string>(
			Array.from(next.values()).map(setToPos).flatMap((position) => 
				pipes[map[position[0]][position[1]]].map(
					(valid, index) => valid ? move(position, movements[index], map) : undefined
				).filter(pos => pos !== undefined) as Position[]
			).map(posToSet).filter(pos => !visited.has(pos))
		)
	}

	const aroundS = movements.map((movement: Position, index: number): boolean => {
		const around = move(start, movement, map)
		if (around === undefined) return false
		return pipes[map[around[0]][around[1]]][(index + 2) % 4]
	})

	const sReplacement = Object.entries(pipes).find(([shape, around]) =>
	///Fcking typescript, can't compare fucking arrays
		around.every((value, index) => aroundS[index] == value)
	)?.[0] as string

	return map.flatMap((line: string, row: number): number[] => line.split('').map((_, column): number => {
		let position: Position | undefined = [row, column]
		if (visited.has(posToSet(position))) return 0
		let pipesCrossed = 0
		let inPipe = false
		let beforeShape: string = 'S'
		while (position !== undefined) {
			if (visited.has(posToSet(position))) {
				const currentShape = map[position[0]][position[1]] == 'S' ? sReplacement : map[position[0]][position[1]]
				position = move(position, movements[0], map)
				if (!inPipe) { //entering pipe
					beforeShape = currentShape
					inPipe = currentShape != '-'
					pipesCrossed ++	
				}
				else { //possibly leaving pipe, if so see if we actually crossed it
					if (currentShape == '|') continue
					else if (beforeShape == 'L' && currentShape == 'F') {
						inPipe = false
						pipesCrossed --
						continue
					}
					else if (beforeShape == 'J' && currentShape == '7') {
						inPipe = false
						pipesCrossed --
						continue
					}
					else inPipe = false
				}
			}
			else {
				inPipe = false
				position = move(position, movements[0], map)
			}
		}
		return pipesCrossed % 2
	})).reduce((a, b) => a + b)
}

const testInput3: PipeMap = `
...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........
`.trim().split('\n')

const testInput4: PipeMap = `
.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...
`.trim().split('\n')

const testInput5: PipeMap = `
FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L
`.trim().split('\n')

console.log(part2(realInput))