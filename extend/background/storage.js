var localStorageVote = {
	get() {
		return localStorage.getItem('vote');
	},
	set(vote) {
		localStorage.setItem('vote', vote);
	}
};