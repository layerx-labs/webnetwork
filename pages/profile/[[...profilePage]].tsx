import Profile, {
  getServerSideProps as profileGetServerSideProps
} from "pages/[network]/profile/[[...profilePage]]";

export default Profile;

export const getServerSideProps = profileGetServerSideProps;
