const fs = require( "fs" ),
    path = require( "path" ),
    faker = require( "faker" ),
    utf8 = "utf-8";

let db = fs.readFileSync( path.resolve( "api/db.json" ), utf8 );

db = JSON.parse( db );


function fakeEmails() {

    var emails = [],
        length = faker.random.number( 25 );

    for ( let i = 0; i < length; i++ ) {

        emails.push( faker.internet.email() );

    }

    return emails;

}

function fakeSearchTerms() {

    var terms = [],
        length = faker.random.number( 50 );

    for ( let i = 0; i < length; i++ ) {

        terms.push( faker.random.words( faker.random.number( 4 ) + 1 ) );

    }

    return terms;

}


db.emails = fakeEmails();
db.terms = fakeSearchTerms();


fs.writeFileSync( path.resolve( "api/db.json" ), JSON.stringify( db ), utf8 );