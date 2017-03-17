import Sequelize from 'sequelize'

const createModel = (Conn)=>{
  const Post = Conn.define('post',{
    id : {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content:{
      type: Sequelize.TEXT,
      allowNull: false,
    },
    photos:{
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
    },
    likes : {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    },
  },{
    updatedAt: 'updated',
    createdAt: 'created',
    timestamps: true,
    // indexes: [
    //   {
    //     name: 'public_by_author',
    //     fields: ['author', 'status'],
    //     where: {
    //       status: 0,
    //     },
    //   },
    // ],
  })

  return Post
}

export default createModel
