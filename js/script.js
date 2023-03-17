const getGitHubRepositoriesData = async (queryStr, perPage) => {
	const queryString = 'q=' + encodeURIComponent(queryStr);
	const url = `https://api.github.com/search/repositories?${queryString} in:name,topics,description,readme&per_page=${perPage}`
  
	const response = await fetch(url)
	if(!response.ok) {
	  throw new Error(`Could not fetch ${url}, status: ${response.status}`);
	}
	let responseData = await response.json();
	return responseData.items;
};

const createMessageNothingFound = parent =>{
	parent.insertAdjacentHTML("beforeend",
		`<div id="msg_nothing_found">
        	<img class="msg_nothing_found_img" src="img/pensive-emoticon.jpg" alt="pensive-emoticon">
        	<p class="msg_nothing_found_text">По данному запросу ничего не найдено!</p>
        </div>`
	);
}

const createArticleForFoundRepository = (parent, repository) => {
	parent.insertAdjacentHTML("beforeend",
		`<article class="response">
			<h3 class="response_name">Name: <a target="_blank" href=${repository.html_url}>${repository.full_name}</a></h3>
			<p class="response_created_udated"><span>Created: </span>${(repository.created_at).split("T")[0]} <span>Updated: </span>${(repository.updated_at).split("T")[0]}</p>
			<p class="response_watchers_private"><span>Watchers:</span> ${repository.watchers} <span>Private: </span>${repository.private}</p>
			<p class="response_descr"><span>Description: </span>${repository.description}</p>
		</article>`
	)
}

form.onsubmit = event => {
	const perPage = 10;

	event.preventDefault();

	if(document.querySelector("#responses")) responses.remove();
	if(document.querySelector("#msg_nothing_found")) msg_nothing_found.remove();
	
	getGitHubRepositoriesData(form.query_input.value, perPage)
	.then(foundRepositories => {

		if(!foundRepositories.length) {

			form.style.position = "absolute";
			container.style.minHeight = "100vh"
			container.style.margin = "0 auto"

			createMessageNothingFound(form);
			return;
		}

		form.style.position = "relative";
		container.style.minHeight = "auto"
		container.style.marginLeft = "0px"
		
		form.insertAdjacentHTML("afterend", `<div id="responses"></div>`);
		foundRepositories.forEach( repository => {
			createArticleForFoundRepository(responses, repository);
		});
	}
	);
};

form_submit_icon.onclick = form.onsubmit;