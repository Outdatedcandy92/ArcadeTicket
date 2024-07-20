const ticketCountElement = document.getElementById('RewardTicket');
const ImageElement = document.getElementById('RewardImage');
const NameElement = document.getElementById('RewardName');
const SubElement = document.getElementById('SubText');
    
        
    
async function RewardDetails() {
    try {
        const response = await fetch('./src/rewards.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text(); // Get the response as text
        console.log("Fetched rewards.json");
        const data = JSON.parse(text); // Manually parse the text to JSON


        const item_index = 2; // Set the value of item_index
        const item = data[item_index]; // Fetch the value at the specified index


        const REWARD_NAME = item.REWARD_NAME;
        const REWARD_TICKET = item.REWARD_TICKET;
        const REWARD_IMAGE = item.REWARD_IMAGE;
        const REWARD_SUBTEXT = item.REWARD_SUBTEXT;

        console.log(REWARD_NAME, REWARD_TICKET, REWARD_IMAGE,REWARD_SUBTEXT);
        return REWARD_TICKET;


            
    } catch (error) {
        console.error("Error fetching or parsing rewards.json:", error);
    }
}


async function UserDetails() {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = localStorage.getItem('ShopUrl'); // Your original URL

    try {
        const response = await fetch(proxyUrl + targetUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const elements = doc.querySelectorAll(".gaegu.css-3ha5y3");
        elements.forEach(el => {
            const content = el.innerHTML; // Get the inner HTML of the element
            const match = content.match(/<!-- -->(\d+)<!-- -->/); // Regular expression to extract the number
            if (match && match[1]) {
                CURRENT_TICKET =match[1];
                console.log(CURRENT_TICKET);

                const TicketNumberElement = document.getElementById('ticketCount');
                TicketNumberElement.textContent = `You Have ${CURRENT_TICKET} 🎟️`;
            }
        });
    } catch (error) {
        console.log("Error:", error);
    }
}



function TicketLeft(){
    let TicketLeft = CURRENT_TICKET - REWARD_TICKET;
    console.log('Ticket Left:',TicketLeft);


}


async function Display() {
    try {
        const something = await RewardDetails();
        console.log(something);
        
    } catch (error) {
        
    }
    
}

Display();
