const API_BASE_URL = 'http://localhost:8080/api';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const errorMessage = document.getElementById('errorMessage');
    
    errorMessage.style.display = 'none';
    
    if (!email) {
        showError('Please enter your email address');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        
        // Store user data in sessionStorage
        sessionStorage.setItem('user', JSON.stringify(data));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        showError(error.message);
    }
});

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}