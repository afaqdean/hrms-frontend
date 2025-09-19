import { auth } from 'auth';

export async function generateMetadata() {
  return {
    title: 'User Profile',
  };
}

export default async function UserProfilePage() {
  const session = await auth();

  return (
    <div className="my-6 -ml-16">
      <h1>User Profile</h1>
      <p>
        Path: /dashboard/user-profile
      </p>
      {
        session?.user
          ? (
              <div>
                <p>
                  Name:
                  {session.user.name}
                </p>
                <p>
                  Email:
                  {session.user.email}
                </p>
                <p>
                  User Role:
                  {(session.user as any).role}
                </p>
                {/* Add more user details as needed */}
              </div>
            )
          : (
              <p>Loading user data...</p>
            )
      }

    </div>
  );
}
