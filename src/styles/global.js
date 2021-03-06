import css from 'styled-jsx/css'

export default css.global`
  body {
    margin: 0;
    padding: 0;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.8;
    color: #333;
    font-family: sans-serif;
  }

  h1 {
    font-weight: 700;
  }

  p {
    margin-bottom: 10px;
  }

  li.selected {
    border: 1px solid #000;
  }
  .optimistic { color: red; }

  .plan-date {
    background: #000;
    color: #fff;
    padding: 10px 15px;
    width: 50%;
    line-height: 1em;
    font-family: Georgia, serif;
    font-size: 1.4em;

  }

`
