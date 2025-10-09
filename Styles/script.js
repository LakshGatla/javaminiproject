let currentSong = new Audio();
let songlist;
let currFolder;
const basePath = '/repository-name'; // Change this to your GitHub repo name/path or '' if at root

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  try {
    currFolder = folder;
    const response = await fetch(`${basePath}/${folder}/songs.json`);
    if (!response.ok) {
      return [];
    }
    const songs = await response.json();
    if (!Array.isArray(songs) || songs.length === 0) {
      return [];
    }
    let SongCard = document.querySelector(".left-middle ul");
    if (!SongCard) {
      return [];
    }
    SongCard.innerHTML = "";
    songs.forEach((song, index) => {
      SongCard.innerHTML += `
      <li>
        <div class="card">
          <div class="song-info">
            <img src="${basePath}/img/music.svg" alt="" class="invert" width="32px">
            <div class="details">
              <p class="title">${song.title}</p>
              <p class="artist-name">${song.artist}</p>
            </div>
          </div>
          <div class="btn" style="margin-right: 10px;">
            <button class="play-btn" data-index="${index}">
              <img src="${basePath}/img/icons8-play-50.png" width="20px" alt="" style="margin-left: 3px;">
            </button>
          </div>
        </div>
      </li>`;
    });
    Array.from(SongCard.getElementsByTagName("li")).forEach((element, i) => {
      element.addEventListener("click", () => {
        playmusic(songs[i].file);
      });
    });
    return songs.map((s) => s.file);
  } catch (error) {
    return [];
  }
}

const playmusic = (track, pause = false) => {
  // Use basePath with currFolder and track for full src path
  currentSong.src = `${basePath}/${currFolder}/${track}`;
  if (!pause) {
    currentSong.play();
    play.innerHTML = `<img src="${basePath}/img/pause.svg" alt="" class="playbtn-img" style="margin-left: 0px; width: 16px;">`;
  }
  document.querySelector(".scroll-text").innerHTML = decodeURI(track);
  document.querySelector(".song-time").innerHTML = "00:00/00:00";
  let scroll_container = document.querySelector(".scroll-text");
  text_clone.textContent = scroll_container.textContent;
  if (scroll_container.scrollWidth > document.querySelector(".track-info").clientWidth) {
    document.querySelector(".scroll-karo").classList.add("scroll");
  }
};

const rand = () => {
  let val = Math.random();
  return `rgba(0, 0, 0, ${val})`;
};

const playlistFolders = ["1st playlist", "ncs re - Copy (2)"];

async function DisplayAlbums() {
  let cardcontainer = document.querySelector(".cardcontainer");
  cardcontainer.innerHTML = "";
  for (const folder of playlistFolders) {
    let infoResponse = await fetch(`${basePath}/musics/${encodeURIComponent(folder)}/info.json`);
    let info = await infoResponse.json();
    cardcontainer.innerHTML += `
      <div class="song-card" data-folder="${folder}">
        <div class="poster">
          <img src="${basePath}/musics/${encodeURIComponent(folder)}/cover.jpg" alt="">
          <div class="play none">
            <button class="circle-button album-btn" data-folder="${folder}">
              <img src="${basePath}/img/icons8-play-50.png" alt="">
            </button>
          </div>
        </div>
        <div class="card-details">
          <div class="title">${info.title}</div>
          <div class="singer">${info.description}</div>
          <div class="status"></div>
        </div>
      </div>`;
  }
  Array.from(document.getElementsByClassName("album-btn")).forEach((item) => {
    item.addEventListener("click", async (event) => {
      const clickedCard = event.currentTarget.closest(".song-card");
      const songlist = await getSongs(`musics/${item.dataset.folder}`);
      playmusic(songlist[0]);
      Array.from(document.getElementsByClassName("song-card")).forEach((card) => {
        card.style.backgroundColor = "rgba(0, 0, 0, 0.233)";
        card.querySelector(".status").innerHTML = "";
      });
      if (clickedCard) {
        clickedCard.style.backgroundColor = "rgba(0, 0, 0, 1)";
        clickedCard.querySelector(".status").innerHTML = "playing...";
      }
    });
  });
  Array.from(document.getElementsByClassName("song-card")).forEach((item) => {
    item.addEventListener("click", async () => {
      songlist = await getSongs(`musics/${item.dataset.folder}`);
      let ham = document.querySelector(".hamburger");
      let left = document.querySelector(".left");
      if (left.style.left === "0px") {
        left.style.left = "-100%";
        ham.src = `${basePath}/img/ham.svg`;
      } else {
        left.style.left = "0";
        ham.src = `${basePath}/img/close.svg`;
      }
    });
  });

  const cards = document.querySelectorAll(".song-card");
  cards.forEach((element) => {
    const button = element.querySelector(".play");
    function transitionin() {
      button.classList.remove("none");
      button.classList.add("animationin");
      button.classList.remove("animationout");
    }
    function transitionout() {
      button.classList.remove("animationin");
      button.classList.add("animationout");
      setTimeout(() => button.classList.add("none"), 100);
    }
    element.addEventListener("mouseover", transitionin);
    element.addEventListener("mouseleave", transitionout);
  });

  const search = document.querySelector("#search");
  if (search) {
    search.addEventListener("input", (e) => {
      let search_value = e.target.value.toLowerCase();
      let anyvisible = false;
      document.querySelectorAll(".song-card").forEach((card) => {
        let isvisible =
          card.querySelector(".title").innerHTML.toLowerCase().includes(search_value) ||
          card.querySelector(".singer").innerHTML.toLowerCase().includes(search_value);
        card.classList.toggle("hide", !isvisible);
        if (isvisible) anyvisible = true;
      });
      if (!anyvisible) {
        document.querySelector(".noresult").classList.remove("hide");
      } else {
        document.querySelector(".noresult").classList.add("hide");
      }
    });
  }
}

async function main() {
  songlist = await getSongs("musics/ncs re");
  playmusic(songlist[0], true);
  DisplayAlbums();

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      play.innerHTML = `<img src="${basePath}/img/pause.svg" alt="" class="playbtn-img" style="margin-left: 0px; width : 16px;">`;
      currentSong.play();
    } else {
      play.innerHTML = `<img src="${basePath}/img/icons8-play-50.png" alt="" class="playbtn-img">`;
      currentSong.pause();
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".song-time").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;

    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    document.querySelector(".fill-bg").style.width = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  const seekBar = document.querySelector(".seekbar");
  const circle = document.querySelector(".circle");
  const fillBg = document.querySelector(".fill-bg");
  seekBar.addEventListener("click", (e) => {
    let perc = ((e.clientX - seekBar.getBoundingClientRect().left) / seekBar.getBoundingClientRect().width) * 100;
    circle.style.left = perc + "%";
    fillBg.style.width = perc + "%";
    let newtime = (currentSong.duration * perc) / 100;
    currentSong.currentTime = newtime;
  });

  next.addEventListener("click", () => {
    let index = songlist.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songlist.length) {
      playmusic(songlist[index + 1]);
    }
  });

  previous.addEventListener("click", () => {
    let index = songlist.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playmusic(songlist[index - 1]);
    }
  });

  let volume = document.getElementById("volume");
  let volueme_progress = document.querySelector(".fill");
  volume.oninput = function () {
    currentSong.volume = volume.value;
    volueme_progress.style.width = volume.value * 100 + "%";
  };
  volueme_progress.style.width = volume.value * 100 + "%";
}

main();
