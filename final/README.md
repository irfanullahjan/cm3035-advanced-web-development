# Advanced Web Development - Final Project

## Introduction

This report explains the course work project and discusses the tools and techniques used and how to get the application running.

## Tools

The application is built with Django, a backend focused web framework written in Python. Django has advanced set of tools for designing backend APIs including routing, Models, ORM, Database auto migrations and more. I used Django Rest Framework for API endpoints.

Even though Django supports frontend views as well through its powerful templating mechanism, I opted for Next.js as the frontend framework because it enables us to develop highly interactive single page applications.

Next.js is built on top of other powerful JavaScript technologies including React.js, Express.js and Webpack. This enables it to perform server-side rendering of React.js components and pages, file and directory-based routing, code-splitting as well built-in support for REST API even though we haven’t used this last feature.

As mentioned above, Next.js is based React.js which is an open-source frontend framework built by Facebook and it provides an ingenious way to mix up frontend layout structures along with the related JavaScript logic into components using a special syntax called JSX. You can think of it like HTML that is written inside JavaScript files. These React.js components help keep the frontend code cleanly organized because all the relevant logic resides directly along with the relevant UI markup.

Redis

In order for the chat functionality to work, a Redis server must be running on localhost at port 6379. This may be configured at /backend/settings.py

## How to run the application?


## Tests

I opted to perform integration testing rather than 

