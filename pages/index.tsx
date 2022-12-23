import { ProfilePage } from "@/components/layout/profile";

interface ProfileProps {
  data: {
    newsletterData: {
      freeListsDB: string[];
      premiumListsDB: string[];
    };
  };
}

const Profile: React.FC<ProfileProps> = ({ data }) => {
  return <ProfilePage />;
};

export default Profile;
