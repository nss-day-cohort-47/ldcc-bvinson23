const toppingObject = (toppingObj) => {
    return `
        <div>
            <option value="${toppingObj.topping.name}">${toppingObj.topping.name}</option>
        </div>
    `
}

export const makeToppingList = (toppingObj) => {
    toppingList(toppingObj)
}

const toppingList = (allToppings) => {
    const toppingElement = document.querySelector(".form-select");
    let HTMLArray = allToppings.map(oneTopping => {
        return toppingObject(oneTopping);
    })
    toppingElement.innerHTML += HTMLArray
}
