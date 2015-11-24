Copyrights
==========

One of the natures of fictional worlds is that the names are things are frequently copyrighted. This includes names of months, weeks, or even cultures. This makes it difficult to legally create a parser or formatter that uses those copyrighted terms.

To avoid difficulties, don't create formats that require lookup codes unless there is some explicit license or general proof that it is acceptable (such as a Wikipedia page describing the calendar). If one is available, include it in the `rights` block inside each of the associated files.

    {
        "rights": {
            "license": "CC BY-NC-SA 4.0",
			"proofUrl": "https://github.com/dmoonfire/fedran/blob/master/LICENSE.markdown"
        }
    }

The `rights` block can be added to any top-level file (culture, calendar).

Removing Entries
----------------

If an entry needs to be removed, please create an issue in the [Github repository](https://github.com/dmoonfire/mfgames-culture-data/issues). This will ensure transparency in the process.
