const API_BASE_URL = 'http://localhost:8080/api';
let currentUser = null;

// Check if user is logged in
function checkAuth() {
    const userString = sessionStorage.getItem('user');
    if (!userString) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(userString);
}

// Initialize page
function init() {
    currentUser = checkAuth();
    if (!currentUser) return;
    
    document.getElementById('userEmail').textContent = currentUser.email;
    
    loadHostedEvents();
    loadAttendingEvents();
}

// Logout function
function logout() {
    sessionStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Create Event Form Handler
document.getElementById('createEventForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('eventTitle').value.trim();
    const description = document.getElementById('eventDescription').value.trim();
    
    hideMessages('create');
    
    try {
        const response = await fetch(`${API_BASE_URL}/events/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: currentUser.id,
                title,
                description
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to create event');
        }
        
        // Show success message
        showSuccess('create', `Event Created! Your shareable event code is: ${data.eventCode}`);
        
        // Clear form
        document.getElementById('createEventForm').reset();
        
        // Reload hosted events
        loadHostedEvents();
        
    } catch (error) {
        showError('create', error.message);
    }
});

// Register Event Form Handler
document.getElementById('registerEventForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const eventCode = document.getElementById('eventCode').value.trim().toUpperCase();
    
    hideMessages('register');
    
    try {
        const response = await fetch(`${API_BASE_URL}/events/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: currentUser.id,
                eventCode
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to register for event');
        }
        
        // Show success message
        showSuccess('register', 'Successfully Registered!');
        
        // Clear form
        document.getElementById('registerEventForm').reset();
        
        // Reload attending events
        loadAttendingEvents();
        
    } catch (error) {
        showError('register', error.message);
    }
});

// Load Hosted Events
async function loadHostedEvents() {
    const container = document.getElementById('hostedEventsList');
    container.innerHTML = '<p class="loading">Loading...</p>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/events/hosted/${currentUser.id}`);
        const events = await response.json();
        
        if (!response.ok) {
            throw new Error('Failed to load hosted events');
        }
        
        if (events.length === 0) {
            container.innerHTML = '<p class="empty-state">You haven\'t created any events yet.</p>';
            return;
        }
        
        container.innerHTML = events.map(event => `
            <div class="event-item">
                <h3>${escapeHtml(event.title)}</h3>
                <p>${escapeHtml(event.description)}</p>
                <span class="event-code">${event.eventCode}</span>
                <p class="event-date">Created: ${formatDate(event.createdAt)}</p>
            </div>
        `).join('');
        
    } catch (error) {
        container.innerHTML = '<p class="empty-state">Error loading events</p>';
    }
}

// Load Attending Events
async function loadAttendingEvents() {
    const container = document.getElementById('attendingEventsList');
    container.innerHTML = '<p class="loading">Loading...</p>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/events/attending/${currentUser.id}`);
        const events = await response.json();
        
        if (!response.ok) {
            throw new Error('Failed to load attending events');
        }
        
        if (events.length === 0) {
            container.innerHTML = '<p class="empty-state">You haven\'t registered for any events yet.</p>';
            return;
        }
        
        container.innerHTML = events.map(event => `
            <div class="event-item">
                <h3>${escapeHtml(event.title)}</h3>
                <p>${escapeHtml(event.description)}</p>
                <span class="event-code">${event.eventCode}</span>
                <p class="event-date">Created: ${formatDate(event.createdAt)}</p>
            </div>
        `).join('');
        
    } catch (error) {
        container.innerHTML = '<p class="empty-state">Error loading events</p>';
    }
}

// Utility Functions
function showSuccess(type, message) {
    const element = document.getElementById(`${type}SuccessMessage`);
    element.textContent = message;
    element.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

function showError(type, message) {
    const element = document.getElementById(`${type}ErrorMessage`);
    element.textContent = message;
    element.style.display = 'block';
}

function hideMessages(type) {
    document.getElementById(`${type}SuccessMessage`).style.display = 'none';
    document.getElementById(`${type}ErrorMessage`).style.display = 'none';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Initialize on page load
init();