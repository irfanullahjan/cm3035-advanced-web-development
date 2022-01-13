# Advanced Web Development Midterm

## How to run the application?

Python verson 3 is required to run this project. We tested it using Python version 3.9.6 so in case of any issue, please ensure Python version is up to date.

In order to run the application, please perform the following actions and commands in your OS terminal in the given order:

1. Create a Python virtual environment by running command `python -m venv <my_env>`.
1. Activate the virtual environment by running `my_env/Scripts/activate`.
1. Install the required packages by running `pip install -r /path/to/requirements.txt`
1. Navigate to directory `/midterm` and then run `python manage.py runserver`

## How to import data?

All the migrations have been run and seed data preloaded in the included `db.sqlite3` file. However, if anything goes wrong, the data maybe prepared by taking the following steps:

1. Delete the file `db.sqlite3`.
1. Run `python manage.py makemigrations proteins`
1. Run `python manage.py migrate`
1. Run `cd scripts`
1. Run `python populate-proteins-db.py`

