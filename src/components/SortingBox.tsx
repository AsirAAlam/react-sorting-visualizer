import React from 'react';
import { useState } from 'react';
import TextField from '@mui/material/TextField';

const gapBetweenBars = 2;
const sortingBoxWidth = 1000;
const sortingBoxBorderWidth = 5;
const barColor = '#036666';


export default function App() {
  const [length, setLength] = useState<number>(5);
  const [numbers, setNumbers] = useState<string>('1, 5, 3, 4, 2');
  // const app = document.getElementById('app') as HTMLElement;

  // if (app != null) {
  //   app.style.width = sortingBoxWidth.toString() + 'px';
  //   app.style.borderWidth = sortingBoxBorderWidth.toString() + 'px';
  // }

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
    console.log(arr);

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

  async function onClickSort() {
    const sortingBox = document.querySelector(".sortingBox");

    if (sortingBox == null) {
      return;
    }

    const bars = sortingBox.children;
    const n = bars.length;
    let arr: string[] = numbers.split(",");
    let canvasWidth = sortingBoxWidth - 2 * sortingBoxBorderWidth + gapBetweenBars;

    const timer = (ms: number) => new Promise(res => setTimeout(res, ms));

    const heightStringToInt = (heightStr: string) => {
      return parseInt(heightStr.split('%')[0]);
    };

    // Selection Sort
    for (let i = 0; i < n; i++) {
      const bar1 = bars[i] as HTMLDivElement;
      bar1.style.borderLeftColor = 'white';
      await timer(100);
      let indexOfSmallest = i;

      // Find smallest in the rest of the array to swap with
      for (let j = i + 1; j < n; j++) {
        const bar2 = bars[j] as HTMLDivElement;
        bar2.style.borderLeftColor = '#fb6107';
        await timer(100);

        const smallestBar = bars[indexOfSmallest] as HTMLDivElement;

        // Found new smallest
        if (heightStringToInt(bar2.style.height) < heightStringToInt(smallestBar.style.height)) {
          // Reset color of previous smallest
          if (indexOfSmallest !== i) {
            smallestBar.style.borderLeftColor = barColor;
          }

          bar2.style.borderLeftColor = '#1f2421';

          indexOfSmallest = j;
        } else {
          bar2.style.borderLeftColor = barColor;
        }
      }

      const smallestBar = bars[indexOfSmallest] as HTMLDivElement;

      let newHeightForA = smallestBar.style.height;
      let newHeightForB = bar1.style.height;

      bar1.style.height = newHeightForA;
      smallestBar.style.height = newHeightForB;

      await timer(1000);

      bar1.style.borderLeftColor = barColor;
      smallestBar.style.borderLeftColor = barColor;
    }
  }

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLength(parseInt(e.target.value));
  }

  const handleNumbersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumbers(e.target.value);
  }

  return (
    <div id="app">
      <div className="header">
        {/* <TextField value={length} onChange={handleLengthChange} id="outlined-basic" label="Outlined" variant="outlined" /> */}
        <label htmlFor="header__inputLength">Length:</label>
        <input value={length} onChange={handleLengthChange} id="header__inputLength" type="text" className="form-control" />

        <label htmlFor="header__inputNumbers">Numbers:</label>
        <input value={numbers} onChange={handleNumbersChange} id="header__inputNumbers" type="text" className="form-control" />

        <button type="button" className="header__generate btn btn-default" onClick={onClickGenerate}>
          Random Sequence
        </button>
        <button type="button" className="header__plot btn btn-default" onClick={onClickPlot}>
          Plot
        </button>
        <button type="button" className="header__sort btn btn-default" onClick={onClickSort}>
          Sort
        </button>
        <div className="sortingBox"></div>
      </div>
    </div>
  );
}