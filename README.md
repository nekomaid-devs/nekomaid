# Nekomaid

## Description
This is a multi-purpose Discord bot written in Typescript.

## Stack
Libraries: <a href="https://github.com/timotejroiko/discord.js-light">discord.js-light</a>  
Databases: <a href="https://www.mysql.com/">MySQL</a>  
Other: <a href="https://www.docker.com/">Docker<a>  

## Docker Hint
Building is done with <code>docker-compose build</code>.  
Running is done with <code>docker-compose up</code>.  
Shutting down is with <code>docker-compose down</code>.
> 1) Copy <code>.docker/extra/root.json</code> into <code>configs/root.json</code> and modify it  
> 2) Import the database schema from <code>.docker/extra/schema.sql</code>  
> 3) And most importantly don't expose the MySQL port in production  

## CLI Commands
| Command                                 | Description                                    |
| --------------------------------------- | ---------------------------------------------- |
| `yarn build`                            | Builds a production version.                   |
| `yarn dev`                              | Builds and hosts a developer version.          |
| `yarn serve`                            | Hosts the production version, if built.        |
| `yarn pretty`                           | Formats the codebase using Prettify.           |
| `yarn lint`                             | Runs ESlint linter on the codebase.            |
| `yarn linty`                            | Automatically lints the codebase using ESlint. |
| `yarn typecheck`                        | Runs Typescript checker on the codebase.       |
            
## Contributing
If you want a feature added or you found a bug, make a new <a href="https://github.com/nekomaid-devs/nekomaid/issues">Issue</a>.  
If you want to contribute, make a new <a href="https://github.com/nekomaid-devs/nekomaid/pulls">Pull Request</a>.  
There are no guidelines or any of the sort and contributing is highly encougaraged!

## License
Nekomaid is licensed under the [GNU General Public License v3.0](https://github.com/nekomaid-devs/nekomaid/blob/master/LICENSE).
