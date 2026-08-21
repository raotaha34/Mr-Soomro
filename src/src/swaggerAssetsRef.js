// Vercel bundles serverless functions with a static file tracer, which cannot
// see swagger-ui-express serving swagger-ui-dist assets dynamically at runtime.
// Referencing each asset statically here forces the tracer to include them,
// so /api-docs assets resolve in the deployed function.
import { createRequire } from "module";

const require = createRequire(import.meta.url);

require.resolve("swagger-ui-dist/swagger-ui-bundle.js");
require.resolve("swagger-ui-dist/swagger-ui-standalone-preset.js");
require.resolve("swagger-ui-dist/swagger-ui.css");
require.resolve("swagger-ui-dist/favicon-32x32.png");
require.resolve("swagger-ui-dist/favicon-16x16.png");
require.resolve("swagger-ui-dist/index.css");

export {};
