import "./style.css";

// === Base Counter and Button (CPU Clicker Theme) ===
let counter: number = 0;
const unit = "cycles"; // main currency

const counterDiv = document.createElement("div");
counterDiv.innerHTML = `⏱️ ${counter} ${unit}`;
document.body.append(counterDiv);

const button = document.createElement("button");
button.innerHTML = "🖱️ Tick CPU"; // main click button
document.body.append(button);

button.addEventListener("click", () => {
  counter++;
  counterDiv.innerHTML = `⏱️ ${Math.floor(counter)} ${unit}`;
});

// === Growth Tracking ===
let growthRate = 0;
let lastTime = performance.now();

function update(time: number) {
  const delta = time - lastTime;
  lastTime = time;

  counter += (growthRate * delta) / 1000;
  counterDiv.innerHTML = `⏱️ ${Math.floor(counter)} ${unit}`;
  refreshUI();

  requestAnimationFrame(update);
}

requestAnimationFrame(update);

// === Step 9: Data-Driven Upgrades ===
interface Item {
  key: string;
  name: string;
  baseCost: number;
  rate: number; // cycles/sec
  count: number;
}

const items: Item[] = [
  { key: "A", name: "Oscillator", baseCost: 10, rate: 0.1, count: 0 },
  { key: "B", name: "CPU Core", baseCost: 100, rate: 2.0, count: 0 },
  { key: "C", name: "Server Rack", baseCost: 1000, rate: 50.0, count: 0 },
];

// Price helpers
function price(base: number, owned: number): number {
  return base * Math.pow(1.15, owned);
}
function fmt(n: number): string {
  return n >= 1000 ? Math.round(n).toString() : n.toFixed(2);
}

// Create info + shop containers
const rateDiv = document.createElement("div");
document.body.append(rateDiv);

const ownedDiv = document.createElement("div");
document.body.append(ownedDiv);

const shopDiv = document.createElement("div");
document.body.append(shopDiv);

// Map of buttons for easy updates
const buttons = new Map<string, HTMLButtonElement>();

function rebuildShop() {
  shopDiv.innerHTML = "";
  items.forEach((item) => {
    const btn = document.createElement("button");
    btn.dataset.key = item.key;
    buttons.set(item.key, btn);
    shopDiv.append(btn);

    btn.addEventListener("click", () => {
      const cost = price(item.baseCost, item.count);
      if (counter >= cost) {
        counter -= cost;
        item.count += 1;
        growthRate += item.rate;
        refreshUI();
      }
    });
  });
}

function refreshShopButtons() {
  items.forEach((item) => {
    const btn = buttons.get(item.key)!;
    const cost = price(item.baseCost, item.count);
    btn.textContent = `Buy ${item.name} (+${item.rate} ${unit}/sec) — cost ${
      fmt(cost)
    } (owned ${item.count})`;
    btn.disabled = counter < cost;
  });
}

function refreshUI() {
  rateDiv.innerHTML = `Growth rate: ${growthRate.toFixed(1)} ${unit}/sec`;
  const ownedLabel = items.map((it) => `${it.name}=${it.count}`).join(", ");
  ownedDiv.innerHTML = `Owned: ${ownedLabel}`;
  refreshShopButtons();
}

// Build and initialize
rebuildShop();
refreshUI();
