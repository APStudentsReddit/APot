# APot
No, it's not a pot. It's APot. A Discord bot custom made for the AP Students Discord server.

## Prerequisites
* [Node.js](https://nodejs.org/en/download/current/)
* [SQLite Browser](https://sqlitebrowser.org/) (optional [so you can see your data])
* [yarn](https://yarnpkg.com/en/docs/install)

## Installation
With both Node.js and Redis installed, run the following:
```bash
$ yarn install
```

## Running
```bash
$ TOKEN="ENTERYOURTOKENHERE" node Bot.js
```
Make sure that the Redis server is running before issuing this command.

It is wise to use a process manager such as pm2/nodemon to make sure the bot doesn't go down when you step away from the terminal.

## Usage
* Set up role aliases by doing: `>createra --role="role name" --alias="alias"`
* To delete a role alias, run: `>deletera --role="role name" --alias="alias"`
* List all role role aliases for a single role by doing: `>ls Role Name`
* To mention a role, run: `>rhelper role alias`
* To blacklist or to unblacklist someone, run: `>blacklist member`

## License
MIT