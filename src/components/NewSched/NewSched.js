import React from 'react'
import ScheduleaseContext from '../../ScheduleaseContext'
import './NewSched.css'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import TimeSpanPickerPerDay from "../TimeSpanPickerPerDay/TimeSpanPickerPerDay"
import NewTimeslots from "../NewTimeslots/NewTimeslots"
import { v4 as uuidv4 } from 'uuid'


class NewSched extends React.Component {
    static contextType = ScheduleaseContext
    constructor(props){
        super(props)
        this.state = {
            scheduleName: {
                value: "",
                touched: false
            },
            newRole: {
                value: "",
                touched: false,
            },
            roles: ["Manager", "Employee"],
            duration: "1 hour",
            timeslots: [],
            timeslotTouched: false,
            startDate: '',
            endDate: '',
            days: [
                {
                    value: "Monday",
                    start: {
                        hour: 9,
                        min: 0,
                        ampm: "AM"},
                    end: {
                        hour: 17, 
                        min: 0,
                        ampm: "PM"},
                },
                {
                    value: "Tuesday",
                    start: {
                        hour: 9,
                        min: 0,
                        ampm: "AM"},
                    end: {
                        hour: 17, 
                        min: 0,
                        ampm: "PM"},
                },
                {
                    value: "Wednesday",
                    start: {
                        hour: 9,
                        min: 0,
                        ampm: "AM"},
                    end: {
                        hour: 17, 
                        min: 0,
                        ampm: "PM"},
                },
                {
                    value: "Thursday",
                    start: {
                        hour: 9,
                        min: 0,
                        ampm: "AM"},
                    end: {
                        hour: 17, 
                        min: 0,
                        ampm: "PM"},
                },
                {
                    value: "Friday",
                    start: {
                        hour: 9,
                        min: 0,
                        ampm: "AM"},
                    end: {
                        hour: 17, 
                        min: 0,
                        ampm: "PM"},
                },
                {
                    value: "Saturday",
                    start: {
                        hour: 9,
                        min: 0,
                        ampm: "AM"},
                    end: {
                        hour: 17, 
                        min: 0,
                        ampm: "PM"},
                },
                {
                    value: "Sunday",
                    start: {
                        hour: 9,
                        min: 0,
                        ampm: "AM"},
                    end: {
                        hour: 17, 
                        min: 0,
                        ampm: "PM"},
                },   
            ],
        }
    }

    updateName = (name) => {
        this.setState({ scheduleName: { value: name, touched: true} })
    }

    updateRole = (role) => {
        this.setState({ newRole: { value: role, touched: true} })
    }

    addRole = (role, e) => {
        console.log(role)
        console.log(this.state.roles)
        e.preventDefault()
        this.setState({
            roles: [...this.state.roles, role],
        })
    }

    deleteRole = (role, e) => {
        e.preventDefault()
        const roles = this.state.roles.filter(r =>
            r !== role)
        this.setState({
            roles: roles
        })
    }

    updateDuration = (duration) => {
        this.setState({ duration: duration })
    }

    updateStartDatetime = (value) =>{
        this.setState({ 
            startDate: value
        })
    }

    updateEndDatetime = (value) =>{
        this.setState({ 
            endDate: value
        })
    }

    updateTimeframe = (value) => {
        this.setState({
            days: value
        })
    }

    updateTimeslots = (isChecked, object) => {
        if (isChecked){
            this.setState ({
                timeslots: [...this.state.timeslots, object],
                timeslotTouched: true
            })
        }
        else{
            let tsOtherDays = this.state.timeslots.filter(t =>
                t.day !== object.day)
            let tsThisDay = this.state.timeslots.filter(t =>
                t.day === object.day)
            let tsToKeep = [...tsThisDay.filter(t=> 
                t.time !== object.time), ...tsOtherDays]
            this.setState({
                timeslots: tsToKeep,
                timeslotTouched: true
            })
        } 
    }

    selectAllTimeslots = (isChecked, timeslots) => {
        if (isChecked){
            this.setState ({
                timeslots: [...timeslots],
                timeslotTouched: true
            })
        }
        else {
            this.setState ({
                timeslots: [],
                timeslotTouched: true
            })
        }
    }

    validateSchedName = () => {
        const name = this.state.scheduleName.value.trim()
        const schedsPerUser = this.context.schedules.filter(s =>
            s.user_id === this.props.match.params.userId)
        const dup = schedsPerUser.filter(sched =>
            sched.schedule_name.toUpperCase() === name.toUpperCase())
        if (name.length === 0){
            return "Schedule name is required"
        }
        else if (dup.length !== 0){
            return "Schedule name already exits! Name it something else."
        }
    }

    displaySchedNameWarning = () => {
        const message = this.validateSchedName()
        if (message && this.state.scheduleName.touched === true){
            return "warning"
        }
        else{
            return "hidden"
        }
    }

    validateNewRole = () => {
        let checkDups
        if (this.state.roles[0] !== undefined){
            checkDups = this.state.roles.filter(r =>
                r.toUpperCase() === this.state.newRole.value.toUpperCase())
                if (checkDups.length !== 0){
                    return "Roles must be distinct."
                }
        }
        else if (this.state.newRole.value.trim().length === 0){
            return "You haven't entered a name for your role yet!"
        }
    }

    displayNewRoleWarning = () => {
        const message = this.validateNewRole()
        if (message && this.state.newRole.touched === true){
            return "warning"
        }
        else{
            return "hidden"
        }
    }

    validateRoles = () => {
        if (this.state.roles.length === 0){
            return "Enter at least one role. If you don't need that function, consider naming your role something like 'General'."
        }
    }


    validateDates = () => {
        const start = new Date(this.state.startDate)
        const end = new Date(this.state.endDate)
        if (start.getTime() > end.getTime()){
            return "Start date must be before end date"
        }
        else if (this.state.startDate.length === 0){
            return "Enter a start date"
        }
        else if (this.state.endDate.length === 0){
            return "Endter an end date"
        }
    }


    validateTimeslots = () => {
        if (this.state.timeslots.length === 0){
            return "Select at least one timeslot"
        }
    }

    displayWarnings = (validateFunction) => {
        const message = validateFunction()
        if (message){
            return "warning"
        }
        else{
            return "hidden"
        }
    }

    addMonthAndDate = (newSchedId) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
        const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        let counter = new Date(this.state.startDate)
        let timeslotsToAdd = []
        let dayOfWeek
        while(counter <= new Date(this.state.endDate)){
            dayOfWeek = weekDays[counter.getDay()]
            console.log(dayOfWeek)
            this.state.timeslots.filter(ts => ts.day === dayOfWeek)
                .forEach(ts => timeslotsToAdd.push(
                    {
                    "schedule_id": newSchedId,
                    "timeslot": ts.time,
                    "day": ts.day + ", " + months[counter.getMonth()] + " " + counter.getDate()
                }))
            counter.setDate(counter.getDate() +1)
        }
        return(timeslotsToAdd)
        
    }

    handleSubmit = (e, callback) => {
        e.preventDefault()
        const newSchedId = uuidv4()
        const scheduleToAdd = {
            "id": newSchedId,
            "schedule_name": this.state.scheduleName.value,
            "user_id": this.props.match.params.userId,
            "status": "open",
            "responses": 0,
            "startDate:": this.state.startDate,
            "endDate": this.state.endDate,
            "meeting_duration": this.state.duration
        }
        let rolesToAdd = []
        this.state.roles.map(role => 
            rolesToAdd.push({
                "schedule_id": newSchedId,
                "role": role,
            }))
        let timeslotsToAdd = this.addMonthAndDate(newSchedId)
        console.log(timeslotsToAdd)
        callback(scheduleToAdd, rolesToAdd, timeslotsToAdd)
        this.props.history.push(`/dashboard/schedule-list/${this.props.match.params.userId}`)
    }

    render(){
        return(
            <div className='new-schedule'>
                <form
                    onSubmit={e => {this.handleSubmit(e, this.context.addSchedule)}}>
                        
                    <label htmlFor='sched-name'>Schedule name:</label>
                    <input  
                        type='text'
                        name='sched-name'
                        onChange={e => this.updateName(e.target.value)}/>
                    <span className={this.displaySchedNameWarning()}>{this.validateSchedName()}</span> 
                    <br/>
                    <label htmlFor='roles-input'>Roles:</label>
                    <input 
                        type='text' 
                        name='roles-input'
                        onChange={e => this.updateRole(e.target.value)}/>
                    <button 
                        disabled={this.validateNewRole()}
                        onClick={(e) => this.addRole(this.state.newRole.value, e)}>
                        Add Role
                    </button>
                    <span className={this.displayNewRoleWarning()}>
                        {this.validateNewRole()}
                    </span> 
                    <ul>
                        {this.state.roles.map(role =>
                            <li key={role}>{role} 
                            <button 
                                onClick={e => this.deleteRole(role, e)}>
                                Delete
                            </button></li>
                        )}
                    </ul>
                    <span className={this.displayWarnings(this.validateRoles)}>
                        {this.validateRoles()}
                    </span> 
                    <br/>

                    <label htmlFor='meeting-duration'>Meeting duration:</label>
                    <select
                        defaultValue="1 hour"
                        onChange={e => this.updateDuration(e.target.value)}>
                        <option>15 minutes</option>
                        <option>30 minutes</option>
                        <option>45 minutes</option>
                        <option>1 hour</option>
                    </select>
                    <br/>
                    <label htmlFor="timeframe">Select a timeframe to use:</label>
                    <div name='timeframe'>
                        <label>Start:</label>
                        <DatePicker 
                            selected={this.state.startDate} 
                            onChange={this.updateStartDatetime}
                        />
                        

                        <br />
                        <label>End:</label>
                        <DatePicker 
                            selected={this.state.endDate} 
                            onChange={this.updateEndDatetime}/>
                        <br />
                        <span className={this.displayWarnings(this.validateDates)}>
                            {this.validateDates()}
                        </span> 
                        <br />
                        <TimeSpanPickerPerDay 
                            updateTimeframe={this.updateTimeframe}
                            days={this.state.days}/>

                    </div>
                    
                    <label htmlFor='Avail'>Select Available Timeslots</label>
                    <br/>
                    <span className={this.displayWarnings(this.validateTimeslots)}>
                        {this.validateTimeslots()}
                    </span> 

                    <NewTimeslots 
                        days={this.state.days}
                        timeslotsState={this.state.timeslots}
                        duration={this.state.duration}
                        updateTimeslots={this.updateTimeslots}
                        selectAllTimeslots={this.selectAllTimeslots}
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                    />
                    
                    <button 
                        type='submit'
                        disabled={
                            this.validateSchedName() ||
                            this.validateRoles() ||
                            this.validateDates() ||
                            this.validateTimeslots()
                        }
                    >
                        Create Schedule
                    </button>
                    <br/>
                </form>
            </div>
        )
    }
}

export default withRouter(NewSched)

NewSched.propTypes = {
    history: PropTypes.object.isRequired
}


