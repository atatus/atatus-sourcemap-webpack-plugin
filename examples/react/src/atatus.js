import atatus from 'atatus-js';

atatus.config(__ATATUS_API_KEY__, {
    version: __GIT_REVISION__,
    tags: [ process.env.NODE_ENV ]
}).install();

export default atatus;
