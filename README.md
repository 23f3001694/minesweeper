# Minesweeper Game 🎮

A classic Minesweeper game built with HTML, CSS, and JavaScript. Play it online at: [Your GitHub Pages URL]

## Features

- **Multiple Difficulty Levels**: Easy (9x9), Medium (16x16), and Hard (30x16)
- **Responsive Design**: Works on desktop and mobile devices
- **Touch Support**: Long press to flag on mobile devices
- **Timer**: Track your solving time
- **Flag Counter**: Keep track of placed flags
- **Beautiful UI**: Modern gradient design with smooth animations

## How to Play

- **Left Click**: Reveal a cell
- **Right Click** (or long press on mobile): Place/remove flag
- **Goal**: Reveal all cells without mines
- **Numbers**: Show count of adjacent mines

## GitHub Pages Setup

To host this Minesweeper game on GitHub Pages:

1. **Fork or Clone this Repository**
   ```bash
   git clone https://github.com/yourusername/minesweeper-game.git
   cd minesweeper-game
   ```

2. **Push to Your GitHub Repository**
   ```bash
   git add .
   git commit -m "Initial commit: Minesweeper game"
   git push origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click on **Settings** tab
   - Scroll down to **Pages** section
   - Under **Source**, select **Deploy from a branch**
   - Choose **main** branch and **/ (root)** folder
   - Click **Save**

4. **Access Your Game**
   - Your game will be available at: `https://yourusername.github.io/repository-name`
   - It may take a few minutes to deploy

## File Structure

```
static-website/
├── index.html      # Main HTML file
├── styles.css      # CSS styles and responsive design
├── script.js       # Game logic and interactions
└── README.md       # This file
```

## Technical Details

- **Pure Vanilla JavaScript**: No external dependencies
- **Mobile Responsive**: Adapts to different screen sizes
- **Touch Events**: Supports touch interactions for mobile devices
- **Local Storage**: Could be extended to save high scores
- **Modern CSS**: Uses Flexbox, Grid, and CSS animations

## Game Logic

The game implements classic Minesweeper rules:
- Mines are randomly placed at the start of each game
- Numbers indicate how many mines are adjacent to a cell
- Clicking a mine ends the game
- Flagged cells cannot be revealed
- Auto-reveal feature for cells with no adjacent mines
- Win condition: reveal all non-mine cells

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Feel free to submit issues and enhancement requests! Some ideas for contributions:
- High score tracking
- Sound effects
- Different themes
- Multiplayer mode
- Additional difficulty levels

## License

This project is open source and available under the [MIT License](LICENSE).

---

Enjoy playing Minesweeper! 🎯