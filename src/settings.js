function DecimalVal(){
    Swal.fire({
        title: 'Enter Decimal Round Off Value. (Default is 2)',
        input: 'number', // Set the type of input to date
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        preConfirm: (name) => {
            // Use the input value
            console.log('Name entered:', name);
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: `Decimal Value Saved As ${result.value}`
            });
            localStorage.setItem('DecimalVal', result.value);
        }
    });
            
}

function CustomEnd (){
    Swal.fire({
    title: 'Enter End Date',
    input: 'date', // Set the type of input to date
    inputAttributes: {
        autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Submit',
    showLoaderOnConfirm: true,
    preConfirm: (name) => {
        // Use the input value
        console.log('Name entered:', name);
    },
    allowOutsideClick: () => !Swal.isLoading()
}).then((result) => {
    if (result.isConfirmed) {
        Swal.fire({
            title: `The New End Date Is ${result.value}`
        });
        localStorage.setItem('EndDate', result.value);
    }
});
}


function resetLocalStorage() {
    localStorage.clear();
    Swal.fire({
        title: 'LocalStorage Reset',
        text: 'LocalStorage has been reset',
        icon: 'success',
        confirmButtonText: 'OK'
    });
}
document.addEventListener('DOMContentLoaded', (event) => {
    const toggleButton = document.getElementById('toggleButton');
    const UserInput = document.getElementById('name'); // Assuming 'name' is the ID of your input element
    let isOn = true; // Initial state of the toggle

    toggleButton.addEventListener('click', () => {
        isOn = !isOn; // Toggle the state
        if (isOn) {
            console.log('Automatic Mode');
            toggleButton.textContent = 'Automatic';
            toggleButton.classList.remove('button-off');
            toggleButton.classList.add('button-on');
            UserInput.placeholder = 'Enter Shop Url'; // Change placeholder for Automatic mode
        } else {
            console.log('Manual Mode');
            toggleButton.textContent = 'Manual';
            toggleButton.classList.remove('button-on');
            toggleButton.classList.add('button-off');
            UserInput.placeholder = 'Enter Number Of Tickets You Have'; // Change placeholder for Manual mode
        }
    });
});
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const reward = document.getElementById('rewardlist').value;
    const toggleButtonValue = toggleButton.textContent;
    const apikey = document.getElementById('api').value;
    
    console.log('Toggle Button Value:', toggleButtonValue);
    console.log('Shop Url:', name);
    console.log('Reward:', reward);
    console.log('API Key:', apikey);


    if (toggleButtonValue === 'Automatic') {
        localStorage.setItem('Automatic', 'true');

        if (name !== '') {
        localStorage.setItem('ShopUrl', name);
        }
        if (reward !== '') {
            localStorage.setItem('Reward', reward);
        }
        if (apikey !== '') {
            localStorage.setItem('APIKey', apikey);
        }
    
    

    } else {
        localStorage.setItem('Automatic', 'false');

        if (name !== '') {
        localStorage.setItem('Tickets', name);
        }
        if (reward !== '') {
            localStorage.setItem('Reward', reward);
        }
        if (apikey !== '') {
            localStorage.setItem('APIKey', apikey);
        }
    

    }


    Swal.fire({
        title: 'Settings Saved',
        text: 'You will be redirected to the main page',
        confirmButtonText: 'Cool'
    }).then(() => {
        window.location.href = 'index.html';
    });
});