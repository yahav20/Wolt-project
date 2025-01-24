document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    try {
        // Send a POST request to the signup endpoint
        const response = await fetch('http://localhost:4000/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, address, email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Signup failed');
        }

        const data = await response.json();
        console.log('Signup successful:', data);

        // Redirect to the login page
        window.location.href = '/login.html';
    } catch (error) {
        // Display error message
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    }
});
