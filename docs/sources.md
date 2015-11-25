Sources
=======

This repository is intended to include calendar data on both fiction and nonfiction universes, effectively documenting known cultures and calendars in a single place. Because of that, a structured organization is needed to avoid naming conflicts but also to assist in finding ones already written. This is complicated by the fact different authors may create worlds or universes with the same name.

Collectively, these are all called *sources*. Sources have the following rules:

* The separator between the various elements of the source and the data file is always a forward slash (`/`) even on operating systems that use a different separator.
* All components, including the source, are lowercase letters in kebab-case.
* It is recommended that the characters stick with the ASCII representation simply because no all languages handle UTF8 values.
* A `./` in the beginning means "the root of the repository".
* All sources are in the `./data/` directory.
* Sources can have `//` and `/* */` comments which will be stripped out.

The primary source is the nonfiction elements based on our own reality. These are in the `nonfiction` source (short for nonfiction but heavily used so it has a shorter name). For example, the Gregorian calendar would be located at `./data/nonfiction/gregorian.json` and would have an ID of `nonfiction/gregorian`.

For most fictional universes, the source has two components: the primary "creator" and the series name. For example, George Lucas is commonly seen as the creator for Star Wars, so the source would be `./george-lucas/star-wars/`. This is true even though there are many different people writing in the Star Wars universe.

Additional rules for creators:

* Creators with multiple initials, combine them together (`jrr-tolkien` instead of `j-r-r-tolkien` for [J. R. R. Tolkien](https://en.wikipedia.org/wiki/J._R._R._Tolkien)).
* When creators change their names, use the name they were using at the time of creation.
* Likewise, if the creator has a byline, use the byline at the point of the first one.
* Companies can be creators also, so `white-wolf/exalted` would be the source for White Wolf's Exalted series. We would include Marvel in this category.
* For universes that have different rules, such as Marvel's various Earths or the Star Wars Expanded Universe, create a folder inside the series if applicacable. For example, `marvel/marvel-universe/earth-16` or `george-lucas/star-wars/expanded-universe`.

If the source already has the same name as an existing one, add a numeric prefix starting at `-2`. For example, `d-moonfire-2` if there were two [D. Moonfires](https://d.moonfire.us/).
