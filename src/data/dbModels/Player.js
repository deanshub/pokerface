import Sequelize from 'sequelize'

const createModel = (Conn)=>{
  const Player = Conn.define('player',{
    username:{
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    firstName:{
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName:{
      type: Sequelize.STRING,
      allowNull: true,
    },
    email:{
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
  },{
    getterMethods: {
      fullName(){ return `${this.firstName} ${this.lastName}` },
    },
    // indexes: [
    //   {
    //     unique: true,
    //     fields: ['username'],
    //   },
    // ],
  })

  return Player
}

export default createModel
