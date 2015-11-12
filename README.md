MfGames Culture Data
====================

This is a collection of JSON files that represent various components of a culture, both ones based on reality and fictional ones.

# Libraries

* [Javascript, Typescript, ES6, AMD, and CommonJS](https://github.com/dmoonfire/mfgames-culture-es6)

# Organization

The organization of the files in this repository are highly dependent on the source of the information. Collectively, these are called the `source` directories.

* Reality uses the root-level directory as the source (`./`).
* For primary author source, use their name as kebab-case. For example, [D. Moonfire](https://d.moonfire.us/) would use `./d-moonfire/` and [J. R. R. Tolkien](https://en.wikipedia.org/wiki/J._R._R._Tolkien) would use `./j-r-r-tolkien/`.
    * If possible, use the author's world as a second-level identifier. For example, D. Moonfire's world is called [Fedran](https://fedran.com/), so the source identifier would be `./d-moonfire/fedran/`.
* For universes that don't have a primary author, just use the name of the universe as kebab-case. For example, Star Wars would be `./star-wars/`.

Regardless of where the data came from, each `source` directory has the following directories underneath it:

* `calendars`: Contains the JSON files that represent a single calendar. The calendar IDs should be kebab-case with the appropriate extension (e.g., `./calendars/gregorian.json`).
* `cultures`: Contains the JSON files that represent a single culture. For reality, this will be the IEFT language tag (e.g., `en-US`) but for fictional elements, it would appropriate for that source.

# Copyright of Components

One of the natures of fictional worlds is that the names are things are frequently copyrighted. This includes names of months, weeks, or even cultures. This makes it difficult to legally create a parser or formatter that uses those copyrighted terms.

To avoid difficulties, don't create formats that require lookup codes unless there is some explicit license or general proof that it is acceptable (such as a Wikipedia page describing the calendar). If one is available, include it in the `rights` block inside each of the associated files.

    {
        "rights": {
            "license": "CC BY-NC-SA 4.0",
			"proofUrl": "https://github.com/dmoonfire/fedran/blob/master/LICENSE.markdown"
        }
    }

If an entry needs to be removed, please send an email with proof to [contact@mfgames.com](mailto:contact@mfgames.com) and we'll get it removed. Corrections will be accepted as pull requests.

# Terminology

* **kebab-case**: Identifiers that are typically lower case with words separated by dashes. There are cases when capitals are appropriate, such as when the identifier represents an IEFT language tag (e.g., `en-US`).
