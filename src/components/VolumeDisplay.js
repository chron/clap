import React from 'react';
import styled from 'styled-components';

const MAX_BAR = 120;

const VolumeBar = styled.div`
  position: relative;
  height: 20px;
  border: 1px solid black;
  background-color: ${p => p.theme.sidebarColor};;
  border-radius: 3px;
  cursor: pointer;
`;

const Threshold = styled.div`
  height: 100%;
  width: ${p => p.value / MAX_BAR * 100}%;
  background-color: white;
  pointer-events: none;
`;

const Volume = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  background-color: black;
  height: 100%;
  pointer-events: none;
`;

const VolumeLabel = styled.label`
  font-size: 10px;
  color: gray;
`;

export default function VolumeDisplay({ volume, clapThreshold, setClapThreshold }) {
  const changeThreshold = e => {
    const { left, width } = e.target.getBoundingClientRect();
    const x = e.clientX - left;
    const newThreshold = x / width * MAX_BAR;

    setClapThreshold(newThreshold);
  }

  return (
    <div>
      <VolumeLabel>microphone volume</VolumeLabel>
      <VolumeBar onClick={changeThreshold}>
        <Threshold value={clapThreshold} />
        <Volume style={{width: `${volume / MAX_BAR * 100}%`}} />
      </VolumeBar>
    </div>
  );
}
