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
const msscalc = require('../src/msscalc')
const test = require('tape')

const cases = [
  {
    bmiZScore: 1.3388313623928048,
    'hdl': 47,
    'height': 143.5,
    'sex': 'MALE',
    'age': 13,
    'sbp': 110,
    'race': 'HISPANIC',
    'mets_z_bmi': 0.488099,
    mets_z_wc: '',
    'waist': 76.4,
    'triglyceride': 94,
    'weight': 48,
    'glucose': 93.07662
  },
  {
    bmiZScore: 0.32010601882928535,
    'glucose': 102.9165,
    'triglyceride': 52,
    'weight': 58.1,
    'sbp': 107.3333,
    'race': 'HISPANIC',
    'mets_z_bmi': '-0.33964',
    mets_z_wc: '',
    'waist': 87.5,
    'height': 160.1,
    'hdl': 54,
    'sex': 'FEMALE',
    'age': 19
  },
  {
    bmiZScore: 0.6803390791459352,
    'glucose': 100.6072,
    'triglyceride': 76,
    'weight': 65,
    'waist': 76.5,
    mets_z_wc: '',
    'mets_z_bmi': 0.38623,
    'race': 'WHITE',
    'sbp': 108,
    'age': 15,
    'sex': 'MALE',
    'hdl': 40,
    'height': 171.9
  },
  {
    bmiZScore: 0.9794850777865289,
    'mets_z_bmi': '-0.39342',
    mets_z_wc: '',
    'waist': 90,
    'sbp': 100.6667,
    'race': 'BLACK',
    'sex': 'FEMALE',
    'age': 18,
    'hdl': 68,
    'height': 167.7,
    'glucose': 67.67353,
    'triglyceride': 103,
    'weight': 71.3
  },
  {
    'age': 23,
    'sex': 'FEMALE',
    'hdl': 43,
    'height': 158.9,
    'waist': 81,
    'mets_z_wc': '-0.07672',
    'mets_z_bmi': '-0.0238',
    'race': 'HISPANIC',
    'sbp': 102.6667,
    'weight': 59.8,
    'triglyceride': 117,
    'glucose': 95.28558
  },
  {
    'race': 'WHITE',
    'sbp': 119.3333,
    'waist': 110.4,
    'mets_z_wc': 0.274626,
    'mets_z_bmi': 0.164624,
    'hdl': 46,
    'height': 172.6,
    'age': 39,
    'sex': 'MALE',
    'glucose': 110.6479,
    'weight': 88.6,
    'triglyceride': 97
  },
  {
    'glucose': 107.8365,
    'weight': 83.3,
    'triglyceride': 108,
    'mets_z_wc': 0.180919,
    'mets_z_bmi': 0.228039,
    'waist': 83.6,
    'sbp': 132.6667,
    'race': 'BLACK',
    'sex': 'MALE',
    'age': 22,
    'height': 193.5,
    'hdl': 36
  },
  {
    'age': 43,
    'sex': 'MALE',
    'height': 170.9,
    'hdl': 45,
    'waist': 88.1,
    'mets_z_wc': '-0.50851',
    'mets_z_bmi': '-0.47154',
    'race': 'HISPANIC',
    'sbp': 113.3333,
    'triglyceride': 62,
    'weight': 70.5,
    'glucose': 100.306
  },
  {
    'glucose': 91.77132,
    'triglyceride': 249,
    'weight': 71.2,
    'mets_z_bmi': 0.142653,
    'mets_z_wc': 0.43294,
    'waist': 102.4,
    'sbp': 117.3333,
    'race': 'WHITE',
    'sex': 'FEMALE',
    'age': 58,
    'height': 162.7,
    'hdl': 71
  },
  {
    'sbp': 118,
    'race': 'BLACK',
    'mets_z_bmi': '-0.45297',
    'mets_z_wc': '-0.44722',
    'waist': 88.6,
    'height': 178.9,
    'hdl': 51,
    'sex': 'MALE',
    'age': 44,
    'glucose': 100.5068,
    'triglyceride': 65,
    'weight': 79.8
  },
  {
    'weight': 72.1,
    'triglyceride': 210,
    'glucose': 146.7946,
    'age': 61,
    'sex': 'FEMALE',
    'height': 176.3,
    'hdl': 66,
    'waist': 91,
    'mets_z_bmi': 1.289268,
    'mets_z_wc': 1.371423,
    'race': 'HISPANIC',
    'sbp': 110.6667
  },
  {
    'triglyceride': 181,
    'weight': 95,
    'glucose': 107.6357,
    'height': 176,
    'hdl': 38,
    'age': 85,
    'sex': 'MALE',
    'race': 'WHITE',
    'sbp': 168,
    'waist': 119.7,
    'mets_z_wc': 1.302729,
    'mets_z_bmi': 1.09538
  },
  {
    'glucose': 114.0618,
    'triglyceride': 125,
    'weight': 68.2,
    'waist': 99.4,
    'mets_z_wc': 0.906364,
    'mets_z_bmi': 0.822064,
    'race': 'BLACK',
    'sbp': 135,
    'age': 78,
    'sex': 'FEMALE',
    'hdl': 39,
    'height': 159.2
  }
].map(data => Object.assign(data, {
  bmi: bmi.BMIAdult(data.weight, data.height / 100)
}))

function nearlyEqual (expected, actual, errorMargin = 0.0025) {
  return Math.abs(expected - actual) < errorMargin
}

cases.forEach(data => {
  const testname = `test ${data.age < 20 ? 'CHILD' : 'ADULT'} ${data.race} ${data.sex}`
  test(testname, function (t) {
    const results = msscalc.CalculateMSS(data)
    if (data.mets_z_wc === '') {
      t.true(!results.mets_z_wc, 'No MetS WC for child')
    } else {
      t.true(nearlyEqual(data.mets_z_wc, results.mets_z_wc), `${data.mets_z_wc} ~= ${results.mets_z_wc}`)
    }

    t.true(nearlyEqual(data.mets_z_bmi, results.mets_z_bmi), `${data.mets_z_bmi} ~= ${results.mets_z_bmi}`)
    t.end()
  })
})
