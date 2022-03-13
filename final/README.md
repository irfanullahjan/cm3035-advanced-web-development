# Advanced Web Development - Final Project

## Introduction

This report explains the course work project and discusses the tools and techniques used and how to get the application running.

## Tools

The backend is built with **Django**, a backend focused web framework written in Python. Django has advanced set of tools for designing backend APIs including routing, Models, ORM, Database auto migrations and more. I used Django Rest Framework for API endpoints.

In order for the chat functionality to work, a **Redis** server must be running on localhost at port 6379. This may be configured at `/backend/settings.py`.

Even though Django supports frontend views as well through its powerful templating mechanism, I opted for **Next.js** as the frontend framework because it enables us to develop highly interactive single page applications.

Next.js is built on top of other powerful JavaScript technologies including React.js, Express.js and Webpack. This enables it to perform server-side rendering of React.js components and pages, file and directory-based routing, code-splitting as well built-in support for REST API even though we haven’t used this last feature.

As mentioned above, Next.js is based **React.js** which is an open-source frontend framework built by Facebook and it provides an ingenious way to mix up frontend layout structures along with the related JavaScript logic into components using a special syntax called JSX. You can think of it like HTML that is written inside JavaScript files. These React.js components help keep the frontend code cleanly organized because all the relevant logic resides directly along with the relevant UI markup.

## Directory and code structure

The application code is organized as a monorepo i.e. a single Git repository constaining both frontend and backend applications.

| Module  | Directory   |
|---------|-------------|
| Django  | `/backend`  |
| Next.js | `/frontend` |

The Django project itself further contains separate sites for:

- A REST API application located at `/backend/app`. This contains API routes `/app/api/*` handling most of the application logic.
- A chat Websocket application handing realtime communication between users. This is located at `/backend/chat`.
- The Django project as whole is defined and configured at `/backend/backend`

The frontend Next.js application is a Node.js application so its scripts and dependencies are listed at `/frontned/package.json` and application configurations such as how frontend requests to backend API are rerouted to backend are located in Next.js configuration file at `/frontend/next.config.js`.

## How to run the application?

To run the whole application, we need to separately run Django backend, a Redis server and the Next.js frontend.

### Django

In development we can use the development server built into Django. But first we need to ensure Python 3 is installed and working. To check, please run the following in your terminal:

```bash
python3 --version
```

It is also recommended to use Python virtual environment to install the Django dependencies. Please follow [https://docs.python.org/3/library/venv.html](https://docs.python.org/3/library/venv.html).

Navigate to `/final/backend` and install Django dependencies:

```bash
pip3 install -r requirements.txt
```

Run the Django development server:

```bash
python3 manage.py runserver
```

Run a Redis server at port 6379 on localhost. If you have Docker installed, you can run Redis via Docker via the following command in terminal:

```bash
docker run -p 6379:6379 redis
```

To run redis locally without Docker, please follow [this guide](https://redis.io/topics/quickstart).

### Next.js

Now that we have the backend running, we can turn our attention to the frontend app. Please keep the Django application running and open a new terminal instance and navigate to `/final/frontend`

To be able to run the frontend, we need have Node.js installed. To check, please run

```bash
node -v
```

If not installed, please install it from here [from here](https://nodejs.org/en/download/).

Restart the terminal, navigate to `/final/frontend` and then run:

```bash
npm i
```

This will install the Node.js packages needed to run the frontend application. Now we can run the frontend development server:

```bash
npm run dev
```

## Tests

I opted to perform integration testing rather than 

