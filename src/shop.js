const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const targetUrl = localStorage.getItem("ShopUrl"); // Your original URL
fetch(proxyUrl + targetUrl)
    .then(response => response.text())
    .then(data => {
        console.log("HTML Body:", data);
    })
    .catch(error => console.log("Error:", error));
