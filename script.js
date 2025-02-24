// SPOTIFY API 

// spotify access token
const getAccessToken = async () => {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        },
        body: "grant_type=client_credentials",
    });

    const data = await response.json();
    return data.access_token;
};

// spotify search query 
const searchSongs = async (query) => {
    const accessToken = await getAccessToken();

    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const data = await response.json();
    return data.tracks.items; 
}

// display spotify search results 
function displayResults(tracks) {
    const resultContainer = document.getElementById("results-container");
    resultContainer.innerHTML = "";

    if (tracks.length === 0) {
        resultContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    tracks.forEach(track => {
        const trackElement = document.createElement('div');
        trackElement.classList.add('track');

        trackElement.innerHTML = `
            <i class="fa-solid fa-plus add-song-icon" data-track-id="${track.id}"></i>
            <img class="cover" src="${track.album.images[0].url}" alt="${track.album.name}" width="100">
            <p class="title">${track.name} by ${track.artists[0].name}</p>
        `;

        resultContainer.appendChild(trackElement);
    });

    // Handle Add Button Click Within Displayed Results in Popup-Container
    const addSongIcons = document.querySelectorAll(".add-song-icon"); // icon to add track element within search display option
    addSongIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            const trackId = icon.getAttribute('data-track-id');
            const selectedTrack = tracks.find(track => track.id === trackId);
            console.log("button pressed");
            if (selectedTrack) {
                const newSong = {
                    id: allSongs.length, 
                    title: selectedTrack.name,
                    artist: selectedTrack.artists[0].name,
                    img: selectedTrack.album.images[0].url,
                    dateAdded: playlistDate
                };
                
                allSongs.push(newSong);
                renderSongs();

                // close pop up after song clicked
                const popupContainer = document.querySelector(".popup-container");
                popupContainer.style.display = "none";
            }
        })
    });
}

const searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", async (e) => {
    e.preventDefault(); // Prevent form submission or page refresh

    const searchInput = document.querySelector(".song-input").value.trim();
    const resultContainer = document.getElementById("results-container");

    if (searchInput) {
        try {
            // Show loading message
            resultContainer.innerHTML = "<p>Loading...</p>";

            // Fetch tracks from Spotify API
            const tracks = await searchSongs(searchInput);

            // Display results
            displayResults(tracks);

            // Clear input field after search
            document.querySelector(".song-input").value = "";
        } catch (error) {
            console.error("Error searching for song:", error);
            resultContainer.innerHTML = "<p>An error occurred while searching.</p>";
        }
    } else {
        alert("Please enter a song name.");
    }
});


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

const allSongs = [
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
        id: 3,
        title: "Close To You",
        artist: "Gracie Abrams",
        img: "album-covers/Gracie_Abrams_Close_To_You.jpg",
        // src: "mp3-files/order-99518.mp3",
        dateAdded: "2/16/2025"
    }
]

const audio = new Audio();

let userData = {
  songs: [...allSongs],
  currentSong: allSongs[1],
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

