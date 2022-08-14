import { useState } from "react";

type UIOverlayProps = {
  isPlayOn: boolean;
  onPlayClick: () => void;
  onDetuneClick: () => void;
  onLowPassClick: () => void;
};

const UIOverlay = ({ isPlayOn, onPlayClick, onDetuneClick, onLowPassClick }: UIOverlayProps) => {

  return (
    <div className="overlay">
      <button className="btn-control" onClick={onPlayClick}>
        {isPlayOn ? 'pause' : 'play'}
      </button>
      <p className="noselect">Detune</p>
      <input type="checkbox" id="detune" onClick={onDetuneClick} />
      <label htmlFor="detune">Detune</label>
      <p className="noselect">LowPass</p>
      <input type="checkbox" id="lowpass" onClick={onLowPassClick}/>
      <label htmlFor="lowpass">Lowpass</label>
    </div>
  );
};

export default UIOverlay;
