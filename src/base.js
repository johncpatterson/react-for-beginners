import Rebase from 're-base';

const base = Rebase.createClass({
    apiKey: process.env.KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
});

export default base;