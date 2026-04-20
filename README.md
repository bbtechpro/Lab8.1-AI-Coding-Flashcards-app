Using the information provided in this lab, build a Flashcards web app. The app should be a single-page app, with no build tools required. Your app should be able to create, edit, delete decks and cards, and study the cards in a deck. The app should be responsive and accessible.

- Part 1: Base UI & Layout
Build the shell:

## Header with app name + “New Deck” button.
## Sidebar: list of decks; active deck highlighted.
## Main: deck title, toolbar (search, shuffle, “New Card”), card area (card front/back), and controls (prev/next/flip).
## Footer: short instructions.

- My first prompt in 'Ask mode' was worded as this, "Using the information provided in this lab, build a Flashcards web app. The app should be a single-page app, with no build tools required. Your app should be able to create, edit, delete decks and cards, and study the cards in a deck. The app should be responsive and accessible. Create a minimal HTML skeleton for a Flashcards app with header, sidebar for decks, main area for cards, and a footer".

Copilot's response: "
Based on your request, I'll provide a minimal HTML skeleton for the Flashcards web app. Since this is a single-page app using vanilla JavaScript (no build tools), the structure focuses on semantic HTML for accessibility, with placeholders for dynamic content that will be managed via JavaScript (e.g., in app.js). The layout includes:

A header for the app title and navigation.
A sidebar for listing and managing decks.
A main area for displaying and interacting with cards (e.g., creating, editing, studying).
A footer for additional info or actions.
To make it responsive, I've included basic CSS classes that can be expanded in styles.css (e.g., using Flexbox or Grid for layout, media queries for mobile). For accessibility, I've used semantic elements, ARIA labels where needed, and ensured keyboard-navigable elements.

Key Notes on the Structure:
Header: Contains the app title and a button to create new decks.
Sidebar: A list for decks. JavaScript will populate this with deck names, and add buttons for edit/delete actions.
Main Area: Two sections – one for managing cards in a deck, another for study mode (hidden by default). Includes buttons for adding cards, flipping, and navigating during study.
Footer: Simple copyright info.
Accessibility: Used role attributes, aria-label for screen readers, and semantic elements like <header>, <aside>, <main>, <footer>.
Responsiveness: The layout assumes a flex/grid setup in CSS (e.g., sidebar on the left, main on the right on desktop; stacked on mobile).
To implement the full app features (create/edit/delete decks/cards, study mode), you'll need to add JavaScript logic in app.js to handle DOM manipulation, local storage for data persistence, and event listeners. For example:

Store decks and cards in localStorage as JSON.
Dynamically generate deck lists and card views.
Toggle between card management and study mode.
Ensure keyboard navigation (e.g., Tab order) and ARIA updates for dynamic content.
For CSS in styles.css, start with basic resets, then add styles for layout (e.g., body { display: flex; flex-direction: column; }, #sidebar { width: 200px; }, media queries for mobile). Use CSS variables for colors/themes to keep it maintainable.

If you provide more details from the lab (e.g., specific UI requirements or data structures), I can refine this further or suggest code snippets for app.js and styles.css. Let me know how you'd like to proceed!

- Next, I asked, "Write base styles with CSS variables and responsive grid".
And Copilot responded with: "I'm in Ask mode, so I can't modify files directly. However, I can provide you with comprehensive base styles for styles.css that include CSS variables and a responsive grid layout. You can then copy this into your styles.css file:

This CSS provides:

CSS Variables: Colors, spacing, typography, borders, and shadows for easy theming
Dark Mode Support: Automatically adapts colors based on system preference
Responsive Grid: Uses CSS Grid for cards with auto-fill for flexible columns
Responsive Layout: Sidebar becomes horizontal on mobile, main content stacks
Accessibility: Focus states, reduced motion support, and semantic styling
Base Components: Styled for header, sidebar, cards, buttons, forms, and footer
Copy this into your styles.css file to get started!

Claude Haiku 4.5 • 1x
- Quality checks:

✅ Semantic structure (header, nav, main, section, button).
✅ Scales on mobile/desktop.

- I asked, "Generate responsive CSS grid layout: fixed-width sidebar, fluid main; prefers-color-scheme support; focus styles for buttons/links".

Copilot response: I'm in Ask mode, so I can provide you with enhanced CSS focused on those specific requirements. Here's a more refined version that emphasizes the responsive grid layout, dark mode support, and accessible focus styles:

Key enhancements:

Responsive CSS Grid: Uses grid-template-columns: var(--sidebar-width) 1fr for fixed sidebar + fluid main on desktop; collapses to single column on mobile.
Dark Mode: Complete prefers-color-scheme: dark support with coordinated color palette.
Accessible Focus Styles:
outline + outline-offset (visible on all devices)
:focus-visible (keyboard-only, doesn't show on mouse clicks)
Custom focus ring color using CSS variables
Works on buttons, links, form inputs, and list items
Enhanced Accessibility: Includes prefers-reduced-motion and prefers-contrast media queries
Copy this into your styles.css file!

- Prompt: Fix inconsistent class names between HTML/CSS
Reviewing the HTML and CSS to identify class mismatches.

Checking the JavaScript too, since class mismatches often involve dynamic elements.

Found one definite mismatch: .skip-link is styled in CSS but not present in HTML. Adding it will improve accessibility and align the files.

Edited
index.html+1-0
✅ Fixed the class mismatch by adding the .skip-link
This aligns the HTML with the styles.css rule for .skip-link and improves accessibility for keyboard users.

- Prompt: Are ther any more inconsistencies?
Review Result
No direct mismatches remain between the current static HTML and CSS selectors for the existing shell.

Confirmed matches
#new-deck-btn, #add-card-btn, #flip-card-btn, #next-card-btn all exist in HTML.
#sidebar, #decks-list, #main-content, #cards-container, #study-card, #study-section all match CSS.
.skip-link is now present in HTML and matches the CSS rule.
Notes
These selectors are present only in CSS and not yet in the static HTML:

.delete-btn
.save-btn
.form-group
.card
.card-front
.card-back
a[role="button"]
They are likely intended for dynamic UI elements created by JavaScript, so they are not necessarily inconsistent.

- Part 2: Deck CRUD
Implement “New Deck” modal with name field.
Add deck to sidebar; select to switch active deck.
Edit deck name and delete deck (confirm dialog).


- Prompt: Create an accessible modal component in plain JS with focus trap, ESC to close, and return focus to opener.


Updating the HTML, CSS, and JavaScript together so the modal component works cleanly.

One CSS edit missed due to matching context; I’m locating the exact block and then I’ll add the modal behavior script.

Adding the modal CSS at the end of styles.css, then I’ll populate app.js with the modal logic.

Inspecting the exact trailing text in styles.css to patch safely.
Accessible Modal Added
What changed
index.html

Added modal markup with:
role="dialog"
aria-modal="true"
aria-labelledby="modal-title"
close button with data-modal-close
overlay click close support
Added a sample opener button: data-modal-target="#app-modal"
styles.css

Added modal styling for overlay, dialog, header, close button, and hidden state.
Kept focus-visible styling for accessible keyboard navigation.
app.js

Added plain JS modal logic with:
focus trap inside the modal
Escape key to close
overlay click to close
return focus to the opener button after close
Result
You now have a working accessible modal component in plain JS with focus management and keyboard controls.

- Prompt: Updating HTML structure for deck form modal and wiring the create button.

Edited
index.html+12-5
Next I’ll replace app.js with the full modal and deck CRUD logic.

Adding small UI styles for deck action buttons and modal form layout.

Deck CRUD Implemented
What changed
app.js

Added in-memory decks array
Added deck creation, editing, deletion
Added deck selection and UI rendering
Wired modal form to create/edit decks
Updated cards area to reflect selected deck
Disabled Add Card until a deck is selected
index.html

Reused the accessible modal for deck create/edit
Added form fields for deck name
Wired New Deck to open the deck modal
styles.css

Added layout styles for .deck-actions and .modal-actions
Result
Create deck via modal
Edit and delete decks from the deck list
Deck list updates immediately
Selected deck updates the cards panel dynamically
If you want, I can next persist decks in localStorage so the state survives reloads.


Updating HTML structure for deck form modal and wiring the create button.

Edited
index.html+12-5
Next I’ll replace app.js with the full modal and deck CRUD logic.

Adding small UI styles for deck action buttons and modal form layout.

Deck CRUD Implemented
What changed
app.js

Added in-memory decks array
Added deck creation, editing, deletion
Added deck selection and UI rendering
Wired modal form to create/edit decks
Updated cards area to reflect selected deck
Disabled Add Card until a deck is selected
index.html

Reused the accessible modal for deck create/edit
Added form fields for deck name
Wired New Deck to open the deck modal
styles.css

Added layout styles for .deck-actions and .modal-actions
Result
Create deck via modal
Edit and delete decks from the deck list
Deck list updates immediately
Selected deck updates the cards panel dynamically
If you want, I can next persist decks in localStorage so the state survives reloads.

- Prompt: Yes, persist decks in localStorage so the state survives reloads.

Reviewing current deck state logic before adding persistence.

Adding localStorage helpers now and wiring save/load around deck state operations.

✅ Deck persistence is now implemented.

What changed
app.js
Added loadState() to restore decks and selected deck from localStorage
Added saveState() to persist deck data and selected deck
Wired saveState() into:
createDeck()
updateDeck()
deleteDeck()
selectDeck()
card creation flow
On startup, the app now calls loadState() before rendering
Result
Decks and selection now survive page reloads using browser localStorage.

- Quality checks
✅ Pressing Tab cycles within modal.
✅ Sidebar updates without reload.

Part 3: Card CRUD + Flip Animation
“New Card” button opens modal with “Front” and “Back” fields.
List/preview cards in deck (optional), but at minimum be able to cycle in Study mode.
Edit/delete card actions.
CSS flip animation for the study card.

- Prompt: Add a CSS 3D flip animation to a .card on .is-flipped class toggle. Implement card create/edit/delete with delegated events.


Applying the UI and animation markup updates, then replacing script with card CRUD logic.

Done
Added card flip animation and card CRUD with delegated events.

What changed
styles.css

Added .card, .card-inner, .card-face, and .is-flipped styles
Implemented 3D flip animation using transform-style: preserve-3d
Added .card-actions styling for edit/delete buttons
index.html

Updated Add Card to open the modal in card creation mode
Expanded modal form to support both deck and card forms
app.js

Added card create/edit/delete logic using delegated event handling on cardsContainer
Clicking a card toggles .is-flipped
Card edit/delete uses data-edit-card / data-delete-card
Card creation/edit uses the shared modal form with dynamic mode handling
Result
Cards now flip in 3D on click
Card CRUD is implemented through event delegation
Deck/card modal reuses the accessible modal component cleanly

- Quality checks:

✅ Smooth flip at 60fps on desktop and mobile.
Editing a card persists and updates the current view.
The save button on the edit card function does not save and close the window.
- Prompt: The save button on the edit card function does not save and close the window.

Fixed the save button issue for card editing. The problem was that the form submission event wasn't reliably triggering in the modal context. I changed the save button from type="submit" to type="button" and attached a click event listener directly to it, ensuring the save and close logic executes properly for both deck and card operations. The modal now closes and saves data correctly when editing cards.

## This last "fix" deleted the cards I already had and broke the "Add Card" button. I am going to undo the last changes.
I undid the changes and my deck of cards came back and my "Add Card" button works again. I may have to find the previous bug of the editing of the cards not saving and fix it manually.

I tried asking Github Copilot chat to fix the issue with the 'Edit card' not working, but it remained broken, even though the respnse said it had fixed the problem twice. So I imported the entire project into Cursor, and asked its AI chat to fix the nonfunctioning edit buttons, and it responcded that it had fixed them. It was still not working, so I decided to try Google Gemini. I took the README.md file that I had created so far based on the Github Copliot resoponses and actions and converted it to a PDF file. I fed the PDF file into Gemni and it created a basic working flashcard app with most of the requirements through part 3. Then I renmaed the exisitng files to backups and created new versions of index.html, styles.css, and app.js files in VS-Code. Then I asked the chat to : Add edit button on each card thst will display the current contants, allow editing, and save the changes.
Changes Made:
1. Edit Button on Cards
Added an "Edit" button to the front of each card
Button is positioned in the bottom-right corner
Uses event.stopPropagation() to prevent card flipping when clicked
2. Edit Window Functionality
Clicking the edit button opens a popup window displaying current card content
Users can edit the front and back text in textareas
Save button sends changes back to the main window
Cancel button closes without saving
3. Fixed Issues
Cleaned up duplicate card rendering code
Added missing deleteDeck function for deck deletion
Added grid layout for proper card display
Fixed CSS positioning for the edit button
4. Data Persistence
Changes are saved to localStorage automatically
Page refresh preserves all edits
How It Works:
Click the Edit button on any card
A popup window opens with the card's current front and back content
Edit the text as needed
Click Save Changes to update the card (or Cancel to discard)
The main page automatically updates and saves to storage
The implementation uses the browser's postMessage API for communication between the popup and main window, ensuring changes are properly synchronized and persisted.
- Prompt: Make the interface look more modern with a space theme.
Perfect! I've transformed your flashcards app with a modern space theme. Here's what I added:

Space Theme Features:
🌌 Color Palette
Dark space backgrounds with deep blues and purples
Neon accents: Cyan, purple, pink, and green for that cyberpunk space vibe
Gradient backgrounds throughout for depth and modernity
✨ Visual Effects
Twinkling stars animated in the background
Glowing neon borders on cards and buttons with shadow effects
Shine animation on cards that plays continuously
Smooth transitions and hover effects with 3D transforms
🎨 Modern Styling
Gradient buttons with glow effects that intensify on hover
Cards with elevation that lift up when hovered
Neon text effects with text shadows for a cyberpunk feel
Improved spacing and typography for better readability
Smooth card flip animation with better easing
🎯 UI Improvements
Enhanced sidebar with hover effects and gradient active state
Better search bar with focus states and glow effects
Modern modal dialog with backdrop blur and neon borders
Responsive design that works beautifully on all screen sizes
Professional gradients on the header and throughout
The interface now has a sleek, futuristic space aesthetic while maintaining excellent usability and accessibility!

Part 4: Study Mode + Navigation
Buttons: Flip, Previous, Next, Shuffle.
Optionally randomize order per session.
Keyboard support: Space (flip), ArrowLeft/Right (prev/next).
Prompts to try:
- Prompt: Fix the shuffle button functionality.
Shuffle Button Implementation:
Features:

Fisher-Yates Shuffle Algorithm: Uses a proper randomization algorithm to shuffle cards
Deck Validation: Only shuffles if a deck is selected and has cards
Enable/Disable: Button is now automatically enabled when a deck is selected
Persistent Shuffle: Changes are saved to localStorage automatically
How it works:

Click the Shuffle button when a deck is selected
Cards are randomized using the Fisher-Yates algorithm (industry standard)
The shuffled order is saved and displayed immediately
The original cards are preserved—only their display order changes
The shuffle button is now fully functional and integrated with your space-themed UI!
Implement enterStudyMode(deckId) that initializes an index, renders current card, handles keyboard shortcuts, and cleans up listeners when exiting.

AI inconsistency watch:

Memory leaks: listeners added multiple times; remove on mode change.
Off-by-one errors at deck boundaries.
Quality checks:

No console errors during rapid navigation.
Keyboard-only usage is smooth.

Part 5: Persistence & Search
Save decks/cards to LocalStorage on changes.
Restore state on reload (including last active deck).
Add case-insensitive keyword search for cards in active deck.
- Prompt: Fix the search function and add a search buuton.
Search Functionality Fixed & Enhanced!
I've successfully implemented a complete search system for your flashcards app with the following features:

🔍 Search Features Added:
1. Search Button

Added a stylish search button (🔍) next to the search bar
Connected search bar and button with seamless styling
Button is disabled when no deck is selected
2. Real-Time Search

Live filtering: Cards filter as you type in the search bar
Case-insensitive: Searches work regardless of letter case
Dual content search: Searches both front AND back of cards
Instant results: No need to click search - results appear immediately
3. Smart Search Logic

Searches through both card faces simultaneously
Uses includes() for partial matches (e.g., "cat" finds "caterpillar")
Filters cards in real-time without affecting the original deck order
4. User Experience Enhancements

Clear on deck switch: Search clears automatically when selecting different decks
Visual feedback: Search button has hover effects matching the space theme
Accessibility: Proper ARIA labels and keyboard navigation
Responsive design: Search container adapts to different screen sizes
🎨 Visual Design:
Space-themed styling: Neon cyan/purple gradients matching your theme
Connected input/button: Seamless border design with shared styling
Glow effects: Hover states with neon glow effects
Professional layout: Clean, modern appearance
🔧 Technical Implementation:
State management: Added searchQuery to app state
Event listeners: Both input events (real-time) and click events (button)
Filtering logic: Efficient card filtering with JavaScript array methods
UI updates: Automatic re-rendering when search changes
🚀 How to Use:
Select a deck with cards
Type in the search bar - cards filter instantly
Or click the 🔍 button to trigger search
Clear the search to see all cards again
Switch decks to automatically clear search
The search functionality is now fully operational and integrated seamlessly with your space-themed UI!

Grok Code Fast 1 • 1x
Prompts to try:

Create storage.js helpers: loadState(), saveState(), with versioning and safe parse fallback. Implement debounced search (300ms) that filters cards; show count of matches.

AI inconsistency watch:

LocalStorage overwrite bugs.
Search should not mutate underlying data, only view.
Quality checks:

Refresh keeps decks/cards intact.
Clearing search restores full set.

Part 6: QA & Polish
Accessibility: labels on inputs; buttons have discernible text; visible focus styles.
Empty states: “No decks yet” / “No cards found” messages.
Error handling: invalid inputs, empty deck name, etc.
Basic theming: CSS variables; prefers dark mode.
Prompts to try:

Add accessible empty-state components with icons and instructions. Audit the app for a11y and fix issues (aria, roles, focus).

Accessibility and Empty-State Improvements Added
What changed
index.html

Added accessible empty-state panels for:
no decks yet
no deck selected
no cards in deck
no search results
Added meaningful icons and instructional text
Added aria-live="polite" / role="status" to empty-state regions
Added explicit type="button" and aria-label to action buttons
styles.css

Added focused visible outlines for keyboard users
Styled empty-state components with clear instruction panels
Added skip-link visible focus styling
Added accessible button styles for deck selection and delete actions
app.js

Render logic now shows the appropriate empty state when:
no decks exist
no deck is selected
the selected deck has no cards
search returns no matches
Deck items are now actual buttons for keyboard access
Card flip elements now support Enter / Space keyboard activation
Search state is cleared when switching decks
Result
The UI now communicates clearly to screen readers
Empty states guide users with next steps
Interactive controls are more keyboard-friendly
Focus management is improved across buttons and cards
Raptor mini (Preview) • 1x

AI inconsistency watch:

Color contrast below WCAG AA; adjust variables.
Missing aria-live for dynamic updates (optional).
Minimal Data Model (for reference)
AppState:
decks: Array<{ id: string, name: string, createdAt: number }>
cardsByDeckId: Record<string, Array<{ id: string, front: string, back: string, updatedAt: number }>>
activeDeckId: string | null
ui: { isModalOpen: boolean; activeCardIndex: number }
Tip: Keep rendering logic in small functions; avoid global event chaos.

Rubric
This lab will be graded on a complete/incomplete basis. A compelte lab consists of a code package, working or not, that attempts to meet the requirements of the given task, as well as a reflection.

Reflection (required)
In 5 bullets, include:

Where AI saved time.
At least one AI bug you identified and how you fixed it.

- Github Copilot broke some of the originally functionality of the app while trying to fix the edit card function. I had to try different AI chats, until I finally got the desired results.

A code snippet you refactored for clarity.

- Added:
    if (cardIndex > -1) {
        activeDeck.cards[cardIndex] = { ...activeDeck.cards[cardIndex], front, back };
        saveState(); 
    } // to update local storage and re-render

One accessibility improvement you added.

- Added accessible empty-state panels for: no decks yet, no deck selected, no cards in deck, and no search results.

What prompt changes improved AI output?

Providing more detail to steer the activity of the AI's response.

Common AI Failure Modes I caught:
Inconsistent variable or class names across files.
Event listeners added multiple times; use delegation or cleanup.
Missing accessibility attributes and focus management.
Fragile DOM queries tied to generated markup; prefer stable selectors.
LocalStorage read/write errors on malformed data.
Animation states not reset on content change.
Example Seed Prompts (copy/paste)
“Scaffold an accessible modal in vanilla JS with focus trap and esc-to-close.”
“Build a responsive two-column layout: fixed sidebar, fluid main; CSS variables; dark mode.”
“Implement LocalStorage-backed state with versioning and safe defaults.”
“Create a 3D flip card animation toggled by a button; reset on next card.”
“Add keyboard shortcuts: Space to flip, ArrowLeft/Right navigate; clean up listeners on unload.”


### Screenshot

![](./assets/Screenshot_of_Flashcard_App.jpg)

Link to deployed project: https://bbtechpro.github.io/Lab8.1-AI-Coding-Flashcards-app/