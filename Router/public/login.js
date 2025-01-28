document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();
        const token = data.token;

        // Store the token in localStorage
        localStorage.setItem('token', token);

        // Redirect to the home page
        window.location.href = 'restaurantsPage.html';
    } catch (error) {
        // Display error message
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    }
});
