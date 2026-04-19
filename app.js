let state = { decks: [], selectedDeckId: null, searchQuery: '' };

const loadState = () => {
    const saved = localStorage.getItem('flashcards_state');
    if (saved) state = JSON.parse(saved);
    render();
};

const saveState = () => {
    localStorage.setItem('flashcards_state', JSON.stringify(state));
    render();
};

const render = () => {
    // Render Decks
    const list = document.getElementById('decks-list');
    list.innerHTML = state.decks.map(d => `
        <li class="${state.selectedDeckId === d.id ? 'active' : ''}" onclick="selectDeck('${d.id}')">
            ${d.name}
            <button onclick="deleteDeck(event, '${d.id}')">×</button>
        </li>
    `).join('');

    // Render Cards for active deck
    const container = document.getElementById('cards-container');
    const activeDeck = state.decks.find(d => d.id === state.selectedDeckId);
    document.getElementById('add-card-btn').disabled = !activeDeck;
    document.getElementById('shuffle-btn').disabled = !activeDeck;
    document.getElementById('search-btn').disabled = !activeDeck;
    
    if (activeDeck) {
        document.getElementById('current-deck-title').textContent = activeDeck.name;
        
        // Filter cards based on search query
        const filteredCards = state.searchQuery 
            ? activeDeck.cards.filter(card => 
                card.front.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                card.back.toLowerCase().includes(state.searchQuery.toLowerCase())
              )
            : activeDeck.cards;
        
        container.innerHTML = filteredCards.map(c => `
            <div class="card" onclick="this.classList.toggle('is-flipped')">
                <div class="card-inner">
                    <div class="card-face card-front">
                        ${c.front}
                        <button class="edit-card-btn" onclick="event.stopPropagation(); openEditWindow('${c.id}')">Edit</button>
                    </div>
                    <div class="card-face card-back">${c.back}</div>
                </div>
            </div>
        `).join('');
    }
};

window.selectDeck = (id) => { 
    state.selectedDeckId = id; 
    state.searchQuery = ''; // Clear search when switching decks
    document.getElementById('search-bar').value = '';
    saveState(); 
};

window.deleteDeck = (event, id) => {
    event.stopPropagation();
    if (confirm("Delete this deck?")) {
        state.decks = state.decks.filter(d => d.id !== id);
        if (state.selectedDeckId === id) state.selectedDeckId = null;
        saveState();
    }
};

document.getElementById('new-deck-btn').onclick = () => {
    const name = prompt("Deck Name:");
    if (name) {
        state.decks.push({ id: Date.now().toString(), name, cards: [] });
        saveState();
    }
};

document.getElementById('add-card-btn').onclick = () => {
    const front = prompt("Front:");
    const back = prompt("Back:");
    const deck = state.decks.find(d => d.id === state.selectedDeckId);
    if (deck && front && back) {
        deck.cards.push({ id: Date.now().toString(), front, back });
        saveState();
    }
};

document.getElementById('shuffle-btn').onclick = () => {
    const activeDeck = state.decks.find(d => d.id === state.selectedDeckId);
    if (activeDeck && activeDeck.cards.length > 0) {
        // Fisher-Yates shuffle algorithm
        for (let i = activeDeck.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [activeDeck.cards[i], activeDeck.cards[j]] = [activeDeck.cards[j], activeDeck.cards[i]];
        }
        saveState();
    }
};

window.openEditWindow = (cardId) => {
    const activeDeck = state.decks.find(d => d.id === state.selectedDeckId);
    const card = activeDeck.cards.find(c => c.id === cardId);

    // 1. Open a new small window
    const editWin = window.open("", "Edit Card", "width=400,height=500");

    // 2. Define the HTML for the edit window
    editWin.document.write(`
        <html>
        <head><title>Edit Card</title></head>
        <body style="font-family: sans-serif; padding: 20px;">
            <h3>Edit Flashcard</h3>
            <label>Front:</label><br>
            <textarea id="edit-front" style="width:100%; height:100px;">${card.front}</textarea><br><br>
            <label>Back:</label><br>
            <textarea id="edit-back" style="width:100%; height:100px;">${card.back}</textarea><br><br>
            <button id="save-btn">Save Changes</button>
            <button onclick="window.close()">Cancel</button>
            <script>
                document.getElementById('save-btn').onclick = () => {
                    const data = {
                        id: "${cardId}",
                        front: document.getElementById('edit-front').value,
                        back: document.getElementById('edit-back').value
                    };
                    // Send data back to the main window
                    window.opener.postMessage(data, "*");
                    window.close();
                };
            </script>
        </body>
        </html>
    `);
};

// 3. Listen for the message from the edit window
window.addEventListener("message", (event) => {
    const { id, front, back } = event.data;
    const activeDeck = state.decks.find(d => d.id === state.selectedDeckId);
    const cardIndex = activeDeck.cards.findIndex(c => c.id === id);

    if (cardIndex > -1) {
        activeDeck.cards[cardIndex] = { ...activeDeck.cards[cardIndex], front, back };
        saveState(); // Update localStorage and re-render
    }
});

// Search functionality
document.getElementById('search-bar').addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    render();
});

document.getElementById('search-btn').addEventListener('click', () => {
    const searchBar = document.getElementById('search-bar');
    state.searchQuery = searchBar.value;
    render();
    searchBar.focus();
});

loadState();
