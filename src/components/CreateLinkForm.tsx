import { gql, useMutation } from '@apollo/client';
import { Button, Stack, TextInput, FileInput, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUpload } from '@tabler/icons';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { GET_LINKS } from '../pages/index';

const CREATE_LINK = gql`
  mutation CreateLink(
    $title: String!
    $description: String!
    $url: String!
    $imageUrl: String!
    $public_id: String!
  ) {
    createLink(
      title: $title
      description: $description
      url: $url
      imageUrl: $imageUrl
      public_id: $public_id
    ) {
      cursor
      node {
        id
        title
        description
        url
        imageUrl
        public_id
        createdAt
      }
    }
  }
`;

const CreateLinkForm = () => {
  const router = useRouter();

  const [createLink] = useMutation(CREATE_LINK);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      link: '',
      public_id: '',
      secure_url: '',
    },
  });

  useEffect(() => {
    const fileHandler = async () => {
      if (file.size > 1_000_000) {
        toast.error('Image size should be less than 1MB');
        setFile(null);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_UPLOAD_PRESET);
      formData.append('folder', 'awesome-link/link/');

      const promise = axios.post(
        'https://api.cloudinary.com/v1_1/dhuwajszm/image/upload',
        formData
      );

      setIsImageUploading(true);

      toast.promise(promise, {
        loading: 'Uploading...',
        success: ({ data }) => {
          form.setFieldValue('public_id', data.public_id);
          form.setFieldValue('secure_url', data.secure_url);

          setIsImageUploading(false);

          setFileError('');
          return 'Image uploaded successfully!';
        },
        error: () => {
          setIsImageUploading(false);

          return 'Please try again...';
        },
      });
    };

    if (file) {
      fileHandler();
    }
  }, [file]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setFileError('Thumbnail image is required');
      return;
    }

    setIsLoading(true);

    await createLink({
      variables: {
        title: form.values.title,
        description: form.values.description,
        url: form.values.link,
        imageUrl: form.values.secure_url,
        public_id: form.values.public_id,
      },
      update: (cache, { data }) => {
        console.log({ data });

        const newEdge = data.createLink;

        const existingGetLinks: any = cache.readQuery({
          query: GET_LINKS,
          variables: { after: null },
        });

        cache.writeQuery({
          query: GET_LINKS,
          variables: { after: null },
          data: {
            getLinks: {
              edges: [newEdge, ...existingGetLinks.getLinks.edges],
              pageInfo: existingGetLinks.getLinks.pageInfo,
              __typename: 'Response',
            },
          },
        });
      },
    });

    router.push('/');
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} overlayBlur={2} color="dark" />

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

          <FileInput
            required
            value={file}
            onChange={setFile}
            error={fileError}
            label="Thumbnail"
            accept=".jpg, .jpeg, .png, .webp"
            placeholder="Upload file (MAX 1MB)"
            icon={<IconUpload size={14} />}
          />
        </Stack>

        <Button loading={isImageUploading} type="submit" mt="lg" color="dark">
          Create
        </Button>
      </form>
    </>
  );
};

export default CreateLinkForm;
