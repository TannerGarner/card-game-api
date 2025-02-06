//login form

document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault(); 

  const username = document.getElementById('username').value;
  const password = document.getElementById('current-password').value;

  try {
    const response = await fetch('http://localhost:3000/getToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: username,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate');
    }

    const data = await response.json();
    localStorage.setItem("token", data.token); // Store the token
    window.location.href = "admin.html"; // Redirect to admin page
  } catch (error) {
    console.error('Error:', error);
    alert('Login failed. Please check your credentials and try again.');
  }
});