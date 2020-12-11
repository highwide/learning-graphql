import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { PostPhotoMutation } from './generated/graphql';
import { ALL_PHOTOS_QUERY } from './Photos';

const POST_PHOTO_MUTATION = gql`
  mutation postPhoto($input: PostPhotoInput!){
    postPhoto(input:$input) {
      id
      name
      url
    }
  }
`

const updatePhotos = (cache, { data: { postPhoto } }) => {
  const data = cache.readQuery({ query: ALL_PHOTOS_QUERY })
  data.allPhotos = [
    postPhoto,
    ...data.allPhotos
  ]
  cache.writeQuery({ query: ALL_PHOTOS_QUERY, data })
}

export const PostPhoto: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState('PORTRAIT');
  const [file, setFile] = useState<File | string>("");

  const history = useHistory();

  const postPhoto = (_mutation) => {
    console.log('todo: post photo')
    console.log(`${{ name }} / ${{ description }} / ${{ category }} / ${{ file }}`)
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <h1>Post a Photo</h1>
      <input
        type="text"
        style={{ margin: "10px" }}
        placeholder="photo name..."
        value={name}
        onChange={({ target }) => setName(target.value)}
      />
      <textarea
        style={{ margin: "10px" }}
        placeholder="photo description..."
        value={description}
        onChange={({ target }) =>
          setDescription(target.value)
        }
      />
      <select
        value={category}
        style={{ margin: "10px" }}
        onChange={({ target }) => setCategory(target.value)}
      >
        <option value="PORTRAIT">PORTRAIT</option>
        <option value="LANDSCAPE">LANDSCAPE</option>
        <option value="ACTION">ACTION</option>
        <option value="GRAPHIC">GRAPHIC</option>
      </select>
      <input
        type="file"
        style={{ margin: "10px" }}
        accept="image/jpeg"
        onChange={({ target }) =>
          setFile(target.files && target.files.length ? target.files[0] : "")
        }
      />
      <div style={{ margin: '10px' }}>
        <Mutation<PostPhotoMutation> mutation={POST_PHOTO_MUTATION} update={updatePhotos}>
          {mutation => <button onClick={() => postPhoto(mutation)}>Post Photo</button>}

        </Mutation>
        <button onClick={() => history.goBack()}>Cancel</button>
      </div>
    </form >
  );
}
