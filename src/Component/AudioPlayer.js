import React, { useState, useRef } from 'react';
import Dropzone from 'react-dropzone';

const AudioPlayer = () => {
    const [tracks, setTracks] = useState([{ id: 1, audioFiles: [] }]);
    const audioPlayerRef = useRef(null);

    const handleDrop = (acceptedFiles, trackId) => {

        setTracks((prevTracks) => {
            const updatedTracks = [...prevTracks];
            const trackIndex = updatedTracks.findIndex((track) => track.id === trackId);
            updatedTracks[trackIndex].audioFiles = [...updatedTracks[trackIndex].audioFiles, ...acceptedFiles];
            return updatedTracks;
        });
    };

    const handleRemove = (trackId, fileIndex) => {

        setTracks((prevTracks) => {
            const updatedTracks = [...prevTracks];
            const trackIndex = updatedTracks.findIndex((track) => track.id === trackId);
            updatedTracks[trackIndex].audioFiles.splice(fileIndex, 1);
            return updatedTracks;
        });
    };

    const handleMove = (trackId, fromIndex, toIndex) => {

        setTracks((prevTracks) => {
            const updatedTracks = [...prevTracks];
            const trackIndex = updatedTracks.findIndex((track) => track.id === trackId);
            const [movedFile] = updatedTracks[trackIndex].audioFiles.splice(fromIndex, 1);
            updatedTracks[trackIndex].audioFiles.splice(toIndex, 0, movedFile);
            return updatedTracks;
        });
    };

    const handlePlay = (trackId) => {

        if (audioPlayerRef.current) {
            const audioContext = new AudioContext();
            const audioSource = audioContext.createBufferSource();

            const track = tracks.find((track) => track.id === trackId);
            if (!track || track.audioFiles.length === 0) {
                console.warn('No audio files in the track');
                return;
            }

            const audioBuffer = new Float32Array(track.audioFiles.length);
            const audioPromiseArray = track.audioFiles.map((file, index) =>
                file.arrayBuffer().then((buffer) => audioContext.decodeAudioData(buffer))
            );

            Promise.all(audioPromiseArray)
                .then((audioBuffers) => {
                    audioBuffers.forEach((buffer, index) => {
                        audioBuffer.set(buffer.getChannelData(0), index);
                    });

                    const finalBuffer = audioContext.createBuffer(1, audioBuffer.length, audioContext.sampleRate);
                    finalBuffer.getChannelData(0).set(audioBuffer);

                    audioSource.buffer = finalBuffer;
                    audioSource.connect(audioContext.destination);
                    audioSource.start();
                })
                .catch((error) => console.error('Error decoding audio:', error));
        }
    };

    const addTrack = () => {

        setTracks((prevTracks) => [
            ...prevTracks,
            { id: Date.now(), audioFiles: [] }
        ]);
    };

    return ( <
        div >
        <
        h1 > Audio Player < /h1>

        {
            tracks.map((track) => ( <
                    div key = { track.id } >
                    <
                    h2 > Track { track.id } < /h2> <
                    Dropzone onDrop = {
                        (acceptedFiles) => handleDrop(acceptedFiles, track.id)
                    }
                    accept = "audio/*" > {
                        ({ getRootProps, getInputProps }) => ( <
                            div {...getRootProps() }
                            style = { dropzoneStyles } >
                            <
                            input {...getInputProps() }
                            /> <
                            p > Drag 'n'
                            drop some audio files here, or click to select files < /p> < /
                            div >
                        )
                    } <
                    /Dropzone>

                    <
                    div >
                    <
                    h3 > Timeline < /h3> <
                    ul > {
                        track.audioFiles.map((file, index) => ( <
                                li key = { index } > { file.name } <
                                button onClick = {
                                    () => handleRemove(track.id, index)
                                } > Remove < /button> {
                                index > 0 && ( <
                                    button onClick = {
                                        () => handleMove(track.id, index, index - 1)
                                    } > Move Up < /button>
                                )
                            } {
                                index < track.audioFiles.length - 1 && ( <
                                    button onClick = {
                                        () => handleMove(track.id, index, index + 1)
                                    } > Move Down < /button>
                                )
                            } <
                            /li>
                        ))
                } <
                /ul> < /
                div >

                <
                div >
                <
                h3 > Playback Controls < /h3> <
                button onClick = {
                    () => handlePlay(track.id)
                } > Play < /button> < /
                div > <
                /div>
            ))
    }

    <
    div >
        <
        button onClick = { addTrack } > Add Track < /button> < /
    div >

        <
        audio ref = { audioPlayerRef }
    style = {
        { display: 'none' }
    }
    /> < /
    div >
);
};

const dropzoneStyles = {
    border: '2px dashed #ccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
};

export default AudioPlayer;