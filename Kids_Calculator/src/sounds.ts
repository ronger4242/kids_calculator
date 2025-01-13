
export interface Sound {
  name: string;
  number: string;
  operation: string;
  equals: string;
  error: string;
  read: boolean;
}

export const sounds: Sound[] = [
  {
    name: "Classic",
    number: 'https://www.soundjay.com/buttons/button-16a.mp3',
    operation: 'https://www.soundjay.com/buttons/button-11.mp3',
    equals: 'https://www.soundjay.com/buttons/button-14.mp3',
    error: 'https://www.soundjay.com/buttons/button-12.mp3',
    read: false
  },
  {
    name: "Playful",
    number: 'https://www.soundjay.com/buttons/button-35.mp3',
    operation: 'https://www.soundjay.com/buttons/button-21.mp3',
    equals: 'https://www.soundjay.com/buttons/button-17.mp3',
    error: 'https://www.soundjay.com/buttons/button-12.mp3',
    read: false
  },
  {
    name: "Cartoon",
    number: 'https://www.soundjay.com/buttons/sounds/button-3.mp3',
    operation: 'https://www.soundjay.com/buttons/sounds/button-4.mp3',
    equals: 'https://www.soundjay.com/buttons/sounds/button-5.mp3',
    error: 'https://www.soundjay.com/buttons/button-12.mp3',
    read: false
  },
  {
    name: "Bubble",
    number: 'https://www.soundjay.com/buttons/sounds/button-20.mp3',
    operation: 'https://www.soundjay.com/buttons/sounds/button-21.mp3',
    equals: 'https://www.soundjay.com/buttons/sounds/button-22.mp3',
    error: 'https://www.soundjay.com/buttons/button-12.mp3',
    read: false
  },
  {
    name: "Game",
    number: 'https://www.soundjay.com/buttons/sounds/button-27.mp3',
    operation: 'https://www.soundjay.com/buttons/sounds/button-28.mp3',
    equals: 'https://www.soundjay.com/buttons/sounds/button-29.mp3',
    error: 'https://www.soundjay.com/buttons/button-12.mp3',
    read: false
  }
];