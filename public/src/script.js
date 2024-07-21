const ticketCountElement = document.getElementById('RewardTicket');
const ImageElement = document.getElementById('RewardImage');
const NameElement = document.getElementById('RewardName');
const SubElement = document.getElementById('SubText');
const Tickets_Left = document.getElementById('TicketLeft');    
const User_Ticker = document.getElementById('ticketCount');        
const ProgressBar = document.getElementById('ProgressBar');


async function RewardDetails(REWARD) {
    try {
        const response = await fetch('./src/rewards.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text(); // Get the response as text
        console.log("Fetched rewards.json");
        const data = JSON.parse(text); // Manually parse the text to JSON


        const item_index = REWARD; // Set the value of item_index
        const item = data[item_index]; // Fetch the value at the specified index


        const REWARD_NAME = item.name;
        const REWARD_TICKET = item.hours;
        const REWARD_IMAGE = item.imageURL;
        const REWARD_DESCRIPTION = item.description;
        const REWARD_SUBTEXT = item.smallName;

        console.log(REWARD_NAME, REWARD_TICKET, REWARD_IMAGE,REWARD_SUBTEXT, REWARD_DESCRIPTION);

        ticketCountElement.textContent = `${REWARD_TICKET} 🎟️`;
        ImageElement.src = REWARD_IMAGE;
        NameElement.textContent = REWARD_NAME;
        SubElement.textContent = REWARD_SUBTEXT;

        return REWARD_TICKET;


            
    } catch (error) {
        console.error("Error fetching or parsing rewards.json:", error);
    }
}


async function UserTicket() {
    try {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const url = localStorage.getItem('ShopUrl');

        const response = await fetch(proxyUrl + url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text(); // Get the response as text
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(text, 'text/html');
        const element = htmlDocument.querySelector('.gaegu.css-3ha5y3');
        const innerText = element.innerText;
        console.log('Inner Text:', innerText);

        return innerText;
        
    } catch (error) {
        console.error("Error fetching user tickets:", error);
    }
}



function TicketLeft(INSTR){

    const CURRENT_TICKET = INSTR ; // Set the value of CURRENT_TICKET
    const regex = /\d+/; // Regular expression to match one or more digits
    const match = CURRENT_TICKET.match(regex); // Extract the number from the text
    const number = match ? parseInt(match[0]) : 0; // Convert the matched string to a number
    User_Ticker.textContent = `You Have ${number} 🎟️`;
    console.log('Ticket Left:',number);

    return number;


}


async function Display() {
    try {

        const rewardIndex = localStorage.getItem('Reward');

        
        const Goal = await RewardDetails(rewardIndex);
        
        const User_ = await UserTicket();

        const Numoftickets = await TicketLeft(User_);

        Tickets_Left.textContent = `You Need ${Goal - Numoftickets} 🎟️`;
        const bar_width = (Numoftickets/Goal)*100;
        console.log('barwid',bar_width);
        ProgressBar.style.width = `${bar_width}%`;
        
        
    } catch (error) {
        
    }
    
}

Display();
