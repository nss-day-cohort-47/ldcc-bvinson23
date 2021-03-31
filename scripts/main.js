console.log('yum, yum, yum');

import { LoginForm } from "./auth/LoginForm.js";
import { RegisterForm } from "./auth/RegisterForm.js";
import { NavBar } from "./nav/NavBar.js";
import { SnackList } from "./snacks/SnackList.js";
import { SnackDetails } from "./snacks/SnackDetails.js";
import { Footer } from "./nav/Footer.js";
import {
	logoutUser, setLoggedInUser, loginUser, registerUser, getLoggedInUser,
	getSnacks, getSingleSnack, getToppings, filterSnackToppings, postNewType, getSnackToppings, addTopping, editTopping
} from "./data/apiManager.js";
import { EditTopping } from "./snacks/EditTopping.js";
import { AddTopping } from "./snacks/AddTopping.js";



const applicationElement = document.querySelector("#ldsnacks");

//login/register listeners
applicationElement.addEventListener("click", event => {
	event.preventDefault();
	if (event.target.id === "login__submit") {
		//collect all the details into an object
		const userObject = {
			name: document.querySelector("input[name='name']").value,
			email: document.querySelector("input[name='email']").value
		}
		loginUser(userObject)
			.then(dbUserObj => {
				if (dbUserObj) {
					sessionStorage.setItem("user", JSON.stringify(dbUserObj));
					startLDSnacks();
				} else {
					//got a false value - no user
					const entryElement = document.querySelector(".mainContainer");
					entryElement.innerHTML = `<p class="center">That user does not exist. Please try again or register for your free account.</p> ${LoginForm()} <hr/> <hr/> ${RegisterForm()}`;
				}
			})
	} else if (event.target.id === "register__submit") {
		//collect all the details into an object
		const userObject = {
			name: document.querySelector("input[name='registerName']").value,
			email: document.querySelector("input[name='registerEmail']").value,
			admin: false
		}
		registerUser(userObject)
			.then(dbUserObj => {
				sessionStorage.setItem("user", JSON.stringify(dbUserObj));
				startLDSnacks();
			})
	}
})

applicationElement.addEventListener("click", event => {
	if (event.target.id === "logout") {
		logoutUser();
		sessionStorage.clear();
		checkForUser();
	}
})
// end login register listeners

// snack listeners
applicationElement.addEventListener("click", event => {
	event.preventDefault();

	if (event.target.id.startsWith("detailscake")) {
		const snackId = event.target.id.split("__")[1];
		getSingleSnack(snackId)
			.then(snackObj => {
				getSnackToppings(snackId)
					.then(snackToppings => {
						snackToppings
						showDetails(snackObj, snackToppings);
					})
			})
	}
})

applicationElement.addEventListener("click", event => {
	if (event.target.id === "add-type") {
		event.preventDefault();
		const typeEntry = document.querySelector("input[name='newType']").value;
		const typeObject = {
			name: typeEntry
		}
		postNewType(typeObject)
			.then(response => {
				location.reload(true);
			})
	}
})

applicationElement.addEventListener("click", event => {
	event.preventDefault();
	if (event.target.id === "allSnacks") {
		showSnackList();
	}
})

const showDetails = (snackObj, snackToppings) => {
	const listElement = document.querySelector("#mainContent");
	listElement.innerHTML = SnackDetails(snackObj, snackToppings);
}
//end snack listeners

//topping listeners

//filter snacks by topping
applicationElement.addEventListener("change", event => {
	if (event.target.id === "navList") {
		let snackSelector = event.target.value
		filterSnackToppings(snackSelector)
			.then(response => {
				let snackArray = [];
				response.forEach(topping => {
					snackArray.push(topping.snack)
				})
				const listElement = document.querySelector("#mainContent")
				listElement.innerHTML = SnackList(snackArray)
			})
	}
})

applicationElement.addEventListener("click", event => {
	if (event.target.id === "add-topping") {
		const toppingName = document.querySelector("input[name='newTopping']")
		const toppingObject = {
			name: toppingName.value
		}
		addTopping(toppingObject)
			.then(response => {
				location.reload(true);
			})
	}
})

applicationElement.addEventListener("change", event => {
	event.preventDefault();
	if (event.target.id === "editList") {
		let toppingSelector = document.querySelector("select[name='editList']").value
		editToppingForm(toppingSelector)
	}
})
applicationElement.addEventListener("click", event => {
	if (event.target.id === "edit-topping") {
		let toppingSelector = document.querySelector("input[name='editSelect']").value
		const entryElement = document.querySelector(".add-edit-form");
		entryElement.innerHTML = editTopping(toppingObject);
		const toppingObject = {
			name: toppingSelector
		}
		.then(response => {
			location.reload(true);
		})
	}
})

//end topping listeners

export const showToppingAdd = () => {
	return AddTopping()
}
export const showToppingEdit = (toppingObj) => {
	const entryElement = document.querySelector(".add-edit-form");
	entryElement.innerHTML = EditTopping(toppingObj);
}
const checkForUser = () => {
	if (sessionStorage.getItem("user")) {
		setLoggedInUser(JSON.parse(sessionStorage.getItem("user")));
		startLDSnacks();
	} else {
		applicationElement.innerHTML = "";
		//show login/register
		showNavBar()
		showLoginRegister();
	}
}

const showLoginRegister = () => {
	//template strings can be used here too
	applicationElement.innerHTML += `${LoginForm()} <hr/> <hr/> ${RegisterForm()}`;
}

const showNavBar = () => {
	applicationElement.innerHTML += NavBar();
}

//show all the snacks
const showSnackList = () => {
	getSnacks().then(allSnacks => {
		const listElement = document.querySelector("#mainContent")
		listElement.innerHTML = SnackList(allSnacks);
	})
}

const showFooter = () => {
	applicationElement.innerHTML += Footer();
}

const startLDSnacks = () => {
	applicationElement.innerHTML = "";
	showNavBar();
	applicationElement.innerHTML += `<div id="mainContent"></div>`;
	showSnackList();
	showFooter();
	createToppingList();
	showToppingAdd();
	// createEditToppingList();

}

//creates a topping list to populate the dropdown in the navbar
const createToppingList = () => {
	const entryHTMLSelector = document.querySelector(".form-select");
	getToppings().then(response => {
		response.forEach((toppingObj, index) => {
			entryHTMLSelector.options[index + 1] = new Option(toppingObj.name, toppingObj.id)
		})
	})
}

//creates a topping list to populate the dropdown in the edit form
// const createEditToppingList = () => {
// 	const entryHTMLSelector = document.querySelector(".edit-select");
// 	getToppings().then(response => {
// 		response.forEach((toppingObj, index) => {
// 			entryHTMLSelector.options[index + 1] = new Option(toppingObj.name, toppingObj.id)
// 		})
// 	})
// }

//populates the add toppinng form to edit a topping
// const editToppingForm = (toppingObj) => {
// 	return `
// 		<input>${toppingObj.name}</input>`
// }

checkForUser();