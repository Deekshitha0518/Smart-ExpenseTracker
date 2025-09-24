// Elements
const titleInput = document.getElementById('title');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const addBtn = document.getElementById('add-btn');
const expenseList = document.getElementById('expense-list');
const totalEl = document.getElementById('total');
const toggleModeBtn = document.getElementById('toggle-mode');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function renderExpenses(){
    expenseList.innerHTML = '';
    expenses.forEach((expense, index)=>{
        const div = document.createElement('div');
        div.classList.add('expense-item');
        div.innerHTML = `
            <span>${expense.title} - ₹${expense.amount} [${expense.category}]</span>
            <button onclick="deleteExpense(${index})">Delete</button>
        `;
        expenseList.appendChild(div);
    });
    updateTotal();
    renderChart();
}

function updateTotal(){
    const total = expenses.reduce((sum, e)=> sum + Number(e.amount),0);
    totalEl.textContent = total;
}

function addExpense(){
    const title = titleInput.value.trim();
    const amount = amountInput.value.trim();
    const category = categoryInput.value;

    if(title === '' || amount === '') return alert('Enter title and amount!');
    expenses.push({title, amount, category});
    localStorage.setItem('expenses', JSON.stringify(expenses));
    titleInput.value = '';
    amountInput.value = '';
    renderExpenses();
}

function deleteExpense(index){
    expenses.splice(index,1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
}

addBtn.addEventListener('click', addExpense);

toggleModeBtn.addEventListener('click', ()=>{
    document.body.classList.toggle('dark-mode');
});

// Chart.js
let chart;
function renderChart(){
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const categories = {};
    expenses.forEach(e=>{
        categories[e.category] = (categories[e.category] || 0) + Number(e.amount);
    });
    const labels = Object.keys(categories);
    const data = Object.values(categories);
    if(chart) chart.destroy();
    chart = new Chart(ctx, {
        type:'pie',
        data:{
            labels: labels,
            datasets:[{
                label:'Expenses by Category',
                data:data,
                backgroundColor:['#ff6384','#36a2eb','#ffcd56','#4bc0c0','#9966ff'],
            }]
        },
        options:{
            responsive:true,
            plugins:{legend:{position:'bottom'}}
        }
    });
}

// Initialize
renderExpenses();