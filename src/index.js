import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import styled, { injectGlobal } from 'styled-components';
import * as serviceWorker from './serviceWorker';

const synth = window.speechSynthesis;

const keys = {
  48: { letter: '0', emojis: [] },
  49: { letter: '1', emojis: [] },
  50: { letter: '2', emojis: [] },
  51: { letter: '3', emojis: [] },
  52: { letter: '4', emojis: [] },
  53: { letter: '5', emojis: [] },
  54: { letter: '6', emojis: [] },
  55: { letter: '7', emojis: [] },
  56: { letter: '8', emojis: [] },
  57: { letter: '9', emojis: [] },
  65: { letter: 'a', emojis: [['🍎', 'apple'], '👽', '⚓️'] },
  66: { letter: 'b', emojis: ['🍌', '👶', '🦇', '🐝'] },
  67: { letter: 'c', emojis: ['🐄', '🐱', '🐈', ['🤠', 'cowboy'], '🛶'] },
  68: { letter: 'd', emojis: ['🐶', ['💃', 'dancing'], '🦌'] },
  69: { letter: 'e', emojis: ['🥚', '👁️', '🦅'] },
  70: { letter: 'f', emojis: ['🐸', '🍟', '👣'] },
  71: { letter: 'g', emojis: ['🍇', '👻', '🦍'] },
  72: {
    letter: 'h',
    emojis: [['🥅', 'hockey net'], ['🏒', 'hockey stick'], '🐹', '🌺']
  },
  73: { letter: 'i', emojis: [['🍦', 'ice cream']] },
  74: { letter: 'j', emojis: [['🤹🏼‍♀️', 'juggler'], '👖', ['🕹️', 'joystick']] },
  75: { letter: 'k', emojis: [['🔪', 'knife'], '🔑'] },
  76: { letter: 'l', emojis: ['🦁', '🦎', '🐆'] },
  77: { letter: 'm', emojis: [['🌝', 'moon'], ['📫', 'mailbox'], '🍈', '👄'] },
  78: { letter: 'n', emojis: ['👃', ['🎶', 'notes']] },
  79: { letter: 'o', emojis: ['🐙', '👌'] },
  80: { letter: 'p', emojis: ['🥞', '🍐', ['🥘', 'pot']] },
  81: { letter: 'q', emojis: [['👸🏻', 'queen'], '🇶🇦', ['❓', 'question mark']] },
  82: { letter: 'r', emojis: ['🐇', '🤖', '♻️'] },
  83: { letter: 's', emojis: ['🐍', '🤳', '🥗', ['⭐️', 'star']] },
  84: { letter: 't', emojis: ['🦃', '🐯', '🌮', '🐅'] },
  85: { letter: 'u', emojis: ['☂️', '🆙', '🦄'] },
  86: { letter: 'v', emojis: ['🎻', '🏐', ['🌋', 'volcano']] },
  87: { letter: 'w', emojis: ['🌊', '🍉', ['🚶', 'walking']] },
  88: { letter: 'x', emojis: [] },
  89: { letter: 'y', emojis: [['💴', 'yen'], '☯️'] },
  90: { letter: 'z', emojis: ['🦓', ['⚡️', 'zap']] }
};

injectGlobal`
  /* latin */
  @font-face {
    font-family: 'ABeeZee';
    font-style: normal;
    font-weight: 400;
    src: local('ABeeZee Regular'), local('ABeeZee-Regular'), url(https://fonts.gstatic.com/s/abeezee/v11/esDR31xSG-6AGleN2tWkkJUEGpA.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  html, body {
    font-family: 'ABeeZee', sans-serif;
    padding: 0;
    margin: 0;
  }
`;

const Container = styled.section`
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  background: #e3dcf7;
`;

const Emoji = styled.span`
  font-size: 10rem;
  line-height: 5rem;
  margin: 2rem;
`;

const Letters = styled.span`
  font-size: 10rem;
`;

class App extends Component {
  state = { emoji: '', letters: '' };

  componentDidMount() {
    this.key = fromEvent(document, 'keydown')
      .pipe(filter(({ keyCode }) => keyCode in keys && !synth.speaking))
      .subscribe(({ keyCode }) => {
        const { letter, emojis } = keys[keyCode];
        let text;
        let emoji = emojis[Math.floor(Math.random() * emojis.length)];

        if (Array.isArray(emoji)) {
          text = emoji[1];
          emoji = emoji[0];
        }

        this.setState(
          {
            emoji,
            letters: isNaN(+letter) ? `${letter.toUpperCase()} ${letter}` : ''
          },
          () => synth.speak(new SpeechSynthesisUtterance(letter)),
          emoji !== undefined &&
            synth.speak(new SpeechSynthesisUtterance(text || emoji))
        );
      });
  }

  componentWillUnmount() {
    this.key && this.key.unsubscribe();
  }

  render() {
    return (
      <Container>
        {!this.state.emoji && <Emoji>Press a key!</Emoji>}
        <Emoji role="img" aria-label="emoji">
          {this.state.emoji}
        </Emoji>
        <Letters>{this.state.letters}</Letters>
      </Container>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
