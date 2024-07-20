
let REWARD_NAME;
let REWARD_TICKET;
let REWARD_IMAGE;
let REWARD_SUBTEXT;

const ticketCountElement = document.getElementById('RewardTicket');
const ImageElement = document.getElementById('RewardImage');
const NameElement = document.getElementById('RewardName');
const SubElement = document.getElementById('SubText');
    
        
    
        

fetch('./src/rewards.json')
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.text(); // Get the response as text
})
.then(text => {
    console.log("Fetched rewards.json")
    return JSON.parse(text); // Manually parse the text to JSON
})
.then(data => {
    const item_index = 2; // Set the value of item_index
    const item = data[item_index]; // Fetch the value at the specified index
    REWARD_NAME = item.REWARD_NAME;
    REWARD_TICKET = item.REWARD_TICKET;
    REWARD_IMAGE = item.REWARD_IMAGE;
    REWARD_SUBTEXT = item.REWARD_SUBTEXT;
    console.log(REWARD_NAME, REWARD_TICKET, REWARD_IMAGE,REWARD_SUBTEXT);


    ticketCountElement.textContent = `${REWARD_TICKET}🎟️`;
    ImageElement.src = REWARD_IMAGE;
    NameElement.textContent = REWARD_NAME;
    SubElement.textContent = REWARD_SUBTEXT;
        
})
.catch(error => console.error('Error loading rewards.json:', error));


document.addEventListener('DOMContentLoaded', function() {

    const ticketCountElement = document.getElementById('RewardTicket');

    
    
    ticketCountElement.textContent = `${REWARD_TICKET}🎟️`;
});