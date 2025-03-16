import { playSound } from "./sfx/sfx.js";

//TODO:
//_____________________________________________________________________________________
//PRIORITIES
//fix yo shit

// Add an auto sale feature for ores

// Improve the shop UI and make it a stand alone feature

// Add a feature to buy a pickaxe to increase the chance of finding ores

// Add late game content (prestige (points system: +1 point to spend on ( +1 luck per upg / save your points to buy stronger upgs(perma keep detector and such))) / modifiers (ex: more taxes) / ...)

//_____________________________________________________________________________________

// Game State
let gameState = {
  gold: 750,
  inventory: {},
  gear: [],
  currentCustomer: null,
  luck: 1, // Default luck factor
  luckUpgrades: 0, // Track the number of luck upgrades purchased
  lifetimeEarnings: 0, // Total pre-tax value of ALL sold ores
  wealthIndex: 750, // Combines gold + inventory value
  stats: {
    totalOresDug: 0,
    discoveredOres: new Set(), // Stores ore names
    totalProfit: 0,
    deepestDig: 0,
    luckiestFind: { ore: null, rarity: Infinity },
    customerDeals: {
      total: 0,
      successful: 0,
      failed: 0,
    },
  },
};

// Ensure luck is a number
if (isNaN(gameState.luck)) {
  gameState.luck = 1; // Reset to default if NaN
}

// Ores (name, value, rarity)
const ores = [
  { name: "⬜ Stone", value: 5, rarity: 0.6, baseRarity: 0.6 },
  { name: "🟫 Copper", value: 12, rarity: 0.5, baseRarity: 0.5 },
  { name: "🟦 Opal", value: 20, rarity: 0.4, baseRarity: 0.4 },
  { name: "🟩 Aquamarine", value: 30, rarity: 0.3, baseRarity: 0.3 },
  { name: "🟪 Amethyst", value: 50, rarity: 0.2, baseRarity: 0.2 },
  { name: "⚪ Silver", value: 100, rarity: 0.15, baseRarity: 0.15 },
  { name: "🟨 Topaz", value: 200, rarity: 0.1, baseRarity: 0.1 },
  { name: "🔵 Sapphire", value: 400, rarity: 0.05, baseRarity: 0.05 },
  { name: "🟡 Gold", value: 800, rarity: 0.03, baseRarity: 0.03 },
  { name: "🔴 Ruby", value: 1_600, rarity: 0.02, baseRarity: 0.02 },
  { name: "🟢 Emerald", value: 3_200, rarity: 0.01, baseRarity: 0.01 },
  { name: "💎 Diamond", value: 6_400, rarity: 0.005, baseRarity: 0.005 },
  { name: "🔮 Mystic Stone", value: 13_000, rarity: 0.001, baseRarity: 0.001 },
  { name: "🌟 Star Ore", value: 25_000, rarity: 0.0005, baseRarity: 0.0005 },
  { name: "🌌 Galaxy Gem", value: 50_000, rarity: 0.0001, baseRarity: 0.0001 },
  {
    name: "🌠 Meteorite",
    value: 200_000,
    rarity: 0.00005,
    baseRarity: 0.00005,
  },
  {
    name: "🪐 Cosmic Crystal",
    value: 400_000,
    rarity: 0.00001,
    baseRarity: 0.00001,
  },
  {
    name: "🌋 Lava Rock",
    value: 800_000,
    rarity: 0.000005,
    baseRarity: 0.000005,
  },
  {
    name: "🧊 Ice Crystal",
    value: 1_500_000,
    rarity: 0.0000025,
    baseRarity: 0.0000025,
  },
  {
    name: "⚡ Thunder Stone",
    value: 3_000_000,
    rarity: 0.000001,
    baseRarity: 0.000001,
  },
  {
    name: "🌑 Dark Matter",
    value: 6_000_000,
    rarity: 0.000002,
    baseRarity: 0.000002,
  },
  {
    name: "🌈 Rainbow Gem",
    value: 13_000_000,
    rarity: 0.0000015,
    baseRarity: 0.0000015,
  },
  {
    name: "🌞 Sunstone",
    value: 25_000_000,
    rarity: 0.000001,
    baseRarity: 0.000001,
  },
  {
    name: "🌜 Moonstone",
    value: 50_000_000,
    rarity: 0.0000008,
    baseRarity: 0.0000008,
  },
  {
    name: "🌊 Ocean Pearl",
    value: 100_000_000,
    rarity: 0.0000005,
    baseRarity: 0.0000005,
  },
  {
    name: "🔥 Fire Opal",
    value: 200_000_000,
    rarity: 0.0000003,
    baseRarity: 0.0000003,
  },
  {
    name: "🌪️ Tornado Crystal",
    value: 400_000_000,
    rarity: 0.0000002,
    baseRarity: 0.0000002,
  },
  {
    name: "🌀 Vortex Gem",
    value: 800_000_000,
    rarity: 0.0000001,
    baseRarity: 0.0000001,
  },
  {
    name: "🌟 Supernova Shard",
    value: 1_500_000_000,
    rarity: 0.00000005,
    baseRarity: 0.00000005,
  },
  {
    name: "🪐 Nebula Stone",
    value: 3_000_000_000,
    rarity: 0.00000002,
    baseRarity: 0.00000002,
  },
  {
    name: "🌌 Black Hole Fragment",
    value: 10_000_000_000,
    rarity: 0.00000001,
    baseRarity: 0.00000001,
  },
  {
    name: "🪐 Galactic Core",
    value: 50_000_000_000,
    rarity: 0.000000005,
    baseRarity: 0.000000005,
  },
  {
    name: "♾️ Quantum Shard",
    value: 150_000_000_000,
    rarity: 0.0000000015,
    baseRarity: 0.0000000015,
  },
  {
    name: "💫 Celestial Prism",
    value: 500_000_000_000,
    rarity: 0.0000000005,
    baseRarity: 0.0000000005,
  },
  {
    name: "🕳️ Void Essence",
    value: 1_500_000_000_000,
    rarity: 0.00000000015,
    baseRarity: 0.00000000015,
  },
  {
    name: "🌕 Astral Fragment",
    value: 5_000_000_000_000,
    rarity: 0.00000000005,
    baseRarity: 0.00000000005,
  },
  {
    name: "❓ ????????????",
    value: 5_000_000_000_000_000_000,
    rarity: 0.00000000000000005,
    baseRarity: 0.00000000000000005,
  },
];

// Customer Offers (name, value, isFake)
const customerItems = [
  { name: "✨ Shiny Rock", value: 5, isFake: true },
  { name: "💠 Ancient Coin", value: 100, isFake: true },
  { name: "🏺 Old Relic", value: 200, isFake: true },
  { name: "💎 Gem", value: 50, isFake: true },
  { name: "🔮 Rare Artifact", value: 500, isFake: true },
  { name: "🎁 Mystery Box", value: 1000, isFake: true },
  { name: "🗿 Golden Idol", value: 2000, isFake: true },
  { name: "📿 Antique Amulet", value: 3000, isFake: true },
  { name: "📜 Ancient Scroll", value: 4000, isFake: true },
  { name: "🗡️ Archaic Sword", value: 5000, isFake: true },
  { name: "👑 Pharaoh's Mask", value: 7000, isFake: true },
  { name: "🥚 Dino Egg", value: 10000, isFake: true },
  { name: "🔑 Ancient Key", value: 15000, isFake: true },
  { name: "📖 Ancient Tome", value: 20000, isFake: true },
  { name: "🛡️ Legendary Shield", value: 25000, isFake: true },
  { name: "⚔️ Mythic Sword", value: 30000, isFake: true },
  { name: "💉 Ancient Elixir", value: 35000, isFake: true },
  { name: "🗺️ Treasure Map", value: 40000, isFake: true },
  { name: "🕰️ Timepiece", value: 45000, isFake: true },
  { name: "🔮 Crystal Ball", value: 50000, isFake: true },
  { name: "🖼 Davinci Painting", value: 100000, isFake: true },
];

// Digging Mechanic
document.getElementById("digZone").addEventListener("click", () => {
  // play Sound Effect
  playSound("mining");

  const inventoryEmpty = Object.keys(gameState.inventory).length === 0;
  if (gameState.gold < 50) {
    if (inventoryEmpty) {
      GameOver();
    } else {
      alert("Dig funds low! Sell ores to keep mining!");
    }
    return;
  }

  playDiggingEffect();

  // Digging has a cost
  gameState.gold -= 50;

  // Get luck-adjusted ores
  const adjustedOres = getAdjustedOres();

  // Calculate total rarity from ADJUSTED ores
  const totalRarity = adjustedOres.reduce((sum, ore) => sum + ore.rarity, 0);

  // Random chance to find an ore
  const foundOre = Math.random() * totalRarity;
  // Find ore using adjusted values
  let cumulativeRarity = 0;
  const ore = adjustedOres.find((o) => {
    cumulativeRarity += o.rarity;
    return foundOre <= cumulativeRarity;
  });

  if (ore) {
    const key = ore.name;
    gameState.inventory[key] = gameState.inventory[key] || { count: 0, ore };
    gameState.inventory[key].count++;
    handleOreFound(ore);
  }

  updateIndex();
  updateGold();
  updateInventory();
  saveGame();
});

// Quick Dig Mechanic
function quickDig(budget) {
  let costPerDig = 100;
  if (gameState.gold < 50000) {
    costPerDig = 60;
  }
  const maxDigs = 500000;
  let digs = Math.min(Math.floor(budget / costPerDig), maxDigs);

  if (gameState.gold < digs * costPerDig) {
    alert("Not enough gold!");
    return;
  }

  if (gameState.gold < budget) {
    alert("You don't have enough money for quick dig!");
    return;
  }

  //play Sound Effect
  playSound("softClick"); //temp
  playDiggingEffect();

  gameState.gold -= digs * costPerDig;

  for (let i = 0; i < digs; i++) {
    // Get luck-adjusted ores for EACH dig
    const adjustedOres = getAdjustedOres();
    const totalRarity = adjustedOres.reduce((sum, ore) => sum + ore.rarity, 0);
    const foundOre = Math.random() * totalRarity;

    let cumulativeRarity = 0;
    const ore = adjustedOres.find((o) => {
      cumulativeRarity += o.rarity;
      return foundOre <= cumulativeRarity;
    });

    if (ore) {
      const key = ore.name;
      gameState.inventory[key] = gameState.inventory[key] || { count: 0, ore };
      gameState.inventory[key].count++;
      handleOreFound(ore);
    }
  }

  updateGold();
  updateInventory();
  saveGame();
}

// Sell All Ores

function sellOres() {
  const preTaxValue = Object.values(gameState.inventory).reduce(
    (sum, { ore, count }) => sum + (ore?.value || 0) * (count || 0),
    0
  );

  if (preTaxValue === 0) {
    alert("No ores to sell!");
    return;
  }

  // Safeguard against invalid values
  if (isNaN(preTaxValue)) {
    console.error("Invalid ore value detected!");
    return;
  }

  // Get tax rate with fallbacks
  const taxRate = getTaxRate() || 0;

  // Progressive caps with safe checks
  let taxCap = 0.25;
  const le = gameState.lifetimeEarnings || 0;

  if (le >= 1_000_000) {
    taxCap = 0.25 + Math.min(0.4, (le - 1_000_000) / 10_000_000);
  }
  if (le >= 100_000_000) {
    taxCap = 0.35 + Math.min(0.3, (le - 100_000_000) / 1_000_000_000);
  }
  if (le >= 1_000_000_000) {
    taxCap = 0.65 + Math.min(0.2, (le - 1_000_000_000) / 10_000_000_000);
  }

  // Early-game protection with numeric coercion
  taxCap = Number.isNaN(taxCap) ? 0.25 : taxCap;
  if ((le || 0) < 1_000_000) {
    taxCap = Math.min(taxCap, 0.12); // Stronger cap
  }

  const effectiveTaxRate = Math.min(Math.min(taxRate, 0.85), taxCap);

  // Final calculation with safeguards
  const taxedValue = preTaxValue * (1 - (effectiveTaxRate || 0));

  gameState.stats.totalProfit += taxedValue;

  if (isNaN(taxedValue)) {
    console.error("Invalid sale calculation!");
    return;
  }

  // Update state with type checking
  gameState.gold = (gameState.gold || 0) + taxedValue;
  gameState.lifetimeEarnings = (gameState.lifetimeEarnings || 0) + preTaxValue;
  gameState.inventory = {};

  updateIndex();
  updateWealthIndex();
  playSound("selling");
  updateInventory();
  updateGold();
  saveGame();
}

function getTaxRate() {
  try {
    const baseRate = 0.03; // Reduced from 0.05
    const le = gameState.lifetimeEarnings || 0;
    const wi = gameState.wealthIndex || 750;

    // Adjusted formula for smoother scaling
    const lifetimeFactor = (0.2 * Math.log10(le + 1000)) / 15; // Reduced impact
    const wealthFactor = (0.1 * Math.log10(wi + 500)) / 12; // Smaller offset

    return Math.min(0.6, baseRate + lifetimeFactor + wealthFactor);
  } catch (e) {
    return 0.03; // Lower fallback
  }
}

function updateWealthIndex() {
  const inventoryValue = Object.values(gameState.inventory).reduce(
    (sum, { ore, count }) => sum + (ore?.value || 0) * (count || 0),
    0
  );
  gameState.wealthIndex = (gameState.gold || 0) + inventoryValue;
  updateIndex();
}

function playDiggingEffect() {
  // Pickaxe digging effect
  const pickaxe = document.getElementById("pickaxe");
  if (pickaxe) {
    pickaxe.classList.add("clicked");

    // Remove the class after 200ms to reset animation
    setTimeout(() => {
      pickaxe.classList.remove("clicked");
    }, 200);
  }
}
// Customer Interaction
function spawnCustomer() {
  const item = customerItems[Math.floor(Math.random() * customerItems.length)];
  gameState.currentCustomer = item;
  item.isFake = Math.random() < 0.5; // 50% chance of being fake

  const customerDiv = document.getElementById("customer");
  customerDiv.innerHTML = `
  <h3>Customer Offer:</h3>
  <p>Item: <span style="color:#007bff; font-weight:bold;">${
    item.name
  }</span></p>
  <p>Price: $${formatNumber(
    item.value
  )} (Potential Profit: <span style="color:#28a745; font-weight:bold;">$${formatNumber(
    item.value * 2
  )}</span>)</p>
  ${
    gameState.gear.includes("Fake Detector")
      ? `<p class="${item.isFake ? "item-fake" : "item-genuine"}">${
          item.isFake ? "⚠️ Fake Item!" : "✅ Genuine"
        }</p>`
      : ""
  }
  <button onclick="buyItem()">Buy</button>
  <button onclick="rejectOffer()">Reject</button>
`;
}

function buyItem() {
  const value = gameState.currentCustomer.value;
  if (gameState.gold < value) {
    alert("You don't have enough money to buy this item!");
    return;
  }

  gameState.gold -= value;

  // Play sound effect
  playSound("buying");

  if (gameState.currentCustomer.isFake) {
    const fakeSaleValue = Math.floor(Math.random() * Math.floor(value * 0.2));
    alert("It's a fake! You lost $" + formatNumber(value - fakeSaleValue));
    gameState.gold += fakeSaleValue;
    updateCustomerStats((success = false));
  } else {
    const profit = value * 2;
    alert("You made a profit! You gained $" + formatNumber(profit));
    gameState.gold += profit;
    updateCustomerStats((success = true));
  }

  gameState.currentCustomer = null;
  updateGold();
  document.getElementById("customer").innerHTML = "";
  saveGame();
  customerPlaceHolder();
}

function rejectOffer() {
  // play Sound Effect
  playSound("reject");
  // To make sure
  customerPlaceHolder();

  gameState.currentCustomer = null;
  document.getElementById("customer").innerHTML = "";

  updateCustomerStats((success = "rejected"));
  saveGame();
  spawnCustomer(); // Immediately spawn a new customer
}

// Function to get color based on rarity
const rarityColorMap = new Map([
  [60_000_000, "#808080"], // ⬜ Stone (0.6)
  [50_000_000, "#6B8E23"], // 🟫 Copper (0.5)
  [40_000_000, "#48D1CC"], // 🟦 Opal (0.4)
  [30_000_000, "#7FFFD4"], // 🟩 Aquamarine (0.3)
  [20_000_000, "#9370DB"], // 🟪 Amethyst (0.2)
  [15_000_000, "#C0C0C0"], // ⚪ Silver (0.15)
  [10_000_000, "#FFD700"], // 🟨 Topaz (0.1)
  [5_000_000, "#00BFFF"], // 🔵 Sapphire (0.05)
  [3_000_000, "#FFD700"], // 🟡 Gold (0.03)
  [2_000_000, "#FF3030"], // 🔴 Ruby (0.02)
  [1_000_000, "#50C878"], // 🟢 Emerald (0.01)
  [500_000, "#E6E6FA"], // 💎 Diamond (0.005)
  [100_000, "#9F2B68"], // 🔮 Mystic Stone (0.001)
  [50_000, "#FFD700"], // 🌟 Star Ore (0.0005)
  [10_000, "#4B0082"], // 🌌 Galaxy Gem (0.0001)
  [5_000, "#FF6B6B"], // 🌠 Meteorite (0.00005)
  [1_000, "#00FFFF"], // 🪐 Cosmic Crystal (0.00001)
  [500, "#FF69B4"], // 🌋 Lava Rock (0.000005)
  [250, "#87CEEB"], // 🧊 Ice Crystal (0.0000025)
  [100, "#FFA500"], // ⚡ Thunder Stone (0.000001)
  [50, "#800080"], // 🌑 Dark Matter (0.0000005)
  [10, "#40E0D0"], // 🌈 Rainbow Gem (0.0000001)
  [0.5, "#9400D3"], // 💫 Celestial Prism (DarkViolet)
  [0.15, "#00BFFF"], // ♾️ Quantum Shard (DeepSkyBlue)
  [0.05, "#4B0082"], // 🪐 Galactic Core (Indigo)
  [0.015, "#696969"], // 🕳️ Void Essence (DimGray)
  [0.005, "#F0E68C"], // 🌕 Astral Fragment (Khaki)
]);

function getColorByRarity(rarity) {
  // Convert to integer key (fast bitwise OR truncates decimals)
  const key = (rarity * 100_000_000) | 0;

  // Find nearest lower key
  let colorKey = 10; // Default to rarest
  for (const [k] of rarityColorMap) {
    if (key >= k) {
      colorKey = k;
      break;
    }
  }

  return rarityColorMap.get(colorKey) || "#FFFFFF";
}

// UI Updates
function formatNumber(num) {
  num = Math.round(num);

  if (num >= 1_000_000_000_000_000_000_000) {
    return (
      (num / 1_000_000_000_000_000_000_000).toFixed(1).replace(/\.0$/, "") +
      "Sx"
    );
  }
  if (num >= 1_000_000_000_000_000_000) {
    return (
      (num / 1_000_000_000_000_000_000).toFixed(1).replace(/\.0$/, "") + "Qa"
    );
  }
  if (num >= 1_000_000_000_000_000) {
    return (num / 1_000_000_000_000_000).toFixed(1).replace(/\.0$/, "") + "Q";
  }
  if (num >= 1_000_000_000_000) {
    return (num / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "") + "T";
  }
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

let sortingPhase = 0; // 0: rarity, 1: total value, 2: count
function sortInventory() {
  const entries = Object.entries(gameState.inventory);

  // play Sound Effect
  playSound("sorting");

  entries.sort((a, b) => {
    const aOre = a[1].ore;
    const bOre = b[1].ore;

    switch (sortingPhase) {
      case 0: // Rarity
        return aOre.baseRarity - bOre.baseRarity;
      case 1: // Total Value
        return bOre.value * b[1].count - aOre.value * a[1].count;
      case 2: // Count
        return b[1].count - a[1].count;
    }
  });

  gameState.inventory = Object.fromEntries(entries);
  sortingPhase = (sortingPhase + 1) % 3;
  updateInventory();
}

function updateInventory() {
  const inventoryDiv = document.getElementById("inventory");
  inventoryDiv.innerHTML = `
    <table class="inventory-table">
      <thead>
        <tr>
          <th>Ore</th>
          <th>Count</th>
          <th>Total Value</th>
        </tr>
      </thead>
      <tbody>
        ${Object.entries(gameState.inventory)
          .map(
            ([name, { ore, count }]) => `
          <tr style="color: ${getColorByRarity(ore.baseRarity)}">
            <td class="${
              ore.baseRarity < 0.00001 ? "glowy-ore" : ""
            }">${name}</td>
            <td>${formatNumber(count)}</td>
            <td>$${formatNumber(ore.value * count)}</td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>
  `;
  updateTotal();
}

function updateTotal() {
  const taxRate = getTaxRate();
  const taxDisplay = document.getElementById("taxRateDisplay");

  // Set color based on tax rate directly
  if (taxRate < 0.25) {
    taxDisplay.className = "low-tax";
  } else if (taxRate < 0.6) {
    taxDisplay.className = "medium-tax";
  } else {
    taxDisplay.className = "high-tax";
  }

  taxDisplay.textContent = ` (${Math.round(taxRate * 100)}% tax)`;

  const total = Object.values(gameState.inventory).reduce(
    (sum, { ore, count }) => {
      return sum + ore.value * count * (1 - taxRate);
    },
    0
  );

  document.getElementById("Total").innerHTML = formatNumber(total);
}

// Adjust ore rarities based on luck
function getAdjustedOres() {
  // Get total ore count
  const totalOres = Object.values(gameState.inventory).reduce(
    (sum, { count }) => sum + count,
    0
  );

  return ores.map((ore) => {
    let adjustedRarity = ore.baseRarity;

    // Beginners luck check
    if (totalOres < 2 && gameState.luckUpgrades === 0 && gameState.gold < 501) {
      adjustedRarity /= 0.0005;
      adjustedRarity = Math.min(0.95, adjustedRarity);
    }

    // Normal luck adjustments
    if (adjustedRarity > 0.5) {
      adjustedRarity = Math.max(
        0.5,
        adjustedRarity * (1 - 0.05 * (gameState.luck - 1)) 
      );
    } else {
      adjustedRarity = Math.min(
        0.5,
        adjustedRarity * (1 + 0.03 * (gameState.luck - 1))
      );
    }

    return { ...ore, rarity: adjustedRarity };
  });
}

function updateGold() {
  const goldElement = document.getElementById("gold");
  if (goldElement) {
    goldElement.textContent = formatNumber(gameState.gold);
    // Update color indicator
    goldElement.style.color = gameState.gold < 100 ? "red" : "black";
  }

  // Update luck upgrade cost display
  const luckUpgradeCostElement = document.getElementById("luckUpgradeCost");
  if (luckUpgradeCostElement) {
    luckUpgradeCostElement.textContent =
      "$" + formatNumber(getLuckUpgradeCost());
  }
}

function GameOver() {
  if (confirm("You're bankrupt! Start over?")) {
    resetGame();
    localStorage.removeItem("tutorialShown"); // Reset tutorial
  } else {
    window.close(); // Close tab if in browser
  }

  console.log("Game Over");
}

let resetTimeout; // Stores timer ID
let resetGameConfirmed = false;

function confirmResetGame() {
  if (!resetGameConfirmed) {
    //play Sound Effect
    playSound("softClick");

    //WARNING
    alert("⚠️ Click RESET again within 5 seconds to confirm!");

    // First click: Start 5-second timer
    resetTimeout = setTimeout(() => {
      resetGameConfirmed = false; // Auto-cancel after 5s
    }, 5000);

    resetGameConfirmed = true;
  } else {
    // Second click: Cancel timer immediately
    clearTimeout(resetTimeout); // 🚨 Critical cleanup
    resetGame();
    resetGameConfirmed = false;
  }
}

function resetGame() {
  gameState = {
    gold: 750,
    inventory: {},
    gear: [],
    currentCustomer: null,
    luck: 1,
    luckUpgrades: 0,
    lifetimeEarnings: 0, // Reset critical values
    wealthIndex: 750, // Reset wealth index
  };

  gameState.stats = {
    totalOresDug: 0,
    discoveredOres: new Set(),
    totalProfit: 0,
    deepestDig: 0,
    luckiestFind: { ore: null, rarity: Infinity },
    customerDeals: { total: 0, successful: 0, failed: 0 },
  };

  const fakeDetectorButton = document.getElementById("fake-det");
  if (fakeDetectorButton) {
    fakeDetectorButton.innerHTML = "🔎 Buy Fake Detector ($10M)";
    fakeDetectorButton.disabled = false;
    fakeDetectorButton.classList.remove("disabled-button");
  }

  localStorage.removeItem("tutorialShown"); // Reset tutorial
  console.log("game reset...");

  updateIndex();
  updateInventory();
  updateGold();
  saveGame();
}

function saveGame() {
  localStorage.setItem("gameState", JSON.stringify(gameState));
  console.log("Game Saved:", gameState);
}

function loadGame() {
  const savedGame = localStorage.getItem("gameState");
  const firstTime = !localStorage.getItem("tutorialShown");

  // Run tutorial if first time
  if (firstTime) {
    runTutorial();
    localStorage.setItem("tutorialShown", "true");
  }

  try {
    if (savedGame) {
      const parsed = JSON.parse(savedGame);

      // Migrate old inventory format
      if (Array.isArray(parsed.inventory)) {
        parsed.inventory = parsed.inventory.reduce((acc, ore) => {
          const key = ore.name;
          acc[key] = acc[key] || { count: 0, ore };
          acc[key].count++;
          return acc;
        }, {});
      }

      // Calculate wealth index if missing
      if (typeof parsed.wealthIndex !== "number") {
        const inventoryValue = Object.values(parsed.inventory || {}).reduce(
          (sum, { ore, count }) => sum + (ore?.value || 0) * (count || 0),
          0
        );
        parsed.wealthIndex = (parsed.gold || 750) + inventoryValue;
      }

      // Set default values for new properties
      gameState = {
        gold: 750,
        inventory: {},
        gear: [],
        currentCustomer: null,
        luck: 1,
        luckUpgrades: 0,
        lifetimeEarnings: 0,
        wealthIndex: 750, // Default starting value
        // Merge saved data
        ...parsed,
        // Ensure critical numbers
        lifetimeEarnings: parsed.lifetimeEarnings || 0,
        wealthIndex: parsed.wealthIndex || 300,
      };

      // Backward compatibility fixes
      if (!Array.isArray(gameState.gear)) {
        gameState.gear = [];
      }
    }
  } catch (e) {
    console.error("Failed to load save:", e);
    localStorage.removeItem("gameState");
    gameState = {
      gold: 750,
      inventory: {},
      gear: [],
      currentCustomer: null,
      luck: 1,
      luckUpgrades: 0,
      lifetimeEarnings: 0,
      wealthIndex: 750,
    };
  }

  // Update UI components
  updateInventory();
  updateGold();

  // Handle fake detector UI
  const fakeDetectorButton = document.getElementById("fake-det");
  if (fakeDetectorButton) {
    if (gameState.gear.includes("Fake Detector")) {
      fakeDetectorButton.innerHTML = "✅ Bought";
      fakeDetectorButton.disabled = true;
      fakeDetectorButton.classList.add("disabled-button");
    } else {
      fakeDetectorButton.innerHTML = "🔎 Buy Fake Detector ($10M)";
      fakeDetectorButton.disabled = false;
      fakeDetectorButton.classList.remove("disabled-button");
    }
  }

  // Initialize wealth index if missing
  if (typeof gameState.wealthIndex !== "number") {
    updateWealthIndex();
  }
}

setInterval(() => {
  spawnCustomer();
}, 10000); // Check for customers every 10 seconds

function runTutorial() {
  let step = 0;

  const tutorialSteps = [
    {
      text: "⛏️ Welcome to Dig It!\nClick the pickaxe to start mining!",
      highlight: "#digZone",
    },
    {
      text: "💰 Found ores? Sell them using the SELL button!\n(Taxes increase with wealth)",
      highlight: ".sell-button",
    },
    {
      text: "👥 Customers appear here!\nBuy low, sell high!",
      highlight: "#customer",
    },
  ];

  function showNextStep() {
    if (step >= tutorialSteps.length) return;

    // Highlight element
    const element = document.querySelector(tutorialSteps[step].highlight);
    if (element) {
      element.classList.add("tutorial-highlight");
    }

    alert(tutorialSteps[step].text);

    // Remove highlight after alert
    setTimeout(() => {
      if (element) element.classList.remove("tutorial-highlight");
      step++;
      showNextStep();
    }, 3000);
  }

  showNextStep();
}

function updateIndex() {
  const indexHTML = `
    <div class="stats-panel">
      <h3>📊 Mining Index</h3>
      <p>⛏ Total Digs: ${formatNumber(gameState.stats.totalOresDug)}</p>
      <p>💎 Unique Ores: ${gameState.stats.discoveredOres.size}/${
    ores.length
  }</p>
      <p>💰 Lifetime Profit: $${formatNumber(gameState.stats.totalProfit)}</p>
      <p>🍀 Luckiest Find: ${gameState.stats.luckiestFind.ore || "None"} 
         (${(1 / gameState.stats.luckiestFind.rarity).toFixed(0)}:1)</p>
      <p>🤝 Customer Deals: ${gameState.stats.customerDeals.successful}✅ / 
         ${gameState.stats.customerDeals.failed}❌</p>
    </div>
  `;
  document.getElementById("indexDisplay").innerHTML = indexHTML;
}

function getLuckUpgradeCost() {
  const baseCost = 500; // Base cost of the first luck upgrade
  const costMultiplier = 1.3; // Multiplier for each subsequent upgrade
  return Math.floor(
    baseCost * Math.pow(costMultiplier, gameState.luckUpgrades)
  );
}

function buyLuckUpgrade() {
  const luckUpgradeCost = getLuckUpgradeCost();
  if (gameState.gold >= luckUpgradeCost) {
    // play Sound Effect
    playSound("lucky");

    gameState.gold -= luckUpgradeCost;
    gameState.luck += 1; // 100% luck boost per upgrade
    gameState.luckUpgrades += 1;
    updateGold();
    saveGame();
  } else {
    alert("Not enough gold!");
  }
}

function buyGear() {
  if (gameState.gear.includes("Fake Detector")) {
    alert("You already own this gear!");
    return;
  }
  if (gameState.gold >= 10000000) {
    // Changed from > to >=
    playSound("buying"); // Fixed reference
    gameState.gear.push("Fake Detector");
    gameState.gold -= 10000000;
    updateGold();
    updateIndex();
    const item = document.getElementById("fake-det");
    if (item) {
      item.innerHTML = "✅ Bought";
      item.disabled = true;
      item.classList.add("disabled-button");
    }
  } else {
    alert("You need $10M to buy this!");
  }
  saveGame();
}

function customerPlaceHolder() {
  const customerDiv = document.getElementById("customer");
  customerDiv.innerHTML = `
  <h3>Customer Offer:</h3>
  <p>Item: <span style="color:#007bff; font-weight:bold;">${"waiting for customer"}</span></p>
  <p>Price: $${formatNumber(
    0
  )} (Potential Profit: <span style="color:#28a745; font-weight:bold;">$${"limₓ→₀ (eˣ − ln(1+x) − 1 − x²) ⁄ x²"} )
  <br>
  <button>Buy</button>
  <button>Reject</button>
`;
}

function updateCustomerStats(success) {
  gameState.stats.customerDeals.total++;

  if (success === "rejected") return; // Ignore rejected deals

  if (success) {
    gameState.stats.customerDeals.successful++;
  } else {
    gameState.stats.customerDeals.failed++;
  }
}

function handleOreFound(ore) {
  gameState.stats.totalOresDug++;

  // Track discovered ores
  if (!gameState.stats.discoveredOres.has(ore.name)) {
    gameState.stats.discoveredOres.add(ore.name);
  }

  // Track rarest find
  if (ore.baseRarity < (gameState.stats.luckiestFind.rarity || Infinity)) {
    gameState.stats.luckiestFind = {
      ore: ore.name,
      rarity: ore.baseRarity,
    };
  }
}

// Load the game on page load
window.onload = loadGame;
customerPlaceHolder();
updateIndex();

// Attach functions to global scope
window.sellOres = sellOres;
window.buyLuckUpgrade = buyLuckUpgrade;
window.buyGear = buyGear;
window.quickDig = quickDig;
window.resetGame = resetGame;
window.confirmResetGame = confirmResetGame;
window.toggleSound = toggleSound;
window.sortInventory = sortInventory;
window.rejectOffer = rejectOffer;
window.buyItem = buyItem;
