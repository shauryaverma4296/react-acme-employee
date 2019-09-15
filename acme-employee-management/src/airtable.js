import Airtable from 'airtable';

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'keySU0rQZXOmlLLHE'
});
const base = Airtable.base('app5V2OXBhs4UAEGz');
 export default base;