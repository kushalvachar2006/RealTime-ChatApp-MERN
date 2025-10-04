import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedimg, setselectedimg] = useState(null);
  const navigate = useNavigate();
  const [name, setname] = useState(authUser.fullname);
  const [bio, setbio] = useState(authUser.bio);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    if (!selectedimg) {
      result = await updateProfile({ fullname: name, bio });
      if (result && result.success) {
        navigate("/");
      }
      return;
    }
    const render = new FileReader();
    render.readAsDataURL(selectedimg);
    render.onload = async () => {
      const base64img = render.result;
      result = await updateProfile({
        profilepic: base64img,
        fullname: name,
        bio,
      });
      if (result && result.success) {
        navigate("/");
      }
    };
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div
        className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between
      max-sm:flex-col-reverse rounded-lg"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3 className="text-lg">Profile details</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={(e) => setselectedimg(e.target.files[0])}
              type="file"
              name=""
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={
                selectedimg
                  ? URL.createObjectURL(selectedimg)
                  : assets.avatar_icon
              }
              alt=""
              className={`w-12 h-12 ${selectedimg && "rounded-full"}`}
            />
            Upload profile image
          </label>
          <input
            onChange={(e) => setname(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Your name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2
          focus:ring-violet-500"
          />
          <textarea
            onChange={(e) => setbio(e.target.value)}
            value={bio}
            placeholder="Write profile bio"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2
          focus:ring-violet-500"
            rows={4}
          ></textarea>
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer"
          >
            Save
          </button>
        </form>
        <img
          src={authUser?.profilepic || assets.logo_icon}
          alt=""
          className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${
            selectedimg && "rounded-full"
          }`}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
