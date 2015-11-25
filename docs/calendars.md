Calendars
=========

A *calendar* describes a temporal measurement system. This is based on [Julian Day Number (JDN)](https://en.wikipedia.org/wiki/Julian_day) both in many inputs and conversions. A calendar can be a measure of days, partial days (hours and minutes), or both.

Like most files, the key parts of the JSON file are the `id`, `version`, and `type`.

    {
        "version": 0,
        "type": "calendar",
        "id": "source/id"
    }

Optionally, a "description" is a one-line sentence of the culture. Typically, this ends with a period.

Cycles
------

Probably the most important part of a calendar are the cycles. A calendar can have one or more cycles. Likewise, a cycle can have zero or more child cycles which are recursively calculated once the parent cycle has been determined. The top-most cycles are called *root cycles*.

    {
        "id": "nonfiction/gregorian",
        "type": "calendar",
        "cycles": [
            {
                "id": "year",
                "type": "repeat"
            }
        ]
    }

A cycle consists of an `id` which must be unique *across calendars used in a culture* and a `type`. The type determines how they are calculated. The system calculates each root cycle and then recurses into the child cycles before moving to the next root cycle.

    {
        "id": "nonfiction/gregorian",
        "type": "calendar",
        "cycles": [
            {
                "id": "year",
                "type": "repeat",
                "cycles": [
                    {
                        "id": "decadeYear",
                        "type": "calculate"
                    }
                ]
            }
        ]
    }

*Developer Notes: There were quite a few implementations of this system, including ones that listed all cycles not in a recursive structure or one that worked from the bottom (days) up. In most cases, it was computationally expensive and it took too long to calculate or format a date. This approach was designed to reduce the amount of effort needed to parse it.*

Cycle names can be whatever the designer wants, but the default ones use `largerUnitSmallerUnit` such as "yearMonth" or "centuryDecade". Any ID is valid, but it is recommended that they are camelCase.

*Developer Notes: "Month of Year" was too many characters and @dmoonfire didn't like the "of". This was purely a design choice.*

There are three types of cycles:

* `repeat`: A cycle which length is set based on either a constant value or simple formulas (e.g., Gregorian years).
* `calculate`: A cycle which is determined by a mathematical operation against another cycle's value. For example, the century is basically `year / 100`.
* `sequence`: A cycle that is based on a sequences of inner lengths. For example, the length of each month in a Gregorian year is based on the month number (with Feburary being complicated).

Performance
-----------

The cycles are the primary reason why a calendar is slow. For example, calculating the year without the larger blocks is slow because it first calculates year 0, and then year 1, and then year 2, etc. Likewise, trying to figure out the minute of the day using a repeat cycle would involve 1440 loops if it is given the last minute of the day.

Using the larger count blocks is one way of reducing the calcuation frequency, but too many blocks can also slow down the system since each calculation starts at the beginning of the cycle lengths and tries again.
