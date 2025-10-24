// sanity/lib/client.ts  <- Note the path
import { createClient } from 'next-sanity';

const projectId = 'wmanqp1c'; // <-- PASTE YOUR PROJECT ID HERE
const dataset = 'production';       // Default dataset name
const apiVersion = '2023-05-03';    // Use a recent API version date

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // `false` for fresh data on every request (development)
                // `true` for cached data (production, faster)
});