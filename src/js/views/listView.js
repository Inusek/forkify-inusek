//Import names from base
import { elements } from './base';

// method to render the shopping list where we pass the item
export const renderItem = item => {
    //creating a markup HTML
    const markUp = `
    <li class="shopping__item" data-itemid=${item.id}>
        <div class="shopping__count">
            <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value" min="0">
            <p>${item.unit}</p>
        </div>
        <p class="shopping__description">${item.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>
    `
    elements.shopping.insertAdjacentHTML('beforeend', markUp);
};

// method to delete an item based on id
export const deleItem = id => {
    const item = document.querySelector(`[data-itemid=${id}]`);
    if (item) item.parentElement.removeChild(item);
};