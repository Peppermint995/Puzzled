// ==========================
// games.js
// ==========================

const gamesContainer = document.getElementById("games");
const loader = document.getElementById("loader");
const progressBar = document.getElementById("progressBar");

async function loadGames() {
  // Fetch games.json or use manual array
  let realGames;
  try {
    const res = await fetch("/games/games.json");
    realGames = await res.json();
  } catch(e) {
    // Fallback if JSON not found: use manual list
    realGames = [
      {name: "SpaceShooter", url: "/games/spaceshooter.html"},
      {name: "MazeRunner", url: "/games/mazerunner.html"},
      {name: "BrickBreaker", url: "/games/brickbreaker.html"}
    ];
  }

  let completed = 0;
  const total = realGames.length;

  for (const game of realGames) {
    addGameCard(game.name, game.url);

    completed++;
    progressBar.style.width = ((completed / total) * 100) + "%";
    loader.innerText = `Scanning… ${Math.floor((completed / total) * 100)}%`;

    await new Promise(r => setTimeout(r, 50)); // small delay for animation
  }

  loader.innerText = "Scan complete";
}

// AI-generated logo function
function generateLogo(name){
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 120;
  const ctx = canvas.getContext("2d");

  let hash = 0;
  for(let i=0;i<name.length;i++) hash = name.charCodeAt(i) + ((hash<<5)-hash);
  const r = (hash>>0)&255, g = (hash>>8)&255, b = (hash>>16)&255;
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(name, canvas.width/2, canvas.height/2);

  return canvas.toDataURL();
}

// Create a game card
function addGameCard(name, url){
  const card = document.createElement("div");
  card.className = "game-card";

  const img = document.createElement("img");
  img.className = "game-logo";
  img.src = generateLogo(name);

  const title = document.createElement("div");
  title.innerText = name;

  card.appendChild(img);
  card.appendChild(title);

  card.onclick = ()=>{
    localStorage.setItem("lastGame", url);
    window.location.href = url;
  };

  gamesContainer.appendChild(card);
}

// Auto-play last game
const last = localStorage.getItem("lastGame");
if(last){
  setTimeout(()=>window.location.href = last, 1500);
}

// Start scanning
loadGames();
