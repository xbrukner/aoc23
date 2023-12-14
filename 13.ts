
const testInput: string[] = `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`.trim().split('\n\n')

import * as fs from 'fs';
const realInput: string[] = fs.readFileSync('13.in','utf8').trim().split('\n\n')

type IndexSplit = {
	start1: number,
	end1: number,
	start2: number,
}

//0 1 2
//0 -> 1, 
//1 -> 2

//0 1 2 3
//0 -> 1
//0, 1 -> 3, 2
//2 -> 3

const createSplits = (length: number): IndexSplit[] => {
	const maxLength = Math.floor(length / 2)

	const startLeft: IndexSplit[] = Array(maxLength).fill(0).map((_, i) => ({
		// length = i + 1
		start1: 0,
		end1: i + 1,
		start2: ((i + 1) * 2) - 1
	}))
	const startRight: IndexSplit[] = Array(length % 2 == 0 ? maxLength - 1 : maxLength).fill(0).map((_, i) => ({
		start1: length - ((i + 1) * 2),
		end1: length - (i + 1),
		start2: length - 1,
	}))
	return startLeft.concat(startRight)
}

const createPairs = (split: IndexSplit): [number, number][] => 
	Array(split.end1 - split.start1).fill(0).map((_, index) => [index + split.start1, split.start2 - index])

const horizontalReflection = (lines: string[]): number[] =>
	createSplits(lines.length)
	.filter((split: IndexSplit): boolean => 
		createPairs(split).map(([i1, i2]) => lines[i1] == lines[i2]).every(b => b == true)
	)
	.map((split) => 100 * split.end1)

const verticalReflection = (lines: string[]): number[] =>
	createSplits(lines[0].length)
	.filter((split: IndexSplit): boolean => 
		createPairs(split).map(([i1, i2]) => 
			lines.map(l => l[i1]).join('') == lines.map(l => l[i2]).join('')
		).every(b => b == true)
	)
	.map((split) => split.end1)

const calculateReflections = (field: string): number[] => {
	const lines = field.split('\n')

	return (horizontalReflection(lines)).concat(verticalReflection(lines))
}

const calculateReflection = (field: string): number => calculateReflections(field)[0]


const part1 = (inputs: string[]): number => 
	inputs.map(calculateReflection).reduce((a, b) => a + b)

console.log(part1(realInput))

const part2 = (inputs: string[]): number =>
	inputs.map((field: string) => {
		const original: number = calculateReflection(field)

		const fields: string[] = Array(field.length - 1).fill(0).map((_, i) =>
			field.slice(0, i) + 
			(field[i] == '\n' ? '\n' : field[i] == '.' ? '#' : '.') +
			field.slice(i + 1)
		)
		
		const different = fields.find((field) => {
			const smudged = calculateReflections(field)
			return smudged.length == 2 || smudged.length == 1 && smudged[0] != original
		})

		return calculateReflections(different as string).filter(v => v != original)[0]
	}).reduce((a, b) => a + b)

console.log(part2(realInput))