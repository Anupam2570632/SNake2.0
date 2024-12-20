import React, { useState, useEffect } from "react";
import "./game.css";

const GameBoard = () => {
  const cells = Array(20 * 20).fill(null); // 20x20 grid

  const [snake, setSnake] = useState([{ x: 10, y: 10 }]); // Initial snake position
  const [direction, setDirection] = useState({ x: 0, y: 1 }); // Initial direction (down)
  const [food, setFood] = useState({
    x: Math.floor(Math.random() * 20),
    y: Math.floor(Math.random() * 20),
  }); // Random initial food position
  const [score, setScore] = useState(0);

  // Move Snake
  useEffect(() => {
    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };
        const newSnake = [newHead, ...prevSnake]; // Add new head
        if (food.x !== newHead.x || food.y !== newHead.y) {
          // If food not eaten, remove the tail
          newSnake.pop();
        } else {
          // If food eaten, do not remove the tail (snake grows)
          setFood({
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20),
          });
          setScore((prevScore) => prevScore + 1);
        }
        return newSnake;
      });
    };

    const checkGameOver = () => {
      const head = snake[0];
      // Check wall collision
      if (head.x < 0 || head.y < 0 || head.x >= 20 || head.y >= 20) return true;
      // Check self collision
      return snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y);
    };

    const gameLoop = () => {
      moveSnake();
      if (checkGameOver()) {
        alert("Game Over! Final Score: " + score);
        resetGame();
      }
    };

    const interval = setInterval(gameLoop, 200); // Game loop every 200ms
    return () => clearInterval(interval);
  }, [direction, snake, food, score]);

  // Handle Keyboard Input
  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case "ArrowUp":
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: 1 });
    setFood({
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20),
    });
    setScore(0);
  };

  return (
    <div>
      <h2>Score: {score}</h2>
      <div className="gameboard">
        {cells.map((_, index) => {
          const x = index % 20;
          const y = Math.floor(index / 20);
          const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;
          return (
            <div
              key={index}
              className={`cell ${isSnake ? "snake" : ""} ${isFood ? "food" : ""}`}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default GameBoard;
