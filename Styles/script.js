let currentSong = new Audio;
let songlist;
let currFolder;

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
  currFolder = folder.replaceAll(" ", "%20")
  let songs = await fetch(`/${currFolder}/`)
  let response = await songs.text()
  let div = document.createElement("div")
  div.innerHTML = response;
  let a = div.getElementsByTagName("a")
  let songlist = []
  for (let index = 0; index < a.length; index++) {
    const element = a[index];

    if (element.href.endsWith(".mp3") || element.href.endsWith(".wav") || element.href.endsWith(".m4a")) {
      songlist.push(element.href.split(`/${currFolder}/`)[1])
      // console.log(element.href.split(`/${currFolder}/`)[1])

    }
  }

  let SongCard = document.querySelector(".left-middle").getElementsByTagName('ul')[0]
  SongCard.innerHTML = ""
  for (const song of songlist) {
    SongCard.innerHTML = SongCard.innerHTML + `
    <li><div class="card">
    <div class="song-info">
    <img src="img/music.svg" alt="" class="invert" width="32px">
    <div class="details">
    <p class="title">${decodeURIComponent(song)}</p>
    <p class="artist-name">Unknown</p>
    </div>
    
    </div>
    <div class="btn"  style="margin-right: 10px;">
    <button class="play-btn">
    <img src="img/icons8-play-50.png" width="20px" alt=""style="margin-left: 3px ; ">
    </button>
    </div>
    </div></li>
    
    ` ;


    //Atach event listener to each song 
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(element => {
      var button = element.getElementsByTagName("button")[0]
      // console.log(button)


      element.addEventListener("click", () => {

        playmusic(element.querySelector(".title").innerHTML.trim().replaceAll("&nbsp;", "\u00A0"))


      })


    });



  }

  return songlist

}

const playmusic = (track, pause = false) => {
  // let audio = new Audio()
  currentSong.src = `/${currFolder}/` + track

  if (!pause) {
    currentSong.play()

    play.innerHTML = `<img  src="img/pause.svg" alt="" class="playbtn-img" style = "margin-left: 0px; width : 16px ; ">`
  }

  document.querySelector(".scroll-text").innerHTML = decodeURI(track)
  document.querySelector(".song-time").innerHTML = "00:00/00:00"

  let scroll_container = document.querySelector(".scroll-text")
  text_clone.textContent = scroll_container.textContent;

  if (scroll_container.scrollWidth > document.querySelector(".track-info").clientWidth) {

    document.querySelector(".scroll-karo").classList.add("scroll")

  }


}


const rand = () => {
  let val = Math.random()

  return `rgba(0, 0, 0, ${val})`
}

async function DisplayAlbums() {
  let songs = await fetch(`musics/`)
  let response = await songs.text()
  let div = document.createElement("div")


  div.innerHTML = response;

  let anchors = div.getElementsByTagName("a")
  let cardcontainer = document.querySelector(".cardcontainer")
  let array = Array.from(anchors)

  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    let folder = (e.href.split("/").slice(-1)[0]).replaceAll("%20", " ")


    if (e.href.includes("/musics/")) {


      let songs = await fetch(`/musics/${folder}/info.json`)
      let response = await songs.json()

      let titlesArray = Object.values(response).map(song => song);
      // console.log(titlesArray[0]);



      cardcontainer.innerHTML = cardcontainer.innerHTML + `<div class="song-card" data-folder="${folder}">
      
      <div class="poster">
      <img src="/musics/${folder}/cover.jpg" alt="">
      <div class="play none">
      <button class="circle-button album-btn" data-folder="${folder}">
      <img src="img/icons8-play-50.png" alt="">
      </button>
      
      </div>
      </div>
      <div class="card-details">
      <div class="title">${response.title}</div>
      <div class="singer">${response.description}</div>
      <div class="status"></div>
      </div>
      </div>`



      const search = document.querySelector("#search");


      search.addEventListener("input", (e) => {
        let search_value = e.target.value.toLowerCase();

        let anyvisible = true;

        document.querySelectorAll(".song-card").forEach((e) => {

          let isvisible = e.querySelector(".title").innerHTML.toLowerCase().includes(search_value) || e.querySelector(".singer").innerHTML.toLowerCase().includes(search_value)

          e.classList.toggle("hide", !isvisible)


          let container = document.getElementById("allsongcard")

          if (isvisible) {
            anyvisible = false;
          }

          if (anyvisible) {
            document.querySelector(".noresult").classList.remove("hide")

          }

          else {
            document.querySelector(".noresult").classList.add("hide")

          }


        })

      });




      Array.from(document.getElementsByClassName("album-btn")).forEach(item => {
        item.addEventListener("click", async (event) => {

          // Get the parent .song-card element for the clicked button
          const clickedCard = event.currentTarget.closest(".song-card");

          // Retrieve the song list and play the first song
          const songlist = await getSongs(`musics/${item.dataset.folder}`);
          playmusic(songlist[0]);

          // Reset styles on all cards and apply style only to the clicked card
          Array.from(document.getElementsByClassName("song-card")).forEach(card => {
            card.style.backgroundColor = "rgba(0, 0, 0, 0.233)"; // Reset background color for all cards
            card.querySelector(".status").innerHTML = ""
          });

          // Change the background color of the clicked card


          if (clickedCard) {


            clickedCard.style.backgroundColor = "rgba(0, 0, 0, 1)"; // Example highlight color
            let status = clickedCard.querySelector(".status")

            status.innerHTML = "playing..."








          }


        });
      });



      Array.from(document.getElementsByClassName("song-card")).forEach(item => {
        
        item.addEventListener("click", async () => {

          songlist = await getSongs(`musics/${item.dataset.folder}`)
          let ham = document.querySelector(".hamburger")
          let left = document.querySelector(".left")


          if (left.style.left === '0px') {
            left.style.left = '-100%';
            ham.src = "img/ham.svg"

          } else {
            left.style.left = '0';

            ham.src = "img/close.svg"
          }



        })

      })





      const card = document.querySelectorAll(".song-card")

      card.forEach(element => {
        const button = element.querySelector(".play")


        function transitionin() {
          button.classList.remove("none")
          button.classList.add("animationin")
          button.classList.remove("animationout")
        }

        function transitionout() {

          button.classList.remove("animationin")
          button.classList.add("animationout")
          setTimeout(() => {
            button.classList.add("none")

          }, 100);

        }

        element.addEventListener("mouseover", transitionin)
        element.addEventListener("mouseleave", transitionout)
      });


    }



  }






}
async function main() {



  songlist = await getSongs("musics/ncs re")


  playmusic(songlist[0], true)

  DisplayAlbums()

  //Atach event listner to play , next previous

  play.addEventListener("click", () => {

    if (currentSong.paused) {
      play.innerHTML = `<img  src="img/pause.svg" alt="" class="playbtn-img" style = "margin-left: 0px; width : 16px ; ">`
      currentSong.play()


    }

    else {
      play.innerHTML = `<img  src="img/icons8-play-50.png" alt="" class="playbtn-img">`
      currentSong.pause()
    }

  })

  // document.body.addEventListener("keydown", (e) => {
  //   if (e.key === " ") {


  //     if (currentSong.paused) {
  //       play.innerHTML = `<img  src="img/pause.svg" alt="" class="playbtn-img" style = "margin-left: 0px; width : 16px ; ">`
  //       currentSong.play()


  //     }

  //     else {
  //       play.innerHTML = `<img  src="img/icons8-play-50.png" alt="" class="playbtn-img">`
  //       currentSong.pause()
  //     }

  //   }
  // })


  //Update Current time and Duration 
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime , currentSong.duration)

    document.querySelector(".song-time").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`

    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"

    document.querySelector(".fill-bg").style.width = (currentSong.currentTime / currentSong.duration) * 100 + "%"



  })


  const seekBar = document.querySelector(".seekbar");
  const circle = document.querySelector(".circle");
  const fillBg = document.querySelector(".fill-bg");

  seekBar.addEventListener("click", (e) => {

    let perc = ((e.clientX - seekBar.getBoundingClientRect().left) / (seekBar.getBoundingClientRect().width)) * 100

    circle.style.left = perc + "%"
    fillBg.style.width = perc + "%"

    let newtime = ((currentSong.duration * perc) / 100)

    currentSong.currentTime = newtime











  })







  next.addEventListener("click", () => {
    // currentSong.pause()
    let index = songlist.indexOf(currentSong.src.split("/").slice(-1)[0])


    if ((index + 1) < songlist.length) {

      playmusic(songlist[index + 1])

    }


  })

  previous.addEventListener("click", () => {
    // currentSong.pause()

    let index = songlist.indexOf(currentSong.src.split("/").slice(-1)[0])

    if ((index - 1) >= 0) {
      playmusic(songlist[index - 1])
    }

  })


  let volume = document.getElementById("volume")

  // console.log(volume)

  let volueme_progress = document.querySelector(".fill")
  volume.oninput = function () {

    currentSong.volume = volume.value
    volueme_progress.style.width = volume.value * 100 + "%"

  }

  volueme_progress.style.width = volume.value * 100 + "%"





}
main()
