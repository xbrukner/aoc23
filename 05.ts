type RangeMap = {
	destinationRangeStart: number,
	sourceRangeStart: number,
	rangeLength: number,
}

const parseRange = (line: string): RangeMap => {
	const [destinationRangeStart, sourceRangeStart, rangeLength] = line.split(' ').map(s => parseInt(s))
	return {destinationRangeStart, sourceRangeStart, rangeLength}
}

type Input = {
	seeds: number[],
	rangeMaps: RangeMap[][]
}

const parseInput = (lines: string[]): Input => {
	const seeds = lines[0].split(':')[1].trim().split(' ').map(s => parseInt(s))

	const rangeMaps = lines.slice(1).reduce((rangeMaps: RangeMap[][], line: string): RangeMap[][] => {
		if (line == '') return rangeMaps
		if ('0123456789'.indexOf(line[0]) == -1) {
			rangeMaps.push([])
			return rangeMaps
		}
		rangeMaps.at(-1)?.push(parseRange(line))
		return rangeMaps
	}, [])

	return {seeds, rangeMaps}
}

const test_input: string[] = `
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`.trim().split('\n')

import * as fs from 'fs';
const input_data: string[] = fs.readFileSync('05.in','utf8').trim().split('\n');

const convertRange = (source: number, rangeMap: RangeMap): number | undefined  => {
	if (source >= rangeMap.sourceRangeStart && source < rangeMap.sourceRangeStart + rangeMap.rangeLength) {
		return rangeMap.destinationRangeStart + source - rangeMap.sourceRangeStart
	}
	return undefined
}

const convertRanges = (source: number, rangeMaps: RangeMap[]): number => 
	rangeMaps.reduce((result: number | undefined, rangeMap: RangeMap): number | undefined =>
		result === undefined ? convertRange(source, rangeMap) : result
	, undefined) ?? source

const testRanges: RangeMap[] = [
	parseRange('50 98 2'), parseRange('52 50 48')
]

//console.log(convertRanges(79, testRanges))
//console.log(convertRanges(14, testRanges))
const parsedTestInput = parseInput(test_input)
const parsedInput = parseInput(input_data)

const part1 = (input: Input): number =>
	input.seeds.map((seed: number) => 
		input.rangeMaps.reduce((value: number, rangeMaps: RangeMap[]): number => 
			convertRanges(value, rangeMaps)
		, seed)
	).reduce((a, b) => a < b ? a : b)


type Range = {
	start: number,
	length: number,
}

const convertSeedstoRanges = (seeds: number[]): Range[] => 
	Array(seeds.length / 2).fill(0).map(
		(_, index: number): Range => ({start: seeds[index * 2], length: seeds[index * 2 + 1]})
	)

const convertRangeMapToSourceRange = (rangeMap: RangeMap): Range =>
	({start: rangeMap.sourceRangeStart, length: rangeMap.rangeLength})

const isBetween = (start: number, inBetween: number, end: number) =>
	start <= inBetween && inBetween < end

const doesStartIntersect = (testStart: Range, other: Range): boolean =>
    isBetween(other.start, testStart.start, other.start + other.length)

const doesEndIntersect = (testEnd: Range, other: Range): boolean =>
    isBetween(other.start, testEnd.start + testEnd.length - 1, other.start + other.length)

type RangeSplitResult = {
	before?: Range,
	mapped?: Range,
	after?: Range
}

const splitRange = (sourceRange: Range, rangeMap: RangeMap): RangeSplitResult => {
	const mappingRange: Range = convertRangeMapToSourceRange(rangeMap)
	const startIntersects: boolean = doesStartIntersect(sourceRange, mappingRange) // -> there is no before
	const endIntersects: boolean = doesEndIntersect(sourceRange, mappingRange) // -> there is no after

	if (!(startIntersects || endIntersects) && !doesStartIntersect(mappingRange, sourceRange)) {
		if (sourceRange.start < mappingRange.start) return { before: sourceRange }
		else return { after: sourceRange }
	}

	let result: RangeSplitResult = {}

	if (!startIntersects) result.before = 
		{
			start: sourceRange.start,
			length: mappingRange.start - sourceRange.start
		}

	let currentLength = result.before?.length ?? 0

	result.mapped = {
		start: rangeMap.destinationRangeStart + (startIntersects ? sourceRange.start - mappingRange.start : 0),
		length: endIntersects ? sourceRange.length - currentLength :
			startIntersects ? (mappingRange.start + mappingRange.length - sourceRange.start) :
			mappingRange.length
	}	
	currentLength += result.mapped.length

	if (!endIntersects) result.after = 
		{
			start: mappingRange.start + mappingRange.length,
			length: sourceRange.length - currentLength
		}
	
	return result
}

const part2 = (input: Input): number => {
	const ranges = convertSeedstoRanges(input.seeds)

	const mapped = input.rangeMaps.reduce((ranges: Range[], rangeMaps: RangeMap[]): Range[] => {
		const ordered = rangeMaps.concat().sort((a: RangeMap, b: RangeMap) => a.sourceRangeStart - b.sourceRangeStart)

		return ranges.flatMap((range: Range): Range[] => {
			type Acc = {
				acc: Range[],
				remaining?: Range
			}
			const res: Acc = ordered.reduce((acc: Acc, rangeMap: RangeMap): Acc => {
				if (!acc.remaining) return acc
				const mapped = splitRange(acc.remaining, rangeMap)
				if (mapped.before) acc.acc.push(mapped.before)
				if (mapped.mapped) acc.acc.push(mapped.mapped)
				return {acc: acc.acc, remaining: mapped.after}
			}, {acc: [], remaining: range})
			return res.remaining ? res.acc.concat(res.remaining) : res.acc
		});
		// Optional optimisation: merge ranges before each rangeMap step
	}, ranges)

	return mapped.reduce((a: Range, b: Range) => a.start < b.start ? a : b).start
}

/*
Tested (Y)
const before = (splitRange({start: 1, length: 1}, parseRange('10 5 3')))
const after = (splitRange({start: 10, length: 1}, parseRange('10 5 3')))
const beforeIn = (splitRange({start: 1, length: 7}, parseRange('10 5 3')))
const inside = (splitRange({start: 6, length: 2}, parseRange('10 5 3')))
const insideAfter = (splitRange({start: 6, length: 7}, parseRange('10 5 3')))
const around = (splitRange({start: 0, length: 10}, parseRange('10 5 3')))
*/

console.log(part1(parsedInput))
console.log(part2(parsedInput))