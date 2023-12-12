const testInput = `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`.trim().split('\n')

import * as fs from 'fs';
const realInput: string[] = fs.readFileSync('12.in','utf8').trim().split('\n')

const generateOption = (c: string): string[] =>
	c == '?' ? ['.', '#'] : [c]

type Reduce = {
	numbers: number[],
	valid: boolean,
	group: boolean
}

const firstReduce = (numbers: number[]): Reduce => (
	{ numbers, valid: true, group: false }
)

const reduceCharacter = (r: Reduce, c: string): Reduce => {
	if (!r.valid) return r
	if (c == '#') {
		if (r.numbers.length == 0) return { ...r, valid: false }
		if (r.numbers[0] == 0) return { ...r, valid: false }
		return {
			...r,
			group: true,
			numbers: [r.numbers[0] - 1].concat(r.numbers.slice(1))
		}
	}
	if (c == '.') {
		if (r.group && r.numbers[0] > 0) return {
			...r,
			valid: false
		}
		if (r.numbers[0] == 0) return {
			...r,
			numbers: r.numbers.slice(1),
			group: false
		}
		return {
			...r,
			group: false
		}
	}
	return r
}

const isFinalResultValid = (result: Reduce): boolean =>
	result.valid && (result.numbers.length == 0 || (result.group == true && result.numbers.length == 1 && result.numbers[0] == 0))

const isValidOption = (option: string, numbers: number[]): boolean => {
	const result = option.split('').reduce(reduceCharacter, firstReduce(numbers))
	return isFinalResultValid(result)
}

const part1 = (input: string[]): number =>
	input.map((line) => {
		const option: string = line.split(' ')[0]
		const numbers: number[] = line.split(' ')[1].split(',').map((n) => parseInt(n))

		const options = option.split('').map((c) => generateOption(c))
			.reduce((befores: string[], currents: string[]): string[] => 
				befores.flatMap((b) => currents.map(c => b + c))
			)
			.filter(option => isValidOption(option, numbers))

		return options.length
	}).reduce((a, b) => a + b)

const part2 = (input: string[]): number =>
	input.map((line) => {
		const option: string = Array(5).fill(0).map(_ => line.split(' ')[0]).join('?')
		const numbersIn: number[] = line.split(' ')[1].split(',').map((n) => parseInt(n))
		const numbers: number[] = Array(5).fill(0).flatMap(_ => numbersIn)

		type CountReduce = {
			count: number,
			reduce: Reduce
		}

		const numbersCompare = (a: number[], b: number[]) =>
			a.length == b.length && a.every((value, index) => value === b[index])

		const groupBy = (reduces: CountReduce[]): CountReduce[] =>
			reduces.reduce((result: CountReduce[], current: CountReduce) => {
				const existingIndex: number = result.findIndex((v) => 
					v.reduce.group == current.reduce.group && numbersCompare(v.reduce.numbers, current.reduce.numbers)
				)
				if (existingIndex == -1) return result.concat(current)
				else {
					const spliced = result.concat()
					spliced.splice(existingIndex, 1, {...current, count: current.count + result[existingIndex].count})
					return spliced
				}
			}, [])

		const firstResult: CountReduce = {reduce: firstReduce(numbers), count: 1}

		const options = option.split('').map((c) => generateOption(c))
			.reduce((results: CountReduce[], currentChars: string[]): CountReduce[] =>
				groupBy(currentChars.flatMap(c => results.map(
					(r: CountReduce): CountReduce => ({count: r.count, reduce: reduceCharacter(r.reduce, c)}))
				).filter(r => r.reduce.valid))
			, [firstResult])
			.filter(result => isFinalResultValid(result.reduce))

		return options.map(c => c.count).reduce((a, b) => a + b)
	}).reduce((a, b) => a + b)

console.log(part1(realInput))
console.log(part2(realInput))