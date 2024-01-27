# Chronos Vue.js frontend

A frontend in Vue.js for the [Chronos](https://github.com/vanilla-os/chronos)
documentation server.

## Configuration

The configuration is done in the `public/chronos.json` file. The following
options are available:

```json
{
  "title": "Chronos Documentation",
  "logoTitle": "Documentation",
  "logoUrl": "/logo.svg",
  "description": "A frontend in Vue.js for the Chronos documentation server.",
  "baseUrl": "http://localhost:5173",
  "chronosCollections": [
    [
      {
        "shortName": "docs",
        "title": "Docs",
        "url": "http://localhost:8080/documentation",
        "description": "Read the technical documentation for the Awesome project."
      }
    ],
    [
      {
        "shortName": "handbook",
        "title": "Handbook",
        "url": "http://localhost:8080/handbook",
        "description": "Are you a new user? Read the handbook to learn how to use the Awesome project."
      }
    ]
  ],
  "extraLinks": [
    [
      {
        "url": "https://github.com/vanilla-os/Chronos",
        "name": "Source Code"
      }
    ]
  ]
}
```

you can also generate the configuration file using the `npm run generate-config`
command, by setting the following environment variables:

- `CHRONOS_TITLE`
- `CHRONOS_LOGO_TITLE`
- `CHRONOS_LOGO_URL`
- `CHRONOS_DESCRIPTION`
- `CHRONOS_BASE_URL`
- `CHRONOS_COLLECTION*` (where \* is a number)
- `CHRONOS_EXTRA_LINK*` (where \* is a number)

for example:

```bash
CHRONOS_TITLE='Chronos Documentation' \
CHRONOS_LOGO_TITLE='Documentation' \
CHRONOS_LOGO_URL='/logo.svg' \
CHRONOS_DESCRIPTION='A frontend in Vue.js for the Chronos documentation server.' \
CHRONOS_BASE_URL='http://localhost:5173' \
CHRONOS_COLLECTION_1='[{"shortName": "docs", "title": "Docs", "url": "http://localhost:8080/documentation", "description": "Read the technical documentation for the Awesome project."}]' \
CHRONOS_COLLECTION_2='[{"shortName": "handbook", "title": "Handbook", "url": "http://localhost:8080/handbook", "description": "Are you a new user? Read the handbook to learn how to use the Awesome project."}]' \
# add more collections here
CHRONOS_EXTRA_LINK_1='[{"url": "https://github.com/vanilla-os/Chronos", "name": "Source Code"}]' \
# add more extra links here
npm run generate-config
```

## Development

To start the development server, run the following command:

```bash
npm run dev
```

## Production

To build the production version, run the following command:

```bash
npm run build
```

### Docker

To deploy the production version using Docker, run the following command:

```bash
docker pull ghcr.io/vanilla-os/chronos-fe:main
docker run -d -p 5173:80 ghcr.io/vanilla-os/chronos-fe:main \
  -e CHRONOS_TITLE='Chronos Documentation' \
  -e CHRONOS_LOGO_TITLE='Documentation' \
  -e CHRONOS_LOGO_URL='/logo.svg' \
  -e CHRONOS_DESCRIPTION='A frontend in Vue.js for the Chronos documentation server.' \
  -e CHRONOS_BASE_URL='http://localhost:5173' \
  -e CHRONOS_COLLECTION_1='[{"shortName": "docs", "title": "Docs", "url": "http://localhost:8080/documentation", "description": "Read the technical documentation for the Awesome project."}]' \
  -e CHRONOS_COLLECTION_2='[{"shortName": "handbook", "title": "Handbook", "url": "http://localhost:8080/handbook", "description": "Are you a new user? Read the handbook to learn how to use the Awesome project."}]' \
  # add more collections here
  -e CHRONOS_EXTRA_LINK_1='[{"url": "https://github.com/vanilla-os/Chronos", "name": "Source Code"}]' \
  # add more extra links here
```
