MfGames Culture Data
====================

Welcome the [MfGames Culture](https://mgames.com/mfgames-culture/) data files repository/package. This documentation describes the JSON-formatted files that consist of the package.

Repository Layout
-----------------

The layout of the repository is:

* `./bin/`: A directory with minification tools and populating the `./dist/` folder.
* `./data/`: The source directory which contains all the JSON files which may include comments.
* `./dist/`: A Git-ignored file which contains versions of the data files (in the same directory structure), plus:
	* `./dist/combined.json`: A sequence containing every data file as a single file.
	* `./dist/combined.min.json`: A minified version of `./dist/combined.json`.
	* `./dist/index.json`: A sequence of every data file but only with the `version`, `id`, `type`, `description`, and `keywords` elements.
	* `./dist/index.min.json`: A minified version of `./dist/index.json`.
* `./docs/`: Documentation written in Markdown and using full filenames for links.
* `./lib/`: A Git- and NPM-ignored folder which contains the source code to package the `./dist/` folder for uploading.
* `./src/`: A NPM-ignored directory which contains the source that is combined into `./lib/`.

Files
-----

Data files are JSON formatted data in the appropiate format. The name of the file is the [source](sources.md) as a directory structure. This is typically lowercase, but may include capitals for IEFT language tags.

* `./data/nonfiction/en-US.json`
* `./data/nonfiction/gregorian.json`

The `id` attribute in the file must match its dirctory structure, minus the `./data/` and the `.json` extension. For example, `nonfiction/en-US` or `nonfiction/gregorian`.

* [Cultures](cultures.md)
* [Calendars](calendars.md)

Other
-----

* [Sources](sources.md)
* [Versions](versions.md)
* [Copyright](copyright.md)
* [Glossary](glossary.md)
