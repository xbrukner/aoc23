interface View {
	red: number;
	green: number;
	blue: number;
}
interface Game {
	id: number;
	views: View[];
}

const test_input: string[] = `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`.trim().split('\n')

import * as fs from 'fs';
const input_data: string[] = fs.readFileSync('02.in','utf8').trim().split('\n');

const parseGame = (line: string): Game => {
	const colonSplit = line.split(':')

	const parseView = (view: string): View => {
		const colors: string[] = view.split(',').map(s => s.trim())

		const red = colors.find((str) => str.endsWith('red')) ?? '0 red'
		const blue = colors.find((str) => str.endsWith('blue')) ?? '0 blue'
		const green = colors.find((str) => str.endsWith('green')) ?? '0 green'

		return {
			red: parseInt(red.split(' ')[0]),
			green: parseInt(green.split(' ')[0]),
			blue: parseInt(blue.split(' ')[0]),
		}
	}
	return {
		id: parseInt(colonSplit[0].split(' ')[1]),
		views: colonSplit[1].split(';').map(parseView)
	}
}

const part1 = (games: Game[]): number => {
	const test: View = {
		red: 12,
		green: 13,
		blue: 14 
	}

	const testView = (view: View): boolean =>
		view.red <= test.red && view.blue <= test.blue && view.green <= test.green

	return games.filter((game: Game) => 
		game.views.map(testView).every(Boolean)
	).map(game => game.id).reduce((a, b) => a + b)	
}

const part2 = (games: Game[]): number => {
	return games.map((game: Game) => {
		const maxCubes = game.views.reduce((prev: View, current: View): View => {
			return {
				red: Math.max(prev.red, current.red),
				green: Math.max(prev.green, current.green),
				blue: Math.max(prev.blue, current.blue)
			}
		}, {red: 0, blue: 0, green: 0})
		return maxCubes.red * maxCubes.green * maxCubes.blue
	}).reduce((a, b) => a + b)
}

const parsedTestInput = test_input.map(parseGame)
const parsedInput = input_data.map(parseGame)
console.log(part1(parsedInput))
console.log(part2(parsedInput))