import { Avatar, LoadingOverlay } from "@mantine/core";
import { gql, useMutation } from "@apollo/client";
import { ChangeEvent, useRef, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import { User } from "@prisma/client";
import { useCurrentUserState } from "../store";

const UPDATE_PROFILE = gql`
  mutation UpdateProfile(
    $email: String!
    $image: String!
    $public_id: String!
  ) {
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

  const [file, setFile] = useState<File | null>();
  const [previewImage, setPreviewImage] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);

  const changeFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    setVisible(true);

    const file = e.target.files[0];

    // check file size
    if (file.size > 1_500_000) {
      toast.error("Image size should be less than 1.5MB");
      setPreviewImage("");
      setVisible(false);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setFile(file);
      setPreviewImage(reader.result as string);
    };

    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET);
    formData.append("folder", "awesome-link/profile/");

    try {
      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/dhuwajszm/image/upload",
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

      toast.success("Profile has been updated!");
    } catch (error) {
      console.log(error);
    } finally {
      setVisible(false);
    }
  };

  return (
    <>
      <div style={{ width: 58, position: "relative" }}>
        <LoadingOverlay
          loaderProps={{ size: "sm", variant: "oval", color: "dark" }}
          visible={visible}
          overlayBlur={2}
        />
        <Avatar src={previewImage || currentUser.image} size="lg" radius="xl" />
      </div>

      <input
        type="file"
        id="file-upload"
        accept=".jpeg, .jpg, .png"
        onChange={changeFileHandler}
      />
      <Toaster />
    </>
  );
};

export default ProfileAvatar;
