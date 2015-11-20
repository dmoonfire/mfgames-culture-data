MfGames Culture Data
====================

This is a collection of JSON files that represent various components of a culture, both ones based on reality and fictional ones.

# Libraries

* [Javascript, Typescript, ES6, AMD, and CommonJS](https://github.com/dmoonfire/mfgames-culture-es6)

# Sources

This repository is intended to include calendar data on both fiction and nonfiction universes, effectively documenting known cultures and calendars in a single place. Because of that, a structured organization is needed to avoid naming conflicts but also to assist in finding ones already written. This is complicated by the fact different authors may create worlds or universes with the same name.

Collectively, these are all called *sources*. Sources have the following rules:

* The separator between the various elements of the source and the data file is always a forward slash (`/`) even on operating systems that use a different separator.
* All components, including the source, are lowercase letters in kebab-case.
* It is recommended that the characters stick with the ASCII representation simply because no all languages handle UTF8 values.
* A `./` in the beginning means "the root of the repository".

The primary source is the nonfiction elements based on our own reality. These are in the `nonfiction` source (short for nonfiction but heavily used so it has a shorter name). For example, the Gregorian calendar would be `./nonfiction/gregorian`.

For most fictional universes, the source has two components: the primary "creator" and the series name. For example, George Lucas is commonly seen as the creator for Star Wars, so the source would be `./george-lucas/star-wars/`. This is true even though there are many different people writing in the Star Wars universe.

Additional rules for creators:

* Creators with multiple initials, combine them together (`./jrr-tolkien/` instead of `./j-r-r-tolkien/` for [J. R. R. Tolkien](https://en.wikipedia.org/wiki/J._R._R._Tolkien)).
* When creators change their names, use the name they were using at the time of creation.
* Likewise, if the creator has a byline, use the byline at the point of the first one.
* Companies can be creators also, so `./white-wolf/exalted/` would be the source for White Wolf's Exalted series. We would include Marvel in this category.
* For universes that have different rules, such as Marvel's various Earths or the Star Wars Expanded Universe, create a folder inside the series if applicacable. For example, `./marvel/marvel-universe/earth-16/` or `./george-lucas/star-wars/expanded-universe/`.

If the source already has the same name as an existing one, add a numeric prefix starting at `-2`. For example, `./d-moonfire-2` if there were two [D. Moonfires](https://d.moonfire.us/).

# Data Files

Data files are JSON formatted data in the appropiate format. The name of the file is typically lowercase, but may include capitals for IEFT language tags.

* `./nonfiction/en-US.json`
* `./nonfiction/gregorian.json`

The `id` attribute in the file must match its dirctory structure, minus the `./` and the `.json` extension. For example, `nonfiction/en-US` or `nonfiction/gregorian`.

## Reserved Sources

The following are reserved names:

* `./nonfiction/`: Non-fiction entries
* `./docs/`: Documentation

# Versioning

This repository uses [semver](https://semver.org/). The version is in `package.json`.

## Major Versions

* A source or data file is renamed or removed.

## Minor Version

* A data file has additional elements add it to it.

## Patch

* Typographical or documentation changes were made to data files.

# Copyright of Components

One of the natures of fictional worlds is that the names are things are frequently copyrighted. This includes names of months, weeks, or even cultures. This makes it difficult to legally create a parser or formatter that uses those copyrighted terms.

To avoid difficulties, don't create formats that require lookup codes unless there is some explicit license or general proof that it is acceptable (such as a Wikipedia page describing the calendar). If one is available, include it in the `rights` block inside each of the associated files.

    {
        "rights": {
            "license": "CC BY-NC-SA 4.0",
			"proofUrl": "https://github.com/dmoonfire/fedran/blob/master/LICENSE.markdown"
        }
    }

If an entry needs to be removed, please create an issue in the [Github repository](https://github.com/dmoonfire/mfgames-culture-data/issues). This will ensure transparency in the process.

# Terminology

* **kebab-case**: Identifiers that are typically lower case with words separated by dashes. There are cases when capitals are appropriate, such as when the identifier represents an IEFT language tag (e.g., `en-US`).
