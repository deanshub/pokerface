import Sequelize from 'sequelize'

const createModel = (Conn)=>{
  const Game = Conn.define('game',{
    id : {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title:{
      type: Sequelize.STRING,
      allowNull: true,
    },
    description:{
      type: Sequelize.TEXT,
      allowNull: true,
    },
    type:{
      type: Sequelize.STRING,
      allowNull: true,
    },
    subtype:{
      type: Sequelize.STRING,
      allowNull: true,
    },
    location:{
      type: Sequelize.STRING,
      allowNull: true,
    },
    from:{
      type: Sequelize.DATE,
      allowNull: false,
    },
    to:{
      type: Sequelize.DATE,
      allowNull: true,
    },
    invited:{
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
    },
    accepted:{
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
    },
    declined:{
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
    },
  },{
    updatedAt: 'updated',
    createdAt: 'created',
    timestamps: true,
    getterMethods: {
      unresponsive(){
        return (this.invited||[]).filter((username)=>{
          return !this.accepted.includes(username) && !this.declined.includes(username)
        })
      },
    },
  })

  return Game
}

export default createModel
