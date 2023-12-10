
const testInput=`
Time:      7  15   30
Distance:  9  40  200
`.trim()

import * as fs from 'fs';
const input_data: string = fs.readFileSync('06.in','utf8').trim()

type RaceInput = {
	time: number,
	distance: number	
}

const parseInput = (input: string): RaceInput[] => {
	const numbers = input.split('\n').map(line => 
		line.split(' ').filter(possiblyNumber => '012345789'.indexOf(possiblyNumber[0]) > -1)
		.map(a => parseInt(a))
	)
	return Array(numbers[0].length).fill(0).map((_, index) => ({
		time: numbers[0][index],
		distance: numbers[1][index]
	}))
}

const parsedTestInput = parseInput(testInput)
const parsedInput = parseInput(input_data)

const part1 = (input: RaceInput[]): number => {
	const options = input.map(({time, distance}) => 
		Array(time).fill(0).map((_, input) => 
			(time - input) * input
		).filter((travelledDistance) => travelledDistance > distance).length
	)
	return options.reduce((a, b) => a * b)
}

const parseSecondInput = (input: string): RaceInput => {
	const numbers = input.split('\n').map(line => 
		parseInt(line.split(':')[1].replace(/ /g,''))
	)	
	return {
		time: numbers[0],
		distance: numbers[1]
	}
}

console.log(part1(parsedInput))
const parsedSecondTestInput = parseSecondInput(testInput)
const parsedSecondFullInput = parseSecondInput(input_data)

console.log(part1([parsedSecondFullInput]))