document.addEventListener('DOMContentLoaded', () => {
    // --- Data Configuration (LoL Skins) ---
    const LOL_SKINS = [
        // Ultimate
        { id: 1, name: "Elementalist Lux", champion: "Lux", rarity: "Ultimate", splash_art: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lux_7.jpg", value: 3250 },
        { id: 2, name: "Pulsefire Ezreal", champion: "Ezreal", rarity: "Ultimate", splash_art: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ezreal_5.jpg", value: 3250 },
        { id: 3, name: "DJ Sona", champion: "Sona", rarity: "Ultimate", splash_art: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Sona_6.jpg", value: 3250 },
        // Mythic
        { id: 4, name: "Ashen Knight Pyke", champion: "Pyke", rarity: "Mythic", splash_art: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Pyke_34.jpg", value: 2500 },
        { id: 5, name: "Hextech Annie", champion: "Annie", rarity: "Mythic", splash_art: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Annie_9.jpg", value: 2500 },
        { id: 6, name: "Prestige K/DA Akali", champion: "Akali", rarity: "Mythic", splash_art: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Akali_14.jpg", value: 2500 },
        // Legendary
        { id: 7, name: "Project: Vayne", champion: "Vayne", rarity: "Legendary", splash_art: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Vayne_11.jpg", value: 1820 },
        { id: 8, name: "Dark Cosmic Jhin", champion: "Jhin", rarity: "Legendary", splash_art: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jhin_4.jpg", value: 1820 },
        { id: 9, name: "God-King Darius", champion: "Darius", rarity: "Legendary", splash_art: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Darius_14.jpg", value: 1820 },
        { id: 18, name: "Nightbringer Yasuo", champion: "Yasuo", rarity: "Legendary", splash_art: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_10.jpg", value: 1820 },
        // Epic
        { id: 10, name: "Blood Moon Jhin", champion: "Jhin", rarity: "Epic", splash_art: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jhin_2.jpg", value: 1350 },
        { id: 11, name: "K/DA Akali", champion: "Akali", rarity: "Epic", splash_art: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Akali_13.jpg", value: 1350 },
        { id: 12, name: "Star Guardian Lux", champion: "Lux", rarity: "Epic", splash_art: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lux_3.jpg", value: 1350 },
        // Rare
        { id: 13, name: "Pool Party Leona", champion: "Leona", rarity: "Rare", splash_art: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Leona_4.jpg", value: 975 },
        { id: 14, name: "Blood Moon Yasuo", champion: "Yasuo", rarity: "Rare", splash_art: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_3.jpg", value: 975 },
        { id: 17, name: "High Noon Yasuo", champion: "Yasuo", rarity: "Rare", splash_art: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_2.jpg", value: 975 },
        // Common
        { id: 15, name: "Assassin Master Yi", champion: "Master Yi", rarity: "Common", splash_art: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/MasterYi_1.jpg", value: 520 },
        { id: 16, name: "Mercenary Katarina", champion: "Katarina", rarity: "Common", splash_art: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Katarina_1.jpg", value: 520 }
    ];

    const CASES_CONFIG = [
        { id: 'hextech', name: 'Hextech Chest', price: 225, image: 'hextech_chest.png' },
        { id: 'masterwork', name: 'Masterwork Chest', price: 500, image: 'masterwork_chest.png' },
        { id: 'legendary', name: 'Demacian Orb', price: 1500, image: 'demacian_orb.png' }
    ];

    // --- Local Storage Management ---
    const getStorageUser = () => {
        const data = localStorage.getItem('hextech_user');
        if (!data) {
            const newUser = { username: 'PLAYER 1', coins: 5000, lastDaily: null };
            saveStorageUser(newUser);
            return newUser;
        }
        return JSON.parse(data);
    };

    const saveStorageUser = (user) => localStorage.setItem('hextech_user', JSON.stringify(user));

    const getStorageInventory = () => {
        const data = localStorage.getItem('hextech_inventory');
        return data ? JSON.parse(data) : [];
    };

    const saveStorageInventory = (inv) => localStorage.setItem('hextech_inventory', JSON.stringify(inv));

    // --- State ---
    let user = getStorageUser();
    let inventory = getStorageInventory();
    let isSpinning = false;
    let currentCase = null;

    // --- Elements ---
    const balanceEl = document.getElementById('user-balance');
    const usernameEl = document.getElementById('username-display');
    const casesContainer = document.getElementById('cases-container');
    const inventoryContainer = document.getElementById('inventory-container');
    const modal = document.getElementById('case-modal');
    const spinnerTrack = document.getElementById('spinner-track');
    const winScreen = document.getElementById('win-screen');
    const btnOpenCase = document.getElementById('btn-open-case');

    // --- Initialization ---
    const init = () => {
        updateStatsUI();
        renderCases();
        setupNavigation();
        setupDailyReward();
    };

    const updateStatsUI = () => {
        balanceEl.textContent = user.coins.toLocaleString();
        usernameEl.textContent = user.username;
    };

    const renderCases = () => {
        casesContainer.innerHTML = '';
        CASES_CONFIG.forEach(c => {
            const card = document.createElement('div');
            card.className = 'case-card';
            card.innerHTML = `
                <div class="case-name">${c.name}</div>
                <img src="${c.image}" class="case-image">
                <div class="case-price">${c.price} <img src="https://static.wikia.nocookie.net/leagueoflegends/images/0/0e/Blue_Essence.png" class="coin-icon-small" style="margin-left:5px"></div>
            `;
            card.onclick = () => openModal(c);
            casesContainer.appendChild(card);
        });
    };

    const openModal = (config) => {
        if (isSpinning) return;
        currentCase = config;
        document.getElementById('opening-case-name').textContent = config.name;
        document.getElementById('opening-case-price').textContent = config.price;
        modal.classList.remove('hidden');
        
        // Setup Opening Animation
        const openingContainer = document.getElementById('opening-animation-container');
        const spinnerContainer = document.getElementById('spinner-container');
        const openingChestImg = document.getElementById('opening-chest-img');
        const glowBurst = document.getElementById('glow-burst');
        
        openingContainer.classList.remove('hidden');
        spinnerContainer.classList.add('hidden');
        openingChestImg.src = config.image;
        openingChestImg.classList.remove('shake');
        glowBurst.classList.remove('active');
    };

    document.getElementById('close-case-modal').onclick = () => {
        if (!isSpinning) modal.classList.add('hidden');
    };

    const rollRarity = () => {
        const r = Math.random() * 100;
        if (r <= 0.5) return 'Ultimate';
        if (r <= 1.5) return 'Mythic';
        if (r <= 4.5) return 'Legendary';
        if (r <= 14.5) return 'Epic';
        if (r <= 39.5) return 'Rare';
        return 'Common';
    };

    const getRandomSkinByRarity = (rarity) => {
        const filtered = LOL_SKINS.filter(s => s.rarity === rarity);
        if (filtered.length === 0) return LOL_SKINS[Math.floor(Math.random() * LOL_SKINS.length)];
        return filtered[Math.floor(Math.random() * filtered.length)];
    };

    btnOpenCase.onclick = () => {
        if (isSpinning || user.coins < currentCase.price) {
            if (user.coins < currentCase.price) showNotification("Not enough Blue Essence!", true);
            return;
        }

        user.coins -= currentCase.price;
        saveStorageUser(user);
        updateStatsUI();

        const rarity = rollRarity();
        const winSkin = getRandomSkinByRarity(rarity);
        
        // --- OPENING ANIMATION SEQUENCE ---
        isSpinning = true;
        btnOpenCase.disabled = true;
        
        const openingChest = document.getElementById('opening-chest-img');
        const glowBurst = document.getElementById('glow-burst');
        const flashOverlay = document.getElementById('flash-overlay');
        const openingContainer = document.getElementById('opening-animation-container');
        const spinnerContainer = document.getElementById('spinner-container');

        // 1. Start Shaking and Glowing
        openingChest.classList.add('shake');
        glowBurst.classList.add('active');

        // 2. Wait for the "build-up"
        setTimeout(() => {
            // 3. Trigger Flash
            flashOverlay.classList.add('active');
            
            // 4. Mid-flash transition (0.3s into 0.8s flash)
            setTimeout(() => {
                openingContainer.classList.add('hidden');
                spinnerContainer.classList.remove('hidden');
                
                // Start the actual reel spin
                startReelSpin(winSkin);
            }, 300);

            // Cleanup flash class after it ends
            setTimeout(() => {
                flashOverlay.classList.remove('active');
            }, 800);

        }, 4000); // 4 seconds of build-up
    };

    const startReelSpin = (winSkin) => {
        // Generate Reel (30 items)
        const reel = [];
        for (let i = 0; i < 30; i++) {
            const randomSkin = LOL_SKINS[Math.floor(Math.random() * LOL_SKINS.length)];
            reel.push(randomSkin);
        }
        reel[25] = winSkin; // Winner index

        // Render Reel
        spinnerTrack.innerHTML = '';
        spinnerTrack.style.transition = 'none';
        spinnerTrack.style.transform = 'translateX(0)';
        
        reel.forEach(s => {
            const item = document.createElement('div');
            item.className = 'spinner-item';
            item.innerHTML = `
                <img src="${s.splash_art}">
                <div class="spinner-item-content">
                    <div class="rarity ${s.rarity}">${s.rarity}</div>
                    <div class="name">${s.name}</div>
                </div>
            `;
            spinnerTrack.appendChild(item);
        });

        setTimeout(() => {
            const itemWidth = 250; 
            const containerWidth = document.querySelector('.spinner-container').offsetWidth;
            const targetLeft = 25 * itemWidth;
            const randomOffset = Math.floor(Math.random() * 160) - 80;
            const finalX = -(targetLeft - (containerWidth / 2) + (itemWidth / 2) + randomOffset);

            spinnerTrack.style.transition = 'transform 8s cubic-bezier(0.15, 0, 0.05, 1)';
            spinnerTrack.style.transform = `translateX(${finalX}px)`;

            setTimeout(() => {
                showWin(winSkin);
                isSpinning = false;
                btnOpenCase.disabled = false;
            }, 8200);
        }, 50);
    };

    const showWin = (skin) => {
        const invId = Date.now();
        const sellVal = Math.floor(skin.value * 0.5);
        document.getElementById('won-image').src = skin.splash_art;
        document.getElementById('won-item').className = `won-item border-${skin.rarity}`;
        document.getElementById('won-rarity').className = `won-rarity ${skin.rarity}`;
        document.getElementById('won-rarity').textContent = skin.rarity;
        document.getElementById('won-name').textContent = skin.name;
        document.getElementById('sell-won-price').textContent = sellVal;

        const btnSell = document.getElementById('btn-sell-won');
        const btnKeep = document.getElementById('btn-keep-won');

        const winScreen = document.getElementById('win-screen');
        winScreen.classList.remove('hidden');

        btnKeep.onclick = () => {
            inventory.push({ ...skin, invId });
            saveStorageInventory(inventory);
            modal.classList.add('hidden');
            showNotification(`Added ${skin.name} to Inventory!`);
        };

        btnSell.onclick = () => {
            user.coins += sellVal;
            saveStorageUser(user);
            updateStatsUI();
            modal.classList.add('hidden');
            showNotification(`Sold ${skin.name} for ${sellVal} Coins!`);
        };
    };

    const setupNavigation = () => {
        const navCases = document.getElementById('nav-cases');
        const navInv = document.getElementById('nav-inventory');
        const pCases = document.getElementById('page-cases');
        const pInv = document.getElementById('page-inventory');

        navCases.onclick = () => {
            navCases.classList.add('active'); navInv.classList.remove('active');
            pCases.classList.add('active-page'); pCases.classList.remove('hidden');
            pInv.classList.add('hidden'); pInv.classList.remove('active-page');
        };
        navInv.onclick = () => {
            navInv.classList.add('active'); navCases.classList.remove('active');
            pInv.classList.add('active-page'); pInv.classList.remove('hidden');
            pCases.classList.add('hidden'); pCases.classList.remove('active-page');
            renderInventory();
        };
    };

    const renderInventory = () => {
        inventoryContainer.innerHTML = '';
        const filter = document.getElementById('rarity-filter').value;
        let totalVal = 0;

        inventory.forEach((item, index) => {
            const sellPrice = Math.floor(item.value * 0.5);
            totalVal += sellPrice;
            if (filter !== 'All' && item.rarity !== filter) return;

            const card = document.createElement('div');
            card.className = `inv-card border-${item.rarity}`;
            card.innerHTML = `
                <img src="${item.splash_art}" class="inv-image">
                <div class="inv-details">
                    <div class="inv-rarity ${item.rarity}">${item.rarity}</div>
                    <div class="inv-name">${item.name}</div>
                    <button class="sell-btn" onclick="sellItem(${index})">SELL: ${sellPrice} <img src="https://static.wikia.nocookie.net/leagueoflegends/images/0/0e/Blue_Essence.png" width="14"></button>
                </div>
            `;
            inventoryContainer.appendChild(card);
        });
        document.getElementById('inventory-total-value').textContent = `${totalVal} Coins`;
    };

    // Global expose for inline onclick
    window.sellItem = (idx) => {
        const item = inventory[idx];
        const val = Math.floor(item.value * 0.5);
        user.coins += val;
        inventory.splice(idx, 1);
        saveStorageUser(user);
        saveStorageInventory(inventory);
        updateStatsUI();
        renderInventory();
        showNotification(`Sold for ${val} Coins`);
    };

    const setupDailyReward = () => {
        document.getElementById('btn-daily').onclick = () => {
            const now = Date.now();
            if (user.lastDaily && now - user.lastDaily < 24 * 60 * 60 * 1000) {
                showNotification("Daily reward already claimed!", true);
                return;
            }
            user.coins += 1000;
            user.lastDaily = now;
            saveStorageUser(user);
            updateStatsUI();
            showNotification("Claimed 1000 Daily Coins!");
        };
    };

    const showNotification = (msg, isError = false) => {
        const notif = document.createElement('div');
        notif.className = `notification ${isError ? 'error' : ''}`;
        notif.textContent = msg;
        document.getElementById('notifications-container').appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    };

    document.getElementById('rarity-filter').onchange = renderInventory;

    init();
});
