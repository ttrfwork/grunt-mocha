var vars = ['data1', 'data2', 'assertlib', 'ainit', 'dep'];

vars.forEach(function (item) {
	if (window[item] !== 'item') {
		throw new Error(item + ' was not loaded');
	}
});