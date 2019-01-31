/*
   Copyright 2019 University of Florida

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

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

