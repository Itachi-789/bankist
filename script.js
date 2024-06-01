"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

////////////////////////////////////////////////

const displayMovements = function (acc) {
  containerMovements.innerHTML = "";
  acc.movements.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${Math.abs(mov)} €</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// computing usernames

const createUsernames = function (acc) {
  acc.forEach((accInfo) => {
    accInfo.username = accInfo.owner
      .toLowerCase()
      .split(" ")
      .map((mov) => mov[0])
      .join("");
  });
};

createUsernames(accounts);
console.log(accounts);

// calculating total balance

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr, i) => acc + curr, 0);
  labelBalance.textContent = acc.balance + " €";
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `${incomes}€`;
  const investments = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = `${Math.abs(investments)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => mov * (acc.interestRate / 100))
    .filter((mov) => mov >= 1)
    .reduce((acc, curr) => acc + curr, 0);
  console.log(interest);
  labelSumInterest.textContent = `${interest}€`;
};

const updateUI = function(acc){
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
}
// Event handlers
let currentAccount;

btnLogin.addEventListener("click", function (event) {
  event.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // clearing the fields
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    inputLoginPin.blur();

    // displaying content
    updateUI(currentAccount); 
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAccount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    console.log(currentAccount);

    currentAccount.movements.push(-amount); 
    receiverAccount.movements.push(amount); 
    console.log(receiverAccount.movements); 

    updateUI(currentAccount); 
    inputTransferTo.value=""; 
    inputTransferAmount.value="";   
  }
}); 

btnClose.addEventListener("click", function(event){
  event.preventDefault(); 
  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){
    const index = accounts.findIndex((acc)=>acc.username === currentAccount.username)
    accounts.splice(index, 1); 
    console.log(accounts);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = ""; 
})

btnLoan.addEventListener("click", function(e){
  e.preventDefault(); 
  const amount = Number(inputLoanAmount.value); 
  if(amount > 0 && currentAccount.movements.some(amt => amt > amount * 0.1)){
    currentAccount.movements.push(amount); 
    console.log(amount);
    updateUI(currentAccount); 
  }
  inputLoanAmount.value=""; 
}) 