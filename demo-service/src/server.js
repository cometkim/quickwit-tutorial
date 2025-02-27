import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { useOpenTelemetry } from '@envelop/opentelemetry';
import { Resource } from '@opentelemetry/resources';
import * as SemanticConventions from '@opentelemetry/semantic-conventions';
import { NodeTracerProvider, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import * as Logtape from '@logtape/logtape';
import { getOpenTelemetrySink } from '@logtape/otel';

import { schema } from './schema.js';

// OTel resource definition
const serviceResource = new Resource({
  [SemanticConventions.ATTR_SERVICE_NAME]: process.env.OTLP_SERVICE_NAME || 'demo-service',
});

// OTel logger config
const loggerProvider = new LoggerProvider({ resource: serviceResource });
const logExporter = new OTLPLogExporter();
loggerProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(logExporter));

// OTel tracer config
const traceExporter = new OTLPTraceExporter();
const traceProvider = new NodeTracerProvider({
  resource: serviceResource,
  spanProcessors: [
    new SimpleSpanProcessor(traceExporter),
  ],
});
traceProvider.register();

await Logtape.configure({
  sinks: {
    console: Logtape.getConsoleSink(),
    otel: getOpenTelemetrySink({
      loggerProvider,
      // Quickwit only allows object type for body
      // See https://github.com/quickwit-oss/quickwit/issues/5343
      messageType: (messages) => ({ message: messages.join('') }),
    }),
  },
  loggers: [
    { category: [], level: 'debug', sinks: ['console'] },
    { category: [], level: 'info', sinks: ['otel'] },
  ],
});

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
const logger = Logtape.getLogger();

server.listen(4000, () => {
  logger.info`Server is running on 4000`;
});
