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

/* METS Calculator
 * Command Line Interface
 *
 * TODO: better argument handling
 */

const path = require('path')
const msscalc = require('./msscalc')

function main () {
  let [, progname, ...args] = process.argv
  progname = path.basename(progname)

  // age, sex, race, bmi, hdl, sbp, triglyceride, glucose, bmiZScore, waist
  const details = {}

  if (args.length < 1) {
    console.log('Usage: node', progname, 'age=<age> sex=FEMALE|MALE race=BLACK|HISPANIC|WHITE bmi=<bmi> hdl=<hdl> sbp=<sbp> triglyceride=<tri> glucose=<glucose> bmiZScore=<bmiz> waist=<waist>')
    console.log('\nCalculates the Metabolic Syndrome Severity score based on the given inputs.\n')
    console.log('All the arguments are case-sensitive and most of their values')
    console.log('must be numbers (except sex and race).')
    return
  }

  args.forEach(pair => {
    const [key, value] = pair.split('=')
    const num = parseFloat(value)
    details[key] = isNaN(num) ? value : num
  })

  // console.log("%j", details)
  console.log(msscalc.CalculateMSS(details))
}

main()
