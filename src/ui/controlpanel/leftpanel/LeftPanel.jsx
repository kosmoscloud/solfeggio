import React from "react";

import { ResultsContext } from "../../../managers/ExerciseLayer.jsx";
import { ExerciseContext } from "../../../managers/ExerciseLayer.jsx";
import { LanguageContext } from "../../../managers/UILayer.jsx";

import Button from "../../../components/button/Button.jsx";
import Grid from "../../../components/grid/Grid.jsx";
import Row from "../../../components/table/row/Row.jsx";
import Results from "../../results/Results.jsx";

import "./style.css";

function LeftPanel() {
    const { hasStarted, startExercise, nextExample, repeatExample, undoNote, showHint, openSettings, returnToMenu } = React.useContext(ExerciseContext);
    const { resetNotesResults, resetExamplesResults } = React.useContext(ResultsContext);
    const { dictionary } = React.useContext(LanguageContext);

    return <div className="left-panel">
            <Grid dimx={2} dimy={3}>
                {/* this is ALWAYS enabled, as the user should always be able to reset the exercise */}
                <Button label={dictionary.startreset.toUpperCase()} onClick={() => startExercise()}/>
                <Row padding={false}>
                    <Button label={dictionary.next.toUpperCase()} onClick={() => nextExample()} isEnabled={hasStarted && nextExample !== undefined}/>
                    <Button label={dictionary.repeat.toUpperCase()} onClick={() => repeatExample()} isEnabled={hasStarted && repeatExample !== undefined}/>
                </Row>
                <Button label={dictionary.hint.toUpperCase()} onClick={() => showHint()} isEnabled={hasStarted && showHint !== undefined}/>
                {/* this is ALWAYS enabled, as the user should always be able to exit the exercise */}
                <Results/>
                {/* this is NEVER enabled, as I still haven't figured what it should be used for */}
                <Button label={dictionary.exit.toUpperCase()} onClick={() => {returnToMenu(); resetNotesResults(); resetExamplesResults()}} />
                <Button label={dictionary.settings.toUpperCase()} isEnabled={openSettings !== undefined} onClick={() => openSettings()}/>
            </Grid>
        </div>;
}

export default LeftPanel;