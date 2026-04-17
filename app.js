let state = { decks: [], selectedDeckId: null };

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
    
    if (activeDeck) {
        document.getElementById('current-deck-title').textContent = activeDeck.name;
        container.innerHTML = activeDeck.cards.map(c => `
            <div class="card" onclick="this.classList.toggle('is-flipped')">
                <div class="card-inner">
                    <div class="card-face card-front">${c.front}</div>
                    <div class="card-face card-back">${c.back}</div>
                </div>
            </div>
        `).join('');
    }
};

window.selectDeck = (id) => { state.selectedDeckId = id; saveState(); };

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

loadState();
