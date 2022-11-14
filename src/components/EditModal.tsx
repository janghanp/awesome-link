import React, { useRef, useState } from 'react';
import {
  AspectRatio,
  Button,
  Image,
  Modal,
  Stack,
  TextInput,
  Text,
  Center,
  LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUpload } from '@tabler/icons';
import axios from 'axios';
import toast from 'react-hot-toast';
import { gql, useMutation } from '@apollo/client';

import { Link } from '../types';
import { GET_LINKS } from '../pages/index';

const UPDATE_LINK = gql`
  mutation UpdateLink(
    $id: String!
    $title: String!
    $description: String!
    $url: String!
    $imageUrl: String!
    $public_id: String!
  ) {
    updateLink(
      id: $id
      title: $title
      description: $description
      url: $url
      imageUrl: $imageUrl
      public_id: $public_id
    ) {
      id
      title
      description
      url
      imageUrl
    }
  }
`;

type Props = {
  link: Link;
  isEditModalOpen: boolean;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditModal = ({ link, isEditModalOpen, setIsEditModalOpen }: Props) => {
  const [updateLink] = useMutation(UPDATE_LINK, {
    refetchQueries: [{ query: GET_LINKS }],
  });

  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    initialValues: {
      title: link.title,
      description: link.description,
      link: link.url,
      public_id: link.public_id,
      secure_url: link.imageUrl,
    },
  });

  const fileChangeHanlder = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];

    if (file.size > 1_000_000) {
      toast.error('Image size should be less than 1MB');
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
    formData.append('folder', 'awesome-link/link/');

    const promise = axios.post('https://api.cloudinary.com/v1_1/dhuwajszm/image/upload', formData);

    setIsImageUploading(true);

    toast.promise(promise, {
      loading: 'Uploading...',
      success: ({ data }) => {
        form.setFieldValue('public_id', data.public_id);
        form.setFieldValue('secure_url', data.secure_url);

        setIsImageUploading(false);

        return 'Image uploaded successfully!';
      },
      error: () => {
        setIsImageUploading(false);

        return 'Please try again...';
      },
    });
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    await updateLink({
      variables: {
        id: link.id,
        title: form.values.title,
        description: form.values.description,
        url: form.values.link,
        imageUrl: form.values.secure_url,
        public_id: form.values.public_id,
      },
    });

    setIsLoading(false);
    setIsEditModalOpen(false);
  };

  return (
    <Modal
      opened={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      withCloseButton={false}
    >
      <LoadingOverlay visible={isLoading} overlayBlur={2} color="dark" />

      <AspectRatio ratio={1920 / 1080} mb="sm">
        <Image src={previewImage || link.imageUrl} radius="md" alt="image" />
      </AspectRatio>

      <Center>
        <Button
          mb="lg"
          variant="default"
          size="xs"
          onClick={() => {
            fileInputRef.current.click();
          }}
        >
          <IconUpload size={13} />
          <Text ml="xs">Upload</Text>
        </Button>
      </Center>

      <form onSubmit={submitHandler}>
        <Stack>
          <TextInput
            required
            label="Title"
            value={form.values.title}
            onChange={(event) => form.setFieldValue('title', event.currentTarget.value)}
          />

          <TextInput
            required
            label="Description"
            value={form.values.description}
            onChange={(event) => form.setFieldValue('description', event.currentTarget.value)}
            error={form.errors.description && form.errors.description}
          />

          <TextInput
            required
            label="Link"
            value={form.values.link}
            onChange={(event) => form.setFieldValue('link', event.currentTarget.value)}
            error={form.errors.link && form.errors.link}
          />

          <input
            hidden
            type="file"
            ref={fileInputRef}
            accept=".jpeg, .jpg, .png"
            onChange={fileChangeHanlder}
          />
        </Stack>

        <Button loading={isImageUploading} type="submit" mt="sm" color="dark">
          Edit
        </Button>
      </form>
    </Modal>
  );
};

export default EditModal;
