type GalaxyMap = string[]

const testInput: GalaxyMap = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`.trim().split('\n')

import * as fs from 'fs';
const realInput: string[] = fs.readFileSync('11.in','utf8').trim().split('\n')

const expandMap = (map: GalaxyMap): GalaxyMap => {
	const expandHorizontal: GalaxyMap = 
		map.flatMap(line => line.split('').filter(c => c == '.').length == line.length ? [line, line]: [line])

	const expandVertical: number[] = 
	Array(expandHorizontal[0].length).fill(0).map((_, index: number): number | undefined => 
		Array(expandHorizontal.length).fill(0).map((_, index2: number) => expandHorizontal[index2][index])
			.filter(c => c == '.').length == expandHorizontal.length ? index : undefined
	).filter(num => num !== undefined) as number[]

	return expandHorizontal.map((line: string) => line.split('').flatMap(
		(value, index) => expandVertical.some((i) => i == index) ? [value, value] : [value]
	).join(''))
}

type Position = [number, number]

const findGalaxies = (map: GalaxyMap): Position[] => 
	map.flatMap(
		(line, row) => line.split('').map((c, column): Position | undefined => c == '#' ? [row, column] : undefined)
	).filter(pos => pos !== undefined) as Position[]


const part1 = (map: GalaxyMap): number => {
	const expandedMap = expandMap(map)
	const galaxies = findGalaxies(expandedMap)
	
	const galaxyPairs: [Position, Position][] = galaxies.flatMap(
		(first, index1: number) => galaxies.filter((_, index2) => index1 < index2).map(second => [first, second])
	)

	return galaxyPairs.map(([[x1, y1], [x2, y2]]) => Math.abs(x2 - x1) + Math.abs(y2 - y1)).reduce((a, b) => a + b)
}

type Expanded = {
	rows: number[],
	columns: number[],
}

const expandMap2 = (map: GalaxyMap): Expanded  => {
	const rows: number[] = 
		map.flatMap((line, index: number) => line.split('').filter(c => c == '.').length == line.length ? [index] : [])

	const columns: number[] = 
	Array(map[0].length).fill(0).map((_, index: number): number | undefined => 
		Array(map.length).fill(0).map((_, index2: number) => map[index2][index])
			.filter(c => c == '.').length == map.length ? index : undefined
	).filter(num => num !== undefined) as number[]

	return { rows, columns }
}

const part2 = (map: GalaxyMap): number => {
	const expanded = expandMap2(map)
	const galaxies = findGalaxies(map)
	
	const galaxyPairs: [Position, Position][] = galaxies.flatMap(
		(first, index1: number) => galaxies.filter((_, index2) => index1 < index2).map(second => [first, second])
	)

	const multiplier = 1000000

	const distanceColumns = (x1: number, x2: number): number => {
		const min = Math.min(x1, x2)
		const max = Math.max(x1, x2)

		return Array(max - min).fill(0).map(
			(_, index: number): number => expanded.columns.includes(index + min) ? multiplier : 1)
			.reduce((a, b) => a + b, 0)
	}

	const distanceRows = (y1: number, y2: number): number => {
		const min = Math.min(y1, y2)
		const max = Math.max(y1, y2)

		return Array(max - min).fill(0).map(
			(_, index: number): number => expanded.rows.includes(index + min) ? multiplier : 1)
			.reduce((a, b) => a + b, 0)
	}

	return galaxyPairs.map(([[y1, x1], [y2, x2]]) => distanceColumns(x1, x2) + distanceRows(y1, y2)).reduce((a, b) => a + b)
}

console.log(part1(realInput))
console.log(part2(realInput))