let allSongs = JSON.parse(localStorage.getItem("allSongs")) || [
];


let userData = {
    songs: [...allSongs],
    currentSong: null,
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
        noSongMessage.textContent = "No songs!";

        noSongItem.appendChild(noSongMessage);
        playlist.appendChild(noSongItem);

    } else {
        allSongs.forEach((song, index) => {
            const songItem = document.createElement("li");
            songItem.classList.add("song-item");

            const songMood = document.createElement("p");
            songMood.classList.add("playlist-song-mood");
            songMood.textContent = song.mood;

            const songName = document.createElement("p");
            songName.classList.add("playlist-song-name");
            songName.textContent = song.title;

            const songArtist = document.createElement("p");
            songArtist.classList.add("playlist-song-artist");
            songArtist.textContent = song.artist;

            const songDateAdded = document.createElement("p");
            songDateAdded.classList.add("date-added");
            songDateAdded.textContent = song.dateAdded;

            const deleteButton = document.createElement("i");
            deleteButton.classList.add("fa-solid", "fa-xmark", "delete-button");
            deleteButton.style.cursor = "pointer";
            deleteButton.addEventListener("click", () => deleteSong(index));

            songItem.appendChild(songMood);
            songItem.appendChild(songName);
            songItem.appendChild(songArtist);
            songItem.appendChild(songDateAdded);
            songItem.appendChild(deleteButton);
            playlist.appendChild(songItem);
        }) 
    };

    // set player display with the current song 
    setCurrentSong();
}

// for current playing song
const setPlayerDisplay = () => {
    const playingSong = document.querySelector(".song-title");
    const playingArtist = document.querySelector(".song-artist");
    const playingCD = document.querySelector("#cd-bar");

    const currentTitle = userData?.currentSong?.title;
    const currentArtist = userData?.currentSong?.artist;
    const albumCover = userData?.currentSong?.img;

    playingSong.textContent = currentTitle ? currentTitle : "Current Song Title";
    playingArtist.textContent = currentArtist ? currentArtist : "Current Artist";
    playingCD.classList.add("paused"); // ensure cd does not rotate until user starts song
    if (albumCover) {
        playingCD.style.setProperty("--album-cover", `url('${albumCover}')`);
    } else {
        playingCD.style.setProperty("--album-cover", "url(album-covers/empty_album_cover.png)");
    }


}

// setting the user's current song
const setCurrentSong = () => {
    // we want to set current song to the most recently added song
    if (allSongs.length >= 1) {
        userData.currentSong = allSongs[allSongs.length - 1];
    } else {
        userData.currentSong = null;
    }

    setPlayerDisplay();
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

// delete song function
const deleteSong = (index) => {
    allSongs.splice(index, 1); 
    localStorage.setItem("allSongs", JSON.stringify(allSongs)); 
    renderSongs(); 
};

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
const addSongForm = document.getElementById("add-song-form");
const placeholderImage = "album-covers/empty_album_cover.png";

if (addSongForm) {
    addSongForm.addEventListener("submit", (e) => {
        e.preventDefault(); // prevent page refresh

        // get input values
        const titleInput = document.getElementById("song-name-input").value.trim();
        const artistInput = document.getElementById("song-artist-input").value.trim();
        const moodInput = document.getElementById("mood-input").value;
        const imageInput = document.getElementById("song-img-input").files[0];

        // ensure all fields filled out
        if (!titleInput || !artistInput || !moodInput) {
            alert("Please fill out all fields before submitting song!");
            return;
        }
        // getting current date
        const date = new Date();
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

        // handling image upload
        let songImage = placeholderImage;

        if (imageInput) {
            const reader = new FileReader();
            reader.onload = function (event) {
                songImage = event.target.result;
                saveNewSong(songImage);
            };
            reader.readAsDataURL(imageInput);
            
        } else {
            saveNewSong(songImage);
        }

        function saveNewSong(imageSrc) {
            const newSong = {
                id: allSongs.length,
                title: titleInput,
                artist: artistInput,
                img: imageSrc, 
                dateAdded: formattedDate,
                mood: moodInput
            };

            // add new song
            allSongs.push(newSong);
            localStorage.setItem("allSongs", JSON.stringify(allSongs));

            // re-render songs
            renderSongs();

            // Hide the pop-up
            popupContainer.style.display = "none";

            // reset form fields
            addSongForm.reset();
            previewImage.src = placeholderImage; 

        }
    });
} else {
    console.error("add-song-form not found in the DOM!");
}

// Image Upload Preview Handler
const imageInput = document.getElementById("song-img-input");
const previewImage = document.getElementById("preview-image");

imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (file) {
        console.log("File selected:", file.name); 
        const reader = new FileReader(); // creating file reader to read file

        reader.onload = function (e) {
            console.log("File loaded:", e.target.result);
            previewImage.src = e.target.result; // set the preview image source to the uploaded file
        };

        reader.readAsDataURL(file);
    } else {
        console.log("No file selected.");
        previewImage.src = "album-covers/empty_album_cover.png";
    }
});


// function calls
renderSongs();

