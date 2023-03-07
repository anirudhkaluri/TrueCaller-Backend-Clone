module.exports=(sequelize,DataTypes)=>{
    const SpamNumber=sequelize.define("SpamNumber",{
        user_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:"Users",
                key:"user_id"
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
        }
    });
    return SpamNumber;
}