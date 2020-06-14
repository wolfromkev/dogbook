function arrayFilter(array, query) {
	let filteredArray = array.filter((user) => {
		for (let i = 0; i < query.length; i++) {
			if (user.handle[i] === query[i]) {
				return true;
			}
		}
		return false;
	});
	return filteredArray;
}

export default arrayFilter;
