import React from 'react';
import './App.css'
import {activeStyle, inactiveStyle, myButtons} from "./constants";
//Display
const Display = props => {
    return (
        <div id="display">
            <span> {props.text} </span>
        </div>
    );
}

//DrumMachine
class DrumMachine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayText: 'Tap pad to start!'
        }
        this.updateDisplay = this.updateDisplay.bind(this)
    }

    updateDisplay(text) {
        this.setState({
            displayText: text
        })
    }

    render() {
        return (
            <div id="drum-machine">
                <Display text={this.state.displayText}/>
                <PadBank updateDisplay={this.updateDisplay}/>

            </div>
        )
    }
}

//PadBank
const PadBank = props => {
    const padBank = myButtons.map((drumObj, i, padBankArr) => {
        return (
            <DrumPad
                key={padBankArr[i].id}
                padId={padBankArr[i].id}
                soundUrl={padBankArr[i].url}
                keyTrigger={padBankArr[i].keyTrigger}
                updateDisplay={props.updateDisplay}
            />
        )
    })

    return (
        <div className="pad-bank">
            {padBank}
        </div>
    )
}

//DrumPad
class DrumPad extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            padStyle: inactiveStyle
        }
        this.playSound = this.playSound.bind(this)
        this.changeStyle = this.changeStyle.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
    }

    handleKeyPress(e) {
        if (String.fromCharCode(e.keyCode) === this.props.keyTrigger) {
            this.playSound();
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }

    changeStyle() {
        this.setState(state => {
            let nextStyle = state.padStyle === activeStyle ? inactiveStyle : activeStyle
            return {padStyle: nextStyle}
        })
    }

    playSound() {
        const sound = document.getElementById(this.props.keyTrigger);
        sound.currentTime = 0;
        sound.play();
        this.changeStyle();
        setTimeout(() => this.changeStyle(), 200);
        this.props.updateDisplay(this.props.padId.replace(/-/g, ' '));
    }

    render() {
        return (
            <div id={this.props.padId} className="drum-pad"
                 onClick={this.playSound}
                 style={this.state.padStyle}>
                <audio className='clip' id={this.props.keyTrigger} src={this.props.soundUrl}/>
                {this.props.keyTrigger}
            </div>
        );
    }
}


export default DrumMachine;