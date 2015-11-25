Cultures
========

A *culture* is a collection of information about a society and how it functions. This includes language, how they keep track of time and communicate it, and other information as these data files mature.

Like most files, the key parts of the JSON file are the `id`, `version`, and `type`.

    {
        "version": 0,
        "type": "culture",
        "id": "source/id"
    }

Optionally, a "description" is a one-line sentence of the culture. Typically, this ends with a period.

Lookups
-------

With the current version, various text lookups are a simple string-based hash called `lookups`. This contains the language-specific (in `utf-8` encoding) charactes that can be used for translating numerical values (such as month names) into the culture's labels.

    {
        "lookups":
        {
            "MMM/01": "Jan",
            "MMM/02": "Feb"
        }
    }

How these codes are used are described in those elements.

Temporal (Time)
---------------

The biggest part of a culture at this point is how they record, format, and parse temporal elements. This includes which calendars they use and the formatting for those calendars.

    {
        "temporal":
        {
            "calendars": ["nonfiction/gregorian", "nonfiction/duodecimal"],
            "instantFormats": {
                "YYYY": [
    			{
    				"maxDigits": 4,
    				"minDigits": 4,
    				"ref": "year"
    			}
            }
        }
    }

There are two parts of the `temporal` element: `calendars` and `instantFormats`.

The `calendars` is an array of *sources* pointing to the calendars that are used by the culture. This can be any number of them but the individual [cycles](calendars.md) must have unique identifiers.

*Developer Notes: The original reason for splitting was to reflect our world where the Gregorian calendar was accepted in different years but the concept of hours and days was used long. Calendars are also significantly complex systems that could use from both isolation and also reuse across multiple cultures.*

The second part are the `instantFormats`. This is a hash of format names and a list of elements that make up that format. The elements are in a sequence (array) that consists of a part.

Instant Formats
---------------

Each instant format is a sequence of elements. These are all inside the object inside the `instantFormats`.

The basic component is the constant. These are the slashes, dashes, and periods between the various calendar elements (the two "-" of "2015-02-05").

    {
        "constant": "-"
    }

The rest of the elements are based on a [cycle](calendars.md) of one of the culture's calendars. For numerical elements (the "2015", "02", and "05" of "2015-02-05"), these are just numbers with a minimum and maximum number of digits. For example, below is a four-digit year.

    {
        "ref": "year",
        "maxDigits": 4,
        "minDigits": 4,
    },

All cycles are zero-based, which means that January 1 is actually `{ yearMonth: 0, monthDay: 0 }` (see [calendars](calendars.md) for this format). To offset this by one, use the offset key. The offset is calculated before lookups are done. Below has the month starting at one (1) instead of zero (0).

    {
        "ref": "monthDay",
        "maxDigits": 2,
        "minDigits": 2,
        "offset": 1
    }

To create a textual code (the "Jan" in "Jan 2005"), a lookup code is needed. The two components are the `lookup` code which enables that code. The calculated prefix is used with the `prefix` in front of it.

    {
        "ref": "yearMonth"
        "lookup": true,
        "maxValue": 11,
        "minDigits": 2,
        "offset": 1,
        "prefix": "MMM/",
    }

In the above example, the lookup codes would start at "MMM/01" and go to "MMM/12". The reason for this is the `minDigits` ensures it has two digits and zero padding, `offset` starts at one (1), and then the lookup code has a `prefix` of "MMM/".

The `maxValue` is needed in the above example since the parser needs to know how to look up all the entries. Parsing is not case-sensitive.

In some formats, there is an abbreviated element. For example, a two-digit year which implies a certain component. Normally, these are based on a calculated cycle, such as `centuryYear` of the Gregorian calendar, but it is translated into the `year` cycle (`centuryYear` is a calculated and can't be set).

    {
        "ref": "centuryYear",
        "maxDigits": 2,
        "minDigits": 2,
        "default": { "year": 2000 },
        "parseRef": "year"
    }

The above example allows for a two-digit year (15 for 2015). When parsing, it assumes 2000 plus the two-digit year, effectively creating 2000 for 00 and 2099 for 99. The two components are `parseRef` which identifies the cycle reference that the parser uses. The `default` sets the value which the `parseRef` is then added it.

`default` can be added to any parse element, even for cycles that aren't in the format.
