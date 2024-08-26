import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { useOpenTelemetry } from '@envelop/opentelemetry';
import { Resource } from '@opentelemetry/resources';
import * as SemanticConvention from '@opentelemetry/semantic-conventions';
import { NodeTracerProvider, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import * as Logtape from '@logtape/logtape';
import { getOpenTelemetrySink } from '@logtape/otel';

import { schema } from './schema.js';

const serviceName = 'demo-service';
const serviceResource = new Resource({
  [SemanticConvention.ATTR_SERVICE_NAME]: serviceName,
});

const loggerProvider = new LoggerProvider({
  resource: serviceResource,
});
const logExporter = new OTLPLogExporter();
loggerProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(logExporter));

await Logtape.configure({
  sinks: {
    console: Logtape.getConsoleSink(),
    otel: getOpenTelemetrySink({
      loggerProvider,
      diagnostics: true,
    }),
  },
  filters: {},
  loggers: [
    { category: [], level: 'debug', sinks: ['console', 'otel'] },
  ],
});

const traceProvider = new NodeTracerProvider({
  resource: serviceResource,
});
const traceExporter = new OTLPTraceExporter();
traceProvider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));
traceProvider.register();

registerInstrumentations({
  instrumentations: getNodeAutoInstrumentations(),
});

const logger = Logtape.getLogger();

const yoga = createYoga({
  schema,
  plugins: [
    useOpenTelemetry(
      {
        resolvers: true,
        variables: true,
        results: true,
      },
      traceProvider,
    ),
  ],
});

const server = createServer(yoga);

server.listen(4000, () => {
  logger.info('Server is running on :4000');
});
