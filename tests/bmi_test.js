const bmi = require('../src/bmi')
const test = require('tape')

function nearlyEqual (a, b, margin = 0.001) {
  return a - b < margin
}

test('test boy 120 months', function (t) {
  const age = 10 * 12
  const sex = bmi.Sex.Male
  const weight = 30 // kg
  const height = 1.36 // m
  t.true(nearlyEqual(bmi.BMIZscore(weight, height, sex, age), -0.22, 0.001))
  t.end()
})

test('test boy 120.1 months', function (t) {
  const age = 10.1 * 12
  const sex = bmi.Sex.Male
  const weight = 30 // kg
  const height = 1.36 // m
  t.true(nearlyEqual(bmi.BMIZscore(weight, height, sex, age), -0.22, 0.001))
  t.end()
})

test('test girl 24 months', function (t) {
  t.fail('TODO: write this edge case 24 months exactly')
  t.end()
})
