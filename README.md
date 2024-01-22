# Chronos Vue.js frontend

A frontend in Vue.js for the Chronos documentation server.

## Configuration

The configuration is done in the `config/config.ts` file. The following options are available:

```typescript
class ChronosConfig {
  public static readonly title = "Chronos Documentation";
  public static readonly logoTitle = "Documentation";
  public static readonly logoUrl = "/logo.svg";
  public static readonly description = "A frontend in Vue.js for the Chronos documentation server.";
  public static readonly baseUrl = "http://localhost:5173";
  public static readonly chronosApiUrl = "http://localhost:8080";
  public static readonly extraLinks = [
    {
      url: "https://github.com/vanilla-os/Chronos",
      name: "Source Code",
    },
  ];
}
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
