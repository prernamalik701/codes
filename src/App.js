import React, { useState } from 'react';
import './App.css';
import Timeline from './Component/Timeline';

function App() {
    const [sequence, setSequence] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentInstrument, setCurrentInstrument] = useState(null);

    const handlePlay = (instrument) => {
        setCurrentInstrument(instrument);
        playTuneForInstrument(instrument);
    };

    const startPlayback = () => {
        setIsPlaying(true);
        setCurrentInstrument(null);

        playSequence();
    };

    const playSequence = () => {
        sequence.forEach((instrument, index) => {
            setTimeout(() => {
                playTuneForInstrument(instrument);
            }, index * 1000);
        });
    };

    const stopPlayback = () => {
        setIsPlaying(false);
    };

    const addInstrumentToSequence = (instrument) => {
        setSequence([...sequence, instrument]);
    };

    const playTuneForInstrument = (instrument) => {
        const audioContext = new(window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(getFrequencyForInstrument(instrument), audioContext.currentTime);
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1);
    };

    const getFrequencyForInstrument = (instrument) => {
        switch (instrument) {
            case 'Guitar':
                return 700.199;
            case 'Piano':
                return 261.6;
            case 'Drum':
                return 146.8;
            case 'Trumpet':
                return 329.6;
            default:
                return 440.0;
        }
    };

    return ( <
        div className = "App" >
        <
        p className = "main-title" > Camb.ai < /p>

        <
        div className = "instrument-block"
        onClick = {
            () => addInstrumentToSequence('Guitar')
        } >
        Guitar <
        /div> <
        div className = "instrument-block"
        onClick = {
            () => addInstrumentToSequence('Piano')
        } >
        Piano <
        /div> <
        div className = "instrument-block"
        onClick = {
            () => addInstrumentToSequence('Drum')
        } >
        Drum <
        /div> <
        div className = "instrument-block"
        onClick = {
            () => addInstrumentToSequence('Trumpet')
        } >
        Trumpet <
        /div>

        <
        button onClick = { startPlayback }
        disabled = { isPlaying || sequence.length === 0 } >
        Play <
        /button> <
        button onClick = { stopPlayback }
        disabled = {!isPlaying } >
        Stop <
        /button>

        <
        Timeline instruments = { sequence }
        onPlay = { handlePlay }
        isPlaying = { isPlaying }
        />

        {
            currentInstrument && ( <
                div className = "currently-playing" >
                Currently playing: { currentInstrument } <
                /div>
            )
        } <
        /div>
    );
}

export default App;