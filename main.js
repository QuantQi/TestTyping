// main.js

// Global Variables
let currentCharIndex = 0;
let startTime, interval;
let correctCharsTyped = 0;
let totalCharsTyped = 0;
let incorrectChars = [];

// DOM Elements
const textToTypeElement = document.getElementById('character');
const characterBox = document.getElementById('characterBox');
const leftArrow = document.getElementById('leftArrow');
const rightArrow = document.getElementById('rightArrow');
const upArrow = document.getElementById('upArrow');
const downArrow = document.getElementById('downArrow');
const fingerNumberElement = document.getElementById('fingerNumber');
const feedback = document.getElementById('feedback');
const timeElapsedElement = document.getElementById('timeElapsed');
const cpmElement = document.getElementById('cpm');
const accuracyElement = document.getElementById('accuracy');
const finalResults = document.getElementById('finalResults');
const finalTimeElapsed = document.getElementById('finalTimeElapsed');
const finalCpm = document.getElementById('finalCpm');
const finalAccuracy = document.getElementById('finalAccuracy');
const incorrectLettersElement = document.getElementById('incorrectLetters');
const restartButton = document.getElementById('restartButton');

// Initialization
window.onload = startTest;
document.addEventListener('keydown', handleKeyPress);
restartButton.addEventListener('click', handleRestart);

function startTest() {
    finalResults.classList.add('hidden');
    feedback.classList.remove('hidden');
    incorrectChars = [];
    updateIncorrectLettersPane();
    characterBox.classList.remove('flash-red');
    startTime = new Date();
    if (interval) clearInterval(interval);
    interval = setInterval(updateTime, 100);
    correctCharsTyped = 0;
    totalCharsTyped = 0;
    displayNextCharacter();
}

function updateTime() {
    const timeElapsed = Math.floor((new Date() - startTime) / 1000);
    timeElapsedElement.innerText = timeElapsed;

    if (timeElapsed >= TEST_DURATION) {
        clearInterval(interval);
        finishTest();
    }
}

function updateFeedback() {
    const timeElapsed = Math.floor((new Date() - startTime) / 1000);
    const cpm = Math.floor((correctCharsTyped / timeElapsed) * 60);
    const accuracy = (correctCharsTyped / totalCharsTyped) * 100;

    cpmElement.innerText = isNaN(cpm) || !isFinite(cpm) ? 0 : cpm;
    accuracyElement.innerText = isNaN(accuracy) ? 0 : accuracy.toFixed(2);
}

function finishTest() {
    const timeElapsed = (new Date() - startTime) / 1000;
    const cpm = Math.floor((correctCharsTyped / timeElapsed) * 60);
    const accuracy = (correctCharsTyped / totalCharsTyped) * 100;

    finalTimeElapsed.innerText = timeElapsed.toFixed(2);
    finalCpm.innerText = cpm;
    finalAccuracy.innerText = accuracy.toFixed(2);

    feedback.classList.add('hidden');
    finalResults.classList.remove('hidden');
}

function getCharacterSet() {
    const selectedRow = document.querySelector('input[name="keyRow"]:checked').value;

    switch (selectedRow) {
        case 'top':
            return topRowKeys;
        case 'home':
            return homeRowKeys;
        case 'bottom':
            return bottomRowKeys;
        case 'all':
            return characters;
        default:
            return characters; // fallback
    }
}

function displayNextCharacter() {
    const charactersToUse = getCharacterSet();
    currentCharIndex = Math.floor(Math.random() * charactersToUse.length);
    const currentChar = charactersToUse[currentCharIndex];
    textToTypeElement.innerHTML = currentChar === "Space" ? "[Space]" : currentChar;

    const leftHand = isLeftHand(currentChar);
    const fingerNumber = getFingerNumber(currentChar);

    fingerNumberElement.innerText = fingerNumber;

    leftArrow.innerText = "";
    rightArrow.innerText = "";
    upArrow.innerText = "";
    downArrow.innerText = "";

    if (leftHand) {
        leftArrow.innerText = "arrow_left";
    } else if (leftHand === false) {
        rightArrow.innerText = "arrow_right";
    }

    if (topRowKeys.includes(currentChar)) {
        upArrow.innerText = "arrow_upward";
    } else if (bottomRowKeys.includes(currentChar)) {
        downArrow.innerText = "arrow_downward";
    }
}

function handleKeyPress(event) {
    // Ignore if 'Shift' key is pressed
    if (event.key === 'Shift') return;

    if (finalResults.classList.contains('hidden')) {
        const typedChar = event.key;
        totalCharsTyped++;

        const expectedChar = characters[currentCharIndex];

        if (expectedChar === "Space" && typedChar === ' ') {
            correctCharsTyped++;
            displayNextCharacter();
        } else if (typedChar === expectedChar) {
            correctCharsTyped++;
            displayNextCharacter();
        } else {
            // Incorrect character
            flashRed(characterBox);
            // Add this line
            incorrectChars.push([expectedChar, typedChar]); // Push expected and typed chars
            updateIncorrectLettersPane();
        }

        updateFeedback();
    }
}



function handleRestart() {
    startTest();
}

function updateIncorrectLettersPane() {
    incorrectLettersElement.innerHTML = incorrectChars.join('   ');
}

// Add your other helper functions like isLeftHand, getFingerNumber, etc.
