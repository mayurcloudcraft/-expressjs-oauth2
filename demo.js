const {sequelize} = require('./models');
const user = sequelize.models.User;

console.log('Demo');

user.findOne().then((firstUser)=>{
    console.log(firstUser.hello());
});

