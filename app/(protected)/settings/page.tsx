import { getUserInfo } from "@/app/actions/user";

import UserInfoForm from "@/app/(protected)/settings/UserInfoForm";

export default async function Page() {
  const result = await getUserInfo();

  return (
    <>
      <div>
        <h2 className="text-lg font-medium">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Update your profile account information.
        </p>
      </div>
      <hr className="my-4 text-muted-foreground" />
      <UserInfoForm userInfo={result.data} />
    </>
  );
}
