var React = window.React || require('react')
var ReactDOM = window.ReactDOM || require('react-dom')
var moment = window.moment || require('moment')

const msscalc = require('./msscalc')
const bmi = require('./bmi')

class Calculator extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      age: null,
      sex: '',
      race: '',
      hdl: '',
      sbp: '',
      triglyceride: '',
      glucose: '',
      waist: '',
      weight: '',
      height: '',
      bmiz: '',
      birth: '',
      appointment: moment().format(moment.HTML5_FMT.DATE),
      result: null
    }

    this.handleBack = this.handleBack.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.afterUpdate = this.afterUpdate.bind(this)
  }

  render () {
    let {
      age, sex, race, weight, height, hdl, sbp, triglyceride, glucose, waist, bmiz,
      birth, appointment, result
    } = this.state

    if (result) {
      return (
        <div className="result">
          <h2>Result</h2>
          {result.mets_z_bmi && (
            <p>Z-Score based on Body Mass Index<br />{result.mets_z_bmi}</p>
          )}
          {result.mets_z_wc && (
            <p>Z-Score based on Waistline<br />{result.mets_z_wc}</p>
          )}
          <button onClick={this.handleBack} className="btn btn-primary">Back</button>
        </div>
      )
    }

    const adult = age && age >= 20
    const adolescent = age && age < 20

    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Age</h3>
        <div className="form-group">
          <label htmlFor="birth">Birthdate</label>
          <input className="form-control" type="date" name="birth" value={birth} onChange={this.handleChange}></input>
        </div>
        <div className="form-group">
          <label htmlFor="appointment">Appointment Date</label>
          <input className="form-control" type="date" name="appointment" value={appointment} onChange={this.handleChange}></input>
        </div>
        {age && (
          <div className="form-group">
            <label htmlFor="age">Age (years)</label>
            <input className="form-control" name="age" value={age || ''} readOnly />
          </div>
        )}

        <h3>Demographics</h3>
        <div className="form-group">
          <label htmlFor="sex">Sex</label>
          <div className="input-group btn-group btn-group-toggle" data-toggle="buttons">
            <label className={`btn btn-light ${sex === msscalc.Sex.Female && 'active'}`}
              role="button"
              checked={sex === msscalc.Sex.Female}
              aria-pressed={sex === msscalc.Sex.Female}
              onClick={this.handleClick} onKeyPress={this.handleKeyPress}
            >
              <input type="radio" name="sex" value={msscalc.Sex.Female} autoComplete="off" />
              Female
            </label>
            <label className= {`btn btn-light ${sex === msscalc.Sex.Male && 'active'}`}
              role="button"
              checked={sex === msscalc.Sex.Male}
              aria-pressed={sex === msscalc.Sex.Male}
              onClick={this.handleClick} onKeyPress={this.handleKeyPress}
            >
              <input type="radio" name="sex" value={msscalc.Sex.Male} autoComplete="off" />
              Male
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="race">Race and Ethnicity</label>
          <select className="form-control" name="race" value={race} onChange={this.handleChange}>
            <option value=""></option>
            <option value={msscalc.RaceEthnicity.Hispanic}>Hispanic</option>
            <option value={msscalc.RaceEthnicity.Black}>Non-Hispanic Black</option>
            <option value={msscalc.RaceEthnicity.White}>Non-Hispanic White</option>
          </select>
        </div>

        <h3>Blood pressure</h3>
        <div className="form-group">
          <label htmlFor="sbp">Systolic Blood Pressure (mmHg)</label>
          <input className="form-control" name="sbp" type="number" min="0" step="any" value={sbp} onChange={this.handleChange}></input>
        </div>
        <div className="form-group">
          <label htmlFor="glucose">Fasting Glucose (mg/dL)</label>
          <input className="form-control" name="glucose" type="number" min="0" step="any" value={glucose} onChange={this.handleChange}></input>
        </div>

        <h3>Measurements</h3>
        <div className="form-group">
          <label htmlFor="triglyceride">Trigylcerides (mg/dL)</label>
          <input className="form-control" name="triglyceride" type="number" min="0" step="any" value={triglyceride} onChange={this.handleChange}></input>
        </div>
        <div className="form-group">
          <label htmlFor="hdl"><abbr title="High-density lipoprotein">HDL</abbr> (mg/dL)</label>
          <input className="form-control" name="hdl" type="number" min="0" step="any" value={hdl} onChange={this.handleChange}></input>
        </div>

        <div className="form-group">
          <label htmlFor="weight">Weight (kg)</label>
          <input className="form-control" name="weight" type="number" min="0" step="any" value={weight} onChange={this.handleChange}></input>
          <label htmlFor="height">Height (cm)</label>
          <input className="form-control" name="height" type="number" min="0" step="any" value={height} onChange={this.handleChange}></input>
        </div>
        {adult && (
          <div className="form-group">
            <label htmlFor="waist">Waistline Circumference (cm)</label>
            <input className="form-control" name="waist" type="number" min="0" step="any" value={waist} onChange={this.handleChange}></input>
          </div>
        )}
        {adolescent && (
          <div className="form-group">
            <label htmlFor="bmiz"> BMI Z-Score </label>
            <input className="form-control" name="bmiz" value={bmiz} readOnly />
          </div>
        )}
        <button type="submit" className="btn btn-primary float-right">Calculate</button>
      </form>
    )
  }

  handleBack (event) {
    event.preventDefault()
    this.setState({ result: null })
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value }, this.afterUpdate)
  }

  handleClick (event) {
    const input = event.target.getElementsByTagName('input')[0]
    this.setState({ [input.name]: input.value }, this.afterUpdate)
  }

  handleKeyPress (event) {
    console.log(event.nativeEvent)
  }

  handleSubmit (event) {
    event.preventDefault()

    let { sex, race, hdl, sbp, triglyceride, glucose, waist, birth, appointment, weight, height, bmiz } = this.state

    // @see https://www.nhs.uk/common-health-questions/lifestyle/how-can-i-work-out-my-body-mass-index-bmi/
    let bmi = null
    if (height && weight) {
      const heightMeters = height / 100
      bmi = weight / heightMeters / heightMeters
    }

    const result = msscalc.CalculateMSS({
      age: moment(appointment).diff(moment(birth), 'years'),
      sex,
      race,
      bmi,
      hdl,
      sbp,
      triglyceride,
      glucose,
      bmiZScore: bmiz,
      waist
    })

    this.setState({ result })
  }

  afterUpdate () {
    const { birth, appointment, weight, height, sex } = this.state

    if (!birth || !appointment) {
      return
    }

    const age = moment(appointment).diff(moment(birth), 'years')

    let bmiz = ''
    const adolescent = age < 20
    if (adolescent && height && weight && sex) {
      const agemos = moment(appointment).diff(moment(birth), 'months')
      const sexord = sex === 'MALE' ? bmi.Sex.Male : bmi.Sex.Female
      bmiz = bmi.BMIZscore(weight, height, sexord, agemos)
    }

    this.setState({
      age,
      bmiz
    })
  }
}

ReactDOM.render(<Calculator />, document.getElementById('calculator'))
