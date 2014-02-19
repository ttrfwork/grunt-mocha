var path = require('path');

var TEMPLATE = ['<script type="text/javascript" src="', 0, '"></script>'];

module.exports = function (grunt, opts) {
	var glued = opts.glued[0];

	if (!glued) {
		throw new Error('This task needs dest to store temporary template interpolation result!');
	}

	glued = path.join(glued, 'glued_template.html');


	var deps = opts.depPath;
	var assert = opts.assertPath;
	var ainit = opts.assertInitPath;
	var data = opts.dataPath;
	var test = opts.testPath;
	var mocha = opts.mochaPath;

	if (!test) {
		throw new Error('No folder for tests provided!');
	}

	var tmpl = path.resolve(__dirname, '../template/template.html');

	// Synchronous!

	deps = grunt.file.expand(deps);
	assert = grunt.file.expand(assert);
	ainit = grunt.file.expand(ainit);
	data = grunt.file.expand(data);
	test = grunt.file.expand(test);
	mocha = grunt.file.expand(mocha);

	console.log(deps, assert, ainit, data, test, mocha);

	if (assert.length !== 1 || ainit.length !== 1 || mocha.length !== 1) {
		throw new Error();
	}

	var template = grunt.file.read(tmpl).split('\n');

	grunt.verbose.write('Dumping template\n').write(template);

	var i;

	function rel(to) {
		return path.relative(path.dirname(glued), to);
	}

	function res(to, template, i) {
		var relpath = rel(to);
		TEMPLATE[1] = relpath;
		template.splice(i, 0, TEMPLATE.join('') + '\n');
	}

	function sub(template, i, paths, variable) {
		var j;
		if (template[i].indexOf(variable) > -1) {
			template.splice(i, 1);
			for (j = 0; j < paths.length; j++) {
				if (grunt.file.isFile(paths[j]) && paths[j].substr(-3) === '.js') {
					res ( paths[j], template, i );
				}
			}
		}
	}

	for (i = 0; i < template.length; i++) {
		sub(template, i, deps, '<<<<DEP_PATH>>>>');
		sub(template, i, data, '<<<<DATA_PATH>>>>');
		sub(template, i, test, '<<<<TEST_PATH>>>>');

		if (template[i].indexOf('<<<<ASSERT_PATH>>>>') > -1) {
			template[i] = template[i].replace('<<<<ASSERT_PATH>>>>', rel(assert[0]));
		}

		if (template[i].indexOf('<<<<MOCHA_PATH>>>>') > -1) {
			template[i] = template[i].replace('<<<<MOCHA_PATH>>>>', rel(mocha[0]));
		}

		if (template[i].indexOf('<<<<ASSERT_INIT>>>>') > -1) {
			template[i] = grunt.file.read(ainit[0]);
		}
	}

	grunt.verbose.write('Glued template\n').write(template.join('\n'));
	grunt.file.write(glued, template.join('\n'));

	return glued;
};