import React from 'react'
import { Query } from 'react-apollo'
import { gql } from "apollo-boost";
import { ROOT_QUERY } from './App'

const ALL_PHOTOS_QUERY = gql`
  query allPhotos {
    allPhotos {
      id
      url
      name
    }
  }
`

const Photos = () =>
  <Query query={ALL_PHOTOS_QUERY}>
    {({loading, data}) => loading ?
      <p>loading...</p> :
      data.allPhotos.map(photo =>
        <img
          key={photo.id}
          src={photo.url}
          alt={photo.name}
          width={350} />
      )
    }
  </Query>

export default Photos
