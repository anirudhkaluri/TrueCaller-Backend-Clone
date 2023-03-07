const bcrypt=require('bcrypt');
module.exports=(sequelize,DataTypes)=>{
    const Credential=sequelize.define("Credential",{
        user_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:"Users",
                key:"user_id"
            }
        },
        password:{
            type:DataTypes.STRING(60),
            allowNull:false,
            set(value){
                const salt=bcrypt.genSaltSync(10);
                const hash=bcrypt.hashSync(value,salt);
                this.setDataValue('password',hash);
            }
        }
    });
    return Credential;
}