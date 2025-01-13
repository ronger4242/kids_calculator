import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2, VolumeX, Settings, Plus, Minus, X,
  Divide, Upload, Music, Palette,
  Delete, Eraser, RewindIcon, CornerDownLeft
} from 'lucide-react';
import {initialThemes, Theme} from './initialThemes.ts';
import {CalcButton} from './CalcButton';
import {sounds} from './sounds.ts';
import {addOpToLastOperand} from './addOpToLastOperand.ts';
import {
  cubeDisplay,
  cubeFormula,
  cubicRootDisplay,
  cubicRootFormula,
  oneOverDisplay,
  oneOverFormula,
  power2Display,
  power2Formula, power3Display,
  power3Formula,
  squareDisplay,
  squareFormula,
  squareRootDisplay,
  squareRootFormula
} from './specialOps.ts';

const LAST_IS_OPERATOR = 0;
const LAST_IS_NUMBER = 1;
const LAST_IS_LEFT_BRACKET = 2;
const LAST_IS_RIGHT_BRACKET = 3;
const LAST_IS_EQUAL = 4;
const LAST_IS_ERROR = 5;
const LAST_IS_SPECIAL = 6;

function showState(state: number) {
  if (state === LAST_IS_OPERATOR) {
    return 'Operator';
  } else if (state === LAST_IS_NUMBER) {
    return 'Number';
  } else if (state === LAST_IS_LEFT_BRACKET) {
    return '(';
  } else if (state === LAST_IS_RIGHT_BRACKET) {
    return ')';
  } else if (state === LAST_IS_EQUAL) {
    return '=';
  } else if (state === LAST_IS_EQUAL) {
    return 'Error';
  } else if (state === LAST_IS_SPECIAL) {
    return 'Special';
  }
}


interface State {
  formula: string;
  display: string;
  state: number;
  finalValue: string | undefined;
}

function App() {
  const [stack, setStack] = useState<State[]>([{
    formula: '',
    display: '',
    state: LAST_IS_OPERATOR,
    finalValue: undefined,
  }]);
  const [showSettings, setShowSettings] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(0);
  const [currentSound, setCurrentSound] = useState(0);
  const [themes] = useState<Theme[]>(initialThemes);
  const [customThemes, setCustomThemes] = useState<{ [key: number]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCurrentTheme = () => {
    try {
      if (customThemes[currentTheme]) {
        return customThemes[currentTheme];
      }
      return themes[currentTheme].url;
    } catch (error) {
      console.error('Error getting theme:', error);
      return themes[0].url;
    }
  };

  const getCurrentThemeColors = () => {
    try {
      return themes[currentTheme].colors;
    } catch (error) {
      console.error('Error getting theme colors:', error);
      return themes[0].colors;
    }
  };

  const playSound = async (type: 'number' | 'operation' | 'equals') => {
    if (isMuted) return;
    try {
      const audio = new Audio(sounds[currentSound][type]);
      await audio.play();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomThemes({
          ...customThemes,
          [currentTheme]: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrent = () => {
    return stack[stack.length - 1];
  }

  function update(newFormula: string, newDisplay: string, newState: number, finalValue: string | undefined = undefined) {
    const step = {
      formula: newFormula,
      display: newDisplay,
      state: newState,
      finalValue: finalValue
    }
    setStack(prev => {
      return [...prev, step];
    });
  }

  const handleClear = () => {
    setStack(prev => {
      const firstStep = {...prev[0]};
      return [firstStep];
    })
    playSound('operation');
  };

  const handleLeftBracket = () => {
    const { formula, display, state : currentState } = getCurrent();

    const newState = LAST_IS_LEFT_BRACKET;
    switch (currentState) {
      case LAST_IS_NUMBER:
      case LAST_IS_SPECIAL:
        return;
      case LAST_IS_LEFT_BRACKET:
      case LAST_IS_OPERATOR:
        update(formula + "(", display + "(", newState);
        break;
      case LAST_IS_EQUAL:
        update("(", "(", newState, "");
        break;
      case LAST_IS_ERROR:
        update("(", "(", newState);
        break;
    }
  }

  const handleRightBracket = () => {
    const { formula, display, state : currentState } = getCurrent();
    const newState = LAST_IS_RIGHT_BRACKET;
    switch (currentState) {
      case LAST_IS_OPERATOR:
      case LAST_IS_EQUAL:
      case LAST_IS_LEFT_BRACKET:
      case LAST_IS_ERROR:
      case LAST_IS_SPECIAL:
        return;
      case LAST_IS_NUMBER:
        update(formula + ")", display + ")", newState);
        break;
      case LAST_IS_RIGHT_BRACKET:
        // TODO check () level.
        update(formula + ")", display + ")", newState);
        break;
    }
  }

  const handleDelete = () => {
    if (stack.length === 1) {
      return;
    }
    setStack(prev => {
      return prev.slice(0, prev.length - 1);
    });
    playSound('operation');
  };

  const handleSpecialOp = (op: string) => {
    const { formula, display, state : currentState } = getCurrent();
    const newState = LAST_IS_SPECIAL;

    switch (currentState) {
      case LAST_IS_OPERATOR:
      case LAST_IS_LEFT_BRACKET:
      case LAST_IS_ERROR:
        return;
      case LAST_IS_SPECIAL:
      case LAST_IS_EQUAL:
      case LAST_IS_NUMBER:
      case LAST_IS_RIGHT_BRACKET:
        break;
    }

    try {
      switch (op) {
        case 'x²': {
          const newFormula = addOpToLastOperand(formula, squareFormula, false);
          const newDisplay = addOpToLastOperand(display, squareDisplay, undefined);
          update(`${newFormula}`, `${newDisplay}`, newState);
          break;
        }
        case 'x³': {
          const newFormula = addOpToLastOperand(formula, cubeFormula, false);
          const newDisplay = addOpToLastOperand(display, cubeDisplay, undefined);
          update(`${newFormula}`, `${newDisplay}`, newState);
          break;
        }
        case '√': {
          const newFormula = addOpToLastOperand(formula, squareRootFormula, false);
          const newDisplay = addOpToLastOperand(display, squareRootDisplay, undefined);
          update(`${newFormula}`, `${newDisplay}`, newState);
          break;
        }
        case '∛': {
          const newFormula = addOpToLastOperand(formula, cubicRootFormula, false);
          const newDisplay = addOpToLastOperand(display, cubicRootDisplay, undefined);
          update(`${newFormula}`, `${newDisplay}`, newState);
          break;
        }
        case '1/x': {
          const newFormula = addOpToLastOperand(formula, oneOverFormula, false);
          const newDisplay = addOpToLastOperand(display, oneOverDisplay, undefined);
          update(`${newFormula}`, `${newDisplay}`, newState);
          break;
        }
        case '2ˣ': {
          const newFormula = addOpToLastOperand(formula, power2Formula, false);
          const newDisplay = addOpToLastOperand(display, power2Display, undefined);
          update(`${newFormula}`, `${newDisplay}`, newState);
          break;
        }
        case '3ˣ': {
          const newFormula = addOpToLastOperand(formula, power3Formula, false);
          const newDisplay = addOpToLastOperand(display, power3Display, undefined);
          update(`${newFormula}`, `${newDisplay}`, newState);
          break;
        }
      }
    } catch {
      setError();
    }
    playSound("operation");
  };

  const handleNumber = (num: string) => {
    const { formula, display, state : currentState } = getCurrent();
    const newState = LAST_IS_NUMBER;

    switch (currentState) {
      case LAST_IS_NUMBER:
      case LAST_IS_OPERATOR:
      case LAST_IS_LEFT_BRACKET:
        update(formula + num, display + num, newState);
        break;
      case LAST_IS_EQUAL:
        update(num, num, newState, "");
        break;
      case LAST_IS_RIGHT_BRACKET:
        // do nothing
        break;
      case LAST_IS_ERROR:
        update(num, num, newState);
        break;
      case LAST_IS_SPECIAL:
        return;
    }
    playSound('number');
  };

  const handleOperation = (op: string, opDisp: string) => {
    const { formula, display, state : currentState } = getCurrent();
    const newState = LAST_IS_OPERATOR;

    switch (currentState) {
      case LAST_IS_NUMBER:
        update(formula + op, display + opDisp, newState);
        break;
      case LAST_IS_OPERATOR: {
        if (op === '-') {
          update(formula + op, display + opDisp, newState);
          break;
        } else {
          return;
        }
      }
      case LAST_IS_LEFT_BRACKET:
      case LAST_IS_ERROR:
        return;
      case LAST_IS_EQUAL:
        update(formula + op, display + opDisp, newState, "");
        break;
      case LAST_IS_RIGHT_BRACKET:
        update(formula + op, display + opDisp, newState);
        break;
      case LAST_IS_SPECIAL:
        update(formula + op, display + opDisp, newState);
        break;
    }
    playSound('operation');
  };

  const setError = () => {
    // setDisplay('Error');
    // setFormula('Error');
    // setCurrentState(LAST_IS_ERROR);
    playSound('error');
  }

  const handleEquals = () => {
    const { formula, display } = getCurrent();

    let result = calculateResult(formula);
    if (result === 'Error') {
      setError();
      return;
    }

    if (Math.abs(result - Math.floor(result)) < 0.001) {
      result = Math.floor(result);
    }
    result = result.toFixed(3);
    if (result.includes('.')) {
      result = result.replace(/\.?0+$/, '');
    }

    // Simply use the formula as is, since it already contains the complete expression
    const finalValue = `${display} = ${result}`
    update(formula, display, LAST_IS_EQUAL, finalValue);
    playSound('equals');
  };

  const calculateResult = (formula: string) => {
    if (formula === "") {
      return 0;
    }
    try {
      console.log("formula " + formula);
      let result = eval(formula);
      console.log("result " + result);
      return result;
    } catch {
      return "Error";
    }
  }

  const { display, finalValue } = getCurrent();

  return (
    <div className="min-h-screen bg-purple-100">
      <div className="max-w-md mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Theme Preview */}
          <div className="h-64 relative">
            <img
              src={getCurrentTheme()}
              alt="Calculator theme"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-full bg-white/80 hover:bg-white"
              >
                {isMuted ?
                  <VolumeX className="w-5 h-5"/> :
                  <Volume2 className="w-5 h-5"/>
                }
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-full bg-white/80 hover:bg-white"
              >
                {!showSettings && <Settings className="w-5 h-5"/>}
                {showSettings && <CornerDownLeft className="w-5 h-5"/>}
              </button>
            </div>
          </div>

          {/* Display */}
          {!showSettings && <div className="p-2">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="text-right text-4xl font-bold" style={{minHeight: '40px'}}>
                {finalValue || display}
              </div>
            </div>

            {/* Calculator Buttons */}
            <div className="grid grid-cols-4 gap-1 mt-2">
              {/* Row 1 - Clear and Delete */}
              <CalcButton onClick={handleClear} type="function" color={getCurrentThemeColors().accent}
                          icon={<Eraser/>}/>
              <CalcButton onClick={() => handleLeftBracket()} type="function"
                          color={getCurrentThemeColors().accent}>(</CalcButton>
              <CalcButton onClick={() => handleRightBracket()} type="function"
                          color={getCurrentThemeColors().accent}>)</CalcButton>
              <CalcButton onClick={handleDelete} type="function" color={getCurrentThemeColors().accent}
                          icon={<Delete/>}/>

              {/* Row 2 - Powers */}
              <CalcButton onClick={() => handleSpecialOp('x²')} type="function"
                          color={getCurrentThemeColors().accent}>x²</CalcButton>
              <CalcButton onClick={() => handleSpecialOp('x³')} type="function"
                          color={getCurrentThemeColors().accent}>x³</CalcButton>
              <CalcButton onClick={() => handleSpecialOp('2ˣ')} type="function"
                          color={getCurrentThemeColors().accent}>2ˣ</CalcButton>
              <CalcButton onClick={() => handleSpecialOp('3ˣ')} type="function"
                          color={getCurrentThemeColors().accent}>3ˣ</CalcButton>

              {/* Row 3 - Roots and Functions */}
              <CalcButton onClick={() => handleSpecialOp('√')} type="function"
                          color={getCurrentThemeColors().accent}>√</CalcButton>
              <CalcButton onClick={() => handleSpecialOp('∛')} type="function"
                          color={getCurrentThemeColors().accent}>∛</CalcButton>
              <CalcButton onClick={() => handleSpecialOp('1/x')} type="function"
                          color={getCurrentThemeColors().secondary}>1/x</CalcButton>
              <CalcButton onClick={() => handleOperation('%', ' mod ')} type="operation"
                          color={getCurrentThemeColors().secondary}>mod</CalcButton>

              {/* Numbers and Operations */}
              <CalcButton onClick={() => handleNumber('7')} type="number"
                          color={getCurrentThemeColors().primary}>7</CalcButton>
              <CalcButton onClick={() => handleNumber('8')} type="number"
                          color={getCurrentThemeColors().primary}>8</CalcButton>
              <CalcButton onClick={() => handleNumber('9')} type="number"
                          color={getCurrentThemeColors().primary}>9</CalcButton>
              <CalcButton onClick={() => handleOperation('/', '÷')} type="operation"
                          color={getCurrentThemeColors().secondary} icon={<Divide/>}/>

              <CalcButton onClick={() => handleNumber('4')} type="number"
                          color={getCurrentThemeColors().primary}>4</CalcButton>
              <CalcButton onClick={() => handleNumber('5')} type="number"
                          color={getCurrentThemeColors().primary}>5</CalcButton>
              <CalcButton onClick={() => handleNumber('6')} type="number"
                          color={getCurrentThemeColors().primary}>6</CalcButton>
              <CalcButton onClick={() => handleOperation('*', '×')} type="operation"
                          color={getCurrentThemeColors().secondary} icon={<X/>}/>

              <CalcButton onClick={() => handleNumber('1')} type="number"
                          color={getCurrentThemeColors().primary}>1</CalcButton>
              <CalcButton onClick={() => handleNumber('2')} type="number"
                          color={getCurrentThemeColors().primary}>2</CalcButton>
              <CalcButton onClick={() => handleNumber('3')} type="number"
                          color={getCurrentThemeColors().primary}>3</CalcButton>
              <CalcButton onClick={() => handleOperation('-', '-')} type="operation"
                          color={getCurrentThemeColors().secondary} icon={<Minus/>}/>

              <CalcButton onClick={() => handleNumber('0')} type="number"
                          color={getCurrentThemeColors().primary}>0</CalcButton>
              <CalcButton onClick={() => handleNumber('.')} type="number"
                          color={getCurrentThemeColors().primary}>.</CalcButton>
              <CalcButton onClick={handleEquals} type="operation"
                          color={getCurrentThemeColors().secondary}>=</CalcButton>
              <CalcButton onClick={() => handleOperation('+', '+')} type="operation"
                          color={getCurrentThemeColors().secondary} icon={<Plus/>}/>
            </div>
          </div>}

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                className="p-4 bg-gray-100"
                initial={{opacity: 0, height: 0}}
                animate={{opacity: 1, height: 'auto'}}
                exit={{opacity: 0, height: 0}}
              >
                {/* Sound Settings */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Music className="w-5 h-5"/> Sound Theme
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {sounds.map((sound, index) => (
                      <button
                        key={sound.name}
                        onClick={() => setCurrentSound(index)}
                        className={`px-3 py-1 rounded ${
                          currentSound === index
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {sound.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Settings */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Palette className="w-5 h-5"/> Background Theme
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {themes.map((theme, index) => (
                      <button
                        key={theme.name}
                        onClick={() => setCurrentTheme(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden ${
                          currentTheme === index ? 'ring-2 ring-blue-500' : ''
                        }`}
                      >
                        <img
                          src={theme.url}
                          alt={theme.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2 px-4 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 
                                flex items-center justify-center gap-2 transition-colors"
                    >
                      <Upload className="w-5 h-5"/>
                      Upload Custom Theme
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/*<div>*/}
        {/*  <br/>*/}
        {/*  formula {formula}<br/>*/}
        {/*  display {display}<br/>*/}
        {/*  final {finalValue}<br/>*/}
        {/*  currentState {showState(currentState)}*/}
        {/*</div>*/}
      </div>
    </div>
  );
}

export default App;