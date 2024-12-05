import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHome, FiRefreshCcw } from 'react-icons/fi';

const NotFound = () => {
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const controls = useAnimation();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [target, setTarget] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (gameActive) {
      generateNewTarget();
    }
  }, [gameActive]);

  const generateNewTarget = () => {
    const maxWidth = window.innerWidth - 100;
    const maxHeight = window.innerHeight - 100;
    setTarget({
      x: Math.random() * maxWidth - maxWidth / 2,
      y: Math.random() * maxHeight - maxHeight / 2,
    });
  };

  const handleCatchTarget = () => {
    setScore(score + 1);
    generateNewTarget();
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
  };

  const stopGame = () => {
    setGameActive(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="text-center"
      >
        <motion.h1
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="text-9xl font-bold text-indigo-600 mb-4"
        >
          404
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl text-gray-600 mb-8"
        >
          Oops! Page not found
        </motion.p>
      </motion.div>

      {!gameActive ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 text-center"
        >
          <p className="text-gray-600 mb-4">
            While you're here, want to play a quick game?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Start Catch the Dot Game
          </motion.button>
        </motion.div>
      ) : (
        <div className="relative w-full h-[400px] mb-8">
          <motion.div
            drag
            dragConstraints={{ left: -500, right: 500, top: -200, bottom: 200 }}
            dragElastic={0.1}
            onDrag={(_, info) => setPosition({ x: info.point.x, y: info.point.y })}
            className="absolute cursor-grab active:cursor-grabbing"
            style={{ left: "50%", top: "50%" }}
          >
            <motion.div
              className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {score}
            </motion.div>
          </motion.div>

          <motion.div
            className="w-6 h-6 bg-red-500 rounded-full absolute"
            initial={false}
            animate={{
              x: target.x,
              y: target.y,
            }}
            onClick={handleCatchTarget}
            style={{ left: "50%", top: "50%" }}
            whileHover={{ scale: 1.2 }}
          />
        </div>
      )}

      <div className="flex space-x-4 mt-8">
        {gameActive && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stopGame}
            className="flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:bg-red-600 transition-colors duration-200"
          >
            <FiRefreshCcw className="w-5 h-5" />
            <span>Stop Game</span>
          </motion.button>
        )}
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <FiHome className="w-5 h-5" />
            <span>Go Home</span>
          </motion.button>
        </Link>
      </div>

      {gameActive && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-gray-600"
        >
          Drag the blue circle and click the red dots to score points!
        </motion.p>
      )}
    </div>
  );
};

export default NotFound;
