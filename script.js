// date tracker for header and playlist column
const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
let currentDate = `${monthNames[month - 1]} ${day}, ${year}`;
document.querySelector('.current-date').textContent = currentDate;

// playlist 
const playButton = document.getElementById("play-button");

const allSongs = [
    {
        id: 0,
        title: "Conceited",
        artist: "SZA",
        img: "album-covers/SZA_SOS.png",
        src: "mp3-files/groovy-ambient-funk-201745.mp3",
        duration: "2:16"
    },
    {
        id: 1,
        title: "Boy's a Liar",
        artist: "Pinkpantheress",
        img: "album-covers/Pinkpantheress_Boys_A_Liar.jpg",
        src: "mp3-files/once-in-paris-168895.mp3",
        duration: "2:12"

    },
    {
        id: 3,
        title: "Close To You",
        artist: "Gracie Abrams",
        img: "album-covers/Gracie_Abrams_Close_To_You.jpg",
        src: "mp3-files/order-99518.mp3",
        duration: "1:44"
    }
]

const audio = new Audio();

let userData = {
  songs: [...allSongs],
  currentSong: null,
  songCurrentTime: 0,
  isPlaying: false
};

// render songs 
const renderSongs = () => {
    const playlist = document.querySelector(".playlist");
    playlist.innerHTML = "";

    // add filler text if no songs yet in playlist
    if (allSongs.length === 0) {
        const noSongItem = document.createElement("li");
        noSongItem.classList.add("song-item");

        const noSongMessage = document.createElement("p");
        noSongMessage.classList.add("playlist-song-name");
        noSongMessage.textContent = "No song added yet!";

        noSongItem.appendChild(noSongMessage);
        playlist.appendChild(noSongItem);
    } else {
        allSongs.forEach((song) => {
            const songItem = document.createElement("li");
            songItem.classList.add("song-item");

            const songName = document.createElement("p");
            songName.classList.add("playlist-song-name");
            songName.textContent = song.title;

            const songArtist = document.createElement("p");
            songArtist.classList.add("playlist-song-artist");
            songArtist.textContent = song.artist;

            const songDuration = document.createElement("p");
            songDuration.classList.add("duration");
            songDuration.textContent = song.duration;

            songItem.appendChild(songName);
            songItem.appendChild(songArtist);
            songItem.appendChild(songDuration);

            playlist.appendChild(songItem);
        }) 
    };
}

// for current playing song
const setPlayerDisplay = () => {
    const playingSong = document.querySelector(".song-title");
    const playingArtist = document.querySelector(".song-artist");
    const playingCD = document.querySelector("#cd-bar");

    const currentTitle = userData?.currentSong?.title;
    const currentArtist = userData?.currentSong?.artist;
    const albumCover = userData?.currentSong?.img;

    playingSong.textContent = currentTitle ? currentTitle : "Song Name";
    playingArtist.textContent = currentArtist ? currentArtist : "Artist Name";
    if (albumCover) {
        playingCD.style.setProperty("--album-cover", `url('${albumCover}')`);
    } else {
        playingCD.style.setProperty("--album-cover", "url(album-covers/empty_album_cover.png)");
    }

}

// toggling between pause and play function
const togglePlayPause = () => {
    // when audio is paused 
    if (userData.isPlaying === false) {
        // audio.play();
        playButton.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
        userData.isPlaying = true;
    } else { 
        // audio.pause();
        playButton.innerHTML = '<i class="fa-solid fa-circle-pause"></i>';
        userData.isPlaying = false;
    }
}

// event listeners
playButton.addEventListener("click", () => togglePlayPause());


// function calls
setPlayerDisplay();
renderSongs();

