const ticketCountElement = document.getElementById('RewardTicket');
const ImageElement = document.getElementById('RewardImage');
const NameElement = document.getElementById('RewardName');
const SubElement = document.getElementById('SubText');
const Tickets_Left = document.getElementById('TicketLeft');    
const User_Ticker = document.getElementById('ticketCount');        
const ProgressBar = document.getElementById('ProgressBar');


async function RewardDetails() {
    try {
        const response = await fetch('./src/rewards.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text(); // Get the response as text
        console.log("Fetched rewards.json");
        const data = JSON.parse(text); // Manually parse the text to JSON


        const item_index = 6; // Set the value of item_index
        const item = data[item_index]; // Fetch the value at the specified index


        const REWARD_NAME = item.REWARD_NAME;
        const REWARD_TICKET = item.REWARD_TICKET;
        const REWARD_IMAGE = item.REWARD_IMAGE;
        const REWARD_SUBTEXT = item.REWARD_SUBTEXT;

        console.log(REWARD_NAME, REWARD_TICKET, REWARD_IMAGE,REWARD_SUBTEXT);

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
        const response = await fetch('SOMETHING');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text(); // Get the response as text
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(text, 'text/html');
        const element = htmlDocument.querySelector('.gaegu.css-3ha5y3');
        const innerText = element.innerText;
        console.log('Inner Text:', innerText);
        
    } catch (error) {
        console.error("Error fetching user tickets:", error);
    }
}



function TicketLeft(Rew){

    const CURRENT_TICKET = 'Your current balance is 3 🎟️'; // Set the value of CURRENT_TICKET
    const regex = /\d+/; // Regular expression to match one or more digits
    const match = CURRENT_TICKET.match(regex); // Extract the number from the text
    const number = match ? parseInt(match[0]) : 0; // Convert the matched string to a number
    User_Ticker.textContent = `You Have ${number} 🎟️`;
    let TicketLeft = Rew - number;
    console.log('Ticket Left:',number);
    return TicketLeft;


}


async function Display() {
    try {
        const something = await RewardDetails();
        const NoTicket = TicketLeft(something);
        Tickets_Left.textContent = `You Need ${NoTicket} 🎟️`;
        const bar_width = (NoTicket/something)*100;
        console.log('barwid',bar_width);
        ProgressBar.style.width = `${bar_width}%`;
        
        
    } catch (error) {
        
    }
    
}

Display();
