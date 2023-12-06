
type Matrix = string[][]

interface Position {
	row: number,
	column: number
}

const test_input: Matrix = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`.trim().split('\n').map(s => s.split(''))

import * as fs from 'fs';
import test from 'node:test';
const input_data: Matrix = fs.readFileSync('03.in','utf8').trim().split('\n').map(s => s.split(''))

const get = (matrix: Matrix, {row, column}: Position): string | undefined =>
	row >= 0 && row < matrix.length && column >= 0 && column < matrix[row].length ? matrix[row][column] : undefined

const around = ({row, column}: Position): Position[] => 
	[
		{row: row - 1, column: column - 1},
		{row: row - 1, column: column},
		{row: row - 1, column: column + 1},
		{row: row, column: column - 1},
		{row: row, column: column + 1},
		{row: row + 1, column: column - 1},
		{row: row + 1, column: column},
		{row: row + 1, column: column + 1},
	]

const adjacentSymbol = (row: number, column: number, matrix: Matrix) => 
	(around({row, column})
	.map(pos => get(matrix, pos))
	.filter(char => char !== undefined) as string[])
	.map(char => '.0123456789'.indexOf(char) == -1)
	.some(Boolean)

function matrixMapReduce<Acc extends {matched: Matched}, Matched = number[]>(matrix: Matrix,
	start: Acc, 
	reducer: (value: Acc, char: string, matrix: Matrix, row: number, column: number) => Acc): Matched[] {
	return matrix.map(
		(line: string[], row: number): Matched => 
			line.concat('.').reduce(
				(value: Acc, char: string, column: number): Acc => reducer(value, char, matrix, row, column),
				start
			).matched
	)
}


const part1 = (matrix: Matrix): number => {
	type Acc = {
		matched: number[],
		currentNum: number,
		currentAdjacent: boolean,
	}
	const start = {
		matched: [],
		currentNum: 0,
		currentAdjacent: false
	}
	return matrixMapReduce(matrix, start, 
		(value: Acc, char: string, matrix: Matrix, row: number, column: number) => {
			if ('0123456789'.indexOf(char) > -1) {
				return {
					matched: value.matched,
					currentNum: value.currentNum * 10 + parseInt(char),
					currentAdjacent: value.currentAdjacent || adjacentSymbol(row, column, matrix)	
				}
			}
			else {
				return {
					matched: value.matched.concat(value.currentNum > 0 && value.currentAdjacent ? [value.currentNum] : []),
					currentNum: 0,
					currentAdjacent: false
				}
			}
		}
	).reduce((prev: number[], current: number[]) => prev.concat(current)).reduce((a, b) => a + b)
}

type NumberMatrix = number[][]
const getNumber = (matrix: NumberMatrix, {row, column}: Position): number | undefined =>
	row >= 0 && row < matrix.length && column >= 0 && column < matrix[row].length ? matrix[row][column] : undefined 

const twoNumbersAroundStar = (matrix: NumberMatrix, {row, column}: Position): number | undefined => {
	const numbers = [
		getNumber(matrix, {row: row - 1, column: column - 1}),
		getNumber(matrix, {row: row - 1, column: column - 1}) === 0 ? getNumber(matrix, {row: row - 1, column: column}) : undefined,
		getNumber(matrix, {row: row - 1, column: column}) === 0 ? getNumber(matrix, {row: row - 1, column: column + 1}) : undefined,
		getNumber(matrix, {row: row, column: column - 1}),
		getNumber(matrix, {row: row, column: column + 1}),
		getNumber(matrix, {row: row + 1, column: column - 1}),
		getNumber(matrix, {row: row + 1, column: column - 1}) === 0 ? getNumber(matrix, {row: row + 1, column: column}) : undefined,
		getNumber(matrix, {row: row + 1, column: column}) === 0 ? getNumber(matrix, {row: row + 1, column: column + 1}) : undefined,
	]
	return (numbers.reduce((count: number, number) => count + (number !== undefined && number > 0 ? 1 : 0), 0) == 2) ?
		(numbers.filter(num => num !== undefined && num> 0) as number[]).reduce((a, b) => a * b)
	: undefined
}

const part2 = (matrix: Matrix): number => {
	type Acc = {
		matched: number[],
		count: number,
		currentNum: number,
	}
	const start: Acc = {
		matched: [],
		count: 0,
		currentNum: 0,
	}

	const numberMatrix: NumberMatrix = matrixMapReduce(matrix, start, 
		(value: Acc, char: string, matrix: Matrix, row: number, column: number) => {
			if ('0123456789'.indexOf(char) > -1) {
				return {
					matched: value.matched,
					count: value.count + 1,
					currentNum: value.currentNum * 10 + parseInt(char),
				}
			}
			else {
				return {
					matched: value.matched.concat(
						value.count > 0 ? Array(value.count).fill(value.currentNum).concat([0]) : [0]
					),
					count: 0,
					currentNum: 0,
				}
			}
		}
	)

	return matrix.reduce(
		(matched: number[], line: string[], row: number): number[] =>
			matched.concat(
				line.concat('.').map((char: string, column: number): number | undefined => 
					char == '*' ? twoNumbersAroundStar(numberMatrix, { row, column }) : undefined
				).filter(num => num !== undefined) as number[]
			),
		[] as number[]
	).reduce((a, b) => a + b)
}

console.log(part1(input_data))
console.log(part2(input_data))