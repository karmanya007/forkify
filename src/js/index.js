// Search : https://forkify-api.herokuapp.com/api/search
// GET: https://forkify-api.herokuapp.com/api/get

import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';
import Recipe from './models/Recipe';

/* * Global state of the app
   * - Search object
   * - Current recipe object
   * - Shopping list object
   * - Liked recipes  
*/

const state = {};

// Search Controller
const controlSearch = async () => {
	// 1) Get query from the view
	const query = searchView.getInput();
	if (query) {
		// 2) New search object and add to state
		state.search = new Search(query);

		// 3) Prepare the UI for results
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);
		try {
			// 4) Search for recipes
			await state.search.getResults();
			// 5) Render results on UI
			clearLoader();
			searchView.renderResults(state.search.result);
		} catch (error) {
			alert('Error processing the query');
			clearLoader();
		}
	}
};

elements.searchForm.addEventListener('submit', (e) => {
	e.preventDefault(); // To prevent the reloding of page after every submit action
	controlSearch();
});

elements.searchResPages.addEventListener('click', (e) => {
	const btn = e.target.closest('.btn-inline');
	if (btn) {
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.result, goToPage);
		// console.log(goToPage);
	}
});

// Recipe controller

const controlRecipe = async () => {
	// Get the id from the url
	const id = window.location.hash.replace('#', '');
	console.log(id);

	if (id) {
		// Prepare UI for changes
		recipeView.clearRecipe();
		renderLoader(elements.recipe);
		// Create new recipe object
		state.recipe = new Recipe(id);

		try {
			// Get recipe data and parse ingredients
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();

			// Calculate servings and time
			state.recipe.calcTime();
			state.recipe.calcServings();

			// Render recipe
			clearLoader();
			recipeView.renderRecipe(state.recipe);
		} catch (error) {
			alert('Error processing recipe');
		}
	}
};

[
	'hashchange',
	'load'
].forEach((event) => window.addEventListener(event, controlRecipe));
