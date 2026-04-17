const focusableSelectors = [
  'a[href]:not([tabindex="-1"])',
  'area[href]:not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]:not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ');

const decks = [];
let selectedDeckId = null;
let deckModalMode = 'create';
let deckEditId = null;

const STORAGE_KEY = 'flashcards-app-decks';
const STORAGE_SELECTED_DECK = 'flashcards-app-selected-deck';

const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-modal-close]');
const modalOverlays = document.querySelectorAll('.modal-overlay');
const decksList = document.getElementById('decks-list');
const cardsSectionHeading = document.querySelector('#cards-section h2');
const cardsContainer = document.getElementById('cards-container');
const addCardBtn = document.getElementById('add-card-btn');
const deckForm = document.getElementById('deck-form');
const deckNameInput = document.getElementById('deck-name-input');
const modal = document.getElementById('app-modal');

function loadState() {
  try {
    const storedDecks = localStorage.getItem(STORAGE_KEY);
    if (storedDecks) {
      const parsed = JSON.parse(storedDecks);
      if (Array.isArray(parsed)) {
        decks.splice(0, decks.length, ...parsed);
      }
    }
  } catch (error) {
    console.warn('Unable to load decks from localStorage.', error);
  }

  const storedSelected = localStorage.getItem(STORAGE_SELECTED_DECK);
  if (storedSelected && decks.some((deck) => deck.id === storedSelected)) {
    selectedDeckId = storedSelected;
  }

  if (!selectedDeckId && decks.length) {
    selectedDeckId = decks[0].id;
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
    if (selectedDeckId) {
      localStorage.setItem(STORAGE_SELECTED_DECK, selectedDeckId);
    } else {
      localStorage.removeItem(STORAGE_SELECTED_DECK);
    }
  } catch (error) {
    console.warn('Unable to save decks to localStorage.', error);
  }
}

function renderDecks() {
  decksList.innerHTML = decks
    .map((deck) => {
      const selectedClass = deck.id === selectedDeckId ? 'active' : '';
      return `
        <li class="${selectedClass}" data-deck-id="${deck.id}" tabindex="0">
          <span>${escapeHtml(deck.title)}</span>
          <div class="deck-actions">
            <button type="button" class="save-btn" data-edit-deck="${deck.id}">Edit</button>
            <button type="button" class="delete-btn" data-delete-deck="${deck.id}">Delete</button>
          </div>
        </li>`;
    })
    .join('');

  if (!decks.length) {
    decksList.innerHTML = '<li class="empty">No decks yet. Create one to get started.</li>';
  }
}

function renderSelectedDeck() {
  const deck = decks.find((item) => item.id === selectedDeckId);

  if (!deck) {
    cardsSectionHeading.textContent = 'Cards';
    cardsContainer.innerHTML = '<p>Select a deck to manage cards.</p>';
    addCardBtn.disabled = true;
    return;
  }

  cardsSectionHeading.textContent = `Cards — ${deck.title}`;
  addCardBtn.disabled = false;
  cardsContainer.innerHTML = deck.cards.length
    ? deck.cards
        .map(
          (card, index) => `
          <div class="card" tabindex="0">
            <p class="card-front">${escapeHtml(card.front)}</p>
            <p class="card-back">${escapeHtml(card.back)}</p>
          </div>`
        )
        .join('')
    : '<p>This deck has no cards yet.</p>';
}

function selectDeck(deckId) {
  selectedDeckId = deckId;
  renderDecks();
  renderSelectedDeck();
  saveState();
}

function createDeck(title) {
  const newDeck = {
    id: `deck-${Date.now()}`,
    title: title.trim(),
    cards: []
  };

  decks.push(newDeck);
  selectedDeckId = newDeck.id;
  renderDecks();
  renderSelectedDeck();
  saveState();
}

function updateDeck(id, title) {
  const deck = decks.find((item) => item.id === id);
  if (!deck) return;
  deck.title = title.trim();
  renderDecks();
  renderSelectedDeck();
  saveState();
}

function deleteDeck(id) {
  const index = decks.findIndex((item) => item.id === id);
  if (index === -1) return;
  decks.splice(index, 1);

  if (selectedDeckId === id) {
    selectedDeckId = decks.length ? decks[0].id : null;
  }

  renderDecks();
  renderSelectedDeck();
  saveState();
}

function openModal(modalElement, opener) {
  if (!modalElement) return;

  modalElement.classList.remove('hidden');
  modalElement.removeAttribute('aria-hidden');
  modalElement.dataset.open = 'true';
  modalElement._lastFocused = opener || document.activeElement;
  document.body.style.overflow = 'hidden';

  const focusableEls = getFocusableElements(modalElement);
  const firstFocusable = focusableEls[0] || modalElement;
  window.requestAnimationFrame(() => {
    firstFocusable.focus();
  });

  modalElement.addEventListener('keydown', trapFocus);
  document.addEventListener('keydown', handleEscape);
}

function closeModal(modalElement) {
  if (!modalElement) return;

  modalElement.classList.add('hidden');
  modalElement.setAttribute('aria-hidden', 'true');
  modalElement.dataset.open = 'false';
  document.body.style.overflow = '';

  modalElement.removeEventListener('keydown', trapFocus);
  document.removeEventListener('keydown', handleEscape);

  const opener = modalElement._lastFocused;
  if (opener instanceof HTMLElement) {
    opener.focus();
  }
}

function trapFocus(event) {
  if (event.key !== 'Tab') return;

  const modalElement = event.currentTarget;
  const focusableEls = getFocusableElements(modalElement);
  if (!focusableEls.length) return;

  const firstFocusable = focusableEls[0];
  const lastFocusable = focusableEls[focusableEls.length - 1];

  if (event.shiftKey) {
    if (document.activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
    }
  } else {
    if (document.activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  }
}

function handleEscape(event) {
  if (event.key !== 'Escape') return;
  const activeModal = document.querySelector('.modal-overlay:not(.hidden)');
  if (activeModal) {
    closeModal(activeModal);
  }
}

function getFocusableElements(container) {
  return Array.from(container.querySelectorAll(focusableSelectors)).filter(
    (element) => element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0
  );
}

function prepareDeckForm({ mode = 'create', deckId = null } = {}) {
  deckModalMode = mode;
  deckEditId = deckId;

  if (mode === 'edit' && deckId) {
    const deck = decks.find((item) => item.id === deckId);
    if (deck) {
      deckNameInput.value = deck.title;
      document.getElementById('modal-title').textContent = 'Edit Deck';
    }
  } else {
    deckNameInput.value = '';
    document.getElementById('modal-title').textContent = 'New Deck';
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

openModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.modalTarget;
    const action = button.dataset.modalAction;
    const modalElement = document.querySelector(target);

    if (action === 'create-deck') {
      prepareDeckForm({ mode: 'create' });
    }

    if (modalElement) {
      openModal(modalElement, button);
    }
  });
});

closeModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const modalElement = button.closest('.modal-overlay');
    if (modalElement) {
      closeModal(modalElement);
    }
  });
});

modalOverlays.forEach((overlay) => {
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeModal(overlay);
    }
  });
});

deckForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = deckNameInput.value.trim();
  if (!title) return;

  if (deckModalMode === 'edit' && deckEditId) {
    updateDeck(deckEditId, title);
  } else {
    createDeck(title);
  }

  closeModal(modal);
});

decksList.addEventListener('click', (event) => {
  const editButton = event.target.closest('[data-edit-deck]');
  const deleteButton = event.target.closest('[data-delete-deck]');
  const deckItem = event.target.closest('[data-deck-id]');

  if (editButton) {
    const deckId = editButton.dataset.editDeck;
    prepareDeckForm({ mode: 'edit', deckId });
    openModal(modal, editButton);
    return;
  }

  if (deleteButton) {
    const deckId = deleteButton.dataset.deleteDeck;
    deleteDeck(deckId);
    return;
  }

  if (deckItem) {
    const deckId = deckItem.dataset.deckId;
    selectDeck(deckId);
  }
});

addCardBtn.addEventListener('click', () => {
  if (!selectedDeckId) return;
  const deck = decks.find((item) => item.id === selectedDeckId);
  if (!deck) return;

  const front = window.prompt('Enter the front text for the new card:');
  if (!front) return;
  const back = window.prompt('Enter the back text for the new card:');
  if (back === null) return;

  deck.cards.push({ front: front.trim(), back: back.trim() });
  renderSelectedDeck();
  saveState();
});

loadState();
renderDecks();
renderSelectedDeck();
