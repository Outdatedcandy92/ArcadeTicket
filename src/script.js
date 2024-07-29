const ticketCountElement = document.getElementById('RewardTicket');
const ImageElement = document.getElementById('RewardImage');
const NameElement = document.getElementById('RewardName');
const SubElement = document.getElementById('SubText');
const Tickets_Left = document.getElementById('TicketLeft');
const User_Ticker = document.getElementById('ticketCount');
const ProgressBar = document.getElementById('ProgressBar');
const HourCount = document.getElementById('HoursPerDay');
const ToolTip = document.getElementById('tooltip-text');


let ROUND = 2;
let EndDate = "2024-8-31"

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

        console.log(REWARD_NAME, REWARD_TICKET, REWARD_IMAGE, REWARD_SUBTEXT, REWARD_DESCRIPTION);

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
        const proxyUrl = 'https://corsproxy.io/?';
        const url = localStorage.getItem('ShopUrl');

        console.log(proxyUrl + url);
        const response = await fetch(proxyUrl+url);

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



function TicketLeft(INSTR) {

    const CURRENT_TICKET = INSTR; // Set the value of CURRENT_TICKET
    const regex = /\d+/; // Regular expression to match one or more digits
    const match = CURRENT_TICKET.match(regex); // Extract the number from the text
    const number = match ? parseInt(match[0]) : 0; // Convert the matched string to a number
    User_Ticker.textContent = `You Have ${number} 🎟️`;
    console.log('Ticket Left:', number);

    return number;


}






function daysleft(remaning_tickets) {
    const date1 = new Date();
    const date2 = new Date(EndDate);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(diffDays, 'Days Left');

    const tick_Num = remaning_tickets / diffDays;

    console.log('Tickets Per Day:', tick_Num);

    if (tick_Num < 1) {
        const tickperday = tick_Num.toFixed(2);
        return tickperday;
    } else {
        const tickperday = tick_Num.toFixed(1);
        return tickperday;
    }



}




async function Display() {
    try {
        let Goal;
        let Numoftickets = 0;

        const rewardIndex = localStorage.getItem('Reward');
        const Mode = localStorage.getItem('Automatic');
        Goal = await RewardDetails(rewardIndex);

        if (Mode == 'true') {
            console.log('Automatic Mode');
            const User_ = await UserTicket(); // <- Remove these 2 in manual
            Numoftickets = await TicketLeft(User_); // Remove these 2 in manual
        }
        else {
            console.log('Manual Mode');
            Numoftickets = localStorage.getItem('Tickets');
            console.log('Tickets:', Numoftickets);
            User_Ticker.textContent = `You Have ${Numoftickets} 🎟️`;
        }

        const RemaningTick = Goal - Numoftickets;

        console.log('remaning const', RemaningTick);

        console.log('Remaining Tickets:', RemaningTick);
        if (RemaningTick <= 0) {
            console.log("Remaining tickets: 0 or less");
            ProgressBar.style.width = `100%`;
            Tickets_Left.textContent = `You Have Completed The Goal 🎉`;
            ToolTip.style.display = 'none';
            HourCount.textContent = ``;
            ConfExpo();
        } else {
            console.log("Remaining tickets: not 0 or less");
            const hourcount = daysleft(RemaningTick);
            HourCount.textContent = `You Need ${hourcount} 🎟️ Per Day`;
            localStorage.setItem('Goal', hourcount);

            Tickets_Left.textContent = `You Need ${RemaningTick} 🎟️`;
            const bar_width = Math.round((Numoftickets / Goal) * 100);
            console.log('barwidth', bar_width);
            ProgressBar.style.width = `${bar_width}%`;
            ToolTip.textContent = `${bar_width}% Complete`;

        }





    } catch (error) {

    }

}

function ConfExpo() {
    confetti({
        particleCount: 400,
        spread: 200,
        origin: { y: 0.7 },
    });
}

function Start() {
    // Add stuff for when localStorage is empty
    if (localStorage.getItem('Automatic') && localStorage.getItem('Reward')) {
        Display();
    } else {
        console.log('Automatic or Reward does not exist in localStorage');
        Swal.fire({
            title: 'Error!',
            text: 'Items do not exist in local storage',
            icon: 'error',
            confirmButtonText: 'Settings',
            allowOutsideClick: () => {

                console.log('User clicked outside the modal');

                window.location.href = 'settings.html';
            }
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'settings.html';
            }
        });
    }
}
function PreStart() {
    if (localStorage.getItem('EndDate')) {
        EndDate = localStorage.getItem('EndDate');
    }
    if (localStorage.getItem('Round')) {
        ROUND = localStorage.getItem('Round');
    }

}

PreStart();

Start();

//Display();
document.addEventListener('DOMContentLoaded', () => {
    const progressContainer = document.querySelector('.progress-container');
    const tooltipText = document.querySelector('.tooltip-text');

    progressContainer.addEventListener('mousemove', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        tooltipText.style.left = `${x - 40}px`; // Adjust the offset as needed
        tooltipText.style.top = `${y - 80}px`; // Adjust the offset as needed
    });

    progressContainer.addEventListener('mouseenter', () => {
        tooltipText.style.visibility = 'visible';
        tooltipText.style.opacity = '1';
    });

    progressContainer.addEventListener('mouseleave', () => {
        tooltipText.style.visibility = 'hidden';
        tooltipText.style.opacity = '0';
    });
});