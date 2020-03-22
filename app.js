const search = document.querySelector('#search');
const submit = document.querySelector('#submit');
const random = document.querySelector('#random');
const mealsEl = document.querySelector('#meals');
const resultHeading = document.querySelector('#result-heading');
const singleMealEl = document.querySelector('#single-meal');

// get random meal

function getRandomMeal() {
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        })
}

// search meal API

function searchMeal(e) {


    // clear single
    singleMealEl.innerHTML = '';

    // get search term
    const term = search.value;
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                resultHeading.innerHTML = `
                <h2>Search Results For '${term}':</h2>
                `;
                if (data.meals === null) {
                    resultHeading.innerHTML = `<h4>No search results. Try different name.</h4>`;
                    mealsEl.innerHTML = '';
                } else {
                    mealsEl.innerHTML = data.meals.map(meal =>
                        `
                    <div class='meal'>
                        <img src='${meal.strMealThumb}' alt='${meal.strMeal}' />
                        <div class='meal-info' data-mealID='${meal.idMeal}'>
                        <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                    `
                    ).join('');
                }
            });
        // clear search text
        search.value = '';
    } else {
        alert('Please Enter a Name');
        mealsEl.innerHTML = '';
    }

    e.preventDefault();
}

// fetch meal ID
function getMealByID(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];

            addMealToDOM(meal);
        })
}

// add meal
function addMealToDOM(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
        } else {
            break;
        }
    }

    singleMealEl.innerHTML = `
    <div class='single-meal'>
        <h1>${meal.strMeal}</h1>
        <img src='${meal.strMealThumb}' alt='${meal.strMeal}' />
        <div class='single-meal-info'>
            ${meal.strCategory ? `<h4>${meal.strCategory}</h4>` : ''}
            ${meal.strArea ? `<h4>${meal.strArea}</h4>` : ''}
        </div>
        <div class='main'>
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
                ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul
        </div>
    </div>
    `;
}

// event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);
mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });

    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealByID(mealID)
    }
});