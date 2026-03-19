import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LucideTrophy, LucideRotateCcw, LucideSettings, LucideInfo, 
  LucideGamepad2, LucideUser, LucideUsers, LucideBot, LucideGlobe, 
  LucideCopy, LucideCheck, LucideLanguages, LucideChevronDown,
  LucideX, LucideCircle, LucideGrid3X3, LucideHelpCircle,
  LucideRefreshCcw, LucideBrain, LucideCompass, LucideLayers,
  LucideGraduationCap, LucideMail,
  // New icons for categories
  LucideMoon, LucideFlame, LucideCloudRain, LucideSun, LucideLeaf, 
  LucideMountain, LucideCloud, LucideHeart, LucideZap, LucideSandwich, 
  LucideSmartphone, LucideDog, LucidePawPrint, LucideApple, LucideCitrus, 
  LucideCarrot, LucideTrees, LucideBird, LucideGrape, LucideBanana,
  LucideCherry, LucideSprout, LucideFlower2,
  LucideCat, LucideRabbit, LucideMouse, LucideBug, LucideSnail,
  LucideTurtle, LucideFish
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { CATEGORIES, DIRECTION_SETS, ItemInfo, UI_STRINGS, CategoryType, DirectionSetType, CREDENTIALS } from './constants';
import { LogoIcon } from './components/icons/LogoIcon';
import { BuyMeACoffeeIcon } from './components/icons/BuyMeACoffeeIcon';
import { HedgehogIcon, SquirrelIcon, MooseIcon, DeerIcon, WolfIcon, FoxIcon } from './components/icons/AnimalIcons';
import { PearIcon, BlueberryIcon, PlumIcon, PotatoIcon, CabbageIcon, CucumberIcon, TomatoIcon, BellPepperIcon } from './components/icons/FoodIcons';
import { GoogleX, IconAAA, GoogleO } from './components/icons/UtilityIcons';

type Player = 'X' | 'O';
type Language = 'est' | 'eng' | 'rus';

interface Move {
  r: number;
  c: number;
  player: Player;
  item: ItemInfo;
  timestamp: number;
}

interface GameState {
  board: (Move | null)[][];
  currentPlayer: Player;
  winner: Player | 'Draw' | null;
  moves: Move[];
  mode: 'standard' | '3-limit';
  opponent: 'human' | 'bot' | 'online';
  botDifficulty: 'easy' | 'medium' | 'hard';
  category: CategoryType;
  myRole: Player | null;
  language: Language;
  playerXName: string;
  playerOName: string;
  winningLine: number[][] | null;
  isBotThinking: boolean;
  directionSet: DirectionSetType;
  fontSize: 'standard' | 'large' | 'extra-large';
}

const ICON_MAP: Record<string, React.ElementType> = {
  Circle: LucideCircle,
  Moon: LucideMoon,
  Flame: LucideFlame,
  CloudRain: LucideCloudRain,
  Sun: LucideSun,
  Leaf: LucideLeaf,
  Mountain: LucideMountain,
  Cloud: LucideCloud,
  Heart: LucideHeart,
  Zap: LucideZap,
  Sandwich: LucideSandwich,
  Smartphone: LucideSmartphone,
  Dog: LucideDog,
  PawPrint: LucidePawPrint,
  Apple: LucideApple,
  Citrus: LucideCitrus,
  Carrot: LucideCarrot,
  Trees: LucideTrees,
  Bird: LucideBird,
  Grape: LucideGrape,
  Banana: LucideBanana,
  Cherry: LucideCherry,
  Strawberry: LucideHeart,
  Sprout: LucideSprout,
  Flower2: LucideFlower2,
  Cat: LucideCat,
  Rabbit: LucideRabbit,
  Mouse: LucideMouse,
  Bug: LucideBug,
  Snail: LucideSnail,
  Turtle: LucideTurtle,
  Fish: LucideFish,
  Hedgehog: HedgehogIcon,
  Squirrel: SquirrelIcon,
  Moose: MooseIcon,
  Deer: DeerIcon,
  Wolf: WolfIcon,
  Fox: FoxIcon,
  Pear: PearIcon,
  Blueberry: BlueberryIcon,
  Plum: PlumIcon,
  Potato: PotatoIcon,
  Cabbage: CabbageIcon,
  Cucumber: CucumberIcon,
  Tomato: TomatoIcon,
  BellPepper: BellPepperIcon,
};

const IconRenderer = ({ name, className }: { name: string, className?: string }) => {
  const IconComponent = ICON_MAP[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

const ItemRenderer = ({ item, className, showLabel }: { item: ItemInfo, className?: string, showLabel?: boolean }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {item.image ? (
        <img 
          src={item.image} 
          alt={item.eesti} 
          className="w-full h-full object-cover rounded-xl shadow-inner"
          referrerPolicy="no-referrer"
        />
      ) : item.icon ? (
        <IconRenderer name={item.icon} className="w-full h-full" />
      ) : item.hex ? (
        <div className="w-full h-full rounded-xl shadow-inner" style={{ backgroundColor: item.hex }} />
      ) : null}
      {showLabel && (
        <span className="text-[0.625rem] font-bold uppercase mt-1 text-white/80">{item.eesti}</span>
      )}
    </div>
  );
};

const Tooltip = ({ text, children, position = 'center' }: { text: string, children: React.ReactNode, position?: 'center' | 'right' }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex items-center" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onClick={() => setShow(!show)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`absolute bottom-full mb-2 px-2 py-1 bg-[#141414] text-white text-[0.625rem] uppercase tracking-widest z-50 rounded pointer-events-none w-max max-w-[200px] text-center whitespace-normal break-words ${position === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'}`}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AtmosphericBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050505]">
      {/* Red Blob - Top Left */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-red-500/10 blur-[100px]"
      />
      {/* Green Blob - Top Right */}
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[15%] -right-[15%] w-[70vw] h-[70vw] rounded-full bg-emerald-500/10 blur-[120px]"
      />
      {/* Blue Blob - Bottom Left */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-[20%] -left-[15%] w-[80vw] h-[80vw] rounded-full bg-blue-600/10 blur-[140px]"
      />
      {/* Yellow/Orange Blob - Bottom Right */}
      <motion.div
        animate={{
          scale: [1.3, 1, 1.3],
          x: [0, -30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-amber-400/10 blur-[90px]"
      />
      
      {/* Center Shimmer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] opacity-40" />
      
      {/* Noise Texture for that premium feel */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

const AccordionBox = ({ 
  title, 
  children, 
  onSettingsClick, 
  defaultOpen = true 
}: { 
  title: string, 
  children: React.ReactNode, 
  onSettingsClick: () => void,
  defaultOpen?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10 shadow-xl overflow-hidden h-fit">
      <div className={`flex items-center justify-between transition-all duration-300 ${isOpen ? 'mb-4' : 'mb-0'}`}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm font-bold uppercase text-white/50 hover:text-white transition-colors group"
        >
          <motion.div animate={{ rotate: isOpen ? 0 : -90 }}>
            <LucideChevronDown size={16} />
          </motion.div>
          {title}
        </button>
        
        <button 
          onClick={onSettingsClick}
          className="p-2 bg-white/5 rounded-lg border border-white/10 hover:border-[#007AFF] hover:bg-[#E7ECEF]/10 transition-all text-white/50 hover:text-[#007AFF]"
        >
          <LucideSettings size={16} />
        </button>
      </div>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(3).fill(null).map(() => Array(3).fill(null)),
    currentPlayer: 'X',
    winner: null,
    moves: [],
    mode: '3-limit',
    opponent: 'bot',
    botDifficulty: 'medium',
    category: 'colors',
    myRole: null,
    language: 'est',
    playerXName: 'Player X',
    playerOName: 'Bot',
    winningLine: null,
    isBotThinking: false,
    directionSet: 'compass',
    fontSize: 'standard'
  });

  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [targetItems, setTargetItems] = useState<ItemInfo[][]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsHighlight, setSettingsHighlight] = useState<'category' | 'directions' | null>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const directionsRef = useRef<HTMLDivElement>(null);
  const [showHints, setShowHints] = useState(true);
  
  const socketRef = useRef<Socket | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (showSettings && settingsHighlight) {
      const timer = setTimeout(() => {
        if (settingsHighlight === 'category' && categoryRef.current) {
          categoryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (settingsHighlight === 'directions' && directionsRef.current) {
          directionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showSettings, settingsHighlight]);

  useEffect(() => {
    if (showTutorial || showSettings) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showTutorial, showSettings]);

  // Auto-focus input when it's player's turn
  useEffect(() => {
    if (gameState.currentPlayer === (gameState.myRole || 'X') && !gameState.winner && !gameState.isBotThinking) {
      inputRef.current?.focus();
    }
  }, [gameState.currentPlayer, gameState.winner, gameState.isBotThinking, gameState.myRole]);

  const t = UI_STRINGS[gameState.language] as any;

  // Initialize target items for each cell with uniqueness
  useEffect(() => {
    const availableItems = CATEGORIES[gameState.category];
    const shuffled = [...availableItems].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 9);
    const newTargetItems = Array(3).fill(null).map((_, r) => 
      Array(3).fill(null).map((_, c) => selected[r * 3 + c])
    );
    setTargetItems(newTargetItems);
  }, [gameState.category]);

  // Socket initialization
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const rId = urlParams.get('room');
    if (rId) {
      setRoomId(rId);
      startOnlineGame(rId);
    }
  }, []);

  const startOnlineGame = (rId: string) => {
    if (!socketRef.current) {
      socketRef.current = io();
      socketRef.current.on('connect', () => socketRef.current?.emit('join-room', rId));
      socketRef.current.on('room-info', ({ players, yourId }) => {
        const role = players[0] === yourId ? 'X' : 'O';
        setGameState(prev => ({ ...prev, opponent: 'online', myRole: role }));
      });
      socketRef.current.on('remote-move', (move: Move) => applyMove(move.r, move.c, move.item, move.player));
      socketRef.current.on('remote-reset', () => resetLocalGame());
    }
  };

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(7);
    const url = new URL(window.location.href);
    url.searchParams.set('room', newRoomId);
    window.history.pushState({}, '', url);
    setRoomId(newRoomId);
    startOnlineGame(newRoomId);
  };

  const checkWinner = (board: (Move | null)[][]): { player: Player | 'Draw' | null; line: number[][] | null } => {
    const lines = [
      [[0, 0], [0, 1], [0, 2]], [[1, 0], [1, 1], [1, 2]], [[2, 0], [2, 1], [2, 2]],
      [[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]],
      [[0, 0], [1, 1], [2, 2]], [[0, 2], [1, 1], [2, 0]],
    ];
    for (const line of lines) {
      const [a, b, c] = line;
      if (board[a[0]][a[1]] && board[a[0]][a[1]]?.player === board[b[0]][b[1]]?.player && board[a[0]][a[1]]?.player === board[c[0]][c[1]]?.player) {
        return { player: board[a[0]][a[1]]!.player, line };
      }
    }
    if (board.flat().every(cell => cell !== null)) return { player: 'Draw', line: null };
    return { player: null, line: null };
  };

  const applyMove = (r: number, c: number, item: ItemInfo, player: Player) => {
    setGameState(prev => {
      const newBoard = prev.board.map(row => [...row]);
      const newMove: Move = { r, c, player, item, timestamp: Date.now() };
      let newMoves = [...prev.moves, newMove];

      if (prev.mode === '3-limit') {
        const playerMoves = newMoves.filter(m => m.player === player);
        if (playerMoves.length > 3) {
          const oldestMove = playerMoves[0];
          newBoard[oldestMove.r][oldestMove.c] = null;
          newMoves = newMoves.filter(m => m !== oldestMove);
        }
      }

      newBoard[r][c] = newMove;
      const { player: winner, line: winningLine } = checkWinner(newBoard);
      return { ...prev, board: newBoard, moves: newMoves, currentPlayer: player === 'X' ? 'O' : 'X', winner, winningLine, isBotThinking: false };
    });
  };

  const makeMove = (r: number, c: number, item: ItemInfo) => {
    if (gameState.board[r][c] || gameState.winner) return;
    if (gameState.opponent === 'online' && gameState.currentPlayer !== gameState.myRole) return;

    const player = gameState.currentPlayer;
    applyMove(r, c, item, player);

    if (gameState.opponent === 'online' && roomId) {
      socketRef.current?.emit('make-move', { roomId, move: { r, c, item, player } });
    }
    setInputValue('');
    setError(null);
  };

  const handleInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameState.winner) return;

    const input = inputValue.trim().toLowerCase();
    const parts = input.split(/\s+/);
    if (parts.length < 2) {
      setError(t.errorFormat);
      return;
    }

    // Try format: Word(s) Direction (e.g. "Punane Keskel")
    const lastPart = parts[parts.length - 1];
    const wordFromLast = parts.slice(0, parts.length - 1).join(' ');
    
    // Try format: Direction Word(s) (e.g. "Keskel Punane")
    const firstPart = parts[0];
    const wordFromFirst = parts.slice(1).join(' ');

    const directions = DIRECTION_SETS[gameState.directionSet];
    let directionStr = '';
    let wordStr = '';

    if (directions[lastPart]) {
      directionStr = lastPart;
      wordStr = wordFromLast;
    } else if (directions[firstPart]) {
      directionStr = firstPart;
      wordStr = wordFromFirst;
    } else {
      setError(t.errorDirection);
      return;
    }

    const pos = directions[directionStr];
    const targetItem = targetItems[pos.r][pos.c];
    
    if (wordStr !== targetItem.eesti.toLowerCase()) {
      setError(`${t.errorWord} ${targetItem.eesti}`);
      return;
    }

    if (gameState.board[pos.r][pos.c]) {
      setError(t.errorTaken);
      return;
    }

    makeMove(pos.r, pos.c, targetItem);
  };

  // Bot logic
  useEffect(() => {
    if (gameState.opponent === 'bot' && gameState.currentPlayer === 'O' && !gameState.winner) {
      setGameState(prev => ({ ...prev, isBotThinking: true }));
      const timer = setTimeout(() => {
        const emptyCells: { r: number; c: number }[] = [];
        gameState.board.forEach((row, r) => {
          row.forEach((cell, c) => {
            if (!cell) emptyCells.push({ r, c });
          });
        });
        
        if (emptyCells.length > 0) {
          const randomMove = () => emptyCells[Math.floor(Math.random() * emptyCells.length)];
          let bestMove = randomMove();

          if (gameState.botDifficulty !== 'easy') {
            const testWin = (r: number, c: number, player: Player) => {
              const newBoard = gameState.board.map(row => [...row]);
              const newMove: Move = { r, c, player, item: targetItems[r][c], timestamp: Date.now() };
              let newMoves = [...gameState.moves, newMove];
              
              if (gameState.mode === '3-limit') {
                const playerMoves = newMoves.filter(m => m.player === player);
                if (playerMoves.length > 3) {
                  const oldestMove = playerMoves[0];
                  newBoard[oldestMove.r][oldestMove.c] = null;
                }
              }
              newBoard[r][c] = newMove;
              return checkWinner(newBoard).player === player;
            };

            let foundMove = false;

            // 1. Win
            for (const cell of emptyCells) {
              if (testWin(cell.r, cell.c, 'O')) { bestMove = cell; foundMove = true; break; }
            }

            // 2. Block
            if (!foundMove) {
              for (const cell of emptyCells) {
                if (testWin(cell.r, cell.c, 'X')) { bestMove = cell; foundMove = true; break; }
              }
            }

            if (!foundMove && (gameState.botDifficulty === 'hard' || Math.random() > 0.5)) {
              // 3. Center
              if (!gameState.board[1][1]) {
                bestMove = { r: 1, c: 1 };
                foundMove = true;
              }

              // 4. Block specific fork (X in opposite corners, O in center)
              if (!foundMove && gameState.board[1][1]?.player === 'O' &&
                  ((gameState.board[0][0]?.player === 'X' && gameState.board[2][2]?.player === 'X') ||
                   (gameState.board[0][2]?.player === 'X' && gameState.board[2][0]?.player === 'X'))) {
                const sides = [[0, 1], [1, 0], [1, 2], [2, 1]];
                const emptySides = sides.filter(([r, c]) => !gameState.board[r][c]);
                if (emptySides.length > 0) {
                  const [r, c] = emptySides[Math.floor(Math.random() * emptySides.length)];
                  bestMove = { r, c };
                  foundMove = true;
                }
              }

              // 5. Opposite corner
              if (!foundMove) {
                const oppositeCorners = [
                  { opp: [0, 0], mine: [2, 2] },
                  { opp: [0, 2], mine: [2, 0] },
                  { opp: [2, 0], mine: [0, 2] },
                  { opp: [2, 2], mine: [0, 0] }
                ];
                for (const { opp, mine } of oppositeCorners) {
                  if (gameState.board[opp[0]][opp[1]]?.player === 'X' && !gameState.board[mine[0]][mine[1]]) {
                    bestMove = { r: mine[0], c: mine[1] };
                    foundMove = true;
                    break;
                  }
                }
              }

              // 6. Any corner
              if (!foundMove) {
                const corners = [[0, 0], [0, 2], [2, 0], [2, 2]];
                const emptyCorners = corners.filter(([r, c]) => !gameState.board[r][c]);
                if (emptyCorners.length > 0) {
                  const [r, c] = emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
                  bestMove = { r, c };
                  foundMove = true;
                }
              }
            }
          }

          makeMove(bestMove.r, bestMove.c, targetItems[bestMove.r][bestMove.c]);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.opponent, gameState.winner, gameState.botDifficulty, gameState.board, gameState.moves, gameState.mode, targetItems]);

  useEffect(() => {
    // Apply global font scaling to the html element
    const scale = gameState.fontSize === 'large' ? '120%' : 
                  gameState.fontSize === 'extra-large' ? '150%' : '100%';
    document.documentElement.style.fontSize = scale;
  }, [gameState.fontSize]);

  const resetToDefaults = () => {
    setGameState(prev => ({
      ...prev,
      mode: 'standard',
      opponent: 'bot',
      botDifficulty: 'medium',
      category: 'colors',
      directionSet: 'compass',
      playerXName: 'Player X',
      playerOName: 'Bot',
      fontSize: 'standard',
    }));
    resetLocalGame();
  };

  const resetLocalGame = () => {
    setGameState(prev => ({ 
      ...prev, 
      board: Array(3).fill(null).map(() => Array(3).fill(null)), 
      currentPlayer: 'X', 
      winner: null, 
      winningLine: null,
      moves: [],
      isBotThinking: false
    }));
    setInputValue('');
    setError(null);
    const availableItems = CATEGORIES[gameState.category];
    const shuffled = [...availableItems].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 9);
    const newTargetItems = Array(3).fill(null).map((_, r) => Array(3).fill(null).map((_, c) => selected[r * 3 + c]));
    setTargetItems(newTargetItems);
  };

  const resetGame = () => {
    resetLocalGame();
    if (gameState.opponent === 'online' && roomId) socketRef.current?.emit('reset-game', roomId);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20 relative overflow-hidden flex flex-col items-center p-4 md:p-8 transition-all duration-300">
      {/* Full-page background with soft radial glows to prevent color banding */}
      <AtmosphericBackground />
      
      {/* Slowly moving category icons background */}
      {gameState.category !== 'colors' && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-full overflow-hidden whitespace-nowrap opacity-5 pointer-events-none">
              <motion.div 
                key={`bg-row-1-${gameState.category}`}
                animate={{ x: [0, -1000] }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="flex gap-20 items-center"
              >
                {Array(30).fill(0).map((_, i) => {
                  const items = CATEGORIES[gameState.category];
                  const item = items[i % items.length];
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-24 h-24 md:w-32 md:h-32">
                        <ItemRenderer item={item} className="w-full h-full" />
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            <div className="absolute bottom-1/4 right-0 w-full overflow-hidden whitespace-nowrap opacity-5 pointer-events-none">
              <motion.div 
                key={`bg-row-2-${gameState.category}`}
                animate={{ x: [-1000, 0] }}
                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                className="flex gap-20 items-center"
              >
                {Array(30).fill(0).map((_, i) => {
                  const items = CATEGORIES[gameState.category];
                  const item = items[(i + 5) % items.length];
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-24 h-24 md:w-32 md:h-32">
                        <ItemRenderer item={item} className="w-full h-full" />
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>
        </div>
      )}

      {/* Google-Style Header */}
      <header className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center mb-8 gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-md border border-white/20 flex items-center justify-center text-white overflow-hidden">
            <LogoIcon className="w-full h-full" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-medium tracking-tight text-white">
              {t.title}
            </h1>
            <p className="text-xs text-white/50 uppercase tracking-widest">{t.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 sm:gap-2 bg-[#1a1a1a] shadow-sm border border-white/10 rounded-full px-2 sm:px-4 py-1 sm:py-2">
            <LucideLanguages size={18} className="text-white/70 hidden sm:block" />
            {(['est', 'eng', 'rus'] as Language[]).map(lang => (
              <button 
                key={lang}
                onClick={() => {
                  const newT = UI_STRINGS[lang];
                  setGameState(p => ({ 
                    ...p, 
                    language: lang,
                    playerXName: p.playerXName.startsWith('Player') || p.playerXName.startsWith('Игрок') || p.playerXName.startsWith('Mängija') ? (lang === 'rus' ? 'Игрок X' : lang === 'est' ? 'Mängija X' : 'Player X') : p.playerXName,
                    playerOName: p.playerOName === 'Bot' || p.playerOName === 'БОТ' || p.playerOName === 'BOT' ? newT.bot : p.playerOName
                  }));
                }}
                className={`text-xs sm:text-sm font-bold uppercase transition-colors px-2 py-1 rounded-md ${gameState.language === lang ? 'bg-white/10 text-[#007AFF]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                {lang}
              </button>
            ))}
          </div>

          <div className="flex gap-1 sm:gap-2 bg-[#1a1a1a] shadow-sm border border-white/10 rounded-full px-2 sm:px-4 py-1 sm:py-2">
            <Tooltip text={t.howToPlay}>
              <button onClick={() => setShowTutorial(true)} className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
                <LucideInfo size={22} />
              </button>
            </Tooltip>
            <Tooltip text={t.showHints}>
              <button 
                onClick={() => setShowHints(!showHints)} 
                className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors ${showHints ? 'text-[#007AFF] bg-white/10' : 'text-white/70 hover:text-white'}`}
              >
                <div className="relative">
                  <LucideGrid3X3 size={22} />
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-black flex items-center justify-center ${showHints ? 'bg-[#007AFF]' : 'bg-white/20'}`}>
                    {showHints && <LucideCheck size={8} className="text-white" strokeWidth={4} />}
                  </div>
                </div>
              </button>
            </Tooltip>
            <Tooltip text={t.settings}>
              <button 
                onClick={() => {
                  setSettingsHighlight(null);
                  setShowSettings(true);
                }} 
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
              >
                <LucideSettings size={22} />
              </button>
            </Tooltip>
            <Tooltip text={t.buyMeACoffee}>
              <a 
                href="https://buymeacoffee.com/Erikegliens" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-[#FFDD00] hover:bg-[#FFDD00]/90 rounded-full transition-all text-black shadow-sm hover:scale-110"
              >
                <BuyMeACoffeeIcon className="scale-75" />
              </a>
            </Tooltip>
            <Tooltip text={t.newGame} position="right">
              <button onClick={resetGame} className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
                <LucideRotateCcw size={22} />
              </button>
            </Tooltip>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-0 md:p-4" 
            onClick={() => setShowSettings(false)}
          >
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#1a1a1a] border-t md:border border-white/10 w-full max-w-md max-h-[90vh] overflow-hidden rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl relative flex flex-col" 
              onClick={e => e.stopPropagation()}
            >
              {/* Sticky Header with Handle */}
              <div className="sticky top-0 bg-[#1a1a1a] z-20 flex flex-col border-b border-white/10 shadow-lg">
                <div className="w-full flex justify-center pt-3 pb-1 md:hidden">
                  <div className="w-10 h-1 bg-white/20 rounded-full" />
                </div>
                <div className="px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white tracking-tight">{t.settings}</h2>
                  <button 
                    onClick={() => setShowSettings(false)} 
                    className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full transition-all text-white/70 hover:text-white"
                  >
                    <LucideX size={18} />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <LucideUser size={14} className="text-[#007AFF]" />
                      <label className="text-[0.625rem] font-bold uppercase text-white/60">{t.player} X {t.name}</label>
                    </div>
                    <input 
                      type="text" 
                      value={gameState.playerXName} 
                      onChange={(e) => setGameState(p => ({ ...p, playerXName: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:outline-none focus:border-[#007AFF] text-sm text-white"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <LucideUser size={14} className="text-[#007AFF]" />
                      <label className="text-[0.625rem] font-bold uppercase text-white/60">{t.player} O {t.name}</label>
                    </div>
                    <input 
                      type="text" 
                      value={gameState.playerOName} 
                      onChange={(e) => setGameState(p => ({ ...p, playerOName: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:outline-none focus:border-[#007AFF] text-sm text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <LucideHelpCircle size={14} className="text-[#007AFF]" />
                    <label className="text-xs font-bold uppercase text-white/60">{t.showHints}</label>
                  </div>
                  <button 
                    onClick={() => setShowHints(!showHints)}
                    className={`w-12 h-6 rounded-full transition-all relative ${showHints ? 'bg-[#007AFF]' : 'bg-white/10'}`}
                  >
                    <motion.div 
                      animate={{ x: showHints ? 24 : 4 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <LucideUser size={14} className="text-[#007AFF]" />
                    <label className="text-xs font-bold uppercase text-white/60 block">{t.changeOpponent}</label>
                  </div>
                  <div className="flex gap-2">
                    {(['human', 'bot' /*, 'online'*/] as const).map(o => (
                      <button 
                        key={o} 
                        onClick={() => {
                          setGameState(p => ({ 
                            ...p, 
                            opponent: o, 
                            myRole: null,
                            playerOName: o === 'bot' ? t.bot : (p.language === 'rus' ? 'Игрок O' : 'Player O')
                          }));
                          resetLocalGame();
                        }}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all border flex items-center justify-center gap-2 ${gameState.opponent === o ? 'bg-[#007AFF] border-[#007AFF] text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'}`}
                      >
                        {o === 'human' ? <LucideUsers size={14} /> : <LucideBot size={14} />}
                        {o === 'human' ? t.friend : o === 'bot' ? t.bot : t.online}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {gameState.opponent === 'bot' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <LucideBrain size={14} className="text-[#007AFF]" />
                        <label className="text-xs font-bold uppercase text-white/60 block">{t.difficulty}</label>
                      </div>
                      <div className="flex gap-2">
                        {(['easy', 'medium', 'hard'] as const).map(d => (
                          <button 
                            key={d} 
                            onClick={() => { setGameState(p => ({ ...p, botDifficulty: d })); resetLocalGame(); }}
                            className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all border flex items-center justify-center gap-2 ${gameState.botDifficulty === d ? 'bg-[#007AFF] border-[#007AFF] text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'}`}
                          >
                            {d === 'easy' ? '🟢 ' + t.easy : d === 'medium' ? '🟡 ' + t.medium : '🔴 ' + t.hard}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={directionsRef} className={`transition-all duration-500 rounded-2xl ${settingsHighlight === 'directions' ? 'ring-2 ring-[#007AFF]/50 bg-[#007AFF]/10 p-3 -mx-3' : ''}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <LucideCompass size={14} className="text-[#007AFF]" />
                    <label className="text-xs font-bold uppercase text-white/60 block">{t.directions}</label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(['compass', 'simple', 'adventure', 'regions', 'family', 'solar', 'body', 'weather', 'emotions', 'time', 'elements', 'chess'] as const).map(set => (
                      <button 
                        key={set} 
                        onClick={() => setGameState(p => ({ ...p, directionSet: set }))}
                        className={`px-3 py-3 rounded-xl border text-[0.625rem] font-bold uppercase transition-all ${gameState.directionSet === set ? 'bg-[#007AFF] border-[#007AFF] text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'}`}
                      >
                        {t.directionSetNames[set]}
                      </button>
                    ))}
                  </div>
                </div>

                <div ref={categoryRef} className={`transition-all duration-500 rounded-2xl ${settingsHighlight === 'category' ? 'ring-2 ring-[#007AFF]/50 bg-[#007AFF]/10 p-3 -mx-3' : ''}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <LucideLayers size={14} className="text-[#007AFF]" />
                    <label className="text-xs font-bold uppercase text-white/60 block">{t.category}</label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(Object.keys(CATEGORIES) as CategoryType[]).map(cat => (
                      <button 
                        key={cat} 
                        onClick={() => { setGameState(p => ({ ...p, category: cat })); resetLocalGame(); }}
                        className={`px-3 py-3 rounded-xl border text-[0.625rem] font-bold uppercase transition-all ${gameState.category === cat ? 'bg-[#007AFF] border-[#007AFF] text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'}`}
                      >
                        {t.categoryNames[cat]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <IconAAA size={14} className="text-[#007AFF]" />
                    <label className="text-xs font-bold uppercase text-white/60 block">{t.fontSize}</label>
                  </div>
                  <div className="flex gap-2">
                    {(['standard', 'large', 'extra-large'] as const).map(size => (
                      <button 
                        key={size} 
                        onClick={() => setGameState(p => ({ ...p, fontSize: size }))}
                        className={`flex-1 py-3 rounded-xl text-[0.625rem] font-bold uppercase transition-all border flex items-center justify-center gap-2 ${gameState.fontSize === size ? 'bg-[#007AFF] border-[#007AFF] text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'}`}
                      >
                        <IconAAA size={size === 'standard' ? 10 : size === 'large' ? 14 : 18} />
                        {size === 'standard' ? t.standardSize : size === 'large' ? t.largeSize : t.extraLargeSize}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <LucideZap size={14} className="text-[#007AFF]" />
                    <label className="text-xs font-bold uppercase text-white/60 block">{t.mode}</label>
                  </div>
                  <div className="flex gap-2">
                    {(['standard', '3-limit'] as const).map(m => (
                      <button 
                        key={m} 
                        onClick={() => { setGameState(p => ({ ...p, mode: m })); resetLocalGame(); }}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all border flex items-center justify-center gap-2 ${gameState.mode === m ? 'bg-[#007AFF] border-[#007AFF] text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'}`}
                      >
                        {m === 'standard' ? <LucideGrid3X3 size={14} /> : <LucideZap size={14} />}
                        {m === 'standard' ? t.standard : t.limit3}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
                  <button 
                    onClick={resetToDefaults}
                    className="py-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-2xl font-bold text-[0.625rem] uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center gap-2"
                  >
                    <LucideRefreshCcw size={14} />
                    {t.resetToDefault}
                  </button>
                  <button 
                    onClick={resetToDefaults}
                    className="py-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-2xl font-bold text-[0.625rem] uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center gap-2"
                  >
                    <LucideGrid3X3 size={14} />
                    {t.defaultSize}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial Modal */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setShowTutorial(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-black/80 backdrop-blur-xl border border-white/10 w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 md:p-12 rounded-[2rem] shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#007AFF] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <LucideInfo size={24} className="text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">{t.howToPlay}</h2>
                </div>
                <button onClick={() => setShowTutorial(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/60 hover:text-white"><LucideX size={28} /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mb-4 group-hover:border-[#007AFF] transition-colors">
                    <LucideGrid3X3 size={32} className="text-[#007AFF]" />
                  </div>
                  <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-[0.625rem] opacity-50">1. {t.tutorial.step1Title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{t.tutorial.step1Text}</p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mb-4 group-hover:border-[#34C759] transition-colors">
                    <LucideZap size={32} className="text-[#34C759]" />
                  </div>
                  <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-[0.625rem] opacity-50">2. {t.tutorial.step2Title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed mb-4">{t.tutorial.step2Text}</p>
                  <div className="w-full bg-white/5 p-3 rounded-xl font-mono text-xs border border-white/10 text-[#34C759] font-bold">
                    &gt; {t.tutorial.example}
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mb-4 group-hover:border-[#FFCC00] transition-colors">
                    <LucideTrophy size={32} className="text-[#FFCC00]" />
                  </div>
                  <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-[0.625rem] opacity-50">3. {t.tutorial.step3Title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {t.tutorial.step3Text}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setShowTutorial(false)} 
                className="w-full py-5 bg-[#007AFF] text-white rounded-2xl font-bold text-lg hover:bg-[#0056B3] transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98]"
              >
                {t.start}
              </button>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/5 text-center">
                <p className="text-sm text-white/50 italic">
                  {gameState.language === 'est' ? 'See on nagu võlukunst – sinu sõnad muudavad mängu!' : 
                   (gameState.language === 'rus' ? 'Это как магия – твои слова меняют игру!' : 
                    'It\'s like magic – your words change the game!')}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Online Link */}
      {roomId && (
        <div className="w-full max-w-2xl mb-8 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex justify-between items-center shadow-xl relative z-10">
          <div className="flex flex-col">
            <span className="text-[0.625rem] font-bold uppercase text-white/60">{t.onlineRoom}: {roomId}</span>
            <span className="text-xs font-mono truncate max-w-[200px] md:max-w-md text-white/60">{window.location.href}</span>
          </div>
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex items-center gap-2 text-xs font-medium text-[#007AFF] hover:bg-white/5 px-4 py-2 rounded-full transition-colors">
            {copied ? <LucideCheck size={16} /> : <LucideCopy size={16} />}
            {copied ? t.copied : t.copyLink}
          </button>
        </div>
      )}

      {/* Game Info Cards */}
      <div className="w-full max-w-2xl grid grid-cols-2 gap-4 mb-8 relative z-10">
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${gameState.currentPlayer === 'X' ? 'bg-white/10 border-[#007AFF] shadow-lg scale-105' : 'bg-white/5 border-white/5 opacity-40'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[0.625rem] font-bold uppercase text-white/60">{t.player} X</span>
            <GoogleX className="w-4 h-4 text-[#007AFF]" />
          </div>
          <span className="text-xl font-medium text-white">{gameState.playerXName}</span>
        </div>
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${gameState.currentPlayer === 'O' ? 'bg-white/10 border-[#FF3B30] shadow-lg scale-105' : 'bg-white/5 border-white/5 opacity-40'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[0.625rem] font-bold uppercase text-white/60">{t.player} O</span>
            <div className="flex items-center gap-2">
              {gameState.isBotThinking && (
                <motion.div 
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-[0.5rem] font-bold text-[#FF3B30] uppercase tracking-tighter"
                >
                  Thinking...
                </motion.div>
              )}
              <GoogleO className="w-4 h-4 text-[#FF3B30]" />
            </div>
          </div>
          <span className="text-xl font-medium text-white">
            {gameState.playerOName}
          </span>
        </div>
      </div>

      {/* Board */}
      <div className="relative mb-8 p-4 bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 relative z-10">
        <div className="grid grid-cols-3 gap-3 relative">
          {/* Winning Line SVG */}
          {gameState.winner && gameState.winningLine && (
            <svg className="absolute inset-0 w-full h-full z-30 pointer-events-none" viewBox="0 0 300 300">
              <motion.line
                x1={gameState.winningLine[0][1] * 100 + 50}
                y1={gameState.winningLine[0][0] * 100 + 50}
                x2={gameState.winningLine[2][1] * 100 + 50}
                y2={gameState.winningLine[2][0] * 100 + 50}
                stroke={gameState.winner === 'X' ? '#007AFF' : '#FF3B30'}
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ filter: `drop-shadow(0 0 10px ${gameState.winner === 'X' ? '#007AFF' : '#FF3B30'})` }}
              />
            </svg>
          )}

          {gameState.board.map((row, r) => 
            row.map((cell, c) => (
              <motion.div 
                key={`${r}-${c}`}
                initial={false}
                animate={{ 
                  backgroundColor: cell ? (cell.item.hex || '#1a1a1a') : (targetItems[r]?.[c]?.hex || '#1a1a1a'),
                  boxShadow: cell ? `0 15px 40px ${cell.item.hex || '#007AFF'}44` : 'inset 0 4px 20px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.1)',
                  borderColor: cell ? (cell.item.hex === '#FFFFFF' || cell.item.hex === '#F5F5DC' ? 'rgba(255,255,255,0.2)' : (cell.item.hex || '#007AFF')) : 'rgba(255,255,255,0.05)',
                  scale: cell ? 1 : 0.98,
                  opacity: cell ? 1 : 0.8
                }}
                className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl border flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 group ${!cell ? 'cursor-pointer hover:opacity-100 hover:bg-white/5 hover:border-t-white/20' : ''}`}
              >
                {/* Recent move highlight */}
                {gameState.moves.length > 0 && gameState.moves[gameState.moves.length - 1].r === r && gameState.moves[gameState.moves.length - 1].c === c && (
                  <div className="absolute inset-0 border-4 border-white/30 z-20 rounded-2xl pointer-events-none" />
                )}

                {showHints && (
                  <span className={`absolute top-1 left-1 text-[0.5rem] md:text-[0.5625rem] font-bold uppercase font-mono z-10 leading-tight max-w-[80%] text-white px-1.5 py-0.5 bg-black/40 backdrop-blur-sm rounded-md border border-white/10`}>
                    {(() => {
                      const directions = DIRECTION_SETS[gameState.directionSet];
                      const key = Object.keys(directions).find(k => directions[k].r === r && directions[k].c === c);
                      return key ? t.directionAbbreviations[key as keyof typeof t.directionAbbreviations] : '';
                    })()}
                  </span>
                )}
                
                {/* Item display (always visible, but dimmed if not taken) */}
                {targetItems[r]?.[c] && (
                  <div className={`absolute inset-0 p-2 transition-all duration-300 ${cell ? 'opacity-30' : (showHints ? 'opacity-40' : 'opacity-20 group-hover:opacity-40')}`}>
                    <ItemRenderer item={targetItems[r][c]} className="w-full h-full" />
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {cell ? (
                    <motion.div 
                      key={`cell-${cell.timestamp}`}
                      initial={{ scale: 0, rotate: -45, opacity: 0 }} 
                      animate={{ 
                        scale: 1, 
                        rotate: 0,
                        opacity: 1 
                      }} 
                      exit={{ 
                        scale: 0, 
                        opacity: 0, 
                        filter: 'blur(10px)',
                        transition: { duration: 0.3 }
                      }}
                      transition={{ 
                        type: 'spring', 
                        damping: 12, 
                        stiffness: 200,
                        duration: 0.5
                      }}
                      className="flex flex-col items-center z-10"
                    >
                      <div className="w-[66px] h-[66px] md:w-[98px] md:h-[98px] bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.2)] border-2 border-white/20">
                        {cell.player === 'X' ? (
                          <GoogleX className="w-8 h-8 md:w-12 md:h-12 text-[#007AFF] drop-shadow-[0_2px_4px_rgba(0,122,255,0.3)]" />
                        ) : (
                          <GoogleO className="w-8 h-8 md:w-12 md:h-12 text-[#FF3B30] drop-shadow-[0_2px_4px_rgba(255,59,48,0.3)]" />
                        )}
                      </div>
                      {showHints && (
                        <span 
                          className="text-[0.625rem] font-bold uppercase font-mono text-white px-2 py-1 rounded-md border border-white/20 shadow-lg"
                          style={{ 
                            backgroundColor: cell.item.hex ? `${cell.item.hex}CC` : 'rgba(0,0,0,0.6)',
                            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                          }}
                        >
                          {cell.item.eesti}
                        </span>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center w-full h-full z-10"
                    >
                      {showHints && (
                        <motion.div 
                          className="text-[0.625rem] font-bold uppercase font-mono opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-center px-2 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/10 text-white z-20 shadow-xl"
                        >
                          {targetItems[r]?.[c]?.eesti}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Oldest move indicator for 3-limit mode */}
                {gameState.mode === '3-limit' && cell && 
                 gameState.moves.filter(m => m.player === cell.player).length === 3 &&
                 gameState.moves.filter(m => m.player === cell.player)[0].r === r &&
                 gameState.moves.filter(m => m.player === cell.player)[0].c === c && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0.1, 0.4, 0.1],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-white/20 pointer-events-none flex items-center justify-center"
                  >
                    <div className="w-full h-full border-4 border-white/20 rounded-2xl" />
                  </motion.div>
                )}

                {/* Success Ripple Effect */}
                {cell && Date.now() - cell.timestamp < 1000 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-0 bg-white/20 rounded-full pointer-events-none"
                  />
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Winner Overlay */}
        <AnimatePresence>
          {gameState.winner && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center z-50 p-8 text-center rounded-3xl border border-white/20 shadow-[0_0_100px_rgba(0,122,255,0.3)]"
            >
              <motion.div 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mb-6 relative"
              >
                <div className="absolute inset-0 blur-2xl bg-[#FFCC00]/20 animate-pulse" />
                <LucideTrophy size={100} className="text-[#FFCC00] relative z-10 drop-shadow-[0_0_20px_rgba(255,204,0,0.5)]" />
              </motion.div>
              
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-6xl font-black mb-4 text-white tracking-tighter"
              >
                {gameState.winner === 'Draw' ? t.draw : (
                  <div className="flex flex-col gap-4 items-center">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring' }}
                      className="px-6 py-2 bg-white/10 rounded-full border border-white/20 text-sm uppercase tracking-[0.5em] text-white/60"
                    >
                      {t.winner}
                    </motion.div>
                    <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5C3] via-[#FFCC00] to-[#FF9500] drop-shadow-[0_10px_20px_rgba(255,204,0,0.6)] font-black" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>
                      {gameState.winner === 'X' ? gameState.playerXName : gameState.playerOName}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent bg-clip-text text-transparent opacity-50 pointer-events-none" />
                    </span>
                  </div>
                )}
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mb-12 text-2xl text-white/80 font-medium"
              >
                {gameState.winner === 'Draw' ? (gameState.language === 'est' ? 'Viik!' : 'It\'s a draw!') : (gameState.language === 'est' ? 'Suurepärane võit!' : 'Excellent victory!')}
              </motion.p>

              <motion.button 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={resetGame} 
                className="group relative h-16 px-16 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] overflow-hidden flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#007AFF] to-[#00C6FF] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 group-hover:text-white transition-colors leading-none inline-flex items-center justify-center">{t.playAgain}</span>
              </motion.button>

              {/* Confetti-like particles */}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    scale: 0,
                    rotate: 0 
                  }}
                  animate={{ 
                    x: (Math.random() - 0.5) * 600, 
                    y: (Math.random() - 0.5) * 600,
                    scale: [0, 1, 0],
                    rotate: Math.random() * 360
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ 
                    backgroundColor: ['#007AFF', '#FF3B30', '#FFCC00', '#34C759'][i % 4]
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="w-full max-w-lg">
        <form onSubmit={handleInput} className="relative group">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!!gameState.winner || (gameState.opponent === 'bot' && gameState.currentPlayer === 'O') || (gameState.opponent === 'online' && gameState.currentPlayer !== gameState.myRole)}
            placeholder={
              gameState.winner ? (gameState.language === 'est' ? 'Mäng läbi!' : 'Game over!') :
              (gameState.opponent === 'bot' && gameState.currentPlayer === 'O') ? (gameState.language === 'est' ? 'Bot mõtleb...' : 'Bot is thinking...') :
              (gameState.opponent === 'online' && gameState.currentPlayer !== gameState.myRole) ? t.waiting : 
              t.inputPlaceholder
            }
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl py-5 pl-6 pr-40 text-base md:text-lg font-medium shadow-xl focus:outline-none focus:border-[#007AFF] focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-white/20 text-white"
            autoFocus
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Tooltip text={t.helpText} position="right">
              <div className="p-2 text-white/30 hover:text-white/60 transition-colors cursor-help">
                <LucideHelpCircle size={20} />
              </div>
            </Tooltip>
            <button type="submit" className="p-3 bg-[#007AFF] text-white rounded-xl shadow-lg hover:bg-[#0056B3] transition-all">
              <LucideGamepad2 size={24} />
            </button>
          </div>
        </form>
        
        {error && (
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[#FF3B30] text-sm mt-3 font-medium text-center">
            {error}
          </motion.p>
        )}
      </div>

      {/* Legend / Info */}
      <div className="mt-12 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-8 relative z-10 items-start">
        <AccordionBox 
          title={t.directions} 
          onSettingsClick={() => { setSettingsHighlight('directions'); setShowSettings(true); }}
        >
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(DIRECTION_SETS[gameState.directionSet]).map(dir => (
              <div key={dir} className="p-2 bg-white/5 rounded-lg border border-white/10 flex flex-col items-center">
                <span className="text-[0.625rem] font-bold text-white">{dir}</span>
                {gameState.language !== 'est' && (
                  <span className="text-[0.5rem] text-white/40 uppercase">
                    {t.directionAbbreviations[dir as keyof typeof t.directionAbbreviations]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </AccordionBox>

        <AccordionBox 
          title={`${t.category}: ${t.categoryNames[gameState.category]}`}
          onSettingsClick={() => { setSettingsHighlight('category'); setShowSettings(true); }}
        >
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {targetItems.flat().map((item, idx) => (
              <div key={`${item.eesti}-${idx}`} className="flex justify-between text-xs border-b border-white/5 pb-1 items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6">
                    <ItemRenderer item={item} className="w-full h-full" />
                  </div>
                  <span className="font-medium text-white">{item.eesti}</span>
                </div>
                {gameState.language !== 'est' && (
                  <span className="text-white/40 italic text-[0.625rem]">
                    {gameState.language === 'rus' ? item.vene : item.english}
                  </span>
                )}
              </div>
            ))}
          </div>
        </AccordionBox>
      </div>

      {/* Tutor CTA Banner */}
      <div className="mt-16 w-full max-w-4xl relative overflow-hidden rounded-3xl p-1 z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-[#007AFF] via-[#5856D6] to-[#FF2D55] opacity-20 animate-pulse" />
        <div className="relative bg-[#1a1a1a]/80 backdrop-blur-xl rounded-[22px] border border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center shadow-lg shrink-0">
              <LucideGraduationCap size={28} className="text-white" />
            </div>
            <div className="flex flex-col text-left">
              <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                {gameState.language === 'rus' ? 'Хотите выучить эстонский язык?' : 
                 gameState.language === 'est' ? 'Soovid õppida eesti keelt?' : 
                 'Want to learn Estonian?'}
              </h3>
              <p className="text-xs md:text-sm text-white/70 max-w-md">
                {gameState.language === 'rus' ? 'Индивидуальные уроки с опытным преподавателем. Начните говорить уверенно!' : 
                 gameState.language === 'est' ? 'Individuaaltunnid kogenud õpetajaga. Hakka kindlalt rääkima!' : 
                 'Private lessons with an experienced tutor. Start speaking confidently!'}
              </p>
            </div>
          </div>
          <a 
            href="mailto:partner.erik.egliens@gmail.com?subject=Estonian%20Language%20Lessons"
            className="group relative px-6 py-3 md:py-4 bg-white text-black font-bold rounded-xl overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all shrink-0 w-full md:w-auto text-center flex justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="relative flex items-center gap-2 text-sm md:text-base">
              <LucideMail size={18} />
              {gameState.language === 'rus' ? 'Связаться со мной' : 
               gameState.language === 'est' ? 'Võta minuga ühendust' : 
               'Contact Me'}
            </span>
          </a>
        </div>
      </div>

      {/* Footer / Credentials */}
      <footer className="mt-12 w-full max-w-4xl border-t border-[#DADCE0] pt-8 pb-12 flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="https://buymeacoffee.com/Erikegliens" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="donate-btn-bmc cookie-regular scale-75 md:scale-90 origin-center"
          >
            <BuyMeACoffeeIcon className="mt-1" />
            <span>Buy me a coffee</span>
          </a>
        </div>
        <div className="flex gap-6">
          {CREDENTIALS.map(c => (
            <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#5F6368] hover:text-[#007AFF] transition-colors">
              {c.name}
            </a>
          ))}
        </div>
        <p className="text-xs text-[#BDC1C6]">© 2026 Erik Egliens. All rights reserved.</p>
      </footer>
    </div>
  );
}
