type Lines = Array<string>

const test_data: Lines = `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`.trim().split('\n')

const test_data2: Lines = `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`.trim().split('\n')

import * as fs from 'fs';
const input_data: Lines = fs.readFileSync('01.in','utf8').trim().split('\n');

const remove_initial_characters = /^[^0-9]*/
const remove_last_characters = /[^0-9]*$/

const part1 = (lines: Lines) => {
	const first_and_last_number = (line: string) => 
		parseInt(line.replace(remove_initial_characters, '')[0]) * 10 +
		parseInt(line.replace(remove_last_characters, '').slice(-1))
	return lines.map(first_and_last_number).reduce((a: number, b: number) => a + b)
}

const digits = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
const first_digit_regex = new RegExp(`(${digits.join('|')})`)
const first_digit_replace = (match: string): string => 
	(digits.indexOf(match) + 1).toString() + match

const reverse = (str: string): string => str.split('').reverse().join('')
const reversed_digits = digits.map(reverse)
const last_digit_regex = new RegExp(`(${reversed_digits.join('|')})`)
const last_digit_replace = (match: string): string => 
	(reversed_digits.indexOf(match) + 1).toString() + match

const part2 = (lines: Lines) => {
	return part1(lines.map((line: string) => 
		reverse(
			reverse(
				line.replace(first_digit_regex, first_digit_replace)
			).replace(last_digit_regex, last_digit_replace)
		)
	))
}

console.log(part1(input_data))
console.log(part2(input_data))