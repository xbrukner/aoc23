type LavaMap = number[][]
const testInput: LavaMap = `
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533
`.trim().split('\n').map((l) => l.split('').map(c => parseInt(c)))

import * as fs from 'fs';
const realInput: LavaMap = fs.readFileSync('17.in','utf8').trim().split('\n').map((l) => l.split('').map(c => parseInt(c)))

type Point = [number, number]

enum Direction {
	Right = 0,
	Down = 1,
	Left = 2,
	Up = 3
}
const directions: Point[] = [[1, 0], [0, 1], [-1, 0], [0, -1]]

type Option = {
	score: number,
	direction: Direction,
	stepsTaken: number
}

const move = ([pX, pY]: Point, direction: Direction, option: Option, map: LavaMap): [Point, Option][] => {
	const [dX, dY] = directions[direction]
	const x = pX + dX
	const y = pY + dY

	const maxX = map[0].length
	const maxY = map.length

	if (x < 0 || x >= maxX || y < 0 || y >= maxY) return []

	const opt: Option = {
		...option,
		direction,
		stepsTaken: option.direction == direction ? option.stepsTaken + 1 : 1,
		score: map[y][x] + option.score
	}

	return [[[x, y], opt]]
}

const getMovements1 = (point: Point, option: Option, map: LavaMap): [Point, Option][] => {
	const pointLeft = move(point, (option.direction + 3) % 4, option, map)
	const pointStraight = option.stepsTaken < 3 ? move(point, option.direction, option, map) : []
	const pointRight = move(point, (option.direction + 1) % 4, option, map)

	return pointLeft.concat(pointStraight).concat(pointRight)
}

const shouldOptionBeReplaced = (replacement: Option, reference: Option): boolean => {
	if (replacement.direction == reference.direction)
		if (replacement.score < reference.score)
			if (replacement.stepsTaken <= reference.stepsTaken)
				return true
	return false
}

const getOptionsPerPoint = (added: Option, options: Option[]): [boolean, Option[]] => {
	const toBeReplaced = options.findIndex(o => shouldOptionBeReplaced(added, o))

	if (toBeReplaced > -1) {
		let newOptions = options.concat()
		newOptions.splice(toBeReplaced, 1, added)
		let replace = newOptions.findIndex(o => shouldOptionBeReplaced(added, o)) 
		while (replace > -1) {
			newOptions.splice(replace, 1)
			replace = newOptions.findIndex(o => shouldOptionBeReplaced(added, o)) 
		}
		return [true, newOptions]
	}

	if (options.some(o => added.direction == o.direction && added.stepsTaken == o.stepsTaken)) {
		return [false, options]
	}

	return [true, options.concat([added])]
}

const part1 = (map: LavaMap): number => {
	//TBD - extract function
	const toKey = (point: Point): string => `${point[0]},${point[1]}`
	const fromKey = (str: string): Point => {
		const [x, y] = str.split(',')
		return [parseInt(x), parseInt(y)]
	}

	const maxX = map[0].length - 1
	const maxY = map.length -1

	const starts: [Point, Option][] = [
		[[0, 0], {score: 0, direction: Direction.Up, stepsTaken: 0}],
		[[0, 0], {score: 0, direction: Direction.Left, stepsTaken: 0}]
	]

	const optionsPerPoint = new Map<string, Option[]>()
	optionsPerPoint.set(toKey(starts[0][0]), [
		starts[0][1],
		starts[1][1],
	])
	const lowestScoreOptions: [Point, Option][] = starts.concat()

	while (lowestScoreOptions.length) {
		const [point, option] = lowestScoreOptions.splice(0, 1)[0]

		if (point[0] == maxX && point[1] == maxY) return option.score

		const moves = getMovements1(point, option, map)

		moves.forEach(([point, option]) => {
			const key = toKey(point)
			const options = optionsPerPoint.has(key) ? optionsPerPoint.get(key) as Option[] : []

			const [toAdd, newOptions] = getOptionsPerPoint(option, options)
			//TBD - removal

			if (toAdd) {
				optionsPerPoint.set(key, newOptions)
				lowestScoreOptions.push([point, option])
			}
		})

		lowestScoreOptions.sort((a, b) => a[1].score == b[1].score ? 0 : (a[1].score < b[1].score ? -1 : 1))
		//TBD - insert ordered
	}

	return 0
}

console.log(part1(realInput))

const getMovements2 = (point: Point, option: Option, map: LavaMap): [Point, Option][] => {
	const pointLeft = option.stepsTaken >= 4 ? move(point, (option.direction + 3) % 4, option, map) : []
	const pointStraight = option.stepsTaken < 10 ? move(point, option.direction, option, map) : []
	const pointRight = option.stepsTaken >= 4 ? move(point, (option.direction + 1) % 4, option, map) : []

	return pointLeft.concat(pointStraight).concat(pointRight)
}


const part2 = (map: LavaMap): number => {
	const toKey = (point: Point): string => `${point[0]},${point[1]}`
	const fromKey = (str: string): Point => {
		const [x, y] = str.split(',')
		return [parseInt(x), parseInt(y)]
	}

	const maxX = map[0].length - 1
	const maxY = map.length -1

	const starts: [Point, Option][] = [
		[[0, 0], {score: 0, direction: Direction.Up, stepsTaken: 4}],
		[[0, 0], {score: 0, direction: Direction.Left, stepsTaken: 4}]
	]

	const optionsPerPoint = new Map<string, Option[]>()
	optionsPerPoint.set(toKey(starts[0][0]), [
		starts[0][1],
		starts[1][1],
	])
	const lowestScoreOptions: [Point, Option][] = starts.concat()

	while (lowestScoreOptions.length) {
		const [point, option] = lowestScoreOptions.splice(0, 1)[0]

		if (point[0] == maxX && point[1] == maxY && option.stepsTaken >= 4) return option.score

		const moves = getMovements2(point, option, map)

		moves.forEach(([point, option]) => {
			const key = toKey(point)
			const options = optionsPerPoint.has(key) ? optionsPerPoint.get(key) as Option[] : []

			const [toAdd, newOptions] = getOptionsPerPoint(option, options)

			if (toAdd) {
				optionsPerPoint.set(key, newOptions)
				lowestScoreOptions.push([point, option])
			}
		})

		lowestScoreOptions.sort((a, b) => a[1].score == b[1].score ? 0 : (a[1].score < b[1].score ? -1 : 1))
	}

	return 0
}

console.log(part2(realInput))