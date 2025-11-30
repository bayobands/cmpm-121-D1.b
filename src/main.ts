import "./style.css";

// === Base Counter and Button ===
let counter: number = 0;
const counterDiv = document.createElement("div");
counterDiv.innerHTML = `🔥 ${counter}`;
document.body.append(counterDiv);

const button = document.createElement("button");
button.innerHTML = "🔥"; // main click button
document.body.append(button);

button.addEventListener("click", () => {
  counter++;
  counterDiv.innerHTML = `🔥 ${Math.floor(counter)}`;
});

// === Growth Tracking ===
let growthRate = 0;
let lastTime = performance.now();

function update(time: number) {
  const delta = time - lastTime;
  lastTime = time;

  counter += (growthRate * delta) / 1000;
  counterDiv.innerHTML = `🔥 ${Math.floor(counter)}`;
  refreshStatus();

  requestAnimationFrame(update);
}

requestAnimationFrame(update);

// === Step 6: Multiple Upgrades + Status ===
const rateDiv = document.createElement("div");
rateDiv.innerHTML = `Growth rate: ${growthRate.toFixed(1)} 🔥/sec`;
document.body.append(rateDiv);

const ownedDiv = document.createElement("div");
ownedDiv.innerHTML = `Owned: A=0, B=0, C=0`;
document.body.append(ownedDiv);

// Each upgrade item
let ownedA = 0, ownedB = 0, ownedC = 0;

const btnA = document.createElement("button");
const btnB = document.createElement("button");
const btnC = document.createElement("button");

document.body.append(btnA, btnB, btnC);

// === Step 7: Price scaling helpers ===
function price(base: number, owned: number): number {
  return base * Math.pow(1.15, owned);
}

function fmt(n: number): string {
  return n >= 1000 ? Math.round(n).toString() : n.toFixed(2);
}

// === Refresh UI & Buttons ===
function refreshStatus() {
  rateDiv.innerHTML = `Growth rate: ${growthRate.toFixed(1)} 🔥/sec`;
  ownedDiv.innerHTML = `Owned: A=${ownedA}, B=${ownedB}, C=${ownedC}`;

  const costA = price(10, ownedA);
  const costB = price(100, ownedB);
  const costC = price(1000, ownedC);

  btnA.textContent = `Buy A (+0.1/sec) — cost ${fmt(costA)}`;
  btnB.textContent = `Buy B (+2/sec) — cost ${fmt(costB)}`;
  btnC.textContent = `Buy C (+50/sec) — cost ${fmt(costC)}`;

  btnA.disabled = counter < costA;
  btnB.disabled = counter < costB;
  btnC.disabled = counter < costC;
}

// === Purchase logic for each upgrade ===
btnA.addEventListener("click", () => {
  const cost = price(10, ownedA);
  if (counter >= cost) {
    counter -= cost;
    growthRate += 0.1;
    ownedA++;
    refreshStatus();
  }
});

btnB.addEventListener("click", () => {
  const cost = price(100, ownedB);
  if (counter >= cost) {
    counter -= cost;
    growthRate += 2;
    ownedB++;
    refreshStatus();
  }
});

btnC.addEventListener("click", () => {
  const cost = price(1000, ownedC);
  if (counter >= cost) {
    counter -= cost;
    growthRate += 50;
    ownedC++;
    refreshStatus();
  }
});

// Initial refresh to set up button states
refreshStatus();
