import React, { useContext, useEffect, useState } from 'react';
import { ResultsContext } from '../managers/ExercisesManager';
import Keyboard from '../components/keyboard/Keyboard';
import ControlPanel from '../components/controlpanel/ControlPanel';
import { ExerciseContext } from '../managers/ExercisesManager';
import SoundGenerator from '../generators/SoundGenerator';
import { GlobalSettingsContext } from '../managers/GlobalSettingsManager';
import chordTypes from './ChordTypes';
import Alert from '../components/overlays/alert/Alert';
import Ranges from '../components/overlays/ranges/Ranges';
import { OverlaysContext } from '../managers/OverlaysManager';

function ChordExercise({type}) {
    const exerciseNames = {
        'triads': 'Trójdźwięk',
        'sevenths': 'Akord z septymą',
        'ninths': 'Akord z noną',
        'elevenths': 'Akord z undecymą',
        'thirteenths': 'Akord z tercdecymą',
        'random': 'Akord przypadkowy'
    };
    const exerciseName = exerciseNames[type] || '???';
    const { updateNotesResults, updateExamplesResults,
        resetNotesResults, resetExamplesResults } = useContext(ResultsContext);
    const [generatedChord, setGeneratedChord] = useState([0]);
    const [playedChord, setPlayedChord] = useState([]);
    const [markedNotes, setMarkedNotes] = useState([]);
    const { showOverlay, showAlert } = useContext(OverlaysContext);

    const enabledComponents = ['startreset', 'exit', 'next', 'repeat', 'undo', 'hint', 'notespacing', 'notelength'];
    const { effectiveScale, enabledChords, enabledInversions } = useContext(GlobalSettingsContext);
    // eslint-disable-next-line
    const possibleChords = React.useMemo(() => {
        if (type==='random') return [0];
        return calculatePossibleChords(effectiveScale, enabledChords[type], enabledInversions[type]);
    }, [effectiveScale, enabledChords, enabledInversions, type]);

    useEffect(() => {
        if (possibleChords.length === 0) {
            showAlert(<Alert text="Wybrana skala nie zawiera żadnego akordu. Wybierz skalę ponownie." />);
            showOverlay(<Ranges/>);
        }
    }, [possibleChords, showAlert, showOverlay]);
    const keyRange = React.useMemo(() => ({ low: effectiveScale[0], high: effectiveScale[effectiveScale.length - 1] }), [effectiveScale]);
    const [noteSpacing, setNoteSpacing] = useState(50);
    const [noteLength, setNoteLength] = useState(50);

    const soundGenerator = new SoundGenerator();

    // one time effect on render
    useEffect(() => {
        startExercise();
        // eslint-disable-next-line
    }, []);

    const startExercise = () => {
        resetNotesResults();
        resetExamplesResults();
        nextExample();
    }

    const playChord = (chord) => {
        console.log('Playing chord', chord);
        soundGenerator.playSimultaneously(chord, noteSpacing * 10 + 50, noteLength / 50 + 0.02);
    }

    const nextExample = () => {
        const randomChord = (() => {
            if (type === 'random') {
                const randomLength = enabledChords['random'][Math.floor(Math.random() * enabledChords['random'].length)];
                const randomChord = [];
                for (let i = 0; i < randomLength; i++) {
                    let randomNote;
                    do {
                        randomNote = Math.floor(Math.random() * 12) + effectiveScale[0];
                    } while (randomChord.includes(randomNote));
                    randomChord.push(randomNote);
                }
                return randomChord;
            } else {
                return possibleChords[Math.floor(Math.random() * possibleChords.length)];
            }
        })();
        console.log(randomChord)
        randomChord.sort((a, b) => a - b);
        if (randomChord.toString() === generatedChord.toString()) return nextExample();
        setGeneratedChord(randomChord);
        setMarkedNotes([randomChord[0]]);
        playChord(randomChord);
    }

    const repeatExample = () => {
        playChord(generatedChord);
    }

    const handleNotePlayed = (midiNote) => {
        setPlayedChord([...playedChord, midiNote]);
        updateNotesResults(generatedChord.includes(midiNote));
    };

    const undoNote = () => {
        setPlayedChord(playedChord.slice(0, -1));
    }

    const showHint = () => {
        if (markedNotes.length === generatedChord.length) return;
        setMarkedNotes([...markedNotes, generatedChord[markedNotes.length]]);
    }

    useEffect(() => {
        if (playedChord.length === generatedChord.length) {
            const isCorrect = playedChord.sort().toString() === generatedChord.sort().toString();
            updateExamplesResults(isCorrect);
            setPlayedChord([]);
            if (isCorrect) setTimeout(() => nextExample(), 500) 
            else {
                setTimeout(() => repeatExample(), 500)
            }
        }
        // disabling because the lack of better solution
        // eslint-disable-next-line
    }, [playedChord]);
    
    function calculatePossibleChords(effectiveScale, enabledChords, enabledInversions) {

        let options = chordTypes[type];
        options = Object.keys(options)
        .filter(chordType => enabledChords.includes(chordType))
        .reduce((arr, key) => {
            Object.keys(options[key])
                .filter(inversion => enabledInversions.includes(parseInt(inversion)))
                .forEach(invKey => {
                arr.push(options[key][invKey]);
                });
            return arr;
            }, []);

        const chords = [];
        for (let i = 0; i < effectiveScale.length; i++) {
            options.forEach(option => {
                const root = effectiveScale[i];
                const chord = option.reduce((acc, interval) => {
                    const lastNote = acc[acc.length - 1] || root;
                    acc.push(lastNote + interval);
                    return acc;
                }, [root]);
                if (chord.every(note => effectiveScale.includes(note))) chords.push(chord);                        
            });
        }
        console.log(chords)
        return chords;
    }

    return (
        <ExerciseContext.Provider value={{exerciseName, enabledComponents, keyRange, markedNotes, startExercise, nextExample, repeatExample, undoNote, showHint, setNoteSpacing, setNoteLength}}>
            <Keyboard onNotePlayed={handleNotePlayed} context={ExerciseContext} />
            <ControlPanel/>
        </ExerciseContext.Provider>
    );
}

export default ChordExercise;
