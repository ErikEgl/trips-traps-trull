# Eesti Risti-Rästi (Estonian Tic-Tac-Toe)

[![Deployed on GitHub Pages](https://img.shields.io/badge/Deployed_on-GitHub_Pages-blue?logo=github)](https://your-username.github.io/your-repo-name/)

**Eesti Risti-Rästi** is a modern, interactive Tic-Tac-Toe game designed to help you learn Estonian (along with English and Russian) vocabulary while playing. By typing colors, directions, and other categories in the target language, you claim your spots on the board!

## ✨ Features

- **🌍 Language Learning**: Master vocabulary across multiple categories (Colors, Animals, Food, Tech, etc.) in Estonian, Russian, and English.
- **🎮 3 Game Modes**:
  - **Single Player**: Challenge a smart Bot with adjustable difficulty (Easy, Medium, Hard).
  - **Local Multiplayer**: Play with a friend on the same device.
  - **Online Multiplayer**: Create a room and play with friends remotely in real-time.
- **🧠 Advanced Rules**: Toggle the "3-Piece Limit" (Infinite Tic-Tac-Toe) where only your 3 most recent moves stay on the board, adding a layer of deep strategy.
- **🎨 Premium UI/UX**:
  - Deep atmospheric dark mode with neon accents.
  - Glassmorphism effects and tactile game board cells.
  - Smooth, spring-based animations powered by Framer Motion.
  - Fully responsive design for seamless play on mobile and desktop.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend (Multiplayer)**: Node.js, Express, Socket.IO

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/eesti-risti-rasti.git
   cd eesti-risti-rasti
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## 🌐 Deployment (GitHub Pages)

This project is fully compatible with GitHub Pages. Since it includes an Express/Socket.IO backend for online multiplayer, you might need to host the backend separately (e.g., on Render, Heroku, or Railway) and point your GitHub Pages frontend to it, or use it purely as a local/bot game when hosted statically.

To deploy the frontend to GitHub Pages:

1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your `gh-pages` branch (you can use tools like the `gh-pages` npm package or GitHub Actions).

## 🎮 How to Play

1. Choose your **Language** (Estonian, Russian, or English).
2. Select a **Category** (e.g., Colors, Animals, Directions).
3. To make a move, type the correct translation of the target word for the cell you want to claim.
4. Get 3 in a row to win! (If the 3-piece limit is on, plan ahead—your oldest piece will vanish when you place your 4th!).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

## 📝 License

This project is licensed under the MIT License.

---
*Enjoy learning while playing!*
