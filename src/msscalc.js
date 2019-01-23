const assert = require('assert')

const RaceEthnicity = {
  Black: 'BLACK',
  Hispanic: 'HISPANIC',
  White: 'WHITE'
}

const Sex = {
  Female: 'FEMALE',
  Male: 'MALE'
}

function CalculateMSS (args) {
  const { log } = Math

  assert(args, 'missing all arguments')

  let { age, sex, race, bmi, hdl, sbp, triglyceride, glucose, bmiZScore, waist } = args

  age = parseInt(args.age)
  assert(age >= 0, 'age must be a non-negative integer')
  assert(Object.keys(Sex).some(s => Sex[s] === sex), 'sex must be FEMALE or MALE')
  assert(Object.keys(RaceEthnicity).some(r => RaceEthnicity[r] === race), 'race must be BLACK, HISPANIC, or WHITE')

  if (age >= 20) {
    /* Adults */
    if (sex === Sex.Female) {
      switch (race) {
        case RaceEthnicity.Black:
          return {
            mets_z_bmi: bmi ? -6.7982 + 0.0484 * bmi - 0.0108 * hdl + 0.0073 * sbp + 0.5278 * log(triglyceride) + 0.0281 * glucose : null,
            mets_z_wc: waist ? (-7.1913 + 0.0304 * waist - 0.0095 * hdl + 0.0054 * sbp + 0.4455 * log(triglyceride) + 0.0225 * glucose) : null
          }
        case RaceEthnicity.Hispanic:
          return {
            mets_z_bmi: bmi ? -7.1844 + 0.0333 * bmi - 0.0166 * hdl + 0.0085 * sbp + 0.8625 * log(triglyceride) + 0.0221 * glucose : null,
            mets_z_wc: waist ? (-7.7641 + 0.0162 * waist - 0.0157 * hdl + 0.0084 * sbp + 0.8872 * log(triglyceride) + 0.0206 * glucose) : null
          }
        case RaceEthnicity.White:
          return {
            mets_z_bmi: bmi ? -6.5231 + 0.0523 * bmi - 0.0138 * hdl + 0.0081 * sbp + 0.6125 * log(triglyceride) + 0.0208 * glucose : null,
            mets_z_wc: waist ? (-7.2591 + 0.0254 * waist - 0.0120 * hdl + 0.0075 * sbp + 0.5800 * log(triglyceride) + 0.0203 * glucose) : null
          }
      }
    }

    /* Male */
    switch (race) {
      case RaceEthnicity.Black:
        // Adult Male Black Non-Hispanic
        return {
          mets_z_bmi: bmi ? -4.8134 + 0.0460 * bmi - 0.0233 * hdl + 0.0020 * sbp + 0.5983 * log(triglyceride) + 0.0166 * glucose : null,
          mets_z_wc: waist ? (-6.3767 + 0.0232 * waist - 0.0175 * hdl + 0.0040 * sbp + 0.5400 * log(triglyceride) + 0.0203 * glucose) : null
        }
      case RaceEthnicity.Hispanic:
        // Adult Male Hispanic
        return {
          mets_z_bmi: bmi ? -4.8198 + 0.0355 * bmi - 0.0303 * hdl + 0.0051 * sbp + 0.7835 * log(triglyceride) + 0.0104 * glucose : null,
          mets_z_wc: waist ? (-5.5541 + 0.0135 * waist - 0.0278 * hdl + 0.0054 * sbp + 0.8340 * log(triglyceride) + 0.0105 * glucose) : null
        }
      case RaceEthnicity.White:
        // Adult Male White Non-Hispanic
        return {
          mets_z_bmi: bmi ? -4.8316 + 0.0315 * bmi - 0.0272 * hdl + 0.0044 * sbp + 0.8018 * log(triglyceride) + 0.0101 * glucose : null,
          mets_z_wc: waist ? (-5.4559 + 0.0125 * waist - 0.0251 * hdl + 0.0047 * sbp + 0.8244 * log(triglyceride) + 0.0106 * glucose) : null
        }
    }
  }

  /* Adolescents */
  if (sex === Sex.Female) {
    switch (race) {
      case RaceEthnicity.Black:
        return {
          mets_z_bmi: bmiZScore ? -3.7145 + 0.5136 * bmiZScore - 0.0190 * hdl + 0.0131 * sbp + 0.4442 * log(triglyceride) + 0.0108 * glucose : null
        }
      case RaceEthnicity.Hispanic:
        return {
          mets_z_bmi: bmiZScore ? -4.7637 + 0.3520 * bmiZScore - 0.0263 * hdl + 0.0152 * sbp + 0.6910 * log(triglyceride) + 0.0133 * glucose : null
        }
      case RaceEthnicity.White:
        return {
          mets_z_bmi: bmiZScore ? -4.3757 + 0.4849 * bmiZScore - 0.0176 * hdl + 0.0257 * sbp + 0.3172 * log(triglyceride) + 0.0083 * glucose : null
        }
    }
  }

  /* Male */
  switch (race) {
    case RaceEthnicity.Black:
      return {
        mets_z_bmi: -4.7544 + 0.2401 * bmiZScore - 0.0284 * hdl + 0.0134 * sbp + 0.6773 * log(triglyceride) + 0.0179 * glucose
      }
    case RaceEthnicity.Hispanic:
      return {
        mets_z_bmi: -3.2971 + 0.2930 * bmiZScore - 0.0315 * hdl + 0.0109 * sbp + 0.6137 * log(triglyceride) + 0.0095 * glucose
      }
    case RaceEthnicity.White:
      return {
        mets_z_bmi: -4.931 + 0.2804 * bmiZScore - 0.0257 * hdl + 0.0189 * sbp + 0.6240 * log(triglyceride) + 0.0140 * glucose
      }
  }
}

// Percentile calculates the percentile from the specified z-score, z. This can
// be used for both the BMI and MetS percenitles.
// https://github.com/travm/ZMI/blob/5340e9d194cc716dd4cf9ff7b5ae479e915798a5/app/js/zmi.js +194
function Percentile (z) {
  return 100 * (1 / (1 + Math.exp(-0.07056 * Math.pow(z, 3) - (1.5976 * z))))
}

module.exports = {
  CalculateMSS,
  Percentile,
  RaceEthnicity,
  Sex
}
