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
        <ButtonGroup
          name="sex" label="Sex" value={sex} options={msscalc.Sex}
          onClick={this.handleClick}
        />
        <ButtonGroup
          name="race" label="Race and Ethnicity" value={race} options={{
            'Hispanic': msscalc.RaceEthnicity.Hispanic,
            'Non-Hispanic Black': msscalc.RaceEthnicity.Black,
            'Non-Hispanic White': msscalc.RaceEthnicity.White
          }}
          onClick={this.handleClick}
        />

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
    let input

    switch (event.target.tagName.toLowerCase()) {
      case 'input':
        input = event.target
        break

      case 'label':
        input = event.target.getElementsByTagName('input')[0]
        break
    }

    if (!input) {
      return
    }

    this.setState({ [input.name]: input.value }, this.afterUpdate)
  }

  handleSubmit (event) {
    event.preventDefault()

    let { sex, race, hdl, sbp, triglyceride, glucose, waist, birth, appointment, weight, height, bmiz } = this.state

    let bmiadult = null
    if (height && weight) {
      const heightMeters = height / 100
      bmiadult = bmi.BMIAdult(weight, heightMeters)
    }

    const result = msscalc.CalculateMSS({
      age: moment(appointment).diff(moment(birth), 'years'),
      sex,
      race,
      bmi: bmiadult,
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

function ButtonGroup (props) {
  const { name, label, options, value, onClick, onKeyPress } = props

  if (!options || options.length === 0) {
    return null
  }

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <div className="input-group btn-group btn-group-toggle" data-toggle="buttons">
        {Object.keys(options).map(label => (
          <Button key={label}
            group={name} label={label} value={options[label]}
            pressed={value === options[label]}
            onClick={onClick} onKeyPress={onKeyPress}
          />
        ))}
      </div>
    </div>
  )
}

function Button (props) {
  const { group, label, pressed, value, onClick, onKeyPress } = props

  return (
    <label className= {`btn btn-light ${pressed ? 'active' : ''}`}
      role="button"
      checked={pressed}
      aria-pressed={pressed}
      onClick={onClick} onKeyPress={onKeyPress}
    >
      <input type="radio" name={group} value={value} autoComplete="off" /> {label}
    </label>
  )
}

ReactDOM.render(<Calculator />, document.getElementById('calculator'))
