

let allSongs = JSON.parse(localStorage.getItem("allSongs")) || [
    {
        id: 0,
        title: "Conceited",
        artist: "SZA",
        img: "album-covers/SZA_SOS.png",
        // src: "mp3-files/groovy-ambient-funk-201745.mp3",
        dateAdded: "2/14/2025"
    },
    {
        id: 1,
        title: "Boy's a Liar",
        artist: "Pinkpantheress",
        img: "album-covers/Pinkpantheress_Boys_A_Liar.jpg",
        // src: "mp3-files/once-in-paris-168895.mp3",
        dateAdded: "2/15/2025"

    },
    {
        id: 2,
        title: "Close To You",
        artist: "Gracie Abrams",
        img: "album-covers/Gracie_Abrams_Close_To_You.jpg",
        // src: "mp3-files/order-99518.mp3",
        dateAdded: "2/16/2025"
    }
];


let userData = {
    songs: [...allSongs],
    currentSong: allSongs[1],
    songCurrentTime: 0,
    isPlaying: false
  };



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
let playlistDate = `${month}/${day}/${year}`;
document.querySelector('.current-date').textContent = currentDate;

// playlist 
const playButton = document.getElementById("play-button");
const addIcon = document.getElementById("add-button");
const popupContainer = document.querySelector(".popup-container");
const addSongForm = document.querySelector(".add-song-form");


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

            const songDateAdded = document.createElement("p");
            songDateAdded.classList.add("date-added");
            songDateAdded.textContent = song.dateAdded;

            songItem.appendChild(songName);
            songItem.appendChild(songArtist);
            songItem.appendChild(songDateAdded);

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
    playingCD.classList.add("paused"); // ensure cd does not rotate until user starts song
    if (albumCover) {
        playingCD.style.setProperty("--album-cover", `url('${albumCover}')`);
    } else {
        playingCD.style.setProperty("--album-cover", "url(album-covers/empty_album_cover.png)");
    }

}

// highlight current playing song 
const highlightCurrentSong = () => {
}

// toggling between pause and play function
const togglePlayPause = () => {
    const cdBar = document.querySelector("#cd-bar");
    
    // when audio is paused 
    if (userData.isPlaying === false) {
        // audio.play();
        playButton.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
        cdBar.classList.add("paused"); // pause cd rotation 
        userData.isPlaying = true;
    } else { 
        // audio.pause();
        playButton.innerHTML = '<i class="fa-solid fa-circle-pause"></i>';
        cdBar.classList.remove("paused"); // resume cd rotation
        userData.isPlaying = false;
    }
}

/* event listeners */


playButton.addEventListener("click", () => togglePlayPause());

// Show Pop Up Add Form when Add Icon Clicked
addIcon.addEventListener("click", () => {
    popupContainer.style.display = "flex";
});

// Hide Pop Up Icon If Mouse Clicked Outside Form
popupContainer.addEventListener("click", (e) => {
    if(e.target === popupContainer) {
        popupContainer.style.display = "none";
    }
});

// Handle Add Song Form Submission
addSongForm.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent page refresh
    // Hide the pop-up
    popupContainer.style.display = "none";
});



// function calls
setPlayerDisplay();
renderSongs();

