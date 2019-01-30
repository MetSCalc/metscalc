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

const msscalc = require('../src/msscalc')
const test = require('tape')

test('test non-hispanic, black, adult, female', function (t) {
  const person = {
    age: 23,
    race: msscalc.RaceEthnicity.Black,
    sex: msscalc.Sex.Female
  }
  t.equal(msscalc.CalculateMSS(person), 1.23)
  t.end()
})
