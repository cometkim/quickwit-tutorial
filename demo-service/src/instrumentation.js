import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

registerInstrumentations({
  instrumentations: getNodeAutoInstrumentations(),
});
