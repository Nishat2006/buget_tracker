// Get DOM elements
const balanceEl = document.getElementById('balance');
const moneyPlusEl = document.getElementById('money-plus');
const moneyMinusEl = document.getElementById('money-minus');
const listEl = document.getElementById('list');
const formEl = document.getElementById('form');
const textEl = document.getElementById('text');
const amountEl = document.getElementById('amount');
const typeEl = document.getElementById('type');

// Get transactions from localStorage or initialize empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Add transaction
function addTransaction(e) {
    e.preventDefault();

    const text = textEl.value.trim();
    const amount = +amountEl.value;
    const type = typeEl.value;
    const category = document.getElementById('category').value;
    const date = new Date().toISOString();

    if (text === '' || amount === '') {
        showNotification('Please add a description and amount', 'error');
        return;
    }

    const transaction = {
        id: generateID(),
        text,
        amount: type === 'expense' ? -amount : amount,
        type,
        category,
        date
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    formEl.reset();

    showNotification('Transaction added successfully!', 'success');
}

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 1000000);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}
t
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    
    const date = formatDate(transaction.date);
    const category = transaction.category || 'Uncategorized';

    item.innerHTML = `
        <div class="transaction-info">
            <div class="transaction-text">
                <span class="transaction-title">${transaction.text}</span>
                <span class="transaction-category">${category}</span>
                <span class="transaction-date">${date}</span>
            </div>
            <div class="transaction-amount">
                <span>${sign}₹${Math.abs(transaction.amount).toFixed(2)}</span>
                <div class="transaction-actions">
                    <button class="edit-btn" onclick="editTransaction(${transaction.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    listEl.appendChild(item);
}


function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
  
    textEl.value = transaction.text;
    amountEl.value = Math.abs(transaction.amount);
    typeEl.value = transaction.type;
    document.getElementById('category').value = transaction.category || '';
    
   
    const submitBtn = formEl.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Update Transaction';
    
    
    removeTransaction(id, false);
    
   
    document.querySelector('.transaction-form').scrollIntoView({ behavior: 'smooth' });
    
    
    formEl.onsubmit = function(e) {
        e.preventDefault();
        
        
        const updatedTransaction = {
            id: generateID(),
            text: textEl.value.trim(),
            amount: typeEl.value === 'expense' ? -amountEl.value : +amountEl.value,
            type: typeEl.value,
            category: document.getElementById('category').value,
            date: new Date().toISOString()
        };
        
        transactions.push(updatedTransaction);
        addTransactionDOM(updatedTransaction);
        updateValues();
        updateLocalStorage();
        formEl.reset();
        
        // Reset form submit handler
        formEl.onsubmit = addTransaction;
        submitBtn.textContent = 'Add Transaction';
        
        showNotification('Transaction updated successfully!', 'success');
    };
}

function removeTransaction(id, showNotification = true) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
    if (showNotification) {
        showNotification('Transaction removed successfully!', 'success');
    }
}


function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    const expense = (amounts
        .filter(item => item < 0)
        .reduce((acc, item) => (acc += item), 0) * -1)
        .toFixed(2);

    balanceEl.innerText = `₹${total}`;
    moneyPlusEl.innerText = `₹${income}`;
    moneyMinusEl.innerText = `₹${expense}`;

    // Add animation to balance
    balanceEl.style.animation = 'none';
    balanceEl.offsetHeight; // Trigger reflow
    balanceEl.style.animation = 'pulse 0.5s ease-in-out';
}


function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}


function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

   
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}


function searchTransactions() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const filteredTransactions = transactions.filter(transaction => 
        transaction.text.toLowerCase().includes(searchTerm) || 
        (transaction.category && transaction.category.toLowerCase().includes(searchTerm))
    );
    
    listEl.innerHTML = '';
    filteredTransactions.forEach(addTransactionDOM);
}

// Filter transactions by type
function filterTransactions(type) {
    if (type === 'all') {
        listEl.innerHTML = '';
        transactions.forEach(addTransactionDOM);
    } else {
        const filteredTransactions = transactions.filter(transaction => transaction.type === type);
        listEl.innerHTML = '';
        filteredTransactions.forEach(addTransactionDOM);
    }
}

// Export transactions to CSV
function exportTransactions() {
    if (transactions.length === 0) {
        showNotification('No transactions to export', 'error');
        return;
    }
    
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvContent = [
        headers.join(','),
        ...transactions.map(t => [
            formatDate(t.date),
            `"${t.text}"`,
            `"${t.category || 'Uncategorized'}"`,
            t.type,
            t.amount
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `budget-tracker-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Transactions exported successfully!', 'success');
}

// Import transactions from CSV
function importTransactions() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const csvData = event.target.result;
            const rows = csvData.split('\n');
            
            // Skip header row
            const importedTransactions = rows.slice(1).map(row => {
                const [date, text, category, type, amount] = row.split(',').map(item => item.replace(/"/g, ''));
                return {
                    id: generateID(),
                    text,
                    category,
                    type,
                    amount: parseFloat(amount),
                    date: new Date(date).toISOString()
                };
            });
            
            // Add imported transactions
            transactions = [...transactions, ...importedTransactions];
            updateLocalStorage();
            init();
            
            showNotification('Transactions imported successfully!', 'success');
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Clear all transactions
function clearAllTransactions() {
    if (transactions.length === 0) {
        showNotification('No transactions to clear', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to clear all transactions? This cannot be undone.')) {
        transactions = [];
        updateLocalStorage();
        init();
        showNotification('All transactions cleared successfully!', 'success');
    }
}

// Initialize app
function init() {
    listEl.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    }

    .notification.show {
        opacity: 1;
        transform: translateX(0);
    }

    .notification.success {
        background: var(--success-color);
    }

    .notification.error {
        background: var(--danger-color);
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .transaction-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    
    .transaction-text {
        display: flex;
        flex-direction: column;
    }
    
    .transaction-title {
        font-weight: 500;
    }
    
    .transaction-category {
        font-size: 0.8rem;
        color: var(--secondary-color);
    }
    
    .transaction-date {
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.6);
    }
    
    .transaction-amount {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .transaction-actions {
        display: flex;
        gap: 5px;
    }
    
    .edit-btn {
        background: var(--primary-color);
        color: var(--light-color);
        border: none;
        padding: 0.5rem;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .edit-btn:hover {
        background: #553c9a;
        transform: scale(1.1);
    }
    
    .action-buttons {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
    }
    
    .action-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }
    
    .export-btn {
        background: var(--success-color);
        color: white;
    }
    
    .import-btn {
        background: var(--primary-color);
        color: white;
    }
    
    .clear-btn {
        background: var(--danger-color);
        color: white;
    }
    
    .filter-buttons {
        display: flex;
        gap: 10px;
        margin-bottom: 1rem;
    }
    
    .filter-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }
    
    .filter-btn.active {
        background: var(--primary-color);
    }
    
    .search-container {
        margin-bottom: 1rem;
    }
    
    .search-container input {
        width: 100%;
        padding: 0.8rem;
        border: none;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
        color: var(--light-color);
        font-size: 1rem;
    }
`;
document.head.appendChild(style);

// Event listeners
formEl.addEventListener('submit', addTransaction);

// Initialize app
init(); 