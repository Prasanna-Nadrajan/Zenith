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
    if (currentUser.name) {
        document.getElementById('userName').textContent = currentUser.name;
    }
    
    // Handle online event checkbox
    const onlineCheckbox = document.getElementById('isOnlineEvent');
    const locationGroup = document.getElementById('locationGroup');
    const locationInput = document.getElementById('eventLocation');
    
    onlineCheckbox.addEventListener('change', function() {
        if (this.checked) {
            locationGroup.style.display = 'none';
            locationInput.removeAttribute('required');
        } else {
            locationGroup.style.display = 'block';
            locationInput.setAttribute('required', 'required');
        }
    });
    
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
    const eventDateTime = document.getElementById('eventDateTime').value;
    const isOnline = document.getElementById('isOnlineEvent').checked;
    const location = document.getElementById('eventLocation').value.trim();
    
    hideMessages('create');
    
    // Validate location if not online
    if (!isOnline && !location) {
        showError('create', 'Please provide a location or mark the event as online');
        return;
    }
    
    try {
        const payload = {
            userId: currentUser.id,
            title,
            description,
            eventDateTime,
            isOnline
        };
        
        if (!isOnline) {
            payload.location = location;
        }
        
        const response = await fetch(`${API_BASE_URL}/events/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
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
                <div>
                    <span class="event-code">${event.eventCode}</span>
                </div>
                <span class="event-date">📅 ${formatEventDateTime(event.eventDateTime)}</span>
                <span class="event-location">📍 ${event.isOnline ? 'Online Event' : escapeHtml(event.location)}</span>
                <p class="event-date">Created: ${formatDate(event.createdAt)}</p>
                <div class="event-actions">
                    <button class="btn btn-info" onclick="viewAttendees(${event.id}, '${escapeHtml(event.title)}')">
                        View Attendees
                    </button>
                    <button class="btn btn-danger" onclick="deleteEvent(${event.id})">
                        Delete Event
                    </button>
                </div>
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
                <div>
                    <span class="event-code">${event.eventCode}</span>
                </div>
                <span class="event-date">📅 ${formatEventDateTime(event.eventDateTime)}</span>
                <span class="event-location">📍 ${event.isOnline ? 'Online Event' : escapeHtml(event.location)}</span>
                <p class="event-date">Created: ${formatDate(event.createdAt)}</p>
            </div>
        `).join('');
        
    } catch (error) {
        container.innerHTML = '<p class="empty-state">Error loading events</p>';
    }
}

// Delete Event
async function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to delete event');
        }
        
        // Reload hosted events
        loadHostedEvents();
        
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// View Attendees
async function viewAttendees(eventId, eventTitle) {
    const modal = document.getElementById('attendeesModal');
    const modalTitle = document.getElementById('modalEventTitle');
    const attendeesList = document.getElementById('attendeesList');
    
    modalTitle.textContent = eventTitle;
    attendeesList.innerHTML = '<p class="loading">Loading attendees...</p>';
    modal.style.display = 'flex';
    
    try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}/attendees`);
        const attendees = await response.json();
        
        if (!response.ok) {
            throw new Error('Failed to load attendees');
        }
        
        if (attendees.length === 0) {
            attendeesList.innerHTML = '<p class="empty-state">No attendees yet.</p>';
            return;
        }
        
        attendeesList.innerHTML = attendees.map(attendee => `
            <div class="attendee-item">
                <div class="attendee-name">${escapeHtml(attendee.name || 'Anonymous')}</div>
                <div class="attendee-email">${escapeHtml(attendee.email)}</div>
                <div class="attendee-date">Registered: ${formatDate(attendee.registeredAt)}</div>
            </div>
        `).join('');
        
    } catch (error) {
        attendeesList.innerHTML = '<p class="empty-state">Error loading attendees</p>';
    }
}

// Close Attendees Modal
function closeAttendeesModal() {
    document.getElementById('attendeesModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('attendeesModal');
    if (event.target === modal) {
        closeAttendeesModal();
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

function formatEventDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Initialize on page load
init();