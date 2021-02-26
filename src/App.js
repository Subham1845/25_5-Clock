import React, { Component } from "react";
import "./styles.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.audioBeep = React.createRef();

    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timeLabel: "Session",
      timeLeftInSecond: 1500,
      isStart: false,
      timerInterval: null,
    };

    this.onIncreaseBreak = this.onIncreaseBreak.bind(this);
    this.onDecreaseBreak = this.onDecreaseBreak.bind(this);
    this.onIncreaseSession = this.onIncreaseSession.bind(this);
    this.onDecreaseSession = this.onDecreaseSession.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onStartStop = this.onStartStop.bind(this);
    this.decreaseTimer = this.decreaseTimer.bind(this);
    this.phaseControl = this.phaseControl.bind(this);
  }

  onIncreaseBreak() {
    if (this.state.breakLength < 60 && !this.state.isStart) {
      this.setState({
        breakLength: this.state.breakLength + 1,
      });
    }
  }

  onDecreaseBreak() {
    if (this.state.breakLength > 1 && !this.state.isStart) {
      this.setState({
        breakLength: this.state.breakLength - 1,
      });
    }
  }

  onIncreaseSession() {
    if (this.state.sessionLength < 60 && !this.state.isStart) {
      this.setState({
        sessionLength: this.state.sessionLength + 1,
        timeLeftInSecond: (this.state.sessionLength + 1) * 60,
      });
    }
  }

  onDecreaseSession() {
    if (this.state.sessionLength > 1 && !this.state.isStart) {
      this.setState({
        sessionLength: this.state.sessionLength - 1,
        timeLeftInSecond: (this.state.sessionLength - 1) * 60,
      });
    }
  }

  onReset() {
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timeLabel: "Session",
      timeLeftInSecond: 1500,
      isStart: false,
      timerInterval: null,
    });

    this.audioBeep.current.pause();
    this.audioBeep.current.currentTime = 0;
    this.state.timerInterval && clearInterval(this.state.timerInterval);
  }

  onStartStop() {
    if (!this.state.isStart) {
      this.setState({
        isStart: !this.state.isStart,
        timerInterval: setInterval(() => {
          this.decreaseTimer();
          this.phaseControl();
        }, 1000),
      });
    } else {
      this.audioBeep.current.pause();
      this.audioBeep.current.currentTime = 0;
      this.state.timerInterval && clearInterval(this.state.timerInterval);

      this.setState({
        isStart: !this.state.isStart,
        timerInterval: null,
      });
    }
  }

  decreaseTimer() {
    this.setState({
      timeLeftInSecond: this.state.timeLeftInSecond - 1,
    });
  }

  phaseControl() {
    if (this.state.timeLeftInSecond === 0) {
      this.audioBeep.current.play();
    } else if (this.state.timeLeftInSecond === -1) {
      if (this.state.timeLabel === "Session") {
        this.setState({
          timeLabel: "Break",
          timeLeftInSecond: this.state.breakLength * 60,
        });
      } else {
        this.setState({
          timeLabel: "Session",
          timeLeftInSecond: this.state.sessionLength * 60,
        });
      }
    }
  }

  render() {
    return (
      <>
        <div class="container">
          <Settings
            breakLength={this.state.breakLength}
            sessionLength={this.state.sessionLength}
            isStart={this.state.isStart}
            onDecreaseBreak={this.onDecreaseBreak}
            onDecreaseSession={this.onDecreaseSession}
            onIncreaseBreak={this.onIncreaseBreak}
            onIncreaseSession={this.onIncreaseSession}
          />

          <Times
            timeLabel={this.state.timeLabel}
            timeLeftInSecond={this.state.timeLeftInSecond}
          />

          <Controller
            onReset={this.onReset}
            onStartStop={this.onStartStop}
            isStart={this.state.isStart}
          />

          <audio
            id="beep"
            preload="auto"
            ref={this.audioBeep}
            src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          ></audio>
        </div>
      </>
    );
  }
}

class Controller extends React.Component {
  render() {
    return (
      <>
        <div className="controller">
          <button id="start_stop" onClick={this.props.onStartStop}>
            {this.props.isStart ? "Stop" : "Start"}
          </button>
          <button id="reset" onClick={this.props.onReset}>
            Reset
          </button>
        </div>
      </>
    );
  }
}

class Settings extends React.Component {
  render() {
    const btnClassName = this.props.isStart ? "disable" : "";

    return (
      <>
        <div className="settings">
          <div className="settings-section">
            <label id="break-label">Break Length</label>
            <div>
              <button
                className={btnClassName}
                id="break-decrement"
                onClick={this.props.onDecreaseBreak}
              >
                -
              </button>
              <span id="break-length">{this.props.breakLength}</span>
              <button
                className={btnClassName}
                id="break-increment"
                onClick={this.props.onIncreaseBreak}
              >
                +
              </button>
            </div>
          </div>
          <div className="settings-section">
            <label id="session-label">Session Length</label>
            <div>
              <button
                className={btnClassName}
                id="session-decrement"
                onClick={this.props.onDecreaseSession}
              >
                -
              </button>
              <span id="session-length">{this.props.sessionLength}</span>
              <button
                className={btnClassName}
                id="session-increment"
                onClick={this.props.onIncreaseSession}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const formatTime = (timeLeftInSecond) => {
  let minute = Math.floor(timeLeftInSecond / 60);
  if (minute < 10) minute = "0" + minute;

  let second = timeLeftInSecond - 60 * minute;
  if (second < 10) second = "0" + second;

  return `${minute}:${second}`;
};

class Times extends React.Component {
  render() {
    return (
      <>
        <div className="times">
          <div className="times-content">
            <label id="timer-label">{this.props.timeLabel}</label>
            <span id="time-left">
              {formatTime(this.props.timeLeftInSecond)}
            </span>
          </div>
        </div>
      </>
    );
  }
}

export default App;
