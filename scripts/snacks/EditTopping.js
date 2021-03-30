export const EditTopping = (toppingObj) => {
    return `
        <form>
	        <button id="edit-topping" class="btn btn-outline-primary" type="button">Edit A Topping</button>
	        <input id="newTopping" name="newTopping">"${toppingObj.name}"</input>
            <input type="hidden" value="${toppingObj.id}"
	    </form>
    `
}