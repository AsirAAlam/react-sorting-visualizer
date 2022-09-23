import React from 'react';
import { useState } from 'react';
import TextField from '@mui/material/TextField';

const gapBetweenBars = 2;
const sortingBoxWidth = 1000; // px
const sortingBoxBorderWidth = 5;
const barColor = '#036666';
const headerHeight = 10; // percent
const numHeaderRows = 2;

const headerStyle = {
  height: headerHeight.toString() + '%',
}

const buttonStyle = {
  height: '50px'
}

export default function App() {
  const [length, setLength] = useState<number>(5);
  const [numbers, setNumbers] = useState<string>('1, 5, 3, 4, 2');
  let isSorting = false;
  let stopSorting = false;

  function onClickGenerate() {
    let str = "";

    // Generate values: 1-100 inclusive, and append to string
    for (let i = 0; i < length; i++) {
      str += Math.floor(Math.random() * 100) + 1;
      if (i < length - 1) str += ", ";
    }
    setNumbers(str)
  }

  // Plot the the bars using the array values as heights
  function onClickPlot() {
    let arr: string[] = numbers.split(", ");
    let canvasWidth = sortingBoxWidth - 2 * sortingBoxBorderWidth + gapBetweenBars;
    let barWidth = canvasWidth / arr.length;
    const sortingBox = document.querySelector(".sortingBox");

    if (sortingBox == null) {
      return;
    }

    // Remove any existing children
    while (sortingBox.firstChild) {
      sortingBox.removeChild(sortingBox.firstChild);
    }

    for (let i = 0; i < arr.length; i++) {
      const height = parseInt(arr[i]);
      let bar = document.createElement("div");
      bar.className = "bar";
      bar.style.left = barWidth * i + 'px';
      bar.style.height = height + '%';
      bar.style.borderLeftWidth = (barWidth - gapBetweenBars) + 'px';
      bar.style.borderLeftColor = barColor;
      bar.addEventListener('mouseover', function handleMouseOver() {
        bar.style.borderLeftColor = '#469d89';
      });
      bar.addEventListener('mouseout', function handleMouseOver() {
        bar.style.borderLeftColor = barColor;
      });
      sortingBox.appendChild(bar);
    }
  }

  async function onClickStopSorting() {
    if (isSorting) {
      stopSorting = true;
    }
  }

  async function onClickSort() {
    const sortingBox = document.querySelector(".sortingBox");

    if (sortingBox == null) {
      return;
    }

    isSorting = true;

    const bars = sortingBox.children;
    const n = bars.length;

    const timer = (ms: number) => new Promise(res => setTimeout(res, ms));

    const heightStringToInt = (heightStr: string) => {
      return parseInt(heightStr.split('%')[0]);
    };

    // Selection Sort
    for (let i = 0; i < n; i++) {
      const bar1 = bars[i] as HTMLDivElement;
      bar1.style.borderLeftColor = 'white';
      let indexOfSmallest = i;

      // Find smallest in the rest of the array to swap with
      for (let j = i + 1; j < n; j++) {
        const smallestBar = bars[indexOfSmallest] as HTMLDivElement;

        if (stopSorting) {
          bar1.style.borderLeftColor = barColor;
          smallestBar.style.borderLeftColor = barColor;
          isSorting = false;
          stopSorting = false;
          return;
        }

        const bar2 = bars[j] as HTMLDivElement;
        bar2.style.borderLeftColor = '#fb6107';
        await timer(100);

        // Found new smallest
        if (heightStringToInt(bar2.style.height) < heightStringToInt(smallestBar.style.height)) {
          // Reset color of previous smallest
          if (indexOfSmallest !== i) {
            smallestBar.style.borderLeftColor = barColor;
          }

          // Mark this one
          bar2.style.borderLeftColor = '#1f2421';

          // Update index of new smallest
          indexOfSmallest = j;
        } else {
          // Not noteworthy, reset color
          bar2.style.borderLeftColor = barColor;
        }
      }

      // Wait before swapping
      await timer(700);

      // If there is no smaller bar to swap with, continue.
      if (indexOfSmallest === i) {
        bar1.style.borderLeftColor = barColor;
        continue;
      }

      const smallestBar = bars[indexOfSmallest] as HTMLDivElement;
      
      // Swap bar heights
      let newHeightForA = smallestBar.style.height;
      let newHeightForB = bar1.style.height;

      bar1.style.height = newHeightForA;
      smallestBar.style.height = newHeightForB;

      // Wait after swapping
      await timer(700);

      bar1.style.borderLeftColor = barColor;
      smallestBar.style.borderLeftColor = barColor;
    }
    isSorting = false;
    stopSorting = false;
  }

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLength(parseInt(e.target.value));
  }

  const handleNumbersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumbers(e.target.value);
  }

  return (
    <div id="app" style={{ width: sortingBoxWidth.toString() + 'px' }}>
      <div className="header" style={headerStyle}>
        <label htmlFor="header__inputLength">Length:</label>
        <input value={length} onChange={handleLengthChange} id="header__inputLength" type="text" className="form-control" />

        <label htmlFor="header__inputNumbers">Numbers:</label>
        <input value={numbers} onChange={handleNumbersChange} id="header__inputNumbers" type="text" className="form-control" />

      </div>
      <div className="header" style={{...headerStyle, display: 'flex', flexDirection: 'row-reverse'}}>
        <div>
          <button style={buttonStyle} onClick={onClickStopSorting}>
            Stop Sorting
          </button>

          <div style={{ display: 'inline-block', margin: '5px' }}></div>

          <button style={buttonStyle} onClick={onClickGenerate}>
            Random Sequence
          </button>
          <button style={buttonStyle} onClick={onClickPlot}>
            Plot
          </button>
          <button style={buttonStyle} onClick={onClickSort}>
            Sort
          </button>
        </div>
      </div>
      <div className="sortingBox" style={{ height: (100 - numHeaderRows*headerHeight).toString() + '%' }}></div>
    </div>
  );
}