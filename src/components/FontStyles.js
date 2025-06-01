import React from 'react';

const FontStyles = () => (
  <style>
    {`
      @font-face {
        font-family: 'SeoulNamsanM';
        src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_two@1.0/SeoulNamsanM.woff') format('woff');
        font-weight: normal;
        font-style: normal;
      }

      body {
        font-family: 'SeoulNamsanM', sans-serif;
      }
    `}
  </style>
);

export default FontStyles;