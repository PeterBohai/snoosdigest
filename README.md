# Snoos Digest

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

Snoos Digest is a web application that provides users with only the top posts from select subreddits on Reddit.
Similar to how one scans the news headlines of the day or week, Snoos Digest will save you from scrolling through endless content.

### Built With

These are the main frameworks, libraries, and tools used in this project.

-   [React.js](https://reactjs.org/)
    -   [MUI](https://mui.com/)
-   [Django](https://www.djangoproject.com/)
    -   [Django REST Framework](https://www.django-rest-framework.org/)
-   [PostgreSQL](https://www.postgresql.org/)

Snoos Digest also relies on [Amazon Web Service](https://aws.amazon.com/)'s (AWS) serverless service [Lambda](https://aws.amazon.com/lambda/) for background updates.
The repository for these processes are available at [PeterBohai/snoosdigest-updater](https://github.com/PeterBohai/snoosdigest-updater)

## Contributing

If you experience any bugs or see anything that can be improved or added, please feel free to [open an issue](https://github.com/PeterBohai/snoosdigest/issues) or create a [pull request](https://github.com/PeterBohai/snoosdigest/pulls).
