# TALES OF MURWELGRAVE

A Discord based role playing game.

## Instructions

The bot will need a config file. Within it, you must provide the following variables:

-   `ARENA` -> The id of the channel where players can battle 1v1.
-   `BOSSES` -> A list of boss names.
-   `DAMAGE_CONTROL` -> An integer used to calculate the total damage output in a battle.
-   `DATABASE_DIR` -> The directory where you want to store the database.
-   `EVENTS_CHANNEL` -> The id of the channel where you want to print game events.
-   `GAME_CATEGORY` -> The main category where you are storing all the game related channels.
-   `GAME_ROLES` -> The list of roles who are allowed to play.
-   `LEVEL_CONTROL` -> An integer user to calculate level ups.
-   `PREFIX` -> A string used to identify a command.
-   `TOKEN` -> The Discord bot token.

It also assumes these files exist within the database:

-   `ranks.json` -> the name of a role with it's corresponding upgrade. Eg. {"role1": "role2"}
-   `raffle.json` -> A string array filled with random words of your choice.
-   `areas` -> A folder containing json files with arrays of Monster type objects. The names of the file must coincide with existing channels.

## Commands

### ping

A simple command to test if the bot is online. Only for moderators.

### help

Lists all the available commands the user has access to. If provided with the name of an existing command, it will return more details.

### stats

Returns the stats of the user who issued the command.

### challenge

Opens a new duel between the user that issued the command and the tagged user.

### accept

Accepts an open duel that the user that issued the command is part of.

### attack

Engages a currently active monster.

### reset

Resets a tagged user's stats. Only for moderators.
