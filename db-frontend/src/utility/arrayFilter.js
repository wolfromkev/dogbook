function arrayFilter(array, query) {
	let filteredArray = array.filter((user) => {
		let queryArray = [];
		for (let i = 0; i < query.length; i++) {
			if (user.handle[i] === query[i]) {
				queryArray.push(true);
			}
		}
		if (queryArray.length === query.length) {
			return true;
		} else return false;
	});
	return filteredArray;
}

export default arrayFilter;
