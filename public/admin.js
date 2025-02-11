document.addEventListener("DOMContentLoaded", async () => {    
    const token = localStorage.getItem("token");

    if (!token) {
        // Redirect to login if no token is found
        window.location.href = "login.html";
        return;
    }

    // Verify the token with the server
    const response = await fetch("http://localhost:3000/verifyToken", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        // If token is invalid or expired, redirect to login
        window.location.href = "login.html";
    }
});

// Create Card Form Elements
document.getElementById("createForm").addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevent the page from reloading

    const token = localStorage.getItem("token"); 
    if (!token) {
        alert("Session expired. Please log in again.");
        window.location.href = "login.html";
        return;
    }

    const name = document.getElementById("name").value;
    const set = document.getElementById("set").value;
    const cardNumber = document.getElementById("cardNumber").value;
    const type = document.getElementById("type").value;
    const rarity = document.getElementById("rarity").value;

    try {
        const response = await fetch('http://localhost:3000/cards/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify({ name, set, cardNumber, type, rarity })
        });

        if (!response.ok) {
            throw new Error('Failed to create card');
        }

        alert(response.message);
        document.getElementById("name").value = "";
        document.getElementById("set").value = "";
        document.getElementById("cardNumber").value = "";
        document.getElementById("type").value = "";
        document.getElementById("rarity").value = "";
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to create card.');
    }
});
  
  
  
// Update Card Form Elements

document.getElementById("updateForm").addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevent the page from reloading

    const token = localStorage.getItem("token"); 
    if (!token) {
        alert("Session expired. Please log in again.");
        window.location.href = "login.html";
        return;
    }

    const id = document.getElementById("updateId").value.trim();
    const category = document.querySelector("#updateForm select").value; 
    const update = document.getElementById("updateInput").value.trim();


    try {
        const response = await fetch(`http://localhost:3000/cards/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify({ category, update })
        });

        const data = await response.json(); // Convert response to JSON

        if (!response.ok) {
            throw new Error(data.error || 'Failed to update card');
        }

        alert(data.message);
        document.getElementById("updateId").value = "";
        document.getElementById("updateForm").querySelector("select").value = "";
        document.getElementById("updateInput").value = "";
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to find card.');
    }
});



// Delete Card Form Elements
const deleteForm = document.getElementById("deleteForm");
const deleteIdInput = document.getElementById("deleteId");