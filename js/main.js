(function(){
    let bindedRemoveAnimationClassFunction;
    const itemValueMap = {
        A: {
            value: 50,
            bonusValue: 200,
            bonusNumber: 3
        },
        B: {
            value: 30,
            bonusValue: 90,
            bonusNumber: 2
        },
        C: {
            value: 20
        },
        D: {
            value: 15
        },
        E: {
            value: 10
        }
    };

    const userStats = {
        items: {}
    };

    const calculateScoreWithBonus = function (itemParameters, itemStats) {
        const itemBonusValue = itemParameters.bonusValue;
        const itemValue = itemParameters.value;
        const bonusCount = parseInt(itemStats.quantity / itemParameters.bonusNumber);
        const remainderCount = itemStats.quantity - itemParameters.bonusNumber * bonusCount;

        return itemBonusValue * bonusCount + itemValue * remainderCount;
    };

    calculateScoreWithoutBonus = function (itemParameters, itemStats) {
        return itemStats.score + itemParameters.value;
    };

    const calculateScore = function (itemParameters, itemStats) {
        if (itemParameters.bonusNumber) {
            return calculateScoreWithBonus(itemParameters, itemStats);
        }

        return calculateScoreWithoutBonus(itemParameters, itemStats);
    };

    const updateScoreEntry = function (scoreEntry, itemStats) {
        if (scoreEntry) {
            return updateExistingScoreEntry(scoreEntry, itemStats);
        }

        return createNewScoreEntry(itemStats);
    };

    const removeAnimationClass = function (element, className) {
        element.classList.remove(className);
        element.removeEventListener('animationend', bindedRemoveAnimationClassFunction, false);
    };

    const updateExistingScoreEntry = function (scoreEntry, itemStats) {
        const itemQuantity = scoreEntry.querySelector('.item-quantity');
        const itemScore = scoreEntry.querySelector('.item-score');

        itemQuantity.innerHTML = itemStats.quantity;
        itemScore.innerHTML = itemStats.score;

        bindedRemoveAnimationClassFunction = removeAnimationClass.bind(this, scoreEntry, 'scale-up-and-down');
        scoreEntry.addEventListener('animationend', bindedRemoveAnimationClassFunction, false);
        scoreEntry.classList.add('scale-up-and-down');
    };

    const createNewScoreEntry = function (itemStats) {
        const newScoreEntry = createScoreEntryElement(itemStats);

        bindedRemoveAnimationClassFunction = removeAnimationClass.bind(this, newScoreEntry, 'rotate-in');
        newScoreEntry.addEventListener('animationend', bindedRemoveAnimationClassFunction, false);

        const itemStatsContainer = document.querySelector('.items-stats-content');
        itemStatsContainer.appendChild(newScoreEntry);
    };

    const createScoreEntryElement = function (itemStats) {
        const scoreEntryElement = document.createElement('div');
        scoreEntryElement.className = 'item-stats three-column-grid rotate-in';
        scoreEntryElement.setAttribute('data-item-score-id', itemStats.id);

        let scoreEntryElementContent = `<span class="grid-cell-center">${itemStats.id}</span>`;
        scoreEntryElementContent += `<span class="item-quantity grid-cell-center">${itemStats.quantity}</span>`;
        scoreEntryElementContent += `<span class="item-score grid-cell-center">${itemStats.score}</span>`;
        scoreEntryElement.innerHTML = scoreEntryElementContent;

        return scoreEntryElement;
    };

    const calculateTotalScore = function () {
        let total = 0;
        Object.keys(userStats.items).forEach((itemId) => {
            total += userStats.items[itemId].score;
        });

        return total;
    };

    const calculateTotalBonus = function () {
        let total = 0;
        Object.keys(userStats.items).forEach((itemId) => {
            const itemStats = userStats.items[itemId];
            const itemValue = itemValueMap[itemId].value;
            const itemCount = itemStats.quantity;

            total += itemStats.score - itemValue * itemCount;
        });

        return total;
    };

    const updateTotalScore = function () {
        const totalScoreElement = document.querySelector('.total-score');
        totalScoreElement.innerHTML = calculateTotalScore();
    };

    const updateTotalBonus = function () {
        const totalBonusElement = document.querySelector('.total-bonus');
        totalBonusElement.innerHTML = calculateTotalBonus();
    };

    const itemClickHandler = function (event) {
        const itemId = event.target.dataset.itemId;
        const itemParameters = itemValueMap[itemId];
        const scoreEntry = document.querySelector(`[data-item-score-id=${itemId}]`);
        const itemStats = userStats.items[itemId] || (userStats.items[itemId] = {id: itemId, quantity: 0, score: 0});

        itemStats.quantity++;
        itemStats.score = calculateScore(itemParameters, itemStats);

        updateScoreEntry(scoreEntry, itemStats);
        updateTotalScore();
        updateTotalBonus();
    };

    const addClickHandlerToItems = function (items) {
        for (let item of items) {
            item.addEventListener('click', itemClickHandler);
        }
    };

    const items = document.getElementsByClassName('item');
    addClickHandlerToItems(items);
}());
