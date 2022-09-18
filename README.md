<h1 align="center">
  SnoosDigest
</h1>

[![Main](https://github.com/PeterBohai/snoosdigest/actions/workflows/lint.yml/badge.svg)](https://github.com/PeterBohai/snoosdigest/actions/workflows/lint.yml)
<a href="https://github.com/PeterBohai/snoosdigest/blob/main/requirements.txt">
<img alt="python" src="https://img.shields.io/badge/python-v3.9.6-blue"></a>
<a href="https://github.com/PeterBohai/snoosdigest/blob/main/requirements.txt">
<img alt="Django" src="https://img.shields.io/badge/Django-v4.0.3-success"></a>
<a href="https://github.com/PeterBohai/snoosdigest/blob/main/frontend/package.json">
<img alt="React.js" src="https://img.shields.io/badge/React.js-^18.0.0-61dafb"></a>
<a href="https://www.postgresql.org/">
<img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white"></a>
<br/>
<a href="https://www.linkedin.com/in/peterbohai">
<img alt="LinedIn" src="https://img.shields.io/badge/LinkedIn-0077B5?logo=linkedin&logoColor=white"></a>

[SnoosDigest](https://www.snoosdigest.com) is a web application that provides users with only the top posts from select subreddits on Reddit.
Similar to how one scans the news headlines of the day or week, SnoosDigest will save you from scrolling through endless content.

The site is hosted at: https://www.snoosdigest.com

## Built With

These are the main frameworks, libraries, and tools used in this project.

-   [React.js](https://reactjs.org/)
    -   [MUI](https://mui.com/)
-   [Django](https://www.djangoproject.com/)
    -   [Django REST Framework](https://www.django-rest-framework.org/)
-   [PostgreSQL](https://www.postgresql.org/)

SnoosDigest also relies on [Amazon Web Service](https://aws.amazon.com/)'s (AWS) serverless service [Lambda](https://aws.amazon.com/lambda/) for background updates.
The repository for these processes are available at [PeterBohai/snoosdigest-updater](https://github.com/PeterBohai/snoosdigest-updater)

## Deployment

SnoosDigest is currently deployed on [Heroku](https://www.heroku.com/), but it can easily be hosted anywhere else.

**Heroku**

-   Currently, both production and dev environment is deployed on Heroku
-   Due to discontinuation of the free-tier Heroku service on November 28th, 2022, the dev environment will migrate to [Render](https://render.com/) after
-   The Heroku-specific deployment files include
    -   `Procfile`
    -   `runtime.txt`
    -   `package.json` (Heroku needs a package.json in the root directory)
-   Two Heroku Buildpacks are used for deployment - `nodejs` and `python`

**Render**

-   A Heroku alternative for the dev environment
-   The Render-specific deployment files include
    -   `render.yaml`
    -   `build.sh`
-   The `Python` [Native Environment](https://render.com/docs/native-environments) is used for deployment
    -   All Native Environments contains `node` during build and deploy. See [Included Tools and Utilities](https://render.com/docs/native-environments#included-tools-and-utilities)

## Running Locally

Support for running with Docker will be coming soon.

### Clone the repo

```shell
git clone https://github.com/PeterBohai/snoosdigest.git
```

### Create .env

Copy the contents from `.env.example` to a new `.env` file and update the values to hold the appropriate values and credentials.

You can run a PostgreSQL instance locally or from an online managed service. Some options include

-   [Amazon RDS](https://aws.amazon.com/rds/) (in AWS)
-   Render's [Managed PostgreSQL](https://render.com/docs/databases) service
-   An instance on [ElephantSQL](https://www.elephantsql.com/)

For Reddit API credentials, follow the instructions from the docs to create your own

-   [Reddit OAuth2 - Getting Started](https://github.com/reddit-archive/reddit/wiki/OAuth2#getting-started)
-   [Reddit API Rules](https://github.com/reddit-archive/reddit/wiki/API)

### Install packages

The Python and npm packages needs to be installed

```shell
pip3 install -r dev-requirements.txt
```

```shell
cd frontend/
npm install --legacy-peer-deps
```

### Set up pre-commit

[pre-commit](https://pre-commit.com/) allows us to easily configure and run git hooks for things such as static analysis and code formatting before each `git commit`.

The pre-commit package should already be installed in the previous step. To set up and install the git hooks scripts defined in `.pre-commit-config.yaml` run the following (only for the initial set up)

```shell
pre-commit install
```

For more information om pre-commit, please refer to the docs linked above.

### Run the backend and frontend

First, run the Django backend using the local settings

```shell
python manage.py runserver --settings=snoosdigest.settings.local
```

In a second terminal window, run the React frontend

```shell
cd frontend/
npm start
```

## Contributing

If you experience any bugs or see anything that can be improved or added, please feel free to [open an issue](https://github.com/PeterBohai/snoosdigest/issues) or create a [pull request](https://github.com/PeterBohai/snoosdigest/pulls).

You can also email in at [support@snoosidgest.com](mailto:support@snoosidgest.com)
