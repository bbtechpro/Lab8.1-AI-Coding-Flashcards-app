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
let cardModalMode = 'create';
let cardEditId = null;

const STORAGE_KEY = 'flashcards-app-decks';
const STORAGE_SELECTED_DECK = 'flashcards-app-selected-deck';

const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-modal-close]');
const modalOverlays = document.querySelectorAll('.modal-overlay');
const decksList = document.getElementById('decks-list');
const cardsSectionHeading = document.querySelector('#cards-section h2');
const cardsContainer = document.getElementById('cards-container');
const addCardBtn = document.getElementById('add-card-btn');
const modalForm = document.getElementById('modal-form');
const deckNameInput = document.getElementById('deck-name-input');
const cardFrontInput = document.getElementById('card-front-input');
const cardBackInput = document.getElementById('card-back-input');
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
          (card) => `
          <div class="card" data-card-id="${card.id}" tabindex="0">
            <div class="card-inner">
              <div class="card-face card-front">
                <p>${escapeHtml(card.front)}</p>
                <div class="card-actions">
                  <button type="button" class="save-btn" data-edit-card="${card.id}">Edit</button>
                  <button type="button" class="delete-btn" data-delete-card="${card.id}">Delete</button>
                </div>
              </div>
              <div class="card-face card-back">
                <p>${escapeHtml(card.back)}</p>
              </div>
            </div>
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

function createCard(deck, front, back) {
  const newCard = {
    id: `card-${Date.now()}`,
    front: front.trim(),
    back: back.trim()
  };

  deck.cards.push(newCard);
  renderSelectedDeck();
  saveState();
}

function updateCard(deck, id, front, back) {
  const card = deck.cards.find((item) => item.id === id);
  if (!card) return;
  card.front = front.trim();
  card.back = back.trim();
  renderSelectedDeck();
  saveState();
}

function deleteCard(deck, id) {
  const index = deck.cards.findIndex((item) => item.id === id);
  if (index === -1) return;
  deck.cards.splice(index, 1);
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
  } else if (document.activeElement === lastFocusable) {
    event.preventDefault();
    firstFocusable.focus();
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

function prepareForm(mode = 'create', type = 'deck', id = null) {
  deckModalMode = type === 'deck' ? mode : 'create';
  cardModalMode = type === 'card' ? mode : 'create';
  deckEditId = type === 'deck' ? id : null;
  cardEditId = type === 'card' ? id : null;

  const deckSection = modal.querySelector('[data-form-section="deck"]');
  const cardSection = modal.querySelector('[data-form-section="card"]');
  const titleElement = document.getElementById('modal-title');

  if (type === 'deck') {
    deckSection.classList.remove('hidden');
    cardSection.classList.add('hidden');
    titleElement.textContent = mode === 'edit' ? 'Edit Deck' : 'New Deck';
    const deck = decks.find((item) => item.id === id);
    deckNameInput.value = deck ? deck.title : '';
    cardFrontInput.value = '';
    cardBackInput.value = '';
  } else {
    deckSection.classList.add('hidden');
    cardSection.classList.remove('hidden');
    titleElement.textContent = mode === 'edit' ? 'Edit Card' : 'New Card';
    const deck = decks.find((item) => item.id === selectedDeckId);
    if (mode === 'edit' && deck && id) {
      const card = deck.cards.find((item) => item.id === id);
      if (card) {
        cardFrontInput.value = card.front;
        cardBackInput.value = card.back;
      }
    } else {
      cardFrontInput.value = '';
      cardBackInput.value = '';
    }
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
      prepareForm('create', 'deck');
    }

    if (action === 'create-card') {
      if (!selectedDeckId) return;
      prepareForm('create', 'card');
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

modalForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const deckTitle = deckNameInput.value.trim();
  const cardFront = cardFrontInput.value.trim();
  const cardBack = cardBackInput.value.trim();

  const isDeckForm = !modal.querySelector('[data-form-section="deck"]').classList.contains('hidden');

  if (isDeckForm) {
    if (!deckTitle) return;
    if (deckModalMode === 'edit' && deckEditId) {
      updateDeck(deckEditId, deckTitle);
    } else {
      createDeck(deckTitle);
    }
  } else {
    if (!selectedDeckId || !cardFront || !cardBack) return;
    const deck = decks.find((item) => item.id === selectedDeckId);
    if (!deck) return;

    if (cardModalMode === 'edit' && cardEditId) {
      updateCard(deck, cardEditId, cardFront, cardBack);
    } else {
      createCard(deck, cardFront, cardBack);
    }
  }

  closeModal(modal);
});

decksList.addEventListener('click', (event) => {
  const editButton = event.target.closest('[data-edit-deck]');
  const deleteButton = event.target.closest('[data-delete-deck]');
  const deckItem = event.target.closest('[data-deck-id]');

  if (editButton) {
    const deckId = editButton.dataset.editDeck;
    prepareForm('edit', 'deck', deckId);
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

cardsContainer.addEventListener('click', (event) => {
  const cardItem = event.target.closest('.card');
  if (!cardItem) return;

  const editButton = event.target.closest('[data-edit-card]');
  const deleteButton = event.target.closest('[data-delete-card]');

  if (editButton) {
    const cardId = editButton.dataset.editCard;
    prepareForm('edit', 'card', cardId);
    openModal(modal, editButton);
    return;
  }

  if (deleteButton) {
    const cardId = deleteButton.dataset.deleteCard;
    const deck = decks.find((item) => item.id === selectedDeckId);
    if (deck) {
      deleteCard(deck, cardId);
    }
    return;
  }

  if (event.target.closest('button')) {
    return;
  }

  cardItem.classList.toggle('is-flipped');
});

addCardBtn.addEventListener('click', () => {
  if (!selectedDeckId) return;
  prepareForm('create', 'card');
  openModal(modal, addCardBtn);
});

loadState();
renderDecks();
renderSelectedDeck();
