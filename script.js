// date tracker
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

