import React, { useContext, useEffect, useState } from 'react';

import { GlobalSettingsContext } from '../../../managers/GlobalSettingsLayer';
import { UIContext } from '../../../managers/UILayer';

import Checkbox from '../../../components/checkbox/Checkbox';

import Table from '../../../components/table/Table';
import Column from '../../../components/table/column/Column';
import Row from '../../../components/table/row/Row';
import Text from '../../../components/text/Text';
import Spacer from '../../../components/spacer/Spacer';

import Overlay from '../Overlay';
import OKCancel from '../okcancel/OKCancel';
import NoteAdjustmentSliders from '../noteadjustmentsliders/NoteAdjustmentSliders';

function Thirteenths() {
    const { showElement, lastOpenedElement } = useContext(UIContext); 
    const { enabledChords, setEnabledChordsByType } = useContext(GlobalSettingsContext);
    const { enabledInversions, setEnabledInversionsByType } = useContext(GlobalSettingsContext);
    const [ tempEnabledThirteenths, setTempEnabledThirteenths ] = useState(enabledChords['thirteenths']);
    const [ tempEnabledThirteenthsInversions, setTempEnabledThirteenthsInversions ] = useState(enabledInversions['thirteenths']);

    const acceptChanges = () => {
        if (tempEnabledThirteenths === enabledChords['thirteenths'] && tempEnabledThirteenthsInversions === enabledInversions['thirteenths']) {
            showElement(lastOpenedElement);
            return;
        }
        setEnabledChordsByType('thirteenths', tempEnabledThirteenths);
        setEnabledInversionsByType('thirteenths', tempEnabledThirteenthsInversions);
        showElement(lastOpenedElement);
    };

    const toggleThirteenthChord = (type) => {
        if(tempEnabledThirteenths.includes(type)) setTempEnabledThirteenths(tempEnabledThirteenths.filter(chord => chord !== type));
        else setTempEnabledThirteenths([...tempEnabledThirteenths, type]);
    }

    return (
        <Overlay>
            <Table direction='column'>
                <Row>
                    <Text center={false}>Akordy z tercdecymą:</Text>
                </Row>
                <Row>
                    <Column>
                        <Checkbox label="3w, 13w, 7w" isChecked={tempEnabledThirteenths.includes('3w13w7w')} onClick={() => toggleThirteenthChord('3w13w7w')}/>
                        <Checkbox label="3m, 13w, 7w" isChecked={tempEnabledThirteenths.includes('3m13w7w')} onClick={() => toggleThirteenthChord('3m13w7w')}/>
                        <Checkbox label="3w, 13w, 7m" isChecked={tempEnabledThirteenths.includes('3w13w7m')} onClick={() => toggleThirteenthChord('3w13w7m')}/>
                        <Checkbox label="3m, 13w, 7m" isChecked={tempEnabledThirteenths.includes('3m13w7m')} onClick={() => toggleThirteenthChord('3m13w7m')}/>
                        <Checkbox label="3w, 13w, 9w" isChecked={tempEnabledThirteenths.includes('3w13w9w')} onClick={() => toggleThirteenthChord('3w13w9w')}/>
                    </Column>
                    <Column>
                        <Checkbox label="3m, 13w, 9w" isChecked={tempEnabledThirteenths.includes('3m13w9w')} onClick={() => toggleThirteenthChord('3m13w9w')}/>
                        <Checkbox label="3w, 13w, 9m" isChecked={tempEnabledThirteenths.includes('3w13w9m')} onClick={() => toggleThirteenthChord('3w13w9m')}/>
                        <Checkbox label="3m, 13w, 9m" isChecked={tempEnabledThirteenths.includes('3m13w9m')} onClick={() => toggleThirteenthChord('3m13w9m')}/>
                        <Text center={false}>Przewroty</Text>
                        <Checkbox label="używaj przewrotów" isChecked={tempEnabledThirteenthsInversions.length > 1} onClick={() => setTempEnabledThirteenthsInversions(tempEnabledThirteenthsInversions.length > 1 ? [0] : [0, 1, 2, 3])}/>
                    </Column>
                    <Column>
                        <Spacer length={0.5}/>
                        <OKCancel onOK={acceptChanges} onCancel={() => showElement(lastOpenedElement)}/>
                        <Spacer length={4}/>
                    </Column>
                </Row>
                <Row>
                    <NoteAdjustmentSliders/>
                </Row>
            </Table>
        </Overlay>
    );

}

export default Thirteenths;
