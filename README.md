# ❤️ ELive

ELive - A statusboard built to fit your needs

> **Note** - this project is still in early development, bugs may occur 🐛

Set up your own own personal statusboard using ELive, monitor endpoints and their responses.

## 🚀 Quickstart

To get going, start by cloning / forking this project. Once done, complete the following steps:

### Database setup

Before starting with the installation, you need to set up a database.

1. Setup your [postgres](https://www.postgresql.org/) database - there is a `docker-compose.yml` file that makes it easy to get up and running with a simple `docker-compose up -d` command.
2. Update your env variables:
   - If using the `docker-compose.yml`-file without any additional settings, you can copy the `.env.example` file to `.env` and continue. Otherwise the `DATABASE_URL` environment variable is required to be set accordingly.

### Project setup

1. Run `yarn install` to install all the necessary dependencies.
2. Push the [Prisma](https://www.prisma.io/) schema to your database using the `yarn prisma:push` command.

> Tip: you can use the `yarn prisma:seed` command to generate two example services to use during development.

3. Start the development server using `yarn dev`

🎉 Thats it - you're up and running with your brand new statusboard.

## 📚 Documentation

A full list of all the available commands can be found [here](docs)
