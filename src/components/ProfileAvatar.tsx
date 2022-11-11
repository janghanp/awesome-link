import { Avatar, ActionIcon } from '@mantine/core';
import { gql, useMutation } from '@apollo/client';
import { ChangeEvent, useRef, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { IconPencil } from '@tabler/icons';

import { User } from '@prisma/client';
import { useCurrentUserState } from '../store';

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($email: String!, $image: String!, $public_id: String!) {
    updateProfile(email: $email, image: $image, public_id: $public_id) {
      id
      name
      email
      image
      role
    }
  }
`;

interface UpdateProfileData {
  updateProfile: User;
}

const ProfileAvatar = () => {
  const [updateProfile] = useMutation<UpdateProfileData>(UPDATE_PROFILE);

  const { currentUser, setCurrentUser } = useCurrentUserState();

  const [previewImage, setPreviewImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const changeFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);

    const file = e.target.files[0];

    // check file size
    if (file.size > 1_000_000) {
      toast.error('Image size should be less than 1MB');
      setPreviewImage('');
      setIsLoading(false);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };

    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_UPLOAD_PRESET);
    formData.append('folder', 'awesome-link/profile/');

    try {
      const { data } = await axios.post(
        'https://api.cloudinary.com/v1_1/dhuwajszm/image/upload',
        formData
      );

      const response = await updateProfile({
        variables: {
          email: currentUser.email,
          image: data.secure_url,
          public_id: data.public_id,
        },
      });

      setCurrentUser(response.data.updateProfile);

      toast.success('Profile has been updated!');
    } catch (error) {
      console.log(error);
      toast.error('Something went please try again...');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div style={{ width: 58, position: 'relative' }}>
        <Avatar src={previewImage || currentUser.image} size="lg" radius="xl" />
        <div style={{ position: 'absolute', top: '30px', right: '-30px' }}>
          <ActionIcon
            size="md"
            variant="outline"
            loading={isLoading}
            onClick={() => inputRef.current.click()}
          >
            <IconPencil size={17} />
          </ActionIcon>
        </div>
      </div>

      <input
        hidden
        ref={inputRef}
        type="file"
        id="file-upload"
        accept=".jpeg, .jpg, .png"
        onChange={changeFileHandler}
      />
    </>
  );
};

export default ProfileAvatar;
