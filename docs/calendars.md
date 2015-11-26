Calendars
=========

A *calendar* describes a temporal measurement system. This is based on [Julian Day Number (JDN)](https://en.wikipedia.org/wiki/Julian_day) both in many inputs and conversions. A calendar can be a measure of days, partial days (hours and minutes), or both.

Like most files, the key parts of the JSON file are the `id`, `version`, and `type`.

    {
        "version": 0,
        "type": "calendar",
        "id": "source/id",
        "description": "A short sentence to describe the item.",
        "keywords": ["source", "nonfiction", "fantasy"]
    }

Both `description` and `keywords` are optional.

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

Cycles Relationships
--------------------

Each cycle can contain more *child cycles*. A *parent cycle* is all of the cycles that contain a given cycle.

    {
        "cycles": [
            {
                "id": "year",
                "cycles": [
                    {
                        "id": "yearMonth",
                        "cycles": [
                            {
                                "id": "monthDay"
                            }
                        ]
                    }
                ]
            }
        ]
    }

Using the above example, the *root cycle* is `year`. It has one child cycle (`yearMonth`) which has a child cycle of (`monthDay`). The parent cycles of `monthDay` is both `yearMonth` and `year`, which means the value of those cycles are availble for `monthDay` calculations.

Because the `cycles` property is defined as a sequence, the order of calculations is always done from the beginning of the sequence to the end.

Cycle Types
-----------

There are three types of cycles. Each one has a different way of calculating the length of the cycle.

* `repeat`: A cycle which length is set based on either a constant value or simple formulas (e.g., Gregorian years).
* `calculate`: A cycle which is determined by a mathematical operation against another cycle's value. For example, the century is basically `year / 100`.
* `sequence`: A cycle that is based on a sequences of inner lengths. For example, the length of each month in a Gregorian year is based on the month number (with Feburary being complicated).

In all three cases, a cycle will reduce the JDN it uses to calculate itself before passing it into any child cycles.

### Repeat Cycles

Repeat is probably the most common type of cycle. It represents a cycle that has a length based on the cycle itself or one of its parent cycles.

Examples of this would be the length of a Gregorian year (which has different numbers if the year is evenly divisible by 400, 100, 4, or 1) or Feburary (which has the same calculations, but based on the year instead of the month).

    {
        "id": "year",
        "type": "repeat",
        "lengths": [
            {
                "count": 400,
                "julian": 146097
            },
            {
                "count": 1,
                "julian": 366,
                "operation": "mod",
                "ref": "year",
                "value": 400
            },
            {
                "count": 1,
                "julian": 365,
                "operation": "mod",
                "ref": "year",
                "value": 100
            },
            {
                "count": 1,
                "julian": 366,
                "operation": "mod",
                "ref": "year",
                "value": 4
            },
            {
                "count": 1,
                "julian": 365
            }
        ]
    }

While calculating repeat cycles, the *cycle index* is set to zero and then the system loops through the lengths until it finds a valid one that is less than or equal to the remaining JDN. Once it finds that, the cycle index is incremented by the `count` property and the `julian` value from the length is subtracted from the JDN before it starts again at the first length.

The `julian` attribute can be a decimal value (`2.34`) or it can be a string version (`'2.34'`). In JSON, a number is only a single precision float which means calculations with large numbers dealin with small values (such as seconds or milliseconds in the Gregorian calendar) get "rounded out". In this library, both the string and single precision values are converted into "big decimals" (arbitrary precision decimals) to ensure even the smallest values are not rounded out.

Working from the bottom, the basic year length is 365 days and increments the cycle index by one and decrements the working JDN by 365. If this was the only length in this cycle, every year would be exactly 365 days.

The one above it (with `value: 4`) queries the *current cycle index* and determines if it is evenly divisible by four. If it is, then it uses a length of 366 days.

The two above that are the same idea but with different values.

Ignoring the top-most length, logic would work like this.

1. Set year to 0.
2. Start at length[1], `0 / 400 === 0`, so `year += 1` and `jdn -= 365`.
3. Start at length[1], `1 / 400 !== 0`, so skip it.
4. Move to length[2], `1 / 100 !== 0`, so skip it.
5. Move to length[3], `1 / 4 !== 0`, so skip it.
6. Length has no condition, so `year += 1` and `jdn -= 365`.
7. Start at length[1] again with `year` being 1.

If we continued to loop through, say to year 4, we get this.

1. Start at length[1], `0 / 400 === 0`, so `year += 1` and `jdn -= 365`.
2. Start at length[1], `1 / 400 !== 0`, so skip it.
3. Move to length[2], `1 / 100 !== 0`, so skip it.
4. Move to length[3], `1 / 4 === 0`, so `year += 1` and `jdn -= 366`.
5. Start at length[1] again with `year` being 5.

The first item is a shortcut calculations. Without it, calculation the year 2015 would require looping through the lengths at least 2015 times with four length calculations for each year. With the first one, we know that 400 years has a set number of days without any calculations, so we can jump 400 years at a time while subtracting the appropriate number of JDN until we get to less than 400 years worth of JDN remaining. Then, we loop through the resulting years until we find the right one. This effectively reduces the cycles by 2000 loops.

When no length can apply to the remaining JDN, then *that modified JDN* is passed into the child cycles to calculate their values. So, calculating 2015-01-02 (second day of the year) will calculate the year (2015) and then pass the remaining value (JDN 1) to the child cycles.

Calculate Cycles
----------------

A calculate cycle takes a parent identiifer (or a previously calculated one) and performs some operation to determine the value.

    {
        "id": "year",
        "cycles": [
            {
                "id": "century",
                "type": "calculate",
                "operation": "div",
                "ref": "year",
                "value": 100
            }
        ]
    }

In the above example, `century` is calculated by taking the calculated `year` value and performing an integer division by 100. This will result in 20 for a year of 2015.

There are two operations available, both are integer operatons:

* div: Good for figuring out the number of decades or centuries.
* mod: Good for figuring out the year within a century (two-digit years).

This does not modify the JDN value which is passed unchanged into any child cycles.

Sequence Cycles
---------------

A sequence cycle is one that loops through the `lengths` inside the cycle, reducing the JDN for each element until one is found. The resulting cycle index is the index within the lengths.

    {
        "id": "year",
        "cycles": [
            "id": "yearMonth",
            "lengths": [
                {
                    "count": 1,
                    "julian": 31
                },
                {
                    "count": 1,
                    "single": [
                        {
                            "julian": 29,
                            "operation": "mod",
                            "ref": "year",
                            "value": 400
                        },
                        {
                            "julian": 28,
                            "operation": "mod",
                            "ref": "year",
                            "value": 100
                        },
                        {
                            "julian": 29,
                            "operation": "mod",
                            "ref": "year",
                            "value": 4
                        },
                        {
                            "julian": 28
                        }
                    ]
                },
                {
                    "count": 1,
                    "julian": 31
                },
            ]
        }
    }

In the above example, if the resulting `year` calculation passes in less than 31, the `yearMonth` will be zero because it "fits" within the first element. If 31 is passed (the first day of Feburary), `yearMonth` will be one and the JDN will be reduced by 31.

If the amount exceeds the length of the second (Feburary) month, which is calculated, then the index will be incremented by the `count` and the JDN reduced by the `julian` or calculated value.

Feburary (lengths[1]) uses `single` to calculate the length in the same manner as the `repeat` cycles calculations.

Performance
-----------

The cycles are the primary reason why a calendar is slow. For example, calculating the year without the larger blocks is slow because it first calculates year 0, and then year 1, and then year 2, etc. Likewise, trying to figure out the minute of the day using a repeat cycle would involve 1440 loops if it is given the last minute of the day.

Using the larger count blocks is one way of reducing the calcuation frequency, but too many blocks can also slow down the system since each calculation starts at the beginning of the cycle lengths and tries again.

In addition, having a large cycle that consumes a large number of Julian Days is more performant. So, it is better to calculate a century at a time than calculate year by year.
