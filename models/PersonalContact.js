module.exports=(sequelize,DataTypes)=>{
    const PersonalContact=sequelize.define("PersonalContact",{
        user_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:"Users",
                key:"user_id"
            }
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        phone:{
            type:DataTypes.STRING(10),
            allowNull:false,
            validate:{
                notEmpty:true,
                isNumeric:true,
                len:[10,10]
            }
        },
        email:{
            type:DataTypes.STRING,
            allowNull:true,
        }
    });
    return PersonalContact;
}