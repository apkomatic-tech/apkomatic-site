import { createClient } from '@sanity/client';

// for sanity config (temp)
const config = {
	apiVersion: '2021-03-25',
	dataset: 'production',
	projectId: 'jibd5p3x',
	useCdn: false
};

export const sanityClient = createClient(config);
