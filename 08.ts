const testInput1 = `
RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)
`.trim()

const testInput2 = `
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
`.trim()

const testInput3 = `
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`.trim()

import * as fs from 'fs';
const realInput: string = fs.readFileSync('08.in','utf8').trim()


type MapNode = {
	left: string,
	right: string,
}

type MapNodes = Record<string, MapNode>

type ParsedInput = {
	directions: string,
	mapNodes: MapNodes
}

const parseInput = (input: string): ParsedInput => {
	const directions = input.split('\n')[0]
	const mapNodes = input.split('\n').slice(2).reduce((mapNodes: MapNodes, line): MapNodes => {
		mapNodes[line.slice(0, 3)] = {
			left: line.slice(7, 10),
			right: line.slice(12, 15)
		}
		return mapNodes
	}, {})
	return { directions, mapNodes }
}

const parsedTestInput1 = parseInput(testInput1)
const parsedTestInput2 = parseInput(testInput2)
const parsedRealInput = parseInput(realInput)

const part1 = (input: ParsedInput): number => {
	function* direction(): Generator<string, unknown, unknown> {
		while (true) {
			for (let value of input.directions.split(''))
				yield value
		}
	}

	let current = 'AAA'
	let dirs = direction()
	let count = 0
	while (current != 'ZZZ') {
		const nextDir = dirs.next()
		current = nextDir.value == 'L' ? input.mapNodes[current].left : input.mapNodes[current].right
		count += 1
	}
	return count
}

console.log(part1(parsedRealInput))


const parsedTestInput3 = parseInput(testInput3)

const part2 = (input: ParsedInput): number => {
	function* direction(): Generator<string, unknown, unknown> {
		while (true) {
			for (let value of input.directions.split(''))
				yield value
		}
	}

	let current = Object.keys(input.mapNodes).filter(value => value[2] == 'A')
	let dirs = direction()
	let count = 0
	let minimum: number[] = []
	while (current.length > 0) {
		const nextDir = dirs.next()
		current = current.map(c => nextDir.value == 'L' ? input.mapNodes[c].left : input.mapNodes[c].right)
		const remaining = current.filter(value => value[2] == 'Z')
		count += 1
		if (remaining.length) {
			minimum = minimum.concat(Array(remaining.length).fill(count))
			current = current.filter(value => value[2] != 'Z')
		}
	}
	function findGCD(a: number, b: number): number {
		while (b !== 0) {
			const temp = b;
			b = a % b;
			a = temp;
		}
		return Math.abs(a);
	}
	
	function findLCM(a: number, b: number): number {
		if (a === 0 || b === 0) {
			return 0;
		}
		return Math.abs((a * b) / findGCD(a, b));
	}
	return minimum.reduce(findLCM)
}

console.log(part2(parsedRealInput))