import React from "react";
import "./style.css";
import Header from "../header/Header";
import Bar from "./bar/Bar";

function Slider({ text, enabled = true, onChange, min, max, initialValue }) {

    return (
        <div className="slider">
            <div className="slider-header">
                <Header text={text} enabled={enabled}/>
            </div>
            <Bar enabled={enabled} initialValue={initialValue} onChange={onChange} min={min} max={max}/>
        </div>
    );
}

export default Slider;
