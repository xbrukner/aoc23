const testInput = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`.trim().split('\n')

import * as fs from 'fs';
const realInput: string[] = fs.readFileSync('07.in','utf8').trim().split('\n');

type Hand = {
	cards: string,
	bid: number
}

const parseHand = (line: string): Hand => {
	const data = line.trim().split(' ')
	return {
		cards: data[0],
		bid: parseInt(data[1])
	}
}

const parsedTestInput = testInput.map(parseHand)
const parsedRealInput = realInput.map(parseHand)

const part1 = (hands: Hand[]): number => {
	type CardCounts = Record<string, number>
	const groupBy = (str: string): CardCounts => 
		str.split('').reduce((obj, card): CardCounts => {
			obj[card] = 1 + (obj.hasOwnProperty(card) ? obj[card] : 0)
			return obj
		}, {})
	const ranks: Array<(counts: CardCounts)=>boolean> = [
		(counts: CardCounts):boolean => Object.values(counts).filter((value) => value == 5).length == 1,
		(counts: CardCounts):boolean => Object.values(counts).filter((value) => value == 4).length == 1,
		(counts: CardCounts):boolean => Object.values(counts).filter((value) => value == 3).length == 1 &&
			Object.values(counts).filter((value) => value == 2).length == 1,
		(counts: CardCounts):boolean => Object.values(counts).filter((value) => value == 3).length == 1 && 
			Object.values(counts).filter((value) => value == 1).length == 2,
		(counts: CardCounts):boolean => Object.values(counts).filter((value) => value == 2).length == 2,
		(counts: CardCounts):boolean => Object.values(counts).filter((value) => value == 2).length == 1 &&
			Object.values(counts).filter((value) => value == 1).length == 3,
		(counts: CardCounts):boolean => Object.values(counts).filter((value) => value == 1).length == 5
	]

	const cardOrder = 'AKQJT98765432'
	
	hands.sort((a: Hand, b: Hand): number => {
		const groupsA = groupBy(a.cards)
		const groupsB = groupBy(b.cards)
		const rankA = ranks.map((func) => func(groupsA)).findIndex((val) => val)
		const rankB = ranks.map((func) => func(groupsB)).findIndex((val) => val)
		if (rankA != rankB) return rankB - rankA
	
		const cardsA = a.cards.split('').map(c => cardOrder.indexOf(c))
		const cardsB = b.cards.split('').map(c => cardOrder.indexOf(c))

		return Array(5).fill(0).map((_, index) => cardsA[index] == cardsB[index] ? 0 : cardsA[index] < cardsB[index] ? 1 : -1)
			.find(val => val != 0) ?? 0
	})

	return hands.map((hand, index) => hand.bid * (index + 1)).reduce((a, b) => a + b)
}

console.log(part1(parsedRealInput))

const part2 = (hands: Hand[]): number => {
	type CardCounts = Record<string, number>
	const groupBy = (str: string): CardCounts => 
		str.split('').reduce((obj, card): CardCounts => {
			obj[card] = 1 + (obj.hasOwnProperty(card) ? obj[card] : 0)
			return obj
		}, {})
	const ranks: Array<(counts: CardCounts, jCount: number)=>boolean> = [
		(counts: CardCounts, jCount: number):boolean => 
			jCount == 5 || jCount == 4 ? true : Object.values(counts).filter((value) => value == 5 - jCount).length == 1,
		(counts: CardCounts, jCount: number):boolean => 
			jCount == 4 || jCount == 3 ? true : Object.values(counts).filter((value) => value == 4 - jCount).length >= 1,
		(counts: CardCounts, jCount: number):boolean => 
			jCount == 3 ? Object.values(counts).filter((value) => value == 2).length == 1 :
			jCount == 2 ? Object.values(counts).filter((value) => value == 3).length == 1 :
			jCount == 1 ? Object.values(counts).filter((value) => value == 2).length == 2 :
			jCount == 0 ? Object.values(counts).filter((value) => value == 3).length == 1 &&
			Object.values(counts).filter((value) => value == 2).length == 1 : false,
		(counts: CardCounts, jCount: number):boolean => 
			jCount == 3 ? true :
			Object.values(counts).filter((value) => value == 3 - jCount).length >= 1,
		(counts: CardCounts, jCount: number):boolean => 
			jCount == 2 ? Object.values(counts).filter((value) => value == 2).length == 1 : 
			jCount == 0 ? Object.values(counts).filter((value) => value == 2).length == 2 :
			jCount == 1 && Object.values(counts).filter((value) => value == 2).length == 1 
				&& Object.values(counts).filter((value) => value == 1).length == 2,
		(counts: CardCounts, jCount: number):boolean => 
			jCount == 2 || jCount == 1 ? true : 
			jCount == 0 ? Object.values(counts).filter((value) => value == 2).length == 1 : false,
		(counts: CardCounts, jCount: number):boolean =>
			jCount == 1 || jCount == 0 && Object.values(counts).filter((value) => value > 1).length == 0
	]

	const cardOrder = 'AKQT98765432J'
	
	hands.sort((a: Hand, b: Hand): number => {
		const groupsA = groupBy(a.cards)
		const groupsB = groupBy(b.cards)
		const jCountA = groupsA.hasOwnProperty('J') ? groupsA['J'] : 0
		const jCountB = groupsB.hasOwnProperty('J') ? groupsB['J'] : 0
		delete groupsA['J']
		delete groupsB['J']
		const rankA = ranks.map((func) => func(groupsA, jCountA)).findIndex((val) => val)
		const rankB = ranks.map((func) => func(groupsB, jCountB)).findIndex((val) => val)
		if (rankA != rankB) return rankB - rankA
	
		const cardsA = a.cards.split('').map(c => cardOrder.indexOf(c))
		const cardsB = b.cards.split('').map(c => cardOrder.indexOf(c))

		return Array(5).fill(0).map((_, index) => cardsA[index] == cardsB[index] ? 0 : cardsA[index] < cardsB[index] ? 1 : -1)
			.find(val => val != 0) ?? 0
	})

	return hands.map((hand, index) => hand.bid * (index + 1)).reduce((a, b) => a + b)
}

console.log(part2(parsedRealInput))