import {
  GraphQLObjectType, GraphQLString,
} from 'graphql'

const UploadedFile = new GraphQLObjectType({
  name: 'UploadedFile',
  fields: {
    originalname: { type: GraphQLString },
    mimetype: { type: GraphQLString },
  },
})

export default UploadedFile
