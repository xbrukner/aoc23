type BeamMap = string[]

const testInput: BeamMap = `
.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....
`.trim().split('\n')

import * as fs from 'fs';
const realInput: string[] = fs.readFileSync('16.in','utf8').trim().split('\n')

type Point = [number, number]

enum Direction {
	Right = 0,
	Down = 1,
	Left = 2,
	Up = 3
}
const directions: Point[] = [[1, 0], [0, 1], [-1, 0], [0, -1]]


const move = ([pX, pY]: Point, direction: Direction, map: BeamMap): Point | undefined => {
	const [dX, dY] = directions[direction]
	const x = pX + dX
	const y = pY + dY

	const maxX = map[0].length
	const maxY = map.length

	if (x < 0 || x >= maxX || y < 0 || y >= maxY) return undefined
	return [x, y]
}

const isSplit = (direction: Direction, c: string): boolean => {
	if (c == '|' && (direction == Direction.Right || direction == Direction.Left)) return true
	if (c == '-' && (direction == Direction.Down || direction == Direction.Up)) return true
	return false
}

const moveBeam = (from: Point, direction: Direction, map: BeamMap): [Point, Direction][] => {
	const to: Point | undefined = move(from, direction, map)
	
	if (to === undefined) return []

	const [x, y] = to
	const c = map[y][x]

	if (isSplit(direction, c)) {
		return [
			[to, (direction + 1) % 4],
			[to, (direction + 3) % 4]
		]
	}
	else if (c == '.' || c == '|' || c == '-') {
		return [[to, direction]]
	}
	else {
		if (c == '/') {
			if (direction == Direction.Right) return [[to, Direction.Up]]
			if (direction == Direction.Down) return [[to, Direction.Left]]
			if (direction == Direction.Left) return [[to, Direction.Down]]
			if (direction == Direction.Up) return [[to, Direction.Right]]
		}
		else { // \
			if (direction == Direction.Right) return [[to, Direction.Down]]
			if (direction == Direction.Down) return [[to, Direction.Right]]
			if (direction == Direction.Left) return [[to, Direction.Up]]
			if (direction == Direction.Up) return [[to, Direction.Left]]
		}
	}

	return []
}

const calculateCoverage = (point: Point, direction: Direction, map: BeamMap) => {
	const toSet = (point: Point, direction: Direction): string => `${point[0]},${point[1]},${direction}`
	const fromSet = (str: string): [Point, Direction] => {
		const [x, y, d] = str.split(',')
		return [[parseInt(x), parseInt(y)], parseInt(d)]
	}

	const visited = new Set<string>()

	let toVisit: [Point, Direction][] = [[point, direction]]

	while (toVisit.length) {
		const [point, direction] = toVisit.splice(0, 1)[0]
		if (visited.has(toSet(point, direction))) continue

		visited.add(toSet(point, direction))

		toVisit.push(...moveBeam(point, direction, map))
	}

	return [...visited.values()].map((s) => fromSet(s)[0]).reduce((set, point): Set<string> => 
		set.add(`${point[0]},${point[1]}`)
	, new Set<string>()).size - 1
}

const part1 = (map: BeamMap): number => calculateCoverage([-1, 0], Direction.Right, map)

console.log(part1(realInput))

const part2 = (map: BeamMap): number => {
	const maxX = map[0].length
	const maxY = map.length

	const left: [Point, Direction][] = Array(maxY).fill(0).map((_, i) => [[-1, i], Direction.Right])
	const right: [Point, Direction][] = Array(maxY).fill(0).map((_, i) => [[maxX, i], Direction.Left])
	const up: [Point, Direction][] = Array(maxX).fill(0).map((_, i) => [[i, -1], Direction.Down])
	const down: [Point, Direction][] = Array(maxX).fill(0).map((_, i) => [[i, maxY], Direction.Up])

	const inputs = left.concat(right).concat(up).concat(down)

	return inputs.map(([point, direction]): number => calculateCoverage(point, direction, map)).reduce((a, b) => a > b ? a : b)
}

console.log(part2(realInput))
