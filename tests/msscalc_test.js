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
