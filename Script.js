console.log('Script loaded');

// DOM Elements
const pollQuestion = document.getElementById('poll-question');
const optionsContainer = document.getElementById('options-container');
const addOptionBtn = document.getElementById('add-option');
const createPollBtn = document.getElementById('create-poll-btn');
const pollsList = document.getElementById('polls-list');

console.log('Poll Question:', pollQuestion);
console.log('Options Container:', optionsContainer);
console.log('Add Option Button:', addOptionBtn);
console.log('Create Poll Button:', createPollBtn);
console.log('Polls List:', pollsList);

// Event Listeners
addOptionBtn.addEventListener('click', () => {
    console.log('Add option clicked');
    addOption();
});

createPollBtn.addEventListener('click', () => {
    console.log('Create poll clicked');
    createPoll();
});

function addOption() {
    const newOption = document.createElement('input');
    newOption.type = 'text';
    newOption.className = 'poll-option';
    newOption.placeholder = `Option ${optionsContainer.children.length + 1}`;
    optionsContainer.appendChild(newOption);
}

function createPoll() {
    const question = pollQuestion.value.trim();
    const options = Array.from(optionsContainer.querySelectorAll('.poll-option'))
        .map(input => input.value.trim())
        .filter(option => option !== '');

    if (question && options.length >= 2) {
        const poll = { 
            question, 
            options, 
            votes: new Array(options.length).fill(0)
        };
        savePoll(poll);
        displayPoll(poll, JSON.parse(localStorage.getItem('polls')).length - 1);
        resetForm();
    } else {
        alert('Please enter a question and at least two options.');
    }
}

function savePoll(poll) {
    let polls = JSON.parse(localStorage.getItem('polls')) || [];
    polls.push(poll);
    localStorage.setItem('polls', JSON.stringify(polls));
}

function displayPoll(poll, index) {
    const pollElement = document.createElement('div');
    pollElement.className = 'poll';
    const totalVotes = poll.votes.reduce((sum, count) => sum + count, 0);
    pollElement.innerHTML = `
        <div class="poll-header">
            <h3>${poll.question}</h3>
            <button class="delete-poll" data-index="${index}" title="Delete Poll">×</button>
        </div>
        <ul>
            ${poll.options.map((option, optionIndex) => {
                const votes = poll.votes[optionIndex];
                const percentage = totalVotes > 0 ? (votes / totalVotes * 100).toFixed(1) : 0;
                return `
                    <li>
                        <button onclick="vote(${index}, ${optionIndex})">${option}</button>
                        <span class="vote-count">${votes} (${percentage}%)</span>
                    </li>
                `;
            }).join('')}
        </ul>
        <p>Total votes: ${totalVotes}</p>
    `;
    pollsList.appendChild(pollElement);

    // Add event listener to the delete button
    pollElement.querySelector('.delete-poll').addEventListener('click', deletePoll);
}

function vote(pollIndex, optionIndex) {
    let polls = JSON.parse(localStorage.getItem('polls'));
    if (!polls[pollIndex].votes) {
        polls[pollIndex].votes = new Array(polls[pollIndex].options.length).fill(0);
    }
    polls[pollIndex].votes[optionIndex]++;
    localStorage.setItem('polls', JSON.stringify(polls));

    updatePollDisplay();
}

function hasVoted(pollIndex) {
    const votedPolls = JSON.parse(localStorage.getItem('votedPolls')) || [];
    return votedPolls.includes(pollIndex);
}

function updatePollDisplay() {
    pollsList.innerHTML = '';
    const polls = JSON.parse(localStorage.getItem('polls')) || [];
    polls.forEach((poll, index) => displayPoll(poll, index));
}

function resetForm() {
    pollQuestion.value = '';
    optionsContainer.innerHTML = `
        <input type="text" class="poll-option" placeholder="Option 1">
        <input type="text" class="poll-option" placeholder="Option 2">
    `;
}

// Initial load
updatePollDisplay();

function deletePoll(event) {
    const index = event.target.getAttribute('data-index');
    let polls = JSON.parse(localStorage.getItem('polls')) || [];
    polls.splice(index, 1);
    localStorage.setItem('polls', JSON.stringify(polls));
    updatePollDisplay();
}

// Make sure to call this function when the page loads
document.addEventListener('DOMContentLoaded', updatePollDisplay);
