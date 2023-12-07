interface Card {
	id: number,
	winning: number[],
	yours: number[],
}

const test_input: string[] = `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`.trim().split('\n')

import * as fs from 'fs';
const input_data: string[] = fs.readFileSync('04.in','utf8').trim().split('\n');

const parseCard = (line: string): Card => {
	const [card, numbers] = line.split(':')
	const [winning, yours] = numbers.split('|').map(s => s.trim())

	return {
		id: parseInt(card.split(' ')[1]),
		winning: winning.split(' ').map(s => parseInt(s)).filter(num => !Number.isNaN(num)),
		yours: yours.split(' ').map(s => parseInt(s)).filter(num => !Number.isNaN(num))
	}
}

const part1 = (cards: Card[]): number => 
	cards.map((card: Card): number => 
		card.yours.reduce((result: number, current: number) => {
			if (card.winning.indexOf(current) > -1) {
				return result == 0 ? 1 : result * 2
			}
			else return result
		}, 0)
	).reduce((a, b) => a + b)

const test_cards = test_input.map(parseCard)
const input_cards = input_data.map(parseCard)

const part2 = (cards: Card[]): number => {
	const counts = cards.reduce(
		(acc: number[], card: Card, index: number): number[] => {
			const wonCards = card.yours.reduce((result: number, current: number) => {
				if (card.winning.indexOf(current) > -1) {
					return result += 1
				}
				else return result
			}, 0)
		return acc.map((value, accIndex) => accIndex > index && accIndex <= index + wonCards ? 
			value + acc[index] : value
		)
	}, Array(cards.length).fill(1) as number[])

	return counts.reduce((a, b) => a + b)

}
console.log(part1(input_cards))
console.log(part2(input_cards))
