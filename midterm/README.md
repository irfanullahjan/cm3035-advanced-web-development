# Advanced Web Development Midterm

## How to run the application?

Python verson 3 is required to run this project. I tested it using Python version 3.9.6 so in case of any issue, please ensure Python version is up to date. I also used Python vitual environments to isolate the packages that the application relied on.

In order to run the application, please perform the following actions and commands in your OS terminal in the given order:

1. Highly recommended but not required: Create a Python virtual environment by running command `python -m venv <my_env>` and then activate the virtual environment by running `my_env/Scripts/activate`.
1. Install the required packages by running `pip install -r /path/to/requirements.txt`
1. Navigate to directory `/midterm` and then run `python manage.py runserver`

The app should now be running at default host of `localhost` with IP address of `127.0.0.1` and Port `8000`. To app may now be accessed using a browser or a REST client at the following address: [http://127.0.0.1:8000](http://127.0.0.1:8000).

In order to run the app at a different address and port, please run the following command:

`python manage.py runserver localhost:8080`

Or to only change the port:

`python manage.py runserver 8080`

The links in this guide assume port `8000` at `localhost` has been used.

### Admin

To login to Django admin, please go to [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin) and login using username: `admin` and password: `admin`.

## How to import data?

All the migrations have been run and seed data preloaded in the included `db.sqlite3` file. However, if anything goes wrong, the data maybe reimported by taking the following steps:

1. Delete the file `db.sqlite3`.
1. Run `python manage.py makemigrations proteins`
1. Run `python manage.py migrate`
1. Run `cd scripts`
1. Run `python populate-proteins-db.py`

## Models

I imported the provided data into the following models/tables:

1. Organism
1. Pfam
1. Domain
1. Protein
1. ProteinDomainMapping (exists solely to map domains to proteins)

In order to ensure the data is normalized and miniminal redundant data is present in the tables, I separated out the organisms data into their own model: `Organism`. Since each `Protein` belongs to an organism, it uses a foreign key `taxonomy` to reference `Organsim` model. I noted that `length` property of `Protein` is computable doesn't need to be saved in the database table.

I also separated out the `Domain` and `ProteinDomainMapping` tables because this way, the mapping table didn't have extra columns which would be tricky to include with the relations. Keeping the mapping table separate from the Domain data made the process really simple with Django rest framework doing the include resolution for us.

I prefered to explicitly declare the primary keys for most of my tables because the IDs in Protein, Organism and Pfam table are already unique.

I felt that domain `description` should belong to `Pfam` model and not `Domain` because it changes with Pfam ID and doesn't change with each Domain instance. However, I kept it with `Domain` just to conform with the coursework requirements. The data in `Domain` table is not therefore normalized.

## REST endpoints

I implemented the following REST endpoints

```
POST http://127.0.0.1:8000/api/protein/
GET  http://127.0.0.1:8000/api/protein/{protein_id}
GET  http://127.0.0.1:8000/api/pfam/{pfam_id}
GET  http://127.0.0.1:8000/api/proteins/{taxa_id}
GET  http://127.0.0.1:8000/api/pfams/{taxa_id}
GET  http://127.0.0.1:8000/api/coverage/{protein_id}
```

I used Django Rest Framework to create the above endpoints. Since the endpoints above are simple I didn't want to reinvent the wheel and I was able to achieve the required functionality using the generic API views that Django Rest Framework provides. In the following lines I briefly describe any notable features of my endpoints implementations:

In `POST /api/protein/`, I create new proteins and accept basic properties such as `protein_id`, `sequence` and `taxonomy`. I don't create nested objects because I wanted to keep the API RESTful.

In `GET /api/protien/{protein_id}`, I use generic `RetrieveAPIView` and in `ProteinRetreiveSerializer`, I compute the protein length using `len()` which I have overriden in `Protien` model and it simply calculates the number of characters in the protein `sequence` property. Also I used `DomainSerializer` to inline domains into protein and also use `depth = 1` in `Meta` which inlines `taxonomy`.

Again, as I stated above, `protein.domains[].description` field is not normalized but only because I wanted to follow the coursework requirements. Ideally, this description will be better placed in `Pfam` table, even though we will end up with two description fields in `Pfam` table.

## Tests

Tests are located in `/midterm/proteins/model_factories.py` and `/midterm/proteins/tests.py`.

To run these tests, navigated to `/midterm` in the OS terminal, and then run the following command:

```bash
python manage.py test
```
