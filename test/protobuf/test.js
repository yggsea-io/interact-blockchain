const protobuf = require('protobufjs');

run().catch(err => console.log(err));

async function run() {
    const root = await protobuf.load('user.proto');
    const User = root.lookupType('userpackage.User');
    console.log(User.verify({ name: 'test', age: 2 })); // null
    console.log(User.verify({ propertyDoesntExist: 'test' })); // null
    console.log(User.verify({ age: 'not a number' }));

    const buf = User.encode({ name: 'Bill', age: 30 }).finish();

    console.log(Buffer.isBuffer(buf)); // true  
    console.log(buf); // true
    console.log(buf.toString('utf8')); // Gnarly string that contains "Bill"
    console.log(buf.toString('hex'));
}