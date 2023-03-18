const getGitHubRepositoriesData = async (queryStr, perPage = 10) => {

	const url = `https://api.github.com/search/repositories?
	q=${encodeURIComponent(queryStr)} in:name,topics,description,readme&per_page=${perPage}`;

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
	event.preventDefault();
	if(!form.query_input.value) {
		return false;
	}

	if(document.querySelector("#responses")) {
		responses.remove();
	} 

	if(document.querySelector("#msg_nothing_found")) {
		msg_nothing_found.remove();
	} 
		

		getGitHubRepositoriesData(form.query_input.value)
		.then(foundRepositories => {
			
			if(!foundRepositories.length) {

				console.log(foundRepositories.length);
				
				container.style.margin = "0 auto"
				container.style.paddingTop = "40vh"
				
				createMessageNothingFound(form);
				return false;
			}
			
			container.style.marginLeft = "0px"
			container.style.paddingTop = "40px"
			
			form.insertAdjacentHTML("afterend", `<div id="responses"></div>`);
			foundRepositories.forEach( repository => {
				createArticleForFoundRepository(responses, repository);
			});
		});
};

form_submit_icon.onclick = form.onsubmit;